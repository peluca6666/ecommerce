import { pool } from '../database/connectionMySQL.js';

/**
 * Crea un nuevo registro de venta con sus detalles y descuenta el stock
 * @param {number} usuarioId - ID del usuario que realiza la compra
 * @param {Array<object>} productos - Arreglo de productos en el carrito
 * @param {string} metodoPago 
 * @param {string} direccionEnvio 
 * @returns {Promise<object>} Objeto con los datos de la venta creada
 */
export const crearNuevaVenta = async (usuarioId, productos, metodoPago, direccionEnvio) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let totalVenta = 0;
    for (const producto of productos) {
      const [rows] = await connection.execute('SELECT stock_actual, precio FROM producto WHERE producto_id = ? FOR UPDATE', [producto.producto_id]);
      
      if (rows.length === 0) {
        throw { statusCode: 404, message: `Producto con ID ${producto.producto_id} no encontrado.` };
      }
      
      const stockActual = rows[0].stock_actual;
      if (stockActual < producto.cantidad) {
        throw { statusCode: 400, message: `Stock insuficiente para el producto con ID ${producto.producto_id}. Stock disponible: ${stockActual}` };
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

      const updateStockSql = 'UPDATE producto SET stock_actual = stock_actual - ? WHERE producto_id = ?';
      await connection.execute(updateStockSql, [producto.cantidad, producto.producto_id]);
    }
    
    await connection.commit();
    
    return { venta_id: nuevaVentaId, total: totalVenta, estado: 'Completado' };

  } catch (error) {
    await connection.rollback();
    console.error("Transacción de venta revertida por error:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Obtiene el historial de todas las ventas de un usuario específico. Para la sección Mi Perfil
 * @param {number} usuarioId
 * @returns {Promise<Array>} arreglo con las ventas del usuario
 */
export async function obtenerHistorialDeVentas(usuarioId) {
  const sql = 'SELECT venta_id, fecha_venta, total, estado FROM venta WHERE usuario_id = ? ORDER BY fecha_venta DESC';
  const [rows] = await pool.execute(sql, [usuarioId]);
  return rows;
};

/**
 * Obtiene todas las ventas registradas, para el panel de administrador
 * @returns {Promise<Array>} Un arreglo con todas las ventas
 */
export async function obtenerTodasLasVentas() {
  const sql = `
    SELECT v.venta_id, v.fecha_venta, v.total, v.estado, u.email 
    FROM venta v
    JOIN usuario u ON v.usuario_id = u.usuario_id
    ORDER BY v.fecha_venta DESC`;
  const [rows] = await pool.execute(sql);
  return rows;
};

/**
 * Obtiene el detalle de una venta para el panel de Administrador. Acá no verifica el dueño, tengo pensado usarlo para mostrar un resumen de ingresos según las ventas
 * @param {number} ventaId 
 * @returns {Promise<object|null>} El detalle de la venta o null si no se encuentra
 */
export async function obtenerDetalleDeVentaParaAdmin(ventaId) {
  return _obtenerDetalleVenta(ventaId); // Llama a la función interna sin usuarioId
}

/**
 * Obtiene el detalle de una venta para un cliente específico verificando que sea el dueño
 * @param {number} ventaId 
 * @param {number} usuarioId - El ID del cliente que debe ser el dueño
 * @returns {Promise<object|null>} El detalle de la venta
 */
export async function obtenerDetalleDeVentaParaCliente(ventaId, usuarioId) {
  return _obtenerDetalleVenta(ventaId, usuarioId); // Llama a la función interna con usuarioId
}


/**Esto nos sirve para manejar los estados de las ventas desde el panel de administrador, por ejemplo para cancelar una venta 
 * Cancela una venta y devuelve el stock de los productos al inventario
 * @param {number} ventaId - El ID de la venta a cancelar
 * @returns {Promise<boolean>} True si la cancelación fue exitosa
 */
export async function cancelarVenta(ventaId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        //Se obtienen todos los productos y cantidades de esa venta
        const [detalles] = await connection.execute(
            'SELECT producto_id, cantidad FROM detalle_venta WHERE venta_id = ?',
            [ventaId]
        );

        if (detalles.length === 0) {
            throw new Error('No se encontraron detalles para esta venta.');
        }

        // Por cada producto devolvemos su cantidad al stock principal
        for (const item of detalles) {
            await connection.execute(
                'UPDATE producto SET stock_actual = stock_actual + ? WHERE producto_id = ?',
                [item.cantidad, item.producto_id]
            );
        }

        // Actualizamos el estado de la venta a 'cancelado'
        const [updateResult] = await connection.execute(
            "UPDATE venta SET estado = 'Cancelado' WHERE venta_id = ?",
            [ventaId]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error('No se encontró la venta para actualizar su estado.');
        }

        // Si todo salió bien confirmamos los cambios
        await connection.commit();
        return true;

    } catch (error) {
        // Si cualquier paso falla revertimos todo para no dejar datos inconsistentes
        await connection.rollback();
        console.error("Error al cancelar la venta:", error);
        throw error; // Relanzamos para que el controlador lo maneje
    } finally {
        if (connection) connection.release();
    }
}

/**
 * Función interna y genérica para obtener el detalle de una venta
 * Es reutilizada por las funciones de admin y cliente
 * @param {number} ventaId 
 * @param {number|null} [usuarioId=null] - El ID del usuario que debe ser el dueño de la venta, si es null no se verifica
 * @private
 */
async function _obtenerDetalleVenta(ventaId, usuarioId = null) {
     let ventaSql = `
      SELECT 
        v.*, 
        u.nombre, u.apellido, u.dni, u.telefono, u.email 
      FROM 
        venta v 
      JOIN 
        usuario u ON v.usuario_id = u.usuario_id 
      WHERE 
        v.venta_id = ?
    `;
    const params = [ventaId];

    if (usuarioId) {
        ventaSql += ' AND usuario_id = ?';
        params.push(usuarioId);
    }

    const [ventaRows] = await pool.execute(ventaSql, params);

    if (ventaRows.length === 0) {
        return null;
    }

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

export async function updateSaleStatus(ventaId, nuevoEstado) {
  const query = 'UPDATE venta SET estado = ? WHERE venta_id = ?';
  const [result] = await pool.query(query, [nuevoEstado, ventaId]);
  
  return result.affectedRows > 0;
}