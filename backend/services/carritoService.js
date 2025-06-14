import { pool } from '../database/connectionMySQL.js';

/**
 * Obtiene el contenido del carrito de un usuario.
 * @param {number} usuarioId - El ID del usuario.
 * @returns {Promise<object>} El objeto del carrito con productos y total.
 */
export async function getCartByUserId(usuarioId) {
  const [rows] = await pool.query(`
    SELECT 
      c.carrito_id, pec.producto_id, p.nombre_producto, p.imagen,
      p.precio AS precio_actual, pec.cantidad,
      (pec.cantidad * p.precio) AS subtotal
    FROM carrito c
    LEFT JOIN producto_en_carrito pec ON c.carrito_id = pec.carrito_id
    LEFT JOIN producto p ON pec.producto_id = p.producto_id
    WHERE c.usuario_id = ?
  `, [usuarioId]);

  if (rows.length === 0 || !rows[0].carrito_id) {
    // Si el usuario no tiene carrito o está vacío
    return { carrito_id: null, productos: [], total: 0 };
  }

  // Filtra filas nulas si el carrito existe pero está vacío
  const productos = rows.filter(row => row.producto_id);
  const total = productos.reduce((acc, item) => acc + item.subtotal, 0);

  return {
    carrito_id: rows[0].carrito_id,
    productos,
    total
  };
}

/**
 * Agrega un producto al carrito de un usuario.
 * @param {number} usuarioId - El ID del usuario.
 * @param {number} productoId - El ID del producto a agregar.
 * @param {number} cantidad - La cantidad a agregar.
 * @returns {Promise<object>} Datos del producto agregado.
 */
export async function addProductToCart(usuarioId, productoId, cantidad) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    // 1. Obtener o crear carrito para el usuario
    await connection.query('INSERT IGNORE INTO carrito (usuario_id) VALUES (?)', [usuarioId]);
    const [[carrito]] = await connection.query('SELECT carrito_id FROM carrito WHERE usuario_id = ?', [usuarioId]);
    const carritoId = carrito.carrito_id;

    // 2. Verificar producto y stock (bloqueando la fila para evitar concurrencia)
    const [[producto]] = await connection.query('SELECT precio, stock_actual FROM producto WHERE producto_id = ? AND activo = true FOR UPDATE', [productoId]);
    if (!producto) {
      throw { statusCode: 404, message: 'Producto no encontrado o no disponible' };
    }

    // 3. Verificar cantidad actual en carrito para no exceder el stock
    const [[itemActual]] = await connection.query('SELECT cantidad FROM producto_en_carrito WHERE carrito_id = ? AND producto_id = ?', [carritoId, productoId]);
    const cantidadActualEnCarrito = itemActual?.cantidad || 0;

    if ((cantidadActualEnCarrito + cantidad) > producto.stock_actual) {
      throw { statusCode: 400, message: `Stock insuficiente. Disponible: ${producto.stock_actual}, ya tienes ${cantidadActualEnCarrito} en el carrito.` };
    }

    // 4. Insertar o actualizar la cantidad del producto
    await connection.query(
      `INSERT INTO producto_en_carrito (carrito_id, producto_id, cantidad, precio_unitario)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)`,
      [carritoId, productoId, cantidad, producto.precio]
    );

    await connection.query('UPDATE carrito SET actualizado_en = NOW() WHERE carrito_id = ?', [carritoId]);
    await connection.commit();

    return { producto_id: productoId, cantidad_agregada: cantidad };

  } catch (error) {
    await connection.rollback();
    console.error('Error en servicio addProductToCart:', error);
    throw error; // Relanzamos el error para que el controlador lo maneje
  } finally {
    connection.release();
  }
}

/**
 * Actualiza la cantidad de un producto en el carrito. Si la cantidad es 0, lo elimina.
 * @param {number} usuarioId - El ID del usuario.
 * @param {number} productoId - El ID del producto.
 * @param {number} cantidad - La nueva cantidad.
 * @returns {Promise<object>} Resultado de la operación.
 */
export async function updateProductInCart(usuarioId, productoId, cantidad) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const [[carrito]] = await connection.query('SELECT carrito_id FROM carrito WHERE usuario_id = ?', [usuarioId]);
    if (!carrito) {
      throw { statusCode: 404, message: 'Carrito no encontrado' };
    }
    const carritoId = carrito.carrito_id;

    if (cantidad === 0) {
      const [deleteResult] = await connection.query('DELETE FROM producto_en_carrito WHERE carrito_id = ? AND producto_id = ?', [carritoId, productoId]);
      await connection.commit();
      return { operacion: 'eliminado', afectado: deleteResult.affectedRows > 0 };
    }

    const [[producto]] = await connection.query('SELECT stock_actual FROM producto WHERE producto_id = ? AND activo = true FOR UPDATE', [productoId]);
    if (!producto) {
      throw { statusCode: 404, message: 'Producto no encontrado o no disponible' };
    }

    if (cantidad > producto.stock_actual) {
      throw { statusCode: 400, message: `Stock insuficiente. Disponible: ${producto.stock_actual}` };
    }

    await connection.query(
      `INSERT INTO producto_en_carrito (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = VALUES(cantidad)`,
      [carritoId, productoId, cantidad]
    );
    await connection.commit();
    return { operacion: 'actualizado', cantidad_nueva: cantidad };

  } catch (error) {
    await connection.rollback();
    console.error('Error en servicio updateProductInCart:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Elimina un producto del carrito, sin importar la cantidad.
 * @param {number} usuarioId  del usuario
 * @param {number} productoId - El ID del producto a eliminar
 * @returns {Promise<boolean>} True si se eliminó, false si no.
 */

export async function removeProductFromCart(usuarioId, productoId) {
  const connection = await pool.getConnection();
  try {
    const [[carrito]] = await connection.query('SELECT carrito_id FROM carrito WHERE usuario_id = ?', [usuarioId]);
    if (!carrito) {
      return false; // No tiene carrito, no se puede eliminar nada
    }

    const [deleteResult] = await connection.query('DELETE FROM producto_en_carrito WHERE carrito_id = ? AND producto_id = ?', [carrito.carrito_id, productoId]);
    return deleteResult.affectedRows > 0;

  } catch (error) {
    console.error('Error en servicio removeProductFromCart:', error);
    throw error;
  } finally {
    connection.release();
  }
}