import { pool } from '../database/connectionMySQL.js';

/**
 * Este servicio crea un nuevo registro de venta con sus detalles y descuenta el stock
 * Todo se ejecuta dentro de una transacción para asegurar la integridad de los datos
 */

export const crearNuevaVenta = async (usuarioId, productos, metodoPago, direccionEnvio) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); // inicia la trasacción

    // Validar stock de cada producto y calcular el total de la venta
    let totalVenta = 0;
    for (const producto of productos) {
      // Se usa 'FOR UPDATE' para bloquear la fila y evitar que otro proceso modifique el stock mientras estamos validando y actualizando.
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

    // Crear el registro principal en la tabla 'venta'
    const ventaSql = 'INSERT INTO venta (usuario_id, fecha_venta, total, estado, metodo_pago, direccion_envio) VALUES (?, NOW(), ?, ?, ?, ?)';
    const [ventaResult] = await connection.execute(ventaSql, [usuarioId, totalVenta, 'Completado', metodoPago, direccionEnvio]);
    const nuevaVentaId = ventaResult.insertId;

    // Guardar cada producto en 'detalle_venta' y actualizar el stock
    for (const producto of productos) {
      const [rows] = await connection.execute('SELECT precio FROM producto WHERE producto_id = ?', [producto.producto_id]);
      const precioUnitario = rows[0].precio;

      // Insertar el detalle de la venta
      const detalleSql = 'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)';
      await connection.execute(detalleSql, [nuevaVentaId, producto.producto_id, producto.cantidad, precioUnitario, producto.cantidad * precioUnitario]);

      // Actualizar el stock del producto correspondiente
      const updateStockSql = 'UPDATE producto SET stock_actual = stock_actual - ? WHERE producto_id = ?';
      await connection.execute(updateStockSql, [producto.cantidad, producto.producto_id]);
    }
    
    // Si todo salió bien confirmamos todos los cambios en la base de datos
    await connection.commit();
    
    return { venta_id: nuevaVentaId, total: totalVenta, estado: 'Completado' };

  } catch (error) {
    // Si algo falló en cualquier punto, revertimos todos los cambios realizados en la transacción
    await connection.rollback();
    console.error("Transacción de venta revertida por error:", error);
    throw error; // Lanzamos el error para que el controlador lo atrape
  } finally {
    // Liberamos la conexión para que pueda ser usada por otros procesos
    connection.release();
  }
};

//Obtenemos las ventas de un usuario específico ================================
export const obtenerVentasPorUsuario = async (usuarioId) => {
  const sql = 'SELECT venta_id, fecha_venta, total, estado FROM venta WHERE usuario_id = ? ORDER BY fecha_venta DESC';
  const [rows] = await pool.execute(sql, [usuarioId]);
  return rows;
};

//Obtenemos todas las ventas para que un administrador pueda verlas ================================
export const obtenerTodasLasVentas = async () => {
  const sql = `
    SELECT v.venta_id, v.fecha_venta, v.total, v.estado, u.email 
    FROM venta v
    JOIN usuario u ON v.usuario_id = u.usuario_id
    ORDER BY v.fecha_venta DESC`;
  const [rows] = await pool.execute(sql);
  return rows;
};

//Obtenemos el detalle completo de una venta por su id, incluyendo los productos vendidos  ================================
export const obtenerDetallePorVentaId = async (ventaId) => {
  const ventaSql = 'SELECT * FROM venta WHERE venta_id = ?';
  const [ventaRows] = await pool.execute(ventaSql, [ventaId]);

  if (ventaRows.length === 0) {
    return null; 
  }

  const detalleSql = `
    SELECT dv.cantidad, dv.precio_unitario, dv.subtotal, p.nombre_producto, p.producto_id
    FROM detalle_venta dv
    JOIN producto p ON dv.producto_id = p.producto_id
    WHERE dv.venta_id = ?`;
  const [detalleRows] = await pool.execute(detalleSql, [ventaId]);

  return {
    ...ventaRows[0],
    productos: detalleRows
  };
};

/**
 * Obtiene el detalle de una venta específica solo si le pertenece al usuario solicitante
 * @param {number} ventaId 
 * @param {number} usuarioId 
 * @returns {Promise<object|null>} El objeto de la venta o null si no se encuentra o no le pertenece
 */
export async function getSaleDetailForUser(ventaId, usuarioId) {
  // Primero verificamos que la venta exista y le pertenezca al usuario
  const ventaSql = 'SELECT * FROM venta WHERE venta_id = ? AND usuario_id = ?';
  const [ventaRows] = await pool.execute(ventaSql, [ventaId, usuarioId]);

  if (ventaRows.length === 0) {
    return null; // La venta no existe o no le pertenece al usuario
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
