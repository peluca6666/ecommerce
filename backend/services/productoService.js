import { pool } from '../database/connectionMySQL.js';

/**
 * Lista de productos con filtros y paginación
 * @param {object} options 
 * @returns {Promise<{productos: Array, paginacion: object}>}
 */
export async function getAllProducts(options = {}) {
    const { categoria, busqueda, minPrice, maxPrice, sortBy, pagina = 1, limite = 10 } = options;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    let query = `SELECT * FROM producto WHERE activo = true`;
    let countQuery = `SELECT COUNT(*) as total FROM producto WHERE activo = true`;
    const params = [];
    const countParams = [];

    if (categoria) {
        query += ` AND categoria_id = ?`;
        countQuery += ` AND categoria_id = ?`;
        params.push(categoria);
        countParams.push(categoria);
    }
    if (busqueda) {
        query += ` AND nombre_producto LIKE ?`;
        countQuery += ` AND nombre_producto LIKE ?`;
        params.push(`%${busqueda}%`);
        countParams.push(`%${busqueda}%`);
    }
    if (minPrice && !isNaN(minPrice)) {
        query += ` AND precio >= ?`;
        countQuery += ` AND precio >= ?`;
        params.push(parseFloat(minPrice));
        countParams.push(parseFloat(minPrice));
    }
    if (maxPrice && !isNaN(maxPrice)) {
        query += ` AND precio <= ?`;
        countQuery += ` AND precio <= ?`;
        params.push(parseFloat(maxPrice));
        countParams.push(parseFloat(maxPrice));
    }

    const validSorts = {
        precio_asc: 'ORDER BY precio ASC',
        precio_desc: 'ORDER BY precio DESC',
        nombre_asc: 'ORDER BY nombre_producto ASC',
        nombre_desc: 'ORDER BY nombre_producto DESC'
    };
    query += ` ${validSorts[sortBy] || 'ORDER BY nombre_producto ASC'}`;
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limite), offset);

    const [productos] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(countQuery, countParams);

    return {
        productos,
        paginacion: { total, limite: parseInt(limite), pagina: parseInt(pagina) }
    };
}

/**
 * Crea un nuevo producto en la BD
 * @param {object} productData - Datos del producto a crear
 * @returns {Promise<object>} - El producto recien creado
 */
export async function createProduct(productData) {
    const { nombre_producto, descripcion, precio, categoria_id, imagen, imagenes, stock_actual, es_oferta = false } = productData;

    if (!nombre_producto || !precio || !stock_actual) {
        const err = new Error('Nombre, precio y stock son requeridos');
        err.statusCode = 400;
        throw err;
    }
    
    const query = `INSERT INTO producto 
      (nombre_producto, descripcion, precio, categoria_id, imagen, imagenes, stock_actual, activo, es_oferta) 
      VALUES (?, ?, ?, ?, ?, ?, ?, true, ?)`;
    
    const params = [
        nombre_producto,
        descripcion || null,
        parseFloat(precio),
        categoria_id || null,
        imagen || null,
        JSON.stringify(Array.isArray(imagenes) ? imagenes : []),
        parseInt(stock_actual),
        Boolean(es_oferta)
    ];

    const [result] = await pool.query(query, params);
    
    return { productoId: result.insertId, ...productData };
}

/**
 * Actualiza un producto por su id
 * @param {number} productoId - El id del producto que queremos actualizar
 * @param {object} updateData - Los campos que queremos actualizar
 * @returns {Promise<object>} - El producto actualizado
 */
export async function updateProduct(productoId, updateData) {
    const [productoExistente] = await pool.query('SELECT * FROM producto WHERE producto_id = ?', [productoId]);
    if (productoExistente.length === 0) {
        const err = new Error('Producto no encontrado');
        err.statusCode = 404;
        throw err;
    }

    const camposActualizar = [];
    const valores = [];

    // Validar y construir la consulta dinamicamente
    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            camposActualizar.push(`${key} = ?`);
            if (key === 'imagenes') {
                valores.push(JSON.stringify(updateData[key]));
            } else {
                valores.push(updateData[key]);
            }
        }
    });

    if (camposActualizar.length === 0) {
        const err = new Error('No se proporcionaron campos para actualizar');
        err.statusCode = 400;
        throw err;
    }

    const query = `UPDATE producto SET ${camposActualizar.join(', ')} WHERE producto_id = ?`;
    valores.push(productoId);

    await pool.query(query, valores);

    const [[productoActualizado]] = await pool.query('SELECT * FROM producto WHERE producto_id = ?', [productoId]);
    return productoActualizado;
}

/**
 * Elimina un producto por según su id
 * @param {number} productoId - El id del producto a eliminar
 * @returns {Promise<boolean>} - True si el producto fue eliminado
 */
export async function deleteProduct(productoId) {
    try {
         const [result] = await pool.query('UPDATE producto SET activo = false WHERE producto_id = ?', [productoId]);

    if (result.affectedRows === 0) {
        const err = new Error('Producto no encontrado');
        err.statusCode = 404;
        throw err;
    }
    return true; 
  } catch (error) {
   
    throw error;
  }
}
