import * as carritoService from '../services/carritoService.js';

export async function obtenerCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const carrito = await carritoService.getCartByUserId(usuarioId);
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

    //Nos aseguramos que producto_id sea un numero y cantidad sea un número positivo
    if (!producto_id || cantidad <= 0) {
      return res.status(400).json({ exito: false, mensaje: 'Datos de producto inválidos' });
    }
    
    const resultado = await carritoService.addProductToCart(usuarioId, parseInt(producto_id), parseInt(cantidad));
    return res.status(200).json({ exito: true, mensaje: 'Producto agregado al carrito', datos: resultado });

  } catch (error) {
    console.error('Error en controlador agregarProductoAlCarrito:', error);
    return res.status(error.statusCode || 500).json({ exito: false, mensaje: error.message || 'Error interno del servidor' });
  }
}

export async function actualizarProductoEnCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { producto_id, cantidad } = req.body;

    const cantidadNum = parseInt(cantidad);
    if (!producto_id || isNaN(cantidadNum) || cantidadNum < 0) {
      return res.status(400).json({ exito: false, mensaje: 'Datos de producto inválidos. La cantidad debe ser un número mayor o igual a 0.' });
    }

    const resultado = await carritoService.updateProductInCart(usuarioId, parseInt(producto_id), cantidadNum);
    return res.status(200).json({ exito: true, mensaje: `Operación realizada: ${resultado.operacion}`, datos: resultado });

  } catch (error) {
    console.error('Error en controlador actualizarProductoEnCarrito:', error);
    return res.status(error.statusCode || 500).json({ exito: false, mensaje: error.message || 'Error interno del servidor' });
  }
}

export async function eliminarProductoDelCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ exito: false, mensaje: 'Se requiere el ID del producto' });
    }

    // Le pasamos el ID del producto al servicio para que lo elimine
    const fueEliminado = await carritoService.removeProductFromCart(usuarioId, parseInt(id));

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