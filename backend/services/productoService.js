import { pool } from '../database/connectionMySQL.js';

// Función auxiliar para convertir ruta absoluta a relativa
function convertToRelativePath(fullPath) {
  if (!fullPath) return null;
  
  // Si ya es una ruta relativa, la devolvemos tal como está
  if (fullPath.startsWith('/images/')) return fullPath;
  
  // Convertir ruta absoluta a relativa
  const publicIndex = fullPath.indexOf('public');
  if (publicIndex !== -1) {
    return '/' + fullPath.substring(publicIndex + 7).replace(/\\/g, '/');
  }
  
  // Fallback: si contiene la estructura esperada
  if (fullPath.includes('images/productos')) {
    const imagePath = fullPath.substring(fullPath.indexOf('images/productos')).replace(/\\/g, '/');
    return '/' + imagePath;
  }
  
  return fullPath.replace(/\\/g, '/');
}

/**
 * Lista de productos con filtros y paginación para el panel de admin
 * @param {object} options 
 * @returns {Promise<{productos: Array, paginacion: object}>}
 */
export async function getAllProducts(options = {}) {
    const { categoria, busqueda, minPrice, maxPrice, es_oferta, sortBy, pagina = 1, limite = 10 } = options;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    let query = `
      SELECT 
        p.*, 
        c.nombre AS nombre_categoria 
      FROM 
        producto p 
      LEFT JOIN 
        categoria c ON p.categoria_id = c.categoria_id
      WHERE 1=1 
    `;
    let countQuery = `SELECT COUNT(*) as total FROM producto WHERE 1=1`;
    
    const params = [];
    const countParams = [];

    if (categoria) {
        query += ` AND p.categoria_id = ?`;
        countQuery += ` AND categoria_id = ?`;
        params.push(categoria);
        countParams.push(categoria);
    }
    if (busqueda) {
        query += ` AND p.nombre_producto LIKE ?`;
        countQuery += ` AND nombre_producto LIKE ?`;
        params.push(`%${busqueda}%`);
        countParams.push(`%${busqueda}%`);
    }
    if (minPrice && !isNaN(minPrice)) {
        query += ` AND p.precio >= ?`;
        countQuery += ` AND precio >= ?`;
        params.push(parseFloat(minPrice));
        countParams.push(parseFloat(minPrice));
    }
    if (maxPrice && !isNaN(maxPrice)) {
        query += ` AND p.precio <= ?`;
        countQuery += ` AND precio <= ?`;
        params.push(parseFloat(maxPrice));
        countParams.push(parseFloat(maxPrice));
    }
    if (es_oferta === 'true') {
        query += ` AND p.es_oferta = true AND p.activo = true`;
        countQuery += ` AND es_oferta = true AND activo = true`;
    }

    const validSorts = {
        precio_asc: 'ORDER BY p.precio ASC',
        precio_desc: 'ORDER BY p.precio DESC',
        nombre_asc: 'ORDER BY p.nombre_producto ASC',
        nombre_desc: 'ORDER BY p.nombre_producto DESC'
    };
    query += ` ${validSorts[sortBy] || 'ORDER BY p.producto_id DESC'}`;
    
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
export async function createProduct(productData, files) { 
  const { 
      nombre_producto, 
      descripcion, 
      precio, 
      precio_anterior, 
      categoria_id, 
      stock_actual,
  } = productData;

  if (!nombre_producto || !precio || !stock_actual) {
      const err = new Error('Nombre, precio y stock son requeridos');
      err.statusCode = 400;
      throw err;
  }

  // CORREGIDO: Convertir a rutas relativas
  const imagenPath = files && files.imagen ? convertToRelativePath(files.imagen[0].path) : null;
  const imagenesPaths = files && files.imagenes ? 
    files.imagenes.map(file => convertToRelativePath(file.path)) : [];
  const imagenesJson = JSON.stringify(imagenesPaths);

  const precioFinal = parseFloat(precio);
  const precioAnteriorFinal = precio_anterior ? parseFloat(precio_anterior) : null;
  const esOfertaFinal = (precioAnteriorFinal != null && precioFinal < precioAnteriorFinal);

  const query = `
    INSERT INTO producto (
      nombre_producto, descripcion, precio, precio_anterior, categoria_id, 
      imagen, imagenes, stock_actual, activo, es_oferta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
      nombre_producto,
      descripcion || null,
      precioFinal,
      precioAnteriorFinal,
      categoria_id || null,
      imagenPath,
      imagenesJson,
      parseInt(stock_actual),
      true,
      esOfertaFinal, 
  ];

  try {
    const [result] = await pool.query(query, params);
    const [[nuevoProducto]] = await pool.query('SELECT * FROM producto WHERE producto_id = ?', [result.insertId]);
    return nuevoProducto;
  } catch (error) {
    console.error("Error al crear el producto en la BD:", error);
    throw new Error('Error de base de datos al crear el producto');
  }
}

/**
 * Actualiza un producto por su id
 * @param {number} productoId
 * @param {object} updateData - Los campos que queremos actualizar
 * @returns {Promise<object>} - El producto actualizado
 */
export async function updateProduct(id, productData, files) {
  const { 
    nombre_producto, 
    descripcion, 
    precio, 
    precio_anterior, 
    categoria_id, 
    stock_actual 
  } = productData;

  const setClauses = [];
  const params = [];

  if (nombre_producto) { setClauses.push('nombre_producto = ?'); params.push(nombre_producto); }
  if (descripcion) { setClauses.push('descripcion = ?'); params.push(descripcion); }
  if (precio) { setClauses.push('precio = ?'); params.push(parseFloat(precio)); }
  if (precio_anterior) { setClauses.push('precio_anterior = ?'); params.push(parseFloat(precio_anterior)); }
  if (categoria_id) { setClauses.push('categoria_id = ?'); params.push(parseInt(categoria_id)); }
  if (stock_actual) { setClauses.push('stock_actual = ?'); params.push(parseInt(stock_actual)); }

  // CORREGIDO: Usar rutas relativas para las imágenes
  if (files && files.imagen && files.imagen[0]) {
    const imagenPath = convertToRelativePath(files.imagen[0].path);
    setClauses.push('imagen = ?');
    params.push(imagenPath);
  }

  if (files && files.imagenes && files.imagenes.length > 0) {
    const imagenesPaths = files.imagenes.map(file => convertToRelativePath(file.path));
    setClauses.push('imagenes = ?');
    params.push(JSON.stringify(imagenesPaths));
  }
  
  if (precio || precio_anterior) {
    const precioFinal = precio ? parseFloat(precio) : (await obtenerProductoPorId(id)).precio;
    const precioAnteriorFinal = precio_anterior ? parseFloat(precio_anterior) : (await obtenerProductoPorId(id)).precio_anterior;
    const esOfertaFinal = (precioAnteriorFinal != null && precioFinal < precioAnteriorFinal);
    setClauses.push('es_oferta = ?');
    params.push(esOfertaFinal);
  }

  if (setClauses.length === 0) {
    throw new Error('No se proporcionaron campos para actualizar');
  }

  const query = `UPDATE producto SET ${setClauses.join(', ')} WHERE producto_id = ?`;
  params.push(id);

  const [result] = await pool.query(query, params);
  if (result.affectedRows === 0) return null;

  const [[productoActualizado]] = await pool.query(
    'SELECT p.*, c.nombre AS nombre_categoria FROM producto p LEFT JOIN categoria c ON p.categoria_id = c.categoria_id WHERE p.producto_id = ?', 
    [id]
  );
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
 * Obtiene un único producto por su id si está activo
 * @param {number} productoId 
 * @returns {Promise<object|null>} El objeto del producto o null si no se encuentra o está inactivo
 */
export async function obtenerProductoPorId(productoId) {
    const query = 'SELECT * FROM producto WHERE producto_id = ? AND activo = true';
    const [productos] = await pool.query(query, [productoId]);

    if (productos.length === 0) {
        return null;
    }

    return productos[0];
}

//activar o desactivar productos 
export async function toggleProductStatus(productoId) {
  const query = 'UPDATE producto SET activo = NOT activo WHERE producto_id = ?';
  const [result] = await pool.query(query, [productoId]);
  
  return result.affectedRows > 0;
}