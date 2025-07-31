import { schemaRegistro, schemaLogin, schemaCambioContraseña } from '../validations/authValidation.js';
import * as usuarioService from '../services/usuarioService.js';
import { enviarEmailRecuperacion } from '../utils/emailService.js';
import pkg from 'jsonwebtoken'; 
const { sign } = pkg;

export const registrarUsuario = async (req, res) => {
  try {
    const { error, value } = schemaRegistro.validate(req.body, { abortEarly: false });
    if (error) {
      const errores = error.details.map(e => e.message);
      return res.status(400).json({ errores });
    }

    const usuarioExistente = await usuarioService.obtenerUsuarioPorEmail(value.email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const nuevoUsuario = await usuarioService.crearUsuario(value);
    return res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario });

  } catch (err) {
    console.error('Error al registrar usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { error, value } = schemaLogin.validate(req.body, { abortEarly: false });
    if (error) {
      const errores = error.details.map(e => e.message);
      return res.status(400).json({ errores });
    }

    const { email, contrasenia } = value;
    const resultado = await usuarioService.loginUsuario(email, contrasenia);

    if (resultado === 'no-verificado') {
      return res.status(403).json({ error: 'La cuenta aún no fue verificada. Revisá tu correo.' });
    }
    if (!resultado) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Obtenemos el rol consultando al usuario de nuevo
    const usuario = await usuarioService.obtenerUsuarioPorEmail(email);
    return res.json({ token: resultado, rol: usuario.rol });

  } catch (err) {
    console.error('Error en loginUsuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const obtenerPerfilUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const usuario = await usuarioService.obtenerUsuarioPorId(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(usuario);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const actualizarPerfilUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const datosPerfil = req.body;

    const usuarioActualizado = await usuarioService.actualizarPerfilUsuario(usuarioId, datosPerfil);

    res.status(200).json({
      exito: true,
      mensaje: 'Perfil actualizado correctamente',
      datos: usuarioActualizado
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(error.statusCode || 500).json({
      exito: false,
      mensaje: error.message || 'Error interno del servidor'
    });
  }
};

export const cambiarContraseñaUsuario = async (req, res) => {
  try {
    const { error, value } = schemaCambioContraseña.validate(req.body);
    if (error) {
      // Mostramos solo el primer mensaje de error para simplificar
      return res.status(400).json({ exito: false, mensaje: error.details[0].message });
    }

    const usuarioId = req.usuario.id;
    const { contraseniaActual, nuevaContrasenia } = value;

    await usuarioService.cambiarContraseñaUsuario(usuarioId, contraseniaActual, nuevaContrasenia);

    res.status(200).json({ exito: true, mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(error.statusCode || 500).json({
      exito: false,
      mensaje: error.message || 'Error interno del servidor'
    });
  }
};

export const verificarCuenta = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Token es requerido' });
  }

  try {
    const resultado = await usuarioService.verificarCuentaPorToken(token);

    if (resultado === 'exitoso') {
      return res.json({ mensaje: 'Cuenta verificada exitosamente' });
    }
    if (resultado === 'no-encontrado') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si el token es inválido o vencido
    return res.status(400).json({ error: 'Token inválido o expirado' });

  } catch (error) {
    console.error('Error en controlador al verificar cuenta:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export async function obtenerTodosLosUsuarios(req, res) {
  try {
     const incluirInactivos = req.query.incluir_inactivos !== 'false'; 
    const usuarios = await usuarioService.obtenerTodosLosUsuarios(incluirInactivos);
    res.json({ exito: true, datos: usuarios });
  } catch (error) {
    console.error("ERROR GRAVE EN EL CONTROLADOR DE USUARIOS:", error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor al obtener usuarios.' });
  }
}

export async function cambiarRolUsuario(req, res) {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!rol || (rol !== 'cliente' && rol !== 'admin')) {
      return res.status(400).json({ exito: false, mensaje: 'Rol no válido' });
    }

    const resultado = await usuarioService.cambiarRolUsuario(id, rol);
    if (!resultado) {
      return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
    }

    res.json({ exito: true, mensaje: 'Rol actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
}

export async function cambiarEstadoUsuario(req, res) {
  try {
    const { id } = req.params;
    const resultado = await usuarioService.cambiarEstadoUsuario(id);
    if (!resultado) {
      return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
    }

    res.json({ exito: true, mensaje: 'Estado del usuario actualizado' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
}

export const solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    const usuario = await usuarioService.obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.json({ mensaje: 'Si el email existe, recibirás un correo con instrucciones' });
    }

    const resetToken = sign(
      { usuario_id: usuario.usuario_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await enviarEmailRecuperacion(usuario, resetToken);
    res.json({ mensaje: 'Si el email existe, recibirás un correo con instrucciones' });

  } catch (error) {
    console.error('Error en solicitarRecuperacion:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const resetearContrasenia = async (req, res) => {
  try {
    const { token, nuevaContrasenia } = req.body;

    if (!token || !nuevaContrasenia) {
      return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
    }

    if (nuevaContrasenia.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const resultado = await usuarioService.resetearContraseniaPorToken(token, nuevaContrasenia);

    if (resultado === 'exitoso') {
      return res.json({ mensaje: 'Contraseña reseteada exitosamente' });
    }
    if (resultado === 'no-encontrado') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(400).json({ error: 'Token inválido o expirado' });

  } catch (error) {
    console.error('Error en resetearContrasenia:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};