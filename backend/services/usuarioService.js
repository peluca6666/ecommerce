import { encriptarContrasenia, compararContrasenia } from "../utils/encriptador.js";
import { pool } from "../database/connectionMySQL.js";
import { Usuario } from "../models/Usuario.js";
import pkg from 'jsonwebtoken';

const { sign } = pkg;
// Función para verificar si un usuario es administrador
export const esAdmin = (usuario) => {
  return usuario.rol === 'admin';
};

export async function crearUsuario(datosUsuario) {
  try {
    //Encriptamos la contraseña
    const hash = await encriptarContrasenia(datosUsuario.contrasenia);

    //Armar query SQL para insertar usuario 
    const sql = 'INSERT INTO usuario ( nombre, apellido, email, contrasenia, rol) VALUES (?, ?, ?, ?, ?)';

    //Ejectutar la query usando la conexion
    const [resultado] = await pool.execute(sql, [
      datosUsuario.nombre,
      datosUsuario.apellido,
      datosUsuario.email,
      hash,
      datosUsuario.rol || 'cliente'
    ]);

    //Creamos una instancia de usuario para mostrar los datos de manera clara 
    const nuevoUsuario = new Usuario(
      resultado.insertId,                      // Id generado por la base
      datosUsuario.nombre,
      datosUsuario.apellido,
      datosUsuario.email,
      undefined,                               // Undefined para no devolver la contraseña
      datosUsuario.rol || 'cliente'
    );

    return nuevoUsuario.obtenerPerfil();

  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;  // Lo podés manejar en el controlador o middleware
  }
}

export async function obtenerUsuarioPorEmail(email) {
  try {
    const sql = 'SELECT * FROM usuario WHERE email = ? LIMIT 1';
    const [rows] = await pool.execute(sql, [email]);
    if (rows.length === 0) {
      return null;
    }
    const usuario = rows[0];
    return new Usuario(
      usuario.usuario_id,
      usuario.nombre,
      usuario.apellido,
      usuario.email,
      usuario.contrasenia, // contraseña encriptada
      usuario.rol
    );
  } catch (error) {
    console.error('Error obteniendo usuario por mail:', error);
    throw error;
  }
}

export async function loginUsuario(email, contrasenia) {
  try {
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return null; // Usuario no encontrado
    }
    const contraseniaValida = await compararContrasenia(contrasenia, usuario.contrasenia);
    if (!contraseniaValida) {
      return null; // Contraseña incorrecta
    }
    // Generar y devolver el JWT con usuario_id y rol
    const payload = {
      usuario_id: usuario.usuario_id,
      rol: usuario.rol
    };
    // Usar tu clave secreta real en producción
    const token = sign(payload, process.env.JWT_SECRET || "claveSecreta", { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    throw error;
  }
}

export async function obtenerUsuarioPorId(usuario_id) {
try{
  const sql = 'SELECT usuario_id, nombre, apellido, email, rol FROM usuario WHERE usuario_id = ? LIMIT 1';
  const [rows] = await pool.execute(sql, [usuario_id]);
  if (rows.length === 0) return null; // Usuario no encontrado
    return rows[0]; //Se devuelven los datos sin la contraseña
  }catch (error) {
    console.error('Error obteniendo usuario por ID:', error);
    throw error;
  }
}