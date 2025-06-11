import { pool } from '../database/connectionMySQL.js'

// GET/carrito-----------------------------------------------------------------------
export async function obtenerCarrito(req, res) {
  const usuarioId = req.usuario?.id;
  
  if (!usuarioId) {
    return res.status(401).json({ 
      exito: false, 
      mensaje: 'Autenticación requerida' 
    });
  }

  try {
    const [result] = await pool.query(`
      SELECT 
        c.carrito_id,
        pec.producto_en_carrito_id,
        pec.producto_id,
        p.nombre_producto,
        p.imagen,
        p.precio AS precio_actual,
        pec.precio_unitario,
        pec.cantidad,
        (pec.cantidad * pec.precio_unitario) AS subtotal
      FROM carrito c
      LEFT JOIN producto_en_carrito pec ON c.carrito_id = pec.carrito_id
      LEFT JOIN producto p ON pec.producto_id = p.producto_id
      WHERE c.usuario_id = ?
    `, [usuarioId]);

    if (!result[0]?.carrito_id) {
      return res.status(200).json({
        exito: true,
        carrito_id: null,
        productos: [],
        total: 0,
        mensaje: 'Carrito vacío'
      });
    }

    const productos = result.filter(row => row.producto_id);
    const total = productos.reduce((acc, item) => acc + item.subtotal, 0);

    return res.status(200).json({
      exito: true,
      carrito_id: result[0].carrito_id,
      productos,
      total
    });

  } catch (error) {
    console.error('Error en obtenerCarrito:', error);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno al procesar el carrito'
    });
  }
}
// POST/carrito
export async function agregarProductoAlCarrito(req, res) {
  const usuarioId = req.usuario?.id;
  const { producto_id, cantidad = 1 } = req.body;

  // Validaciones básicas mejoradas
  if (!usuarioId) return res.status(401).json({ exito: false, mensaje: 'Autenticación requerida' });
  
  const productoId = parseInt(producto_id);
  const cantidadNum = parseInt(cantidad);
  
  if (!productoId || productoId <= 0 || !cantidadNum || cantidadNum <= 0) {
    return res.status(400).json({ exito: false, mensaje: 'Producto ID y cantidad deben ser números positivos' });
  }

  if (cantidadNum > 100) {
    return res.status(400).json({ exito: false, mensaje: 'Cantidad máxima permitida: 100 unidades' });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    // 1. Obtener o crear carrito
    await connection.query('INSERT IGNORE INTO carrito (usuario_id) VALUES (?)', [usuarioId]);
    const [[carrito]] = await connection.query('SELECT carrito_id FROM carrito WHERE usuario_id = ?', [usuarioId]);

    // 2. Verificar producto, stock y cantidad actual en carrito
    const [[producto]] = await connection.query(
      'SELECT precio, stock_actual FROM producto WHERE producto_id = ? AND activo = true FOR UPDATE',
      [productoId]
    );
    
    if (!producto) {
      await connection.rollback();
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado o no disponible' });
    }

    // Verificar cantidad actual en carrito para validación total de stock
    const [[itemActual]] = await connection.query(
      'SELECT cantidad FROM producto_en_carrito WHERE carrito_id = ? AND producto_id = ?',
      [carrito.carrito_id, productoId]
    );

    const cantidadActualEnCarrito = itemActual?.cantidad || 0;
    const cantidadTotalRequerida = cantidadActualEnCarrito + cantidadNum;

    if (cantidadTotalRequerida > producto.stock_actual) {
      await connection.rollback();
      return res.status(400).json({
        exito: false,
        mensaje: `Stock insuficiente. Disponible: ${producto.stock_actual}, tienes ${cantidadActualEnCarrito} en carrito`
      });
    }

    // 3. Insertar o actualizar producto en carrito
    const [result] = await connection.query(
      `INSERT INTO producto_en_carrito (carrito_id, producto_id, cantidad, precio_unitario)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)`,
      [carrito.carrito_id, productoId, cantidadNum, producto.precio]
    );

    // 4. Actualizar timestamp del carrito
    await connection.query('UPDATE carrito SET actualizado_en = NOW() WHERE carrito_id = ?', [carrito.carrito_id]);

    // 5. Obtener cantidad final para respuesta precisa
    const [[itemFinal]] = await connection.query(
      'SELECT cantidad FROM producto_en_carrito WHERE carrito_id = ? AND producto_id = ?',
      [carrito.carrito_id, productoId]
    );

    await connection.commit();

    return res.status(200).json({
      exito: true,
      mensaje: 'Producto agregado al carrito exitosamente',
      datos: {
        carrito_id: carrito.carrito_id,
        producto_id: productoId,
        cantidad_agregada: cantidadNum,
        cantidad_total_en_carrito: itemFinal.cantidad,
        precio_unitario: producto.precio
      }
    });

  } catch (error) {
    await connection.rollback();
    
    console.error('Error agregando producto al carrito:', {
      error: error.message,
      usuario_id: usuarioId,
      producto_id: productoId,
      cantidad: cantidadNum,
      timestamp: new Date().toISOString()
    });

    return res.status(500).json({ 
      exito: false, 
      mensaje: 'Error interno al agregar producto al carrito' 
    });
  } finally {
    connection.release();
  }
}

