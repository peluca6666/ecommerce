// services/categoriaService.js

import { pool } from '../database/connectionMySQL.js';

// Las constantes que definen reglas de datos y paginación pertenecen al servicio.
const DEFAULT_PAGINATION = {
    LIMIT: 20,
    OFFSET: 0,
    ORDER: 'nombre_producto'
};
const ALLOWED_ORDERS = ['nombre_producto', 'precio', 'stock_actual', 'fecha_creacion'];

/**
 * Obtiene todas las categorías, con un filtro opcional para mostrar solo las activas.
 * @param {boolean} soloActivos - Si es true, filtra por categorías activas.
 * @returns {Promise<Array>} Un arreglo de objetos de categoría.
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
 * Obtiene una categoría específica por su ID.
 * @param {number} categoriaId - El ID de la categoría.
 * @returns {Promise<object|null>} El objeto de la categoría o null si no se encuentra.
 */
export async function getCategoryById(categoriaId) {
    const [categorias] = await pool.query(
        'SELECT categoria_id, nombre, activo FROM categoria WHERE categoria_id = ?',
        [categoriaId]
    );
    return categorias.length > 0 ? categorias[0] : null;
}

/**
 * Crea una nueva categoría.
 * @param {string} nombre - El nombre de la nueva categoría.
 * @param {boolean} activo - El estado inicial de la categoría.
 * @returns {Promise<object>} Un objeto con el ID de la nueva categoría.
 */
export async function createCategory(nombre, activo) {
    try {
        const [resultado] = await pool.query(
            'INSERT INTO categoria (nombre, activo) VALUES (?, ?)',
            [nombre.trim(), activo]
        );
        return { categoria_id: resultado.insertId };
    } catch (error) {
        // Si el error es por una entrada duplicada, lo lanzamos para que el controlador lo maneje.
        if (error.code === 'ER_DUP_ENTRY') {
            const err = new Error('Ya existe una categoría con ese nombre');
            err.statusCode = 409; // 409 Conflict
            throw err;
        }
        throw error; // Relanzamos cualquier otro error.
    }
}

/**
 * Actualiza una categoría existente.
 * @param {number} categoriaId - El ID de la categoría a actualizar.
 * @param {string} nombre - El nuevo nombre para la categoría.
 * @param {boolean} activo - El nuevo estado para la categoría.
 * @returns {Promise<boolean>} True si la actualización fue exitosa.
 */
export async function updateCategory(categoriaId, nombre, activo) {
    // Primero, verificamos que la categoría exista.
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
 * Elimina una categoría por su ID.
 * @param {number} categoriaId - El ID de la categoría a eliminar.
 * @returns {Promise<boolean>} True si se eliminó, false si no se encontró.
 */
export async function deleteCategory(categoriaId) {
    const [resultado] = await pool.query(
        'UPDATE categoria SET activo = false WHERE categoria_id = ?',
        [categoriaId]
    );
    
    // La lógica para saber si se encontró y se modificó sigue siendo la misma.
    return resultado.affectedRows > 0;
}

/**
 * Obtiene todas las categorías junto con la cantidad de productos en cada una.
 * @returns {Promise<Array>} Arreglo de categorías con sus conteos.
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
 * Obtiene los productos de una categoría con filtros, paginación y ordenamiento.
 * @param {number} categoriaId - El ID de la categoría.
 * @param {object} options - Opciones de filtrado y paginación.
 * @returns {Promise<object>} Objeto con los productos y la información de paginación.
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

    // Verificar existencia y estado de la categoría
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

    // Construir la consulta de productos
    let query = `SELECT p.* FROM producto p WHERE p.categoria_id = ?`;
    const params = [categoriaId];
    // Construir la consulta de conteo
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