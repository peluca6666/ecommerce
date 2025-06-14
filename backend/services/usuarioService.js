import { encriptarContrasenia, compararContrasenia } from "../utils/encriptador.js";
import { pool } from "../database/connectionMySQL.js";
import { Usuario } from "../models/Usuario.js";
import pkg from 'jsonwebtoken';
import { enviarMailBienvenida } from '../utils/emailService.js';

const { sign, verify } = pkg;

export const esAdmin = (usuario) => usuario.rol === 'admin';

export async function crearUsuario(datosUsuario) {
  try {
    const hash = await encriptarContrasenia(datosUsuario.contrasenia);

    // SQL CORREGIDO: Especificamos las 9 columnas que queremos llenar.
    const sql = `
      INSERT INTO usuario 
      (nombre, apellido, email, contrasenia, rol, verificado, dni, telefono, direccion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // VALORES CORREGIDOS: Pasamos 9 valores, uno para cada columna.
    // Usamos 'null' para los campos que pueden no venir en el formulario de registro.
    const [resultado] = await pool.execute(sql, [
      datosUsuario.nombre,
      datosUsuario.apellido,
      datosUsuario.email,
      hash,
      'cliente', // rol por defecto
      false,     // 'verificado' es false al crear
      datosUsuario.dni || null,
      datosUsuario.telefono || null,
      datosUsuario.direccion || null
    ]);

    // El envío de email está bien.
    await enviarMailBienvenida({
      id: resultado.insertId,
      nombre: datosUsuario.nombre,
      email: datosUsuario.email
    });

    // RETURN CORREGIDO: Devolvemos un objeto simple y limpio con los datos del nuevo usuario.
    return {
      id: resultado.insertId,
      nombre: datosUsuario.nombre,
      email: datosUsuario.email,
      rol: 'cliente'
    };

  } catch (error) {
    // Este console.error es el que te mostrará el error real en la terminal del servidor.
    console.error('Error creando usuario:', error);
    throw error;
  }
}

export async function obtenerUsuarioPorEmail(email) {
  try {
    const sql = 'SELECT * FROM usuario WHERE email = ? LIMIT 1';
    const [rows] = await pool.execute(sql, [email]);
    if (rows.length === 0) return null;

    const u = rows[0]; // 'u' de data de usuario
    
    // LLAMADA AL CONSTRUCTOR CON EL ORDEN CORREGIDO Y SINCRONIZADO
    return new Usuario(
      u.usuario_id,
      u.nombre,
      u.apellido,
      u.email,
      u.contrasenia,
      u.rol,
      Boolean(u.verificado), // 'verificado' ahora está en la 7ª posición
      u.dni,
      u.telefono, 
      u.direccion
    );
  } catch (error) {
    console.error('Error obteniendo usuario por mail:', error);
    throw error;
  }
}

export async function loginUsuario(email, contrasenia) {
  try {
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) return null;
    if (!usuario.verificado) return 'no-verificado';

    const contraseniaValida = await compararContrasenia(contrasenia, usuario.contrasenia);
    if (!contraseniaValida) return null;

    const payload = {
      usuario_id: usuario.usuario_id,
      rol: usuario.rol
    };

    const token = sign(payload, process.env.JWT_SECRET || "claveSecreta", { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    throw error;
  }
}

export async function obtenerUsuarioPorId(usuario_id) {
  try {
    const sql = 'SELECT usuario_id, nombre, apellido, email, rol, dni, telefono, direccion FROM usuario WHERE usuario_id = ? LIMIT 1';
    const [rows] = await pool.execute(sql, [usuario_id]);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error('Error obteniendo usuario por ID:', error);
    throw error;
  }
}

export async function verificarCuenta(token) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'claveSecreta');
    const sql = 'UPDATE usuario SET verificado = true, rol = \"cliente\" WHERE usuario_id = ?';
    await pool.execute(sql, [decoded.usuario_id]);
    return true;
  } catch (err) {
    console.error('Error al verificar cuenta:', err);
    return false;
  }
}
