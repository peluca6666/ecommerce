import { encriptarContrasenia, compararContrasenia } from "../utils/encriptador.js";
import { pool } from "../database/connectionMySQL.js";
import { Usuario } from "../models/Usuario.js";
import pkg from 'jsonwebtoken';
import { enviarMailBienvenida } from '../utils/emailService.js';

const { sign, verify } = pkg;

/**
 * Crea un usuario nuevo en la BD
 * @param {Object} datosUsuario Datos del usuario
 * @returns {Object} Usuario creado (id, nombre, email, rol)
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
      'cliente', // rol por defecto
      false,     // aún no verificado
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
 * Loguea usuario y devuelve token si está ok
 * @param {string} email Email usuario
 * @param {string} contrasenia Contraseña para validar
 * @returns {string|null|'no-verificado'} Token JWT o null o string según resultado
 */
export async function loginUsuario(email, contrasenia) {
  const usuario = await obtenerUsuarioPorEmail(email);

  if (!usuario) return null;
  if (!usuario.verificado) return 'no-verificado';

  const contraseniaValida = await compararContrasenia(contrasenia, usuario.contrasenia);
  if (!contraseniaValida) return null;

  const payload = {
    usuario_id: usuario.usuario_id,
    rol: usuario.rol
  };

  return sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" });
}

/**
 * Verifica cuenta con token
 * @param {string} token Token JWT para verificar
 * @returns {string} 'exitoso', 'no-encontrado' o 'token-invalido'
 */
export async function verificarCuentaPorToken(token) {
  try {
    const payload = verify(token, process.env.JWT_SECRET);
    const sql = 'UPDATE usuario SET verificado = TRUE WHERE usuario_id = ?';
    const [resultado] = await pool.execute(sql, [payload.usuario_id]);

    return resultado.affectedRows > 0 ? 'exitoso' : 'no-encontrado';
  } catch (err) {
    console.error('Error al verificar cuenta:', err);
    return 'token-invalido';
  }
}

/**
 * Busca un usuario activo por email
 * @param {string} email Email para buscar
 * @returns {Usuario|null} Instancia Usuario o null si no existe
 */
export async function obtenerUsuarioPorEmail(email) {
  try {
    const sql = 'SELECT * FROM usuario WHERE email = ? AND activo = TRUE LIMIT 1';
    const [rows] = await pool.execute(sql, [email]);

    if (rows.length === 0) return null;

    const u = rows[0];
    return new Usuario(
      u.usuario_id, u.nombre, u.apellido, u.email, u.contrasenia,
      u.rol, Boolean(u.verificado), u.dni, u.telefono, u.direccion
    );
  } catch (error) {
    console.error('Error buscando usuario por email:', error);
    throw error;
  }
}

/**
 * Devuelve datos de usuario por ID
 * @param {number} usuario_id ID del usuario
 * @returns {Object|null} Datos del usuario o null si no existe
 */
export async function obtenerUsuarioPorId(usuario_id) {
  try {
    const sql = `
      SELECT 
        usuario_id, nombre, apellido, email, rol, dni, telefono, direccion, 
        provincia, localidad, codigo_postal 
      FROM usuario 
      WHERE usuario_id = ? 
      LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [usuario_id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error buscando usuario por ID:', error);
    throw error;
  }
}

/**
 * Actualiza perfil del usuario
 * @param {number} userId ID usuario
 * @param {Object} profileData Datos para actualizar
 * @returns {Object} Datos actualizados del usuario
 */
export async function actualizarPerfilUsuario(userId, profileData) {
  const { 
    nombre, apellido, dni, telefono, direccion, 
    provincia, localidad, codigo_postal 
  } = profileData;

  const fieldsToUpdate = [];
  const values = [];

  if (nombre != null) { fieldsToUpdate.push('nombre = ?'); values.push(nombre); }
  if (apellido != null) { fieldsToUpdate.push('apellido = ?'); values.push(apellido); }
  if (dni != null) { fieldsToUpdate.push('dni = ?'); values.push(dni); }
  if (telefono != null) { fieldsToUpdate.push('telefono = ?'); values.push(telefono); }
  if (direccion != null) { fieldsToUpdate.push('direccion = ?'); values.push(direccion); }
  if (provincia != null) { fieldsToUpdate.push('provincia = ?'); values.push(provincia); }
  if (localidad != null) { fieldsToUpdate.push('localidad = ?'); values.push(localidad); }
  if (codigo_postal != null) { fieldsToUpdate.push('codigo_postal = ?'); values.push(codigo_postal); }

  if (fieldsToUpdate.length === 0) {
    throw { statusCode: 400, message: 'No se enviaron datos para actualizar' };
  }

  const sql = `UPDATE usuario SET ${fieldsToUpdate.join(', ')} WHERE usuario_id = ?`;
  values.push(userId);

  await pool.execute(sql, values);
  return obtenerUsuarioPorId(userId);
}

/**
 * Cambia la contraseña de un usuario
 * @param {number} userId ID usuario
 * @param {string} contraseniaActual Contraseña vieja para validar
 * @param {string} nuevaContrasenia Nueva contraseña
 * @returns {boolean} true si se cambió ok
 */
export async function cambiarContraseñaUsuario(userId, contraseniaActual, nuevaContrasenia) {
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
 * Trae todos los usuarios activos (sin contraseña)
 * @returns {Array} Lista de usuarios
 */
export async function obtenerTodosLosUsuarios(incluirInactivos = true) {
  try {
    const whereClause = incluirInactivos ? '' : 'WHERE activo = TRUE';
    
    const sql = `
      SELECT usuario_id, nombre, apellido, email, dni, direccion, telefono, 
      provincia as Provincia, localidad as Localidad, codigo_postal, rol, activo 
      FROM usuario 
      ${whereClause}
      ORDER BY activo DESC, usuario_id DESC
    `;
    
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    throw error;
  }
}

/**
 * Cambia el rol de un usuario
 * @param {number} usuarioId ID usuario
 * @param {string} nuevoRol Nuevo rol a asignar
 * @returns {boolean} true si cambió el rol
 */
export async function cambiarRolUsuario(usuarioId, nuevoRol) {
  const query = 'UPDATE usuario SET rol = ? WHERE usuario_id = ?';
  const [result] = await pool.query(query, [nuevoRol, usuarioId]);
  return result.affectedRows > 0;
}

/**
 * Activa o desactiva usuario
 * @param {number} usuarioId ID usuario
 * @returns {boolean} true si se cambió el estado
 */
export async function cambiarEstadoUsuario(usuarioId) {
  const query = 'UPDATE usuario SET activo = NOT activo WHERE usuario_id = ?';
  const [result] = await pool.query(query, [usuarioId]);
  return result.affectedRows > 0;
}

/**
 * Resetear contraseña con token
 * @param {string} token Token JWT
 * @param {string} nuevaContrasenia Nueva contraseña
 * @returns {string} 'exitoso', 'no-encontrado' o 'token-invalido'
 */
export async function resetearContraseniaPorToken(token, nuevaContrasenia) {
  try {
    const payload = verify(token, process.env.JWT_SECRET);
    const nuevoHash = await encriptarContrasenia(nuevaContrasenia);
    
    const sql = 'UPDATE usuario SET contrasenia = ? WHERE usuario_id = ?';
    const [resultado] = await pool.execute(sql, [nuevoHash, payload.usuario_id]);

    return resultado.affectedRows > 0 ? 'exitoso' : 'no-encontrado';
  } catch (err) {
    console.error('Error al resetear contraseña:', err);
    return 'token-invalido';
  }
}
