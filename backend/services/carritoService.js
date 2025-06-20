import { pool } from '../database/connectionMySQL.js';

/**
 * Trae los productos del carrito de un usuario
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<{carrito_id: number|null, productos: Array, total: number}>} - Datos del carrito y total
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

  // Si el carrito existe pero no tiene productos
  const productos = rows.filter(row => row.producto_id);
  const total = productos.reduce((acc, item) => acc + item.subtotal, 0);

  return {
    carrito_id: rows[0].carrito_id,
    productos,
    total
  };
}

/**
 * Agrega un producto al carrito (si no tiene, lo crea)
 * @param {number} usuarioId - ID del usuario
 * @param {number} productoId - ID del producto
 * @param {number} cantidad - Cantidad a agregar
 * @returns {Promise<{producto_id: number, cantidad_agregada: number}>}
 * @throws {Error} Si no hay stock suficiente o producto no existe
 */
export async function addProductToCart(usuarioId, productoId, cantidad) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    await connection.query(
      'INSERT IGNORE INTO carrito (usuario_id) VALUES (?)',
      [usuarioId]
    );

    const [[carrito]] = await connection.query(
      'SELECT carrito_id FROM carrito WHERE usuario_id = ?',
      [usuarioId]
    );

    const carritoId = carrito.carrito_id;

    const [[producto]] = await connection.query(
      `SELECT precio, stock_actual FROM producto 
       WHERE producto_id = ? AND activo = true 
       FOR UPDATE`,
      [productoId]
    );

    if (!producto) {
      throw {
        statusCode: 404,
        message: 'Producto no encontrado o no disponible'
      };
    }

    const [[itemActual]] = await connection.query(
      `SELECT cantidad FROM producto_en_carrito 
       WHERE carrito_id = ? AND producto_id = ?`,
      [carritoId, productoId]
    );

    const cantidadActualEnCarrito = itemActual?.cantidad || 0;

    if ((cantidadActualEnCarrito + cantidad) > producto.stock_actual) {
      throw {
        statusCode: 400,
        message: `Stock insuficiente. Disponible: ${producto.stock_actual}, ya tenés ${cantidadActualEnCarrito} en el carrito.`
      };
    }

    await connection.query(
      `INSERT INTO producto_en_carrito (carrito_id, producto_id, cantidad, precio_unitario)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)`,
      [carritoId, productoId, cantidad, producto.precio]
    );

    await connection.query(
      'UPDATE carrito SET actualizado_en = NOW() WHERE carrito_id = ?',
      [carritoId]
    );

    await connection.commit();
    return { producto_id: productoId, cantidad_agregada: cantidad };

  } catch (error) {
    await connection.rollback();
    console.error('Error en servicio addProductToCart:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Actualiza la cantidad de un producto en el carrito (si pone 0, lo borra)
 * @param {number} usuarioId
 * @param {number} productoId
 * @param {number} cantidad
 * @returns {Promise<{operacion: string, afectado?: boolean, cantidad_nueva?: number}>}
 * @throws {Error} Si no hay stock suficiente o carrito/producto no existe
 */
export async function updateProductInCart(usuarioId, productoId, cantidad) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [[carrito]] = await connection.query(
      'SELECT carrito_id FROM carrito WHERE usuario_id = ?',
      [usuarioId]
    );

    if (!carrito) {
      throw { statusCode: 404, message: 'Carrito no encontrado' };
    }

    const carritoId = carrito.carrito_id;

    if (cantidad === 0) {
      const [deleteResult] = await connection.query(
        `DELETE FROM producto_en_carrito 
         WHERE carrito_id = ? AND producto_id = ?`,
        [carritoId, productoId]
      );

      await connection.commit();
      connection.release();

      return { operacion: 'eliminado', afectado: deleteResult.affectedRows > 0 };
    }

    // Traemos precio y stock del producto
    const [[producto]] = await connection.query(
      `SELECT precio, stock_actual FROM producto 
       WHERE producto_id = ? AND activo = true 
       FOR UPDATE`,
      [productoId]
    );

    if (!producto) {
      throw { statusCode: 404, message: 'Producto no encontrado o no disponible' };
    }

    if (cantidad > producto.stock_actual) {
      throw { statusCode: 400, message: `Stock insuficiente. Disponible: ${producto.stock_actual}` };
    }

    await connection.query(
      `INSERT INTO producto_en_carrito 
       (carrito_id, producto_id, cantidad, precio_unitario) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         cantidad = VALUES(cantidad), 
         precio_unitario = VALUES(precio_unitario)`,
      [carritoId, productoId, cantidad, producto.precio]
    );

    await connection.query(
      'UPDATE carrito SET actualizado_en = NOW() WHERE carrito_id = ?',
      [carritoId]
    );

    await connection.commit();
    return { operacion: 'actualizado', cantidad_nueva: cantidad };

  } catch (error) {
    await connection.rollback();
    console.error('Error en servicio updateProductInCart:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Elimina un producto puntual del carrito
 * @param {number} usuarioId
 * @param {number} productoId
 * @returns {Promise<boolean>} True si se eliminó correctamente, false si no existía carrito
 */
export async function removeProductFromCart(usuarioId, productoId) {
  const connection = await pool.getConnection();

  try {
    const [[carrito]] = await connection.query(
      'SELECT carrito_id FROM carrito WHERE usuario_id = ?',
      [usuarioId]
    );

    if (!carrito) {
      return false; // No hay carrito, no se puede borrar
    }

    const [deleteResult] = await connection.query(
      `DELETE FROM producto_en_carrito 
       WHERE carrito_id = ? AND producto_id = ?`,
      [carrito.carrito_id, productoId]
    );

    return deleteResult.affectedRows > 0;

  } catch (error) {
    console.error('Error en servicio removeProductFromCart:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Elimina todo el contenido del carrito de un usuario
 * @param {number} usuarioId
 * @returns {Promise<boolean>} True si se borraron productos, false si no había carrito
 */
export async function clearCartByUserId(usuarioId) {
  const connection = await pool.getConnection();

  try {
    const [[carrito]] = await connection.query(
      'SELECT carrito_id FROM carrito WHERE usuario_id = ?',
      [usuarioId]
    );

    if (!carrito) return false;

    const [deleteResult] = await connection.query(
      'DELETE FROM producto_en_carrito WHERE carrito_id = ?',
      [carrito.carrito_id]
    );

    return deleteResult.affectedRows > 0;

  } catch (error) {
    console.error('Error en servicio clearCartByUserId:', error);
    throw error;
  } finally {
    connection.release();
  }
}
