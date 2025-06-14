import express from 'express';
import { verifyToken, autorizarPorRol } from '../middleware/auth.js';
import { schemaRegistro, schemaLogin } from '../validations/authValidation.js';
import { validarBody } from '../middleware/validar.js';
import { registrarUsuario, loginUsuario, obtenerPerfilUsuario } from '../controllers/usuarioController.js';
import { agregarProducto, obtenerProductos, actualizarProducto, eliminarProducto } from '../controllers/productoController.js';
import { actualizarCategoria, crearCategoria, eliminarCategoria, obtenerCategoriaPorId, obtenerCategorias, obtenerCategoriasConConteo, obtenerProductosPorCategoria } from '../controllers/categoriaController.js';
import { obtenerCarrito, agregarProductoAlCarrito, actualizarProductoEnCarrito, eliminarProductoDelCarrito } from '../controllers/carritoController.js';
import { verificarCuenta } from '../controllers/usuarioController.js';
import { crearVenta, obtenerHistorialCompras, listarTodasLasVentas, obtenerDetalleVenta } from '../controllers/ventaController.js';

const router = express.Router();

// ------------------------Rutas de autenticación------------------------
router.post('/register', validarBody(schemaRegistro), registrarUsuario);
router.post('/login', loginUsuario);
router.get('/profile', verifyToken, obtenerPerfilUsuario);
router.get('/verify', verificarCuenta);

//------------------------ Rutas de productos ------------------------
router.get('/producto', obtenerProductos);
router.post('/producto', verifyToken, autorizarPorRol('admin'), agregarProducto);
router.put('/producto/:id', verifyToken, autorizarPorRol('admin'), actualizarProducto);
router.delete('/producto/:id', verifyToken, autorizarPorRol('admin'), eliminarProducto);

// ------------------------ Rutas de categorías ------------------------
router.get('/categoria', obtenerCategorias);
router.get('/categoria/:id/producto', obtenerProductosPorCategoria);

// ------------------------ Rutas de carrito ------------------------
router.get('/carrito', verifyToken, obtenerCarrito);
router.post('/carrito', verifyToken, agregarProductoAlCarrito);
router.put('/carrito/:id', verifyToken, actualizarProductoEnCarrito);
router.delete('/carrito/:id', verifyToken, eliminarProductoDelCarrito);

// ------------------------ Rutas de ventas ------------------------
router.post('/ventas', verifyToken, crearVenta);
router.get('/ventas/historial', verifyToken, obtenerHistorialCompras);

// ------------------------ Ruta de administrador ------------------------
router.get('/admin', verifyToken, autorizarPorRol('admin'), (req, res) => {
  res.json({ mensaje: 'Acceso a panel de administrador' });
});
router.get('/categoria/:id', verifyToken, autorizarPorRol('admin'), obtenerCategoriaPorId);
router.get('/categoria/conteo', verifyToken, autorizarPorRol('admin'), obtenerCategoriasConConteo);
router.post('/categoria', verifyToken, autorizarPorRol('admin'), crearCategoria);
router.put('/categoria/:id', verifyToken, autorizarPorRol('admin'), actualizarCategoria);
router.delete('/categoria/:id', verifyToken, autorizarPorRol('admin'), eliminarCategoria)
router.get('/admin/ventas', verifyToken, autorizarPorRol('admin'), listarTodasLasVentas);
router.get('/admin/ventas/:id', verifyToken, autorizarPorRol('admin'), obtenerDetalleVenta);

export default router;
