import * as ventaService from '../services/ventaService.js';
import * as carritoService from '../services/carritoService.js';

// crea venta y vacia carrito en una transaccion logica
export const crearVenta = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { productos, metodo_pago, direccion_envio } = req.body;

    // validacion de estructura de datos antes de procesar
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ exito: false, mensaje: 'El campo "productos" debe ser un arreglo no vacío.' });
    }

    // proceso de checkout: crear venta + limpiar carrito
    const nuevaVenta = await ventaService.crearNuevaVenta(usuarioId, productos, metodo_pago, direccion_envio);
    await carritoService.eliminarCarritoPorUsuarioId(usuarioId);
    res.status(201).json({ exito: true, mensaje: 'Venta creada exitosamente', venta: nuevaVenta });
  } catch (error) {
    console.error('Error en el controlador al crear la venta:', error);
    res.status(error.statusCode || 500).json({ exito: false, mensaje: error.message || 'Error interno del servidor' });
  }
};

// historial personal del usuario autenticado
export const obtenerHistorialCompras = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    // solo obtiene compras del usuario logueado por seguridad
    const historial = await ventaService.obtenerHistorialDeVentas(usuarioId);
    res.status(200).json({ exito: true, datos: historial });
  } catch (error) {
    console.error('Error en el controlador al obtener el historial:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor al obtener el historial de compras' });
  }
};

// vista global de todas las ventas para administradores
export const listarTodasLasVentas = async (req, res) => {
  try {
    const ventas = await ventaService.obtenerTodasLasVentas();
    res.status(200).json({ exito: true, datos: ventas });
  } catch (error) {
    console.error('Error en el controlador al listar ventas:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor al obtener todas las ventas' });
  }
};

// detalle completo de venta para administradores
export const obtenerDetalleVenta = async (req, res) => {
  try {
    const { id } = req.params;
    // version admin incluye toda la info sensible y de gestion
    const detalle = await ventaService.obtenerDetalleDeVentaParaAdmin(parseInt(id));

    if (!detalle) {
      return res.status(404).json({ exito: false, mensaje: 'Venta no encontrada' });
    }

    res.status(200).json({ exito: true, datos: detalle });
  } catch (error) {
    console.error('Error en el controlador al obtener detalle de venta (admin):', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
};

// detalle de venta con verificacion de propiedad del usuario
export const obtenerDetalleVentaUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id: ventaId } = req.params;

    // verifica que la venta pertenezca al usuario autenticado
    const venta = await ventaService.obtenerDetalleDeVentaParaCliente(parseInt(ventaId), usuarioId);

    if (!venta) {
      return res.status(404).json({ exito: false, mensaje: 'Orden no encontrada o no te pertenece' });
    }

    res.status(200).json({ exito: true, datos: venta });
  } catch (error) {
    console.error("Error al obtener detalle de venta para usuario:", error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
};

// cambio de estado de venta para workflow de fulfillment
export async function actualizarEstadoVenta(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ exito: false, mensaje: 'El nuevo estado es requerido' });
    }

    // estados tipicos: pendiente, procesando, enviado, entregado, cancelado
    const resultado = await ventaService.actualizarEstadoVenta(id, estado);
    if (!resultado) {
      return res.status(404).json({ exito: false, mensaje: 'Venta no encontrada' });
    }
    res.json({ exito: true, mensaje: 'Estado de la venta actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
}

// vista admin de compras de un usuario especifico
export async function obtenerVentasPorUsuarioAdmin(req, res) {
  try {
    const { id } = req.params;
    // para analisis de clientes, historial de compras, soporte
    const ventas = await ventaService.obtenerVentasDeUsuarioPorAdmin(id);
    res.json({ exito: true, datos: ventas });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
}