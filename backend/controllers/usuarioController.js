import { schemaRegistro, schemaLogin } from '../validations/authValidation.js';
import * as usuarioService from '../services/usuarioService.js';


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

    // Se obtiene el email y la contraseña del cuerpo de la solicitud
    const { email, contrasenia } = value;
    const resultado = await usuarioService.loginUsuario(email, contrasenia);

    // Verificamos el resultado del login
    if (resultado === 'no-verificado') {
      return res.status(403).json({ error: 'La cuenta aún no fue verificada. Revisá tu correo.' });
    }
    if (!resultado) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Para obtener el rol necesitamos buscar el usuario de nuevo 
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

// Controlador para verificar la cuenta del usuario mediante un token
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
    // Para 'token-invalido' o cualquier otro caso
    return res.status(400).json({ error: 'Token inválido o expirado' });

  } catch (error) {
    console.error('Error en controlador al verificar cuenta:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};