import * as ventaService from '../services/ventaService.js';

// Controlador para crear una nueva venta
export const crearVenta = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { productos, metodo_pago, direccion_envio } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ exito: false, mensaje: 'El campo "productos" debe ser un arreglo no vacío.' });
    }

    const nuevaVenta = await ventaService.crearNuevaVenta(usuarioId, productos, metodo_pago, direccion_envio);

    res.status(201).json({ exito: true, mensaje: 'Venta creada exitosamente', venta: nuevaVenta });
  } catch (error) {
    console.error('Error en el controlador al crear la venta:', error);
    res.status(error.statusCode || 500).json({ exito: false, mensaje: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener el historial de compras de un usuario
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


 // Controlador para que un administrador liste todas las ventas del sistema
export const listarTodasLasVentas = async (req, res) => {
    try {
      const ventas = await ventaService.obtenerTodasLasVentas();
      res.status(200).json({ exito: true, datos: ventas });
    } catch (error) {
      console.error('Error en el controlador al listar ventas:', error);
      res.status(500).json({ exito: false, mensaje: 'Error interno del servidor al obtener todas las ventas' });
    }
};

// Controlador para que un administrador obtenga el detalle de cualquier venta
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

// Controlador para que un usuario obtenga el detalle de sus propias compras
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