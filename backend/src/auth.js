import pkg from 'jsonwebtoken';
const { verify } = pkg;

// middleware para verificar autenticacion en rutas protegidas
export const verifyToken = (req, res, next) => {
  console.log('🔍 === INICIO VERIFICACIÓN TOKEN ===');
  console.log('Headers:', req.headers.authorization);
  
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('❌ No authHeader');
    return res.status(401).json({ error: 'Token no encontrado' });
  }

  // extrae token del header Bearer
  const token = authHeader.split(' ')[1];
  console.log('Token extraído:', token ? 'SÍ' : 'NO');
  
  if (!token) {
    console.log('❌ No token después de split');
    return res.status(401).json({ error: 'Token no válido' });
  }

  try {
    console.log('🔑 JWT_SECRET disponible:', !!process.env.JWT_SECRET);
    console.log('🔑 JWT_SECRET length:', process.env.JWT_SECRET?.length);
    
    // verifica firma y expiracion del token con secret del servidor
    const { usuario_id, rol } = verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verificado. Usuario:', usuario_id, 'Rol:', rol);
    
    // inyecta datos del usuario al request para uso en controllers
    req.usuario = { id: usuario_id, rol };
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// factory function para crear middleware de autorizacion por rol
export const autorizarPorRol = (rolRequerido) => {
  return (req, res, next) => {
    console.log(`🔐 Verificando rol. Requerido: ${rolRequerido}, Usuario: ${req.usuario?.rol}`);
    
    // verifica que el usuario ya este autenticado
    if (!req.usuario) {
      console.log('❌ Usuario no autenticado en autorización');
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    // compara rol del usuario con rol requerido para la ruta
    if (req.usuario.rol !== rolRequerido) {
      console.log(`❌ Rol no autorizado. Esperado: ${rolRequerido}, Actual: ${req.usuario.rol}`);
      return res.status(403).json({ error: 'Acceso denegado: rol no autorizado' });
    }
    
    console.log('✅ Autorización exitosa');
    next();
  };
};
