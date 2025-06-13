import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'claveSecreta'; 

export function generarToken(datos, expiracion = '2h') {
  return jwt.sign(datos, SECRET, { expiresIn: expiracion });
}

export function verificarToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
