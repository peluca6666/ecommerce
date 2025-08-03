import pkg from 'jsonwebtoken';
const { verify } = pkg;

// middleware para verificar autenticacion en rutas protegidas
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no encontrado' });
  }

  // extrae token del header Bearer
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no válido' });
  }

  try {
    // verifica firma y expiracion del token con secret del servidor
    const { usuario_id, rol } = verify(token, process.env.JWT_SECRET);
    // inyecta datos del usuario al request para uso en controllers
    req.usuario = { id: usuario_id, rol };
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// factory function para crear middleware de autorizacion por rol
export const autorizarPorRol = (rolRequerido) => {
  return (req, res, next) => {
    // verifica que el usuario ya este autenticado
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    // compara rol del usuario con rol requerido para la ruta
    if (req.usuario.rol !== rolRequerido) {
      return res.status(403).json({ error: 'Acceso denegado: rol no autorizado' });
    }
    next();
  };
};