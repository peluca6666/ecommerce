import express from 'express';

import { verifyToken, autorizarPorRol } from '../middleware/auth.js';
import { schemaRegistro, schemaLogin } from '../validations/authValidation.js';
import { validarBody } from '../middleware/validar.js';

import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfilUsuario,
  actualizarPerfilUsuario,
  cambiarContraseñaUsuario,
  verificarCuenta,
  obtenerTodosLosUsuarios,
  cambiarRolUsuario,
  cambiarEstadoUsuario
} from '../controllers/usuarioController.js';

import {
  agregarProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosEnOferta,
  obtenerProductoPorId,
  toggleActivoProducto
} from '../controllers/productoController.js';

import {
  obtenerCategorias,
  obtenerCategoriasConConteo,
  obtenerProductosPorCategoria,
  obtenerTodasCategoriasAdmin,
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria,
  obtenerCategoriaPorId
} from '../controllers/categoriaController.js';

import {
  obtenerCarrito,
  agregarProductoAlCarrito,
  actualizarProductoEnCarrito,
  eliminarProductoDelCarrito
} from '../controllers/carritoController.js';

import {
  crearVenta,
  obtenerHistorialCompras,
  listarTodasLasVentas,
  obtenerDetalleVenta,
  obtenerDetalleVentaUsuario,
  actualizarEstadoVenta,
  obtenerVentasPorUsuarioAdmin
} from '../controllers/ventaController.js';

import { manejarFormularioContacto } from '../controllers/contactoController.js';
import { upload } from '../middleware/upload.js';
import { uploadCategoria } from '../middleware/uploadCategoria.js';

import { createOrder, receiveWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// --- Rutas públicas ---

// Contacto
router.post('/contacto', manejarFormularioContacto);

// Registro y login
router.post('/register', validarBody(schemaRegistro), registrarUsuario);
router.post('/login', loginUsuario);
router.get('/verify', verificarCuenta);

// Perfil
router.get('/profile', verifyToken, obtenerPerfilUsuario);
router.put('/profile', verifyToken, actualizarPerfilUsuario);
router.post('/profile/change-password', verifyToken, cambiarContraseñaUsuario);

// Productos y categorías visibles para cualquiera
router.get('/producto', obtenerProductos);
router.get('/producto/ofertas', obtenerProductosEnOferta);
router.get('/producto/:id', obtenerProductoPorId);
router.get('/categoria', obtenerCategorias);
router.get('/categoria/:id/producto', obtenerProductosPorCategoria);

// --- Rutas protegidas para usuarios logueados ---

// Carrito
router.get('/carrito', verifyToken, obtenerCarrito);
router.post('/carrito', verifyToken, agregarProductoAlCarrito);
router.put('/carrito/:id', verifyToken, actualizarProductoEnCarrito);
router.delete('/carrito/:id', verifyToken, eliminarProductoDelCarrito);

// Ventas
router.post('/ventas', verifyToken, crearVenta);
router.get('/ventas/historial', verifyToken, obtenerHistorialCompras);
router.get('/ventas/:id', verifyToken, obtenerDetalleVentaUsuario);

// Pago
router.post('/create-order', verifyToken, createOrder);
router.get('/success', (req, res) => {
  res.redirect('https://salomarket.shop/OrderConfirmationPage'); 
});
router.post ('/webhook', receiveWebhook);

// --- Rutas solo para admin ---

// Productos
router.post(
  '/producto',
  verifyToken,
  autorizarPorRol('admin'),
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'imagenes', maxCount: 10 }
  ]),
  agregarProducto
);

router.put(
  '/producto/:id',
  verifyToken,
  autorizarPorRol('admin'),
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'imagenes', maxCount: 10 }
  ]),
  actualizarProducto
);

router.delete('/producto/:id', verifyToken, autorizarPorRol('admin'), eliminarProducto);
router.put('/producto/:id/toggle-activo', verifyToken, autorizarPorRol('admin'), toggleActivoProducto);

// Categorías
router.get('/categoria/:id', verifyToken, autorizarPorRol('admin'), obtenerCategoriaPorId);
router.get('/categoria/conteo', verifyToken, autorizarPorRol('admin'), obtenerCategoriasConConteo);
router.get('/admin/categorias', verifyToken, autorizarPorRol('admin'), obtenerTodasCategoriasAdmin);

router.post(
  '/admin/categorias',
  verifyToken,
  autorizarPorRol('admin'),
  uploadCategoria.single('imagen'),
  crearCategoria
);

router.put(
  '/admin/categorias/:id',
  verifyToken,
  autorizarPorRol('admin'),
  uploadCategoria.single('imagen'),
  actualizarCategoria
);

router.put('/admin/categorias/:id/toggle-activo', verifyToken, autorizarPorRol('admin'), cambiarEstadoCategoria);

// Ventas
router.get('/admin/ventas', verifyToken, autorizarPorRol('admin'), listarTodasLasVentas);
router.get('/admin/ventas/:id', verifyToken, autorizarPorRol('admin'), obtenerDetalleVenta);
router.put('/admin/ventas/:id/status', verifyToken, autorizarPorRol('admin'), actualizarEstadoVenta);

// Usuarios
router.get('/admin/usuarios', verifyToken, autorizarPorRol('admin'), obtenerTodosLosUsuarios);
router.put('/admin/usuarios/:id/rol', verifyToken, autorizarPorRol('admin'), cambiarRolUsuario);
router.put('/admin/usuarios/:id/toggle-activo', verifyToken, autorizarPorRol('admin'), cambiarEstadoUsuario);
router.get('/admin/usuarios/:id/ventas', verifyToken, autorizarPorRol('admin'), obtenerVentasPorUsuarioAdmin);

// Panel admin de prueba
router.get('/admin', verifyToken, autorizarPorRol('admin'), (req, res) => {
  res.json({ mensaje: 'Acceso a panel de administrador' });
});

export default router;
