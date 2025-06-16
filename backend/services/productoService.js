import { pool } from '../database/connectionMySQL.js';

/**
 * Lista de productos con filtros y paginación
 * @param {object} options 
 * @returns {Promise<{productos: Array, paginacion: object}>}
 */
export async function getAllProducts(options = {}) {
    const { categoria, busqueda, minPrice, maxPrice, es_oferta, sortBy, pagina = 1, limite = 10 } = options;
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
    if (es_oferta === 'true') {
        query += ` AND es_oferta = true`;
        countQuery += ` AND es_oferta = true`;
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
        paginacion: { 
            total, 
            limite: parseInt(limite), 
            pagina: parseInt(pagina),
            total_paginas: Math.ceil(total / parseInt(limite))
        }
    };
}

/**
 * Crea un nuevo producto en la BD
 * @param {object} productData - Datos del producto a crear
 * @returns {Promise<object>} - El producto recien creado
 */
export async function createProduct(productData) {
    const { nombre_producto, descripcion, precio, categoria_id, imagen, imagenes, stock_actual, precio_anterior } = productData;

    if (!nombre_producto || !precio || !stock_actual) {
        const err = new Error('Nombre, precio y stock son requeridos');
        err.statusCode = 400;
        throw err;
    }

    // Logica para validar y convertir los precios
    const precioFinal = parseFloat(precio);
    const precioAnteriorFinal = precio_anterior ? parseFloat(precio_anterior) : null;

    const esOfertaFinal = (precioAnteriorFinal != null && precioFinal < precioAnteriorFinal);

    const query = `INSERT INTO producto 
      (nombre_producto, descripcion, precio, precio_anterior, categoria_id, imagen, imagenes, stock_actual, activo, es_oferta) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, true, ?)`;
    
    const params = [
        nombre_producto,
        descripcion || null,
        precioFinal,
        precioAnteriorFinal, // Guardamos el precio anterior
        categoria_id || null,
        JSON.stringify(Array.isArray(imagenes) ? imagenes : []),
        parseInt(stock_actual),
        esOfertaFinal // Guardamos el valor calculado de es_oferta
    ];

    const [result] = await pool.query(query, params);
    
    // Devolvemos el producto completo como fue guardado
    const [[nuevoProducto]] = await pool.query('SELECT * FROM producto WHERE producto_id = ?', [result.insertId]);
    return nuevoProducto;
}

/**
 * Actualiza un producto por su id
 * @param {number} productoId - El id del producto que queremos actualizar
 * @param {object} updateData - Los campos que queremos actualizar
 * @returns {Promise<object>} - El producto actualizado
 */
export async function updateProduct(productoId, updateData) {
    const [productoExistenteResult] = await pool.query('SELECT * FROM producto WHERE producto_id = ?', [productoId]);
    if (productoExistenteResult.length === 0) {
        const err = new Error('Producto no encontrado');
        err.statusCode = 404;
        throw err;
    }
    const productoExistente = productoExistenteResult[0];

    // Verificamos si los datos entrantes modifican alguno de los precios
    if (updateData.precio !== undefined || updateData.precio_anterior !== undefined) {
        // Tomamos el nuevo precio o mantenemos el existente si no se modifica
        const precioFinal = updateData.precio !== undefined ? parseFloat(updateData.precio) : productoExistente.precio;
        // Hacemos lo mismo para el precio anterior
        const precioAnteriorFinal = updateData.precio_anterior !== undefined ? parseFloat(updateData.precio_anterior) : productoExistente.precio_anterior;

        // es oferta si hay precio anterior y es mayor al precio actual
        const debeSerOferta = (precioAnteriorFinal != null && precioFinal < precioAnteriorFinal);
        
        // Forzamos el valor correcto de 'es_oferta' en los datos a actualizar
        updateData.es_oferta = debeSerOferta;
    }

    const camposActualizar = [];
    const valores = [];

//Logica para construir la consulta de actualización
    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            camposActualizar.push(`${key} = ?`);
            // Manejo especial para el campo de imágenes que es un JSON
            if (key === 'imagenes' && Array.isArray(updateData[key])) {
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

/**
 * Obtiene una lista de productos que están marcados como oferta
 * @param {number} limite - La cantidad máxima de productos a devolver
 * @returns {Promise<Array>} - Lista de productos en oferta
 */
export async function getOfferProducts(limite = 8) {
    const query = `
        SELECT * FROM producto 
        WHERE activo = true AND es_oferta = true 
        ORDER BY producto_id DESC 
        LIMIT ?
    `;
    const [productos] = await pool.query(query, [limite]);
    return productos;
}

/**
 * Obtiene un único producto por su ID, si está activo.
 * @param {number} productoId - El ID del producto.
 * @returns {Promise<object|null>} El objeto del producto o null si no se encuentra o está inactivo.
 */
export async function obtenerProductoPorId(productoId) {
    const query = 'SELECT * FROM producto WHERE producto_id = ? AND activo = true';
    const [productos] = await pool.query(query, [productoId]);
    
    if (productos.length === 0) {
        return null;
    }
    
    return productos[0];
}