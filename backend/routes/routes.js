import express from 'express';
import { verifyToken, autorizarPorRol } from '../middleware/auth.js';
import { schemaRegistro, schemaLogin } from '../validations/authValidation.js';
import { validarBody } from '../middleware/validar.js';
import { registrarUsuario, loginUsuario } from '../controllers/usuarioController.js';
import { obtenerPerfilUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/admin', verifyToken, autorizarPorRol('admin'), (req, res) => {
  res.json({ mensaje: 'Acceso a panel de administrador' });
});

router.post('/register', validarBody(schemaRegistro), registrarUsuario);
router.post('/login', validarBody(schemaLogin), loginUsuario);

router.get('/profile', verifyToken, obtenerPerfilUsuario);

export default router;