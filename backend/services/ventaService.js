import { pool } from '../database/connectionMySQL.js';

/**
 * Guarda una venta con sus detalles y descuenta el stock
 * @param {number} usuarioId - ID del usuario que compra
 * @param {Array<object>} productos - Productos en el carrito con cantidades
 * @param {string} metodoPago
 * @param {string} direccionEnvio
 * @returns {Promise<object>} - Datos básicos de la venta creada
 */
export const crearNuevaVenta = async (usuarioId, productos, metodoPago, direccionEnvio) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let totalVenta = 0;
    for (const producto of productos) {
      // Bloqueo para evitar conflictos de stock concurrente
      const [rows] = await connection.execute(
        'SELECT stock_actual, precio FROM producto WHERE producto_id = ? FOR UPDATE',
        [producto.producto_id]
      );

      if (rows.length === 0) {
        throw { statusCode: 404, message: `Producto con ID ${producto.producto_id} no encontrado.` };
      }

      const stockActual = rows[0].stock_actual;
      if (stockActual < producto.cantidad) {
        throw { statusCode: 400, message: `Stock insuficiente para producto ${producto.producto_id}. Disponible: ${stockActual}` };
      }

      totalVenta += rows[0].precio * producto.cantidad;
    }

    const ventaSql = 'INSERT INTO venta (usuario_id, fecha_venta, total, estado, metodo_pago, direccion_envio) VALUES (?, NOW(), ?, ?, ?, ?)';
    const [ventaResult] = await connection.execute(ventaSql, [usuarioId, totalVenta, 'Procesando', metodoPago, direccionEnvio]);
    const nuevaVentaId = ventaResult.insertId;

    for (const producto of productos) {
      const [rows] = await connection.execute('SELECT precio FROM producto WHERE producto_id = ?', [producto.producto_id]);
      const precioUnitario = rows[0].precio;

      const detalleSql = 'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)';
      await connection.execute(detalleSql, [nuevaVentaId, producto.producto_id, producto.cantidad, precioUnitario, producto.cantidad * precioUnitario]);

      // Descuenta stock
      const updateStockSql = 'UPDATE producto SET stock_actual = stock_actual - ? WHERE producto_id = ?';
      await connection.execute(updateStockSql, [producto.cantidad, producto.producto_id]);
    }

    await connection.commit();

    return { venta_id: nuevaVentaId, total: totalVenta, estado: 'Completado' };

  } catch (error) {
    await connection.rollback();
    console.error("Error en la transacción de venta:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Trae todas las ventas de un usuario para mostrar en su perfil
 * @param {number} usuarioId
 * @returns {Promise<Array>} - Ventas ordenadas por fecha
 */
export async function obtenerHistorialDeVentas(usuarioId) {
  const sql = 'SELECT venta_id, fecha_venta, total, estado FROM venta WHERE usuario_id = ? ORDER BY fecha_venta DESC';
  const [rows] = await pool.execute(sql, [usuarioId]);
  return rows;
}

/**
 * Trae todas las ventas para el panel admin
 * @returns {Promise<Array>} - Ventas con email del comprador
 */
export async function obtenerTodasLasVentas() {
  const sql = `
    SELECT v.venta_id, v.fecha_venta, v.total, v.estado, u.email 
    FROM venta v
    JOIN usuario u ON v.usuario_id = u.usuario_id
    ORDER BY v.fecha_venta DESC`;
  const [rows] = await pool.execute(sql);
  return rows;
}

/**
 * Detalle de venta para el panel admin (sin filtro de usuario)
 * @param {number} ventaId 
 * @returns {Promise<object|null>} - Detalle o null si no existe
 */
export async function obtenerDetalleDeVentaParaAdmin(ventaId) {
  return _obtenerDetalleVenta(ventaId);
}

/**
 * Detalle de venta para un cliente, verifica que sea dueño
 * @param {number} ventaId 
 * @param {number} usuarioId - ID del cliente
 * @returns {Promise<object|null>} - Detalle o null si no es dueño o no existe
 */
export async function obtenerDetalleDeVentaParaCliente(ventaId, usuarioId) {
  return _obtenerDetalleVenta(ventaId, usuarioId);
}

/**
 * Cancela una venta y devuelve el stock
 * @param {number} ventaId
 * @returns {Promise<boolean>} - True si se canceló
 */
export async function cancelarVenta(ventaId) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [detalles] = await connection.execute(
      'SELECT producto_id, cantidad FROM detalle_venta WHERE venta_id = ?',
      [ventaId]
    );

    if (detalles.length === 0) {
      throw new Error('No se encontraron productos en la venta.');
    }

    for (const item of detalles) {
      await connection.execute(
        'UPDATE producto SET stock_actual = stock_actual + ? WHERE producto_id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    const [updateResult] = await connection.execute(
      "UPDATE venta SET estado = 'Cancelado' WHERE venta_id = ?",
      [ventaId]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('No se encontró la venta para cancelar.');
    }

    await connection.commit();
    return true;

  } catch (error) {
    await connection.rollback();
    console.error("Error al cancelar la venta:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Función privada que obtiene el detalle de una venta, opcionalmente valida dueño
 * @param {number} ventaId 
 * @param {number|null} [usuarioId=null] - Si se pasa, verifica que sea dueño
 * @private
 * @returns {Promise<object|null>}
 */
async function _obtenerDetalleVenta(ventaId, usuarioId = null) {
  let ventaSql = `
    SELECT 
      venta.*, 
      usuario.nombre, usuario.apellido, usuario.dni, usuario.telefono, usuario.email 
    FROM 
      venta 
    JOIN 
      usuario ON venta.usuario_id = usuario.usuario_id 
    WHERE 
      venta.venta_id = ?`;
  const params = [ventaId];

  if (usuarioId) {
    ventaSql += ' AND venta.usuario_id = ?';
    params.push(usuarioId);
  }

  const [ventaRows] = await pool.execute(ventaSql, params);
  if (ventaRows.length === 0) return null;

  const detalleSql = `
    SELECT dv.cantidad, dv.precio_unitario, dv.subtotal, p.nombre_producto, p.producto_id, p.imagen
    FROM detalle_venta dv
    JOIN producto p ON dv.producto_id = p.producto_id
    WHERE dv.venta_id = ?`;
  const [detalleRows] = await pool.execute(detalleSql, [ventaId]);

  return {
    ...ventaRows[0],
    productos: detalleRows
  };
}

/**
 * Cambia el estado de una venta
 * @param {number} ventaId
 * @param {string} nuevoEstado
 * @returns {Promise<boolean>} - True si actualizó
 */
export async function actualizarEstadoVenta(ventaId, nuevoEstado) {
  const query = 'UPDATE venta SET estado = ? WHERE venta_id = ?';
  const [result] = await pool.query(query, [nuevoEstado, ventaId]);
  return result.affectedRows > 0;
}

/**
 * Ventas de un usuario (para admin)
 * @param {number} usuarioId
 * @returns {Promise<Array>}
 */
export async function obtenerVentasDeUsuarioPorAdmin(usuarioId) {
  const sql = 'SELECT venta_id, fecha_venta, total, estado FROM venta WHERE usuario_id = ? ORDER BY fecha_venta DESC';
  const [rows] = await pool.execute(sql, [usuarioId]);
  return rows;
}