//PUT/carrito----------------------------------------------------------------------------
export async function actualizarProductoEnCarrito(req, res) {
  const usuarioId = req.usuario?.id;
  const { producto_id, cantidad } = req.body;

  // Validaciones básicas
  if (!usuarioId) {
    return res.status(401).json({ exito: false, mensaje: 'Autenticación requerida' });
  }

  const productoId = parseInt(producto_id);
  const cantidadNum = parseInt(cantidad);

  if (!productoId || productoId <= 0 || typeof cantidadNum !== 'number' || cantidadNum < 0) {
    return res.status(400).json({ exito: false, mensaje: 'Producto ID debe ser positivo y cantidad debe ser un número >= 0' });
  }

  if (cantidadNum > 100) {
    return res.status(400).json({ exito: false, mensaje: 'Cantidad máxima permitida: 100 unidades' });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Obtener o crear carrito
    await connection.query('INSERT IGNORE INTO carrito (usuario_id) VALUES (?)', [usuarioId]);
    const [[carrito]] = await connection.query('SELECT carrito_id FROM carrito WHERE usuario_id = ?', [usuarioId]);

    if (!carrito) {
      await connection.rollback();
      return res.status(500).json({ exito: false, mensaje: 'Error al obtener carrito' });
    }

    const carritoId = carrito.carrito_id;

    // 2. Caso especial: eliminar producto (cantidad = 0)
    if (cantidadNum === 0) {
      const [deleteResult] = await connection.query(
        'DELETE FROM producto_en_carrito WHERE carrito_id = ? AND producto_id = ?',
        [carritoId, productoId]
      );

      // Actualizar timestamp del carrito
      await connection.query('UPDATE carrito SET actualizado_en = NOW() WHERE carrito_id = ?', [carritoId]);

      await connection.commit();

      return res.status(200).json({ 
        exito: true, 
        mensaje: deleteResult.affectedRows > 0 ? 'Producto eliminado del carrito' : 'Producto no estaba en el carrito',
        datos: {
          carrito_id: carritoId,
          producto_id: productoId,
          cantidad_final: 0,
          eliminado: deleteResult.affectedRows > 0
        }
      });
    }

    // 3. Verificar producto y stock
    const [[producto]] = await connection.query(
      'SELECT precio, stock_actual FROM producto WHERE producto_id = ? AND activo = true FOR UPDATE',
      [productoId]
    );

    if (!producto) {
      await connection.rollback();
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado o no disponible' });
    }

    // 4. Validar stock disponible
    if (cantidadNum > producto.stock_actual) {
      await connection.rollback();
      return res.status(400).json({
        exito: false,
        mensaje: `Stock insuficiente. Disponible: ${producto.stock_actual} unidades`
      });
    }

    // 5. Verificar si el producto ya está en el carrito para logging
    const [[itemActual]] = await connection.query(
      'SELECT cantidad FROM producto_en_carrito WHERE carrito_id = ? AND producto_id = ?',
      [carritoId, productoId]
    );

    const cantidadAnterior = itemActual?.cantidad || 0;

    // 6. Insertar o actualizar el producto en el carrito
    const [upsertResult] = await connection.query(
      `INSERT INTO producto_en_carrito (carrito_id, producto_id, cantidad, precio_unitario, agregado_en)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
       cantidad = VALUES(cantidad), 
       precio_unitario = VALUES(precio_unitario),
       actualizado_en = NOW()`,
      [carritoId, productoId, cantidadNum, producto.precio]
    );

    // 7. Actualizar timestamp del carrito
    await connection.query('UPDATE carrito SET actualizado_en = NOW() WHERE carrito_id = ?', [carritoId]);

    // 8. Obtener resumen del carrito actualizado
    const [[resumenCarrito]] = await connection.query(`
      SELECT 
        COUNT(*) as total_productos,
        SUM(cantidad) as total_unidades,
        SUM(cantidad * precio_unitario) as total_precio
      FROM producto_en_carrito 
      WHERE carrito_id = ?
    `, [carritoId]);

    await connection.commit();

    const esNuevoItem = upsertResult.affectedRows === 1;
    const esActualizacion = upsertResult.affectedRows === 2;

    return res.status(200).json({ 
      exito: true, 
      mensaje: esNuevoItem ? 'Producto agregado al carrito' : 'Cantidad actualizada en el carrito',
      datos: {
        carrito_id: carritoId,
        producto_id: productoId,
        cantidad_anterior: cantidadAnterior,
        cantidad_nueva: cantidadNum,
        precio_unitario: producto.precio,
        operacion: esNuevoItem ? 'agregado' : 'actualizado',
        resumen_carrito: {
          total_productos: parseInt(resumenCarrito.total_productos),
          total_unidades: parseInt(resumenCarrito.total_unidades),
          total_precio: parseFloat(resumenCarrito.total_precio || 0)
        }
      }
    });

  } catch (error) {
    await connection.rollback();
    
    console.error('Error en actualizarProductoEnCarrito:', {
      error: error.message,
      stack: error.stack,
      usuario_id: usuarioId,
      producto_id: productoId,
      cantidad: cantidadNum,
      timestamp: new Date().toISOString()
    });

    return res.status(500).json({ 
      exito: false, 
      mensaje: 'Error interno del servidor al actualizar carrito' 
    });
  } finally {
    connection.release();
  }
}

