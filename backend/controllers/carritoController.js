import * as carritoService from '../services/carritoService.js';

export async function obtenerCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const carrito = await carritoService.obtenerCarrito(usuarioId);
    return res.status(200).json({ exito: true, ...carrito });
  } catch (error) {
    console.error('Error en controlador obtenerCarrito:', error);
    return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
}

export async function agregarProductoAlCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { producto_id, cantidad = 1 } = req.body;

    // Validamos que los datos vengan bien
    if (!producto_id || cantidad <= 0) {
      return res.status(400).json({ exito: false, mensaje: 'Datos de producto inválidos' });
    }

    const resultado = await carritoService.agregarProductoAlCarrito(
      usuarioId,
      parseInt(producto_id),
      parseInt(cantidad)
    );
    
    return res.status(200).json({ exito: true, mensaje: 'Producto agregado al carrito', datos: resultado });

  } catch (error) {
    console.error('Error en controlador agregarProductoAlCarrito:', error);
    return res.status(error.statusCode || 500).json({
      exito: false,
      mensaje: error.message || 'Error interno del servidor'
    });
  }
}

export async function actualizarProductoEnCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { id: productoId } = req.params;
    const { cantidad } = req.body;

    const cantidadNum = parseInt(cantidad);

    // Nos fijamos que la cantidad sea válida
    if (!productoId || isNaN(cantidadNum) || cantidadNum < 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Datos de producto inválidos. La cantidad debe ser un número mayor o igual a 0.'
      });
    }

    const resultado = await carritoService.actualizarProductoEnCarrito(
      usuarioId,
      parseInt(productoId),
      cantidadNum
    );

    return res.status(200).json({
      exito: true,
      mensaje: `Operación realizada: ${resultado.operacion}`,
      datos: resultado
    });

  } catch (error) {
    console.error('Error en controlador actualizarProductoEnCarrito:', error);
    return res.status(error.statusCode || 500).json({
      exito: false,
      mensaje: error.message || 'Error interno del servidor'
    });
  }
}

// 🔧 FUNCIÓN ARREGLADA
export async function eliminarProductoDelCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ exito: false, mensaje: 'Se requiere el ID del producto' });
    }

    // ✅ CAMBIO: Usar vaciarCarrito que sí existe en el service
    const fueEliminado = await carritoService.vaciarCarrito(usuarioId, parseInt(id));

    if (fueEliminado) {
      return res.status(200).json({ exito: true, mensaje: 'Producto eliminado del carrito' });
    } else {
      return res.status(404).json({ exito: false, mensaje: 'El producto no se encontró en el carrito' });
    }

  } catch (error) {
    console.error('Error en controlador eliminarProductoDelCarrito:', error);
    return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
}

export async function vaciarCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const fueVaciado = await carritoService.eliminarCarritoPorUsuarioId(usuarioId);

    if (fueVaciado) {
      return res.status(200).json({ exito: true, mensaje: 'Carrito vaciado exitosamente' });
    } else {
      return res.status(404).json({ exito: false, mensaje: 'No se encontró un carrito para este usuario o ya estaba vacío' });
    }

  } catch (error) {
    console.error('Error en controlador vaciarCarrito:', error);
    return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
}