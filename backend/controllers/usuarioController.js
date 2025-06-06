import { schemaRegistro, schemaLogin } from '../validations/authValidation.js';
import { crearUsuario, obtenerUsuarioPorEmail, loginUsuario as serviceLoginUsuario } from '../services/usuarioService.js';
import { obtenerUsuarioPorId } from '../services/usuarioService.js';
import jwt from 'jsonwebtoken';

export const registrarUsuario = async (req, res) => {
  try {
    // Validar datos con Joi
    const { error, value } = schemaRegistro.validate(req.body, { abortEarly: false });
    if (error) {
      const errores = error.details.map(e => e.message);
      return res.status(400).json({ errores });
    }

    const { email } = value;

    // Verificar si email ya existe
    const usuarioExistente = await obtenerUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear usuario con el service (que hace hash y guarda en la DB)
    const nuevoUsuario = await crearUsuario(value);

    return res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario });

  } catch (err) {
    console.error('Error al registrar usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    // Validar datos con Joi
    const { error, value } = schemaLogin.validate(req.body, { abortEarly: false });
    if (error) {
      const errores = error.details.map(e => e.message);
      return res.status(400).json({ errores });
    }

    const { email, contrasenia } = value;

    // Obtener usuario por email
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Aquí asumimos que serviceLoginUsuario devuelve el token si la contraseña es correcta
    const token = await serviceLoginUsuario(email, contrasenia);

    if (!token) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Enviar token y rol al frontend
    return res.json({ token, rol: usuario.rol });

  } catch (err) {
    console.error('Error en loginUsuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const obtenerPerfilUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // viene del verifyToken

    const usuario = await obtenerUsuarioPorId(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json(usuario);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};