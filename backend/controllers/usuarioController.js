import { schemaRegistro, schemaLogin } from '../validations/authValidation.js';
import { crearUsuario, obtenerUsuarioPorEmail, loginUsuario as serviceLoginUsuario } from '../services/usuarioService.js';

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

    // Intentar login y obtener token JWT
    const token = await serviceLoginUsuario(email, contrasenia);

    if (!token) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    return res.json({ token });

  } catch (err) {
    console.error('Error en loginUsuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
