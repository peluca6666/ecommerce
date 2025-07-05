import { pool } from '../database/connectionMySQL.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Para saber dónde estamos en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convierte una ruta de imagen para que el front la pueda usar
 * @param {string} fullPath Ruta completa del archivo
 * @returns {string|null} Ruta relativa o null si no hay ruta
 */
function convertToRelativePath(fullPath) {
    if (!fullPath) return null;
    if (fullPath.startsWith('/images/')) return fullPath;

    const publicIndex = fullPath.indexOf('public');

    if (publicIndex !== -1) {
        return '/' + fullPath.substring(publicIndex + 7).replace(/\\/g, '/');
    }

    if (fullPath.includes('images/productos')) {
        const imagePath = fullPath
            .substring(fullPath.indexOf('images/productos'))
            .replace(/\\/g, '/');
        return '/' + imagePath;
    }

    return fullPath.replace(/\\/g, '/');
}

/**
 * Trae todos los productos con filtros y paginación para admin
 * @param {Object} options Opciones de filtro y paginación
 * @returns {Object} Productos y datos de paginación
 */
export async function obtenerProductos(options = {}) {
    const { categoria, busqueda, minPrice, maxPrice, es_oferta, sortBy, pagina = 1, limite = 10, incluirInactivos = false } = options;

      const incluirInactivosBool = incluirInactivos === 'true' || incluirInactivos === true;

     const offset = (parseInt(pagina) - 1) * parseInt(limite);

    let query = `
        SELECT p.*, c.nombre AS nombre_categoria
        FROM producto p
        LEFT JOIN categoria c ON p.categoria_id = c.categoria_id
    `;

    let countQuery = `SELECT COUNT(*) as total FROM producto`;

    const params = [];
    const countParams = [];
    const conditions = [];

    // Solo filtrar por activo si NO queremos incluir inactivos
    if (!incluirInactivosBool) {
        conditions.push('p.activo = TRUE');
    }

    if (categoria) {
        conditions.push('p.categoria_id = ?');
        params.push(categoria);
        countParams.push(categoria);
    }

    if (busqueda) {
        conditions.push('p.nombre_producto LIKE ?');
        params.push(`%${busqueda}%`);
        countParams.push(`%${busqueda}%`);
    }

    if (minPrice && !isNaN(minPrice)) {
        conditions.push('p.precio >= ?');
        params.push(parseFloat(minPrice));
        countParams.push(parseFloat(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
        conditions.push('p.precio <= ?');
        params.push(parseFloat(maxPrice));
        countParams.push(parseFloat(maxPrice));
    }

    if (es_oferta === 'true') {
        conditions.push('p.es_oferta = true');
    }

    // Aplicar condiciones si las hay
    if (conditions.length > 0) {
        const whereClause = ' WHERE ' + conditions.join(' AND ');
        query += whereClause;
        
        // Para countQuery, adaptar las condiciones (sin el alias p.)
        const countConditions = conditions.map(condition => 
            condition.replace('p.', '')
        );
        countQuery += ' WHERE ' + countConditions.join(' AND ');
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
 * Crea un producto nuevo en la base
 * @param {Object} productData Datos del producto
 * @param {Object} files Archivos subidos (imagenes)
 * @returns {Object} Producto creado
 */
export async function agregarProducto(productData, files) {
    const {
        nombre_producto,
        descripcion,
        precio,
        precio_anterior,
        categoria_id,
        stock_actual
    } = productData;

    if (!nombre_producto || !precio || stock_actual == null || stock_actual === '') {
        const err = new Error('Nombre, precio y stock son requeridos');
        err.statusCode = 400;
        throw err;
    }

    const imagenPath = files?.imagen ? convertToRelativePath(files.imagen[0].path) : null;

    const imagenesPaths = files?.imagenes
        ? files.imagenes.map(file => convertToRelativePath(file.path))
        : [];

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
        esOfertaFinal
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
 * Actualiza un producto con nuevos datos o imágenes
 * @param {number} id ID del producto a actualizar
 * @param {Object} productData Datos para actualizar
 * @param {Object} files Archivos nuevos (opcional)
 * @returns {Object|null} Producto actualizado o null si no existe
 */
export async function actualizarProducto(id, productData, files) {
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

    if (nombre_producto) {
        setClauses.push('nombre_producto = ?');
        params.push(nombre_producto);
    }

    if (descripcion) {
        setClauses.push('descripcion = ?');
        params.push(descripcion);
    }

    if (precio != null && precio !== '') {
        setClauses.push('precio = ?');
        params.push(parseFloat(precio));
    }

    if (precio_anterior != null && precio_anterior !== '') {
        setClauses.push('precio_anterior = ?');
        params.push(parseFloat(precio_anterior));
    }

    if (categoria_id) {
        setClauses.push('categoria_id = ?');
        params.push(parseInt(categoria_id));
    }

    if (stock_actual != null && stock_actual !== '') {
        setClauses.push('stock_actual = ?');
        params.push(parseInt(stock_actual));
    }

    if (files?.imagen?.[0]) {
        const productoExistente = await obtenerProductoPorId(id);
        if (productoExistente?.imagen) {
            const rutaImagenAntigua = path.join(__dirname, '..', 'public', productoExistente.imagen);
            if (fs.existsSync(rutaImagenAntigua)) fs.unlinkSync(rutaImagenAntigua);
        }
        const imagenPath = convertToRelativePath(files.imagen[0].path);
        setClauses.push('imagen = ?');
        params.push(imagenPath);
    }

    if (files?.imagenes?.length > 0) {
        const imagenesPaths = files.imagenes.map(file => convertToRelativePath(file.path));
        setClauses.push('imagenes = ?');
        params.push(JSON.stringify(imagenesPaths));
    }

    if (precio || precio_anterior) {
        const productoActual = await obtenerProductoPorId(id);
        const precioFinal = precio ? parseFloat(precio) : productoActual.precio;
        const precioAnteriorFinal = precio_anterior ? parseFloat(precio_anterior) : productoActual.precio_anterior;
        const esOfertaFinal = (precioAnteriorFinal != null && precioFinal < precioAnteriorFinal);
        setClauses.push('es_oferta = ?');
        params.push(esOfertaFinal);
    }

    if (setClauses.length === 0) {
        throw new Error('No se pasaron datos para actualizar');
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
 * Marca un producto como inactivo (borrado lógico)
 * @param {number} productoId ID del producto a borrar
 * @returns {boolean} true si se desactivó, lanza error si no existe
 */
export async function eliminarProducto(productoId) {
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
 * Obtiene productos en oferta (ejemplo para home)
 * @param {number} limite Cantidad máxima de productos
 * @returns {Array} Productos en oferta
 */
export async function obtenerProductosEnOferta(limite = 8) {
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
 * Busca un producto por su ID
 * @param {number} productoId ID del producto
 * @returns {Object|null} Producto o null si no existe
 */
export async function obtenerProductoPorId(productoId) {
    const query = 'SELECT * FROM producto WHERE producto_id = ?';
    const [productos] = await pool.query(query, [productoId]);

    if (productos.length === 0) return null;

    return productos[0];
}

/**
 * Cambia estado activo/inactivo de un producto
 * @param {number} productoId ID del producto
 * @returns {boolean} true si se actualizó
 */
export async function toggleActivoProducto(productoId) {
    const query = 'UPDATE producto SET activo = NOT activo WHERE producto_id = ?';
    const [result] = await pool.query(query, [productoId]);
    return result.affectedRows > 0;
}
