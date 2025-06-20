import { encriptarContrasenia, compararContrasenia } from "../utils/encriptador.js";
import { pool } from "../database/connectionMySQL.js";
import { Usuario } from "../models/Usuario.js";
import pkg from 'jsonwebtoken';
import { enviarMailBienvenida } from '../utils/emailService.js';

const { sign, verify } = pkg;

/**
 * Crea un nuevo usuario en la base de datos
 * @param {object} datosUsuario - Datos del usuario
 * @returns {Promise<object>} - El objeto del nuevo usuario creado
 */
export async function crearUsuario(datosUsuario) {
  try {
    const hash = await encriptarContrasenia(datosUsuario.contrasenia);

    const sql = `
      INSERT INTO usuario 
      (nombre, apellido, email, contrasenia, rol, verificado, dni, telefono, direccion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      datosUsuario.nombre,
      datosUsuario.apellido,
      datosUsuario.email,
      hash,
      'cliente', // rol por defecto, si queremos que sea admin lo establecemos en la BD
      false,     // verificado es false al crear
      datosUsuario.dni || null,
      datosUsuario.telefono || null,
      datosUsuario.direccion || null
    ];

    const [resultado] = await pool.execute(sql, params);

    await enviarMailBienvenida({
      id: resultado.insertId,
      nombre: datosUsuario.nombre,
      email: datosUsuario.email
    });

    return {
      id: resultado.insertId,
      nombre: datosUsuario.nombre,
      email: datosUsuario.email,
      rol: 'cliente'
    };
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
}

/**
 * Procesa el login de un usuario, validando sus credenciales y estado de verificación
 * @param {string} email - Email del usuario
 * @param {string} contrasenia - Contraseña del usuario
 * @returns {Promise<string|null>} - Devuelve el token JWT, 'no-verificado', o null si las credenciales son incorrectas
 */
export async function loginUsuario(email, contrasenia) {
  const usuario = await obtenerUsuarioPorEmail(email);
  if (!usuario) {
    return null; // Usuario no encontrado
  }
  if (!usuario.verificado) {
    return 'no-verificado';
  }

  const contraseniaValida = await compararContrasenia(contrasenia, usuario.contrasenia);
  if (!contraseniaValida) {
    return null; // Contraseña incorrecta
  }

  const payload = {
    usuario_id: usuario.usuario_id,
    rol: usuario.rol
  };

  return sign(payload, process.env.JWT_SECRET || "claveSecreta", { expiresIn: "1h" });
}

/**
 * Verifica una cuenta de usuario usando un token JWT
 * @param {string} token - El token de verificación
 * @returns {Promise<string>} Devuelve 'exitoso', 'no-encontrado' o 'token-invalido'.
 */
export async function verificarCuentaPorToken(token) {
  try {
    const payload = verify(token, process.env.JWT_SECRET || 'claveSecreta');
    const sql = 'UPDATE usuario SET verificado = TRUE WHERE usuario_id = ?';
    const [resultado] = await pool.execute(sql, [payload.usuario_id]);

    return resultado.affectedRows > 0 ? 'exitoso' : 'no-encontrado';
  } catch (err) {
    console.error('Error en servicio al verificar cuenta:', err);
    return 'token-invalido';
  }
}

//Funciones de ayuda del servicio de usuario

export async function obtenerUsuarioPorEmail(email) {
  try {
    const sql = 'SELECT * FROM usuario WHERE email = ? LIMIT 1';
    const [rows] = await pool.execute(sql, [email]);
    if (rows.length === 0) return null;

    const u = rows[0];
    return new Usuario(
      u.usuario_id, u.nombre, u.apellido, u.email, u.contrasenia,
      u.rol, Boolean(u.verificado), u.dni, u.telefono, u.direccion
    );
  } catch (error) {
    console.error('Error obteniendo usuario por mail:', error);
    throw error;
  }
}

export async function obtenerUsuarioPorId(usuario_id) {
  try {
    const sql = 'SELECT usuario_id, nombre, apellido, email, rol, dni, telefono, direccion FROM usuario WHERE usuario_id = ? LIMIT 1';
    const [rows] = await pool.execute(sql, [usuario_id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error obteniendo usuario por ID:', error);
    throw error;
  }
}

/**
 * Actualiza los datos del perfil de un usuario
 * Esta versión está corregida para aceptar todos los campos del perfil
 * @param {number} userId 
 * @param {object} profileData - Datos a actualizar (nombre, apellido, dni, etc.)
 * @returns {Promise<object>} El objeto del usuario actualizado
 */
export async function updateUserProfile(userId, profileData) {
    // Obtenemos todos los posibles campos del objeto que llega del frontend
    const { 
        nombre, 
        apellido, 
        dni, 
        telefono, 
        direccion, 
        provincia, 
        localidad, 
        codigo_postal 
    } = profileData;

    const fieldsToUpdate = [];
    const values = [];
    
    if (nombre != null) { 
        fieldsToUpdate.push('nombre = ?');
        values.push(nombre);
    }
    if (apellido != null) {
        fieldsToUpdate.push('apellido = ?');
        values.push(apellido);
    }
    if (dni != null) {
        fieldsToUpdate.push('dni = ?');
        values.push(dni);
    }
    if (telefono != null) {
        fieldsToUpdate.push('telefono = ?');
        values.push(telefono);
    }
    if (direccion != null) {
        fieldsToUpdate.push('direccion = ?');
        values.push(direccion);
    }
    if (provincia != null) {
        fieldsToUpdate.push('provincia = ?');
        values.push(provincia);
    }
    if (localidad != null) {
        fieldsToUpdate.push('localidad = ?');
        values.push(localidad);
    }
    if (codigo_postal != null) {
        fieldsToUpdate.push('codigo_postal = ?');
        values.push(codigo_postal);
    }

    // Si no llegó ningún campo para actualizar, lanzamos un error.
    if (fieldsToUpdate.length === 0) {
        throw { statusCode: 400, message: 'No se proporcionaron campos para actualizar' };
    }

    const sql = `UPDATE usuario SET ${fieldsToUpdate.join(', ')} WHERE usuario_id = ?`;
    values.push(userId); // Añadimos el userId al final para el WHERE

    await pool.execute(sql, values);

    // Devolvemos el perfil actualizado para confirmar los cambios
    return obtenerUsuarioPorId(userId);
}

/**
 * Cambia la contraseña de un usuario después de verificar la contraseña actual
 * @param {number} userId 
 * @param {string} contraseniaActual 
 * @param {string} nuevaContrasenia 
 * @returns {Promise<boolean>} True si la contraseña se cambió correctamente
 */
export async function changeUserPassword(userId, contraseniaActual, nuevaContrasenia) {
  const usuario = await obtenerUsuarioPorEmail((await obtenerUsuarioPorId(userId)).email);
  if (!usuario) {
    throw { statusCode: 404, message: 'Usuario no encontrado' };
  }

  const contraseniaValida = await compararContrasenia(contraseniaActual, usuario.contrasenia);
  if (!contraseniaValida) {
    throw { statusCode: 401, message: 'La contraseña actual es incorrecta' };
  }

  const nuevoHash = await encriptarContrasenia(nuevaContrasenia);
  await pool.execute('UPDATE usuario SET contrasenia = ? WHERE usuario_id = ?', [nuevoHash, userId]);

  return true;
}

/**
 * Obtiene todos los usuarios para el panel de admin
 * No devuelve la contraseña por seguridad
 * @returns {Promise<Array>}
 */
export async function obtenerTodosLosUsuarios() {
  try {
    const sql = 'SELECT usuario_id, nombre, apellido, email, dni, direccion, telefono, provincia, localidad, codigo_postal, rol, activo FROM usuario ORDER BY usuario_id DESC';
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error("ERROR EN EL SERVICIO AL BUSCAR TODOS LOS USUARIOS:", error);
    throw error;
  }
}

/**
 * Podemos cambiar el rol de un usuario
 * @param {number} usuarioId
 * @param {string} nuevoRol cliente o admin
 * @returns {Promise<boolean>}
 */
export async function updateUserRole(usuarioId, nuevoRol) {
  const query = 'UPDATE usuario SET rol = ? WHERE usuario_id = ?';
  const [result] = await pool.query(query, [nuevoRol, usuarioId]);
  return result.affectedRows > 0;
}

/**
 * Activa o desactiva la cuenta de un usuario
 * @param {number} usuarioId
 * @returns {Promise<boolean>}
 */
export async function toggleUserStatus(usuarioId) {
  const query = 'UPDATE usuario SET activo = NOT activo WHERE usuario_id = ?';
  const [result] = await pool.query(query, [usuarioId]);
  return result.affectedRows > 0;
}