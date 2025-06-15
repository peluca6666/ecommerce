import { pool } from '../database/connectionMySQL.js';

// Constantes para la paginacion y reglas de datos
const DEFAULT_PAGINATION = {
    LIMIT: 20,
    OFFSET: 0,
    ORDER: 'nombre_producto'
};
const ALLOWED_ORDERS = ['nombre_producto', 'precio', 'stock_actual', 'fecha_creacion'];

/**
 * Obtiene todas las categorías con un filtro opcional para mostrar solo las activas
 * @param {boolean} soloActivos - Si es true, filtra por categorías activas
 * @returns {Promise<Array>} Un array de objetos de categoría.
 */
export async function getAllCategories(soloActivos = false) {
    let query = 'SELECT categoria_id, nombre, imagen, activo FROM categoria';
    if (soloActivos) {
        query += ' WHERE activo = true';
    }
    query += ' ORDER BY nombre ASC';

    const [categorias] = await pool.query(query);
    return categorias;
}

/**
 * Obtiene una categoría específica por su id
 * @param {number} categoriaId 
 * @returns {Promise<object|null>} El objeto de la categoría o null si no se encuentra
 */
export async function getCategoryById(categoriaId) {
    const [categorias] = await pool.query(
        'SELECT categoria_id, nombre, activo FROM categoria WHERE categoria_id = ?',
        [categoriaId]
    );
    return categorias.length > 0 ? categorias[0] : null;
}

/**
 * Crea una nueva categoria
 * @param {string} nombre - El nombre de la nueva categoria
 * @param {boolean} activo - El estado inicial de la categoria
 * @returns {Promise<object>} Un objeto con el id de la nueva categoria
 */
export async function createCategory(nombre, activo) {
    try {
        const [resultado] = await pool.query(
            'INSERT INTO categoria (nombre, activo) VALUES (?, ?)',
            [nombre.trim(), activo]
        );
        return { categoria_id: resultado.insertId };
    } catch (error) {
        // Si el error es por una entrada duplicada lo lanzamos para que el controlador lo maneje
        if (error.code === 'ER_DUP_ENTRY') {
            const err = new Error('Ya existe una categoría con ese nombre');
            err.statusCode = 409; 
            throw err;
        }
        throw error; 
    }
}

/**
 * Actualiza una categoria existente
 * @param {number} categoriaId - El id de la categoría que queremos actualizar
 * @param {string} nombre - El nombre nuevo para la categoría
 * @param {boolean} activo - Acá ponemos si la categoría está activa o no
 * @returns {Promise<boolean>} True si la actualización fue exitosa
 */
export async function updateCategory(categoriaId, nombre, activo) {
    // Primero verificamos que la categoría exista
    const categoriaExistente = await getCategoryById(categoriaId);
    if (!categoriaExistente) {
        const err = new Error('Categoría no encontrada');
        err.statusCode = 404;
        throw err;
    }
    
    try {
        await pool.query(
            'UPDATE categoria SET nombre = ?, activo = ? WHERE categoria_id = ?',
            [nombre.trim(), activo, categoriaId]
        );
        return true;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const err = new Error('Ya existe una categoría con ese nombre');
            err.statusCode = 409;
            throw err;
        }
        throw error;
    }
}

/**
 * Elimina una categoria por su id
 * @param {number} categoriaId 
 * @returns {Promise<boolean>} True si se eliminó, false si no se encontró
 */
export async function deleteCategory(categoriaId) {
    const [resultado] = await pool.query(
        'UPDATE categoria SET activo = false WHERE categoria_id = ?',
        [categoriaId]
    );
    // Si no se afectó ninguna fila significa que no se encontró la categoria
    return resultado.affectedRows > 0;
}

/**
 * Obtenemos todas las categorias con todos los productos que tienen
 * @returns {Promise<Array>} 
 */
export async function getCategoriesWithProductCount() {
    const [categorias] = await pool.query(`
      SELECT 
        c.categoria_id, c.nombre, c.activo,
        COUNT(p.producto_id) as total_productos,
        COUNT(CASE WHEN p.es_oferta = true THEN 1 END) as productos_en_oferta
      FROM categoria c
      LEFT JOIN producto p ON c.categoria_id = p.categoria_id
      WHERE c.activo = true
      GROUP BY c.categoria_id, c.nombre, c.activo
      ORDER BY c.nombre ASC
    `);
    return categorias;
}


/**
 * Obtiene los productos de una categoría con filtros, paginación y ordenamiento
 * @param {number} categoriaId 
 * @param {object} options  Opciones de filtrado y paginación
 * @returns {Promise<object>} Objeto con los productos y la información de paginación
 */
export async function getProductsByCategoryId(categoriaId, options = {}) {
    const {
        limit = DEFAULT_PAGINATION.LIMIT,
        offset = DEFAULT_PAGINATION.OFFSET,
        es_oferta,
        precio_min,
        precio_max,
        orden = DEFAULT_PAGINATION.ORDER
    } = options;

    const ordenSeguro = ALLOWED_ORDERS.includes(orden) ? orden : DEFAULT_PAGINATION.ORDER;

    // Se verifica el estado y la existencia de la categoría
    const categoria = await getCategoryById(categoriaId);
    if (!categoria) {
        const err = new Error('Categoría no encontrada');
        err.statusCode = 404;
        throw err;
    }
    if (!categoria.activo) {
        const err = new Error('Categoría no disponible');
        err.statusCode = 400;
        throw err;
    }

    // Consulta de productos por categoría
    let query = `SELECT p.* FROM producto p WHERE p.categoria_id = ?`;
    const params = [categoriaId];
    // Consulta para contar el total de productos
    let countQuery = `SELECT COUNT(*) as total FROM producto WHERE categoria_id = ?`;
    const countParams = [categoriaId];

    // Aplicar filtros a ambas consultas
    if (es_oferta === 'true') {
        query += ' AND p.es_oferta = true';
        countQuery += ' AND es_oferta = true';
    }
    if (precio_min) {
        query += ' AND p.precio >= ?';
        params.push(parseFloat(precio_min));
        countQuery += ' AND precio >= ?';
        countParams.push(parseFloat(precio_min));
    }
    if (precio_max) {
        query += ' AND p.precio <= ?';
        params.push(parseFloat(precio_max));
        countQuery += ' AND precio <= ?';
        countParams.push(parseFloat(precio_max));
    }
    
    query += ` ORDER BY p.${ordenSeguro} ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    // Ejecutar ambas consultas
    const [productos] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(countQuery, countParams);

    return {
        nombre_categoria: categoria.nombre,
        productos,
        paginacion: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        }
    };
}