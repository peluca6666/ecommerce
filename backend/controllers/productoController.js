import * as productoService from '../services/productoService.js';

export async function obtenerProductos(req, res) {
  try {
    // Le pasamos directamente los filtros de la query al servicio
    const resultado = await productoService.getAllProducts(req.query);
    const { productos, paginacion } = resultado;

    return res.status(200).json({
      exito: true,
      mensaje: 'Productos obtenidos exitosamente',
      datos: productos,
      paginacion: {
        total_items: paginacion.total,
        total_paginas: Math.ceil(paginacion.total / paginacion.limite),
        pagina_actual: paginacion.pagina,
        limite_por_pagina: paginacion.limite
      }
    });
  } catch (error) {
    console.error("Error en obtenerProductos Controller:", error);
    return res.status(500).json({ exito: false, mensaje: 'Error al obtener productos' });
  }
}

export async function agregarProducto(req, res) {
  try {
    // Enviamos los datos del form + archivos al servicio
    const nuevoProducto = await productoService.createProduct(req.body, req.files);

    return res.status(201).json({
      exito: true,
      mensaje: 'Producto agregado correctamente',
      datos: nuevoProducto
    });
  } catch (error) {
    console.error("Error en agregarProducto Controller:", error);
    return res.status(error.statusCode || 500).json({
      exito: false,
      mensaje: error.message || 'Error interno del servidor'
    });
  }
}

export async function actualizarProducto(req, res) {
  console.log('--- CONTROLLER: INICIO DE actualizarProducto ---');
  console.log('ID del producto a actualizar:', req.params.id);
  console.log('Datos de texto recibidos (req.body):', req.body);
  console.log('Archivos recibidos (req.files):', req.files);
  console.log('-------------------------------------------');

  try {
    const { id } = req.params;

    // Pasamos ID, body y archivos al servicio para actualizar
    const productoActualizado = await productoService.updateProduct(id, req.body, req.files);

    if (!productoActualizado) {
      console.error('[CONTROLLER] El servicio no devolvió un producto actualizado (posible 404).');
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
    }

    console.log('[CONTROLLER] Producto actualizado con éxito. Enviando respuesta.');
    res.json({
      exito: true,
      mensaje: 'Producto actualizado correctamente',
      datos: productoActualizado
    });

  } catch (error) {
    console.error("Error en actualizarProducto Controller:", error);
    res.status(500).json({ exito: false, mensaje: error.message });
  }
}

export async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ exito: false, mensaje: 'ID de producto inválido' });
    }

    await productoService.deleteProduct(parseInt(id));
    return res.status(200).json({ exito: true, mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("Error en eliminarProducto Controller:", error);
    return res.status(error.statusCode || 500).json({
      exito: false,
      mensaje: error.message || 'Error interno del servidor'
    });
  }
}

export async function obtenerProductosEnOferta(req, res) {
  try {
    const productos = await productoService.getOfferProducts();
    return res.status(200).json({
      exito: true,
      mensaje: 'Productos en oferta obtenidos exitosamente',
      datos: productos
    });
  } catch (error) {
    console.error("Error en obtenerProductosEnOferta Controller:", error);
    return res.status(500).json({ exito: false, mensaje: 'Error al obtener productos en oferta' });
  }
}

export async function obtenerProductoPorId(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ exito: false, mensaje: 'ID de producto inválido' });
    }

    const producto = await productoService.obtenerProductoPorId(parseInt(id));

    if (!producto) {
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado o no disponible' });
    }

    return res.status(200).json({ exito: true, datos: producto });

  } catch (error) {
    console.error("Error en obtenerProductoPorId Controller:", error);
    return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
}

// Activar o desactivar un producto
export async function toggleActivoProducto(req, res) {
  try {
    const { id } = req.params;
    const resultado = await productoService.toggleProductStatus(id);

    if (!resultado) {
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
    }

    res.json({ exito: true, mensaje: 'Estado del producto actualizado' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
}
