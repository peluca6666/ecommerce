import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'claveSecreta'; // clave para firmar los tokens

export function generarToken(datos, expiracion = '2h') {
  // crea un JWT con los datos y tiempo de expiración
  return jwt.sign(datos, SECRET, { expiresIn: expiracion });
}

export function verificarToken(token) {
  try {
    return jwt.verify(token, SECRET); // verifica y decodifica el token
  } catch (err) {
    return null; // token inválido o expirado
  }
}
