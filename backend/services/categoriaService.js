import { pool } from '../database/connectionMySQL.js';

// Constantes de configuración que ya tenías
const DEFAULT_PAGINATION = { LIMIT: 20, OFFSET: 0, ORDER: 'nombre_producto' };
const ALLOWED_ORDERS = ['nombre_producto', 'precio', 'stock_actual', 'fecha_creacion'];

/**
 * Obtiene todas las categorías. Puede filtrar por activas para el público general
 */
export async function obtenerCategorias(soloActivos = false) {
    let query = 'SELECT categoria_id, nombre, imagen, activo FROM categoria';
    if (soloActivos) {
        query += ' WHERE activo = true';
    }
    query += ' ORDER BY nombre ASC';
    const [categorias] = await pool.query(query);
    return categorias;
}

/**
 * Obtiene TODAS las categorías sin filtro para el panel de admin
 */
export async function obtenerTodasCategoriasAdmin() {
  const [rows] = await pool.query('SELECT * FROM categoria ORDER BY categoria_id DESC');
  return rows;
}

/**
 * Obtiene una categoría específica por su id
 */
export async function obtenerCategoriaPorId(categoriaId) {
    const [rows] = await pool.query('SELECT * FROM categoria WHERE categoria_id = ?', [categoriaId]);
    return rows.length > 0 ? rows[0] : null;
}

/**
 * Crea una nueva categoría, manejando nombre, imagen opcional y estado activo
 */
export async function crearCategoria(categoryData, file) {
  const { nombre, activo = true } = categoryData;
   const imagenPath = file ? `/images/categorias/${file.filename}` : null;

  if (!nombre || nombre.trim() === '') {
    const err = new Error('El nombre de la categoría es obligatorio');
    err.statusCode = 400;
    throw err;
  }
  
   try {
    const sql = 'INSERT INTO categoria (nombre, imagen, activo) VALUES (?, ?, ?)';
    // Usamos la nueva variable 'imagenPath'
    const [resultado] = await pool.query(sql, [nombre.trim(), imagenPath, true]);
    const [[nuevaCategoria]] = await pool.query('SELECT * FROM categoria WHERE categoria_id = ?', [resultado.insertId]);
    return nuevaCategoria;
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
 * Actualiza una categoría existente, manejando nombre, estado e imagen opcional
 */
export async function actualizarCategoria(id, categoryData, file) {
  const { nombre, activo } = categoryData;
  const setClauses = [];
  const params = [];

  if (nombre !== undefined) {
    setClauses.push('nombre = ?');
    params.push(nombre.trim());
  }
  if (activo !== undefined) {
    setClauses.push('activo = ?');
    params.push(activo === 'true' || activo === true ? 1 : 0);
  }
  if (file) {
    setClauses.push('imagen = ?');
    params.push(`/images/categorias/${file.filename}`);
  }

  if (setClauses.length === 0) {
    throw { statusCode: 400, message: 'No se proporcionaron datos para actualizar' };
  }

  const query = `UPDATE categoria SET ${setClauses.join(', ')} WHERE categoria_id = ?`;
  params.push(id);

  try {
    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) return null;
    return await obtenerCategoriaPorId(id);
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
 * Cambia el estado de una categoría
 */
export async function cambiarEstadoCategoria(categoriaId) {
  const query = 'UPDATE categoria SET activo = NOT activo WHERE categoria_id = ?';
  const [result] = await pool.query(query, [categoriaId]);
  return result.affectedRows > 0;
}

/**
 * Obtiene categorías con la cantidad de productos que tienen
 */
export async function obtenerCategoriasConConteo() {
    const [rows] = await pool.query(`
      SELECT 
        c.categoria_id, c.nombre, c.activo, COUNT(p.producto_id) as total_productos
      FROM categoria c
      LEFT JOIN producto p ON c.categoria_id = p.categoria_id
      WHERE c.activo = true
      GROUP BY c.categoria_id, c.nombre, c.activo
      ORDER BY c.nombre ASC
    `);
    return rows;
}

/**
 * Obtiene los productos de una categoría con filtros y paginación
 */
export async function obtenerProductosPorCategoria(categoriaId, options = {}) {
    const {
      limit = DEFAULT_PAGINATION.LIMIT,
      offset = DEFAULT_PAGINATION.OFFSET,
      es_oferta,
      precio_min,
      precio_max,
      orden = DEFAULT_PAGINATION.ORDER
    } = options;

    const ordenSeguro = ALLOWED_ORDERS.includes(orden) ? orden : DEFAULT_PAGINATION.ORDER;
    const categoria = await obtenerCategoriaPorId(categoriaId);
    if (!categoria || !categoria.activo) {
        const err = new Error('Categoría no encontrada o no disponible');
        err.statusCode = 404;
        throw err;
    }

    let query = `SELECT p.* FROM producto p WHERE p.categoria_id = ? AND p.activo = true`;
    const queryParams = [categoriaId];
    let countQuery = `SELECT COUNT(*) as total FROM producto WHERE categoria_id = ? AND activo = true`;
    const countParams = [categoriaId];

    if (es_oferta === 'true') {
        query += ' AND p.es_oferta = true';
        countQuery += ' AND es_oferta = true';
    }
    if (precio_min) {
        query += ' AND p.precio >= ?';
        queryParams.push(parseFloat(precio_min));
        countQuery += ' AND precio >= ?';
        countParams.push(parseFloat(precio_min));
    }
    if (precio_max) {
        query += ' AND p.precio <= ?';
        queryParams.push(parseFloat(precio_max));
        countQuery += ' AND precio <= ?';
        countParams.push(parseFloat(precio_max));
    }
    
    query += ` ORDER BY p.${ordenSeguro} ASC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [productos] = await pool.query(query, queryParams);
    const [[{ total }]] = await pool.query(countQuery, countParams);

    return {
        nombre_categoria: categoria.nombre,
        productos,
        paginacion: { total, limit: parseInt(limit), offset: parseInt(offset) }
    };
}