//DELETE /carrito--------------------------------------------------------------------

export async function eliminarProductoDelCarrito(req, res) {
  const usuarioId = req.usuario?.id;
const { producto_id } = req.body;

  // Validaciones
  if (!usuarioId) {
    return res.status(401).json({ exito: false, mensaje: 'Autenticación requerida' });
  }

  const productoId = parseInt(producto_id);
  if (isNaN(productoId)) {
    return res.status(400).json({ exito: false, mensaje: 'ID de producto inválido' });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Buscar carrito del usuario
    const [[carrito]] = await connection.query(
      'SELECT carrito_id FROM carrito WHERE usuario_id = ?', 
      [usuarioId]
    );

    if (!carrito) {
      await connection.rollback();
      return res.status(404).json({ exito: false, mensaje: 'Carrito no encontrado' });
    }

    // 2. Eliminar producto
    const [deleteResult] = await connection.query(
      'DELETE FROM producto_en_carrito WHERE carrito_id = ? AND producto_id = ?',
      [carrito.carrito_id, productoId]
    );

    if (deleteResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        exito: false, 
        mensaje: 'Producto no encontrado en el carrito' 
      });
    }

    // 3. Actualizar timestamp del carrito
    await connection.query(
      'UPDATE carrito SET actualizado_en = NOW() WHERE carrito_id = ?',
      [carrito.carrito_id]
    );

    await connection.commit();

    return res.status(200).json({
      exito: true,
      mensaje: 'Producto eliminado del carrito',
      datos: {
        carrito_id: carrito.carrito_id,
        producto_id: productoId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error eliminando producto:', {
      error: error.message,
      usuarioId,
      productoId,
      timestamp: new Date().toISOString()
    });
    return res.status(500).json({ 
      exito: false, 
      mensaje: 'Error interno al eliminar producto' 
    });
  } finally {
    connection.release();
  }
}