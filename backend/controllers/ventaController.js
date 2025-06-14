// src/controllers/ventaController.js

import * as ventaService from '../services/ventaService.js';

export const crearVenta = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // Lo obtenemos del middleware verifyToken
    const { productos, metodo_pago, direccion_envio } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'El campo "productos" debe ser un arreglo no vacío.' });
    }

    const nuevaVenta = await ventaService.crearNuevaVenta(usuarioId, productos, metodo_pago, direccion_envio);

    res.status(201).json({ mensaje: 'Venta creada exitosamente', venta: nuevaVenta });
  } catch (error) {
    console.error('Error en el controlador al crear la venta:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const obtenerHistorialCompras = async (req, res) => {
    try {
      const usuarioId = req.usuario.id;
      const historial = await ventaService.obtenerVentasPorUsuario(usuarioId);
      res.json(historial);
    } catch (error) {
      console.error('Error en el controlador al obtener el historial:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener el historial de compras' });
    }
};

export const listarTodasLasVentas = async (req, res) => {
    try {
      const ventas = await ventaService.obtenerTodasLasVentas();
      res.json(ventas);
    } catch (error) {
      console.error('Error en el controlador al listar ventas:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener todas las ventas' });
    }
};

export const obtenerDetalleVenta = async (req, res) => {
    try {
      const { id } = req.params;
      const detalle = await ventaService.obtenerDetallePorVentaId(id);
      
      if (!detalle) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }
      
      res.json(detalle);
    } catch (error) {
      console.error('Error en el controlador al obtener detalle de venta:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener el detalle de la venta' });
    }
};