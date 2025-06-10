import express from 'express';
import { verifyToken, autorizarPorRol } from '../middleware/auth.js';
import { schemaRegistro, schemaLogin } from '../validations/authValidation.js';
import { validarBody } from '../middleware/validar.js';
import { registrarUsuario, loginUsuario, obtenerPerfilUsuario } from '../controllers/usuarioController.js';
import { agregarProducto, obtenerProductos, actualizarProducto, eliminarProducto } from '../controllers/productoController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/register', validarBody(schemaRegistro), registrarUsuario);
router.post('/login', validarBody(schemaLogin), loginUsuario);
router.get('/profile', verifyToken, obtenerPerfilUsuario);

// Rutas de productos
router.get('/productos', obtenerProductos);
router.post('/productos', verifyToken, autorizarPorRol('admin'), agregarProducto);
router.put('/productos/:id', verifyToken, autorizarPorRol('admin'), actualizarProducto);
router.delete('/productos/:id', verifyToken, autorizarPorRol('admin'), eliminarProducto);


// Ruta de admin
router.get('/admin', verifyToken, autorizarPorRol('admin'), (req, res) => {
  res.json({ mensaje: 'Acceso a panel de administrador' });
});

export default router;