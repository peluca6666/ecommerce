import pkg from 'jsonwebtoken';
const { verify } = pkg;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no encontrado' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no válido' });
  }

  try {
    const { usuario_id, rol } = verify(token, process.env.JWT_SECRET || 'claveSecreta');
    req.usuario = { id: usuario_id, rol };
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// middleware para proteger rutas que requieren autenticación 
export const autorizarPorRol = (rolRequerido) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (req.usuario.rol !== rolRequerido) {
      return res.status(403).json({ error: 'Acceso denegado: rol no autorizado' });
    }
    next(); 
  };
};