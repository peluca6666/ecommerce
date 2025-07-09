import * as ventaService from '../services/ventaService.js';
import * as carritoService from '../services/carritoService.js';

// Crea una nueva venta a partir del carrito del usuario
export const crearVenta = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { productos, metodo_pago, direccion_envio } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ exito: false, mensaje: 'El campo "productos" debe ser un arreglo no vacío.' });
    }

    const nuevaVenta = await ventaService.crearNuevaVenta(usuarioId, productos, metodo_pago, direccion_envio);
    await carritoService.eliminarCarritoPorUsuarioId(usuarioId);
    res.status(201).json({ exito: true, mensaje: 'Venta creada exitosamente', venta: nuevaVenta });
  } catch (error) {
    console.error('Error en el controlador al crear la venta:', error);
    res.status(error.statusCode || 500).json({ exito: false, mensaje: error.message || 'Error interno del servidor' });
  }
};

// Devuelve el historial de compras del usuario logueado
export const obtenerHistorialCompras = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const historial = await ventaService.obtenerHistorialDeVentas(usuarioId);
    res.status(200).json({ exito: true, datos: historial });
  } catch (error) {
    console.error('Error en el controlador al obtener el historial:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor al obtener el historial de compras' });
  }
};

// Devuelve todas las ventas del sistema (admin)
export const listarTodasLasVentas = async (req, res) => {
  try {
    const ventas = await ventaService.obtenerTodasLasVentas();
    res.status(200).json({ exito: true, datos: ventas });
  } catch (error) {
    console.error('Error en el controlador al listar ventas:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor al obtener todas las ventas' });
  }
};

// Devuelve el detalle completo de una venta (admin)
export const obtenerDetalleVenta = async (req, res) => {
  try {
    const { id } = req.params;
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

// Devuelve el detalle de una venta pero solo si le pertenece al usuario
export const obtenerDetalleVentaUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id: ventaId } = req.params;

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

// Actualiza el estado de una venta (admin)
export async function actualizarEstadoVenta(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ exito: false, mensaje: 'El nuevo estado es requerido' });
    }

    const resultado = await ventaService.actualizarEstadoVenta(id, estado);
    if (!resultado) {
      return res.status(404).json({ exito: false, mensaje: 'Venta no encontrada' });
    }
    res.json({ exito: true, mensaje: 'Estado de la venta actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
}

// Muestra las ventas realizadas por un usuario específico (admin)
export async function obtenerVentasPorUsuarioAdmin(req, res) {
  try {
    const { id } = req.params;
    const ventas = await ventaService.obtenerVentasDeUsuarioPorAdmin(id);
    res.json({ exito: true, datos: ventas });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
}
