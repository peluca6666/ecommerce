import jwt from 'jsonwebtoken';

const payload = {
  usuario_id: 1,
  rol: 'admin'
};

const token = jwt.sign(payload, 'claveSecreta', { expiresIn: '2h' });

console.log(token);