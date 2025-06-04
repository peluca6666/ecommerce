import jwt from 'jsonwebtoken';

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
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.usuario = payload; // Guarda el payload en req para los siguientes middlewares
    next();
  } catch (error) {
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
