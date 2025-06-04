import express from 'express';
import { verifyToken, autorizarPorRol } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', verifyToken, autorizarPorRol('admin'), (req, res) => {
  res.json({ mensaje: 'Acceso a panel de administrador' });
});

export default router;