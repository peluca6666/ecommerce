import { pool } from '../database/connectionMySQL.js'

// GET/categorias --------------------------------------------------------------

// Constantes para evitar magic strings y mejorar mantenibilidad
const ERROR_CODES = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_ID: 'INVALID_ID',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  CATEGORY_INACTIVE: 'CATEGORY_INACTIVE',
  INVALID_CATEGORY_ID: 'INVALID_CATEGORY_ID'
};

const DEFAULT_PAGINATION = {
  LIMIT: 20,
  OFFSET: 0,
  ORDER: 'nombre_producto'
};

const ALLOWED_ORDERS = ['nombre_producto', 'precio', 'stock_actual', 'fecha_creacion'];

// Función para validar IDs
const isValidId = (id) => id && !isNaN(parseInt(id));

// Función para construir respuestas de error
const buildErrorResponse = (res, status, error, code, details = null) => {
  const response = { error, codigo: code };
  if (details && process.env.NODE_ENV === 'development') {
    response.detalles = details;
  }
  return res.status(status).json(response);
};

export async function obtenerCategorias(req, res) {
  const { activo } = req.query;

  try {
    let query = 'SELECT categoria_id, nombre, activo FROM categoria';
    const params = [];

    if (activo === 'true') {
      query += ' WHERE activo = true';
    }

    query += ' ORDER BY nombre ASC';

    const [categorias] = await pool.query(query, params);

    return res.status(200).json({
      exito: true,
      mensaje: 'Categorías obtenidas exitosamente',
      categorias,
      total: categorias.length
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return buildErrorResponse(
      res,
      500,
      'Error interno del servidor',
      ERROR_CODES.INTERNAL_ERROR,
      { mensaje: error.message, stack: error.stack }
    );
  }
}

export async function obtenerCategoriaPorId(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return buildErrorResponse(
      res,
      400,
      'ID de categoría inválido',
      ERROR_CODES.INVALID_ID
    );
  }

  const categoriaId = parseInt(id);

  try {
    const [categoria] = await pool.query(
      'SELECT categoria_id, nombre, activo FROM categoria WHERE categoria_id = ?',
      [categoriaId]
    );

    if (categoria.length === 0) {
      return buildErrorResponse(
        res,
        404,
        'Categoría no encontrada',
        ERROR_CODES.CATEGORY_NOT_FOUND
      );
    }

    return res.status(200).json({
      exito: true,
      categoria: categoria[0]
    });

  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return buildErrorResponse(
      res,
      500,
      'Error interno del servidor',
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

export async function obtenerProductosPorCategoria(req, res) {
  const { id } = req.params;
  const {
    limit = DEFAULT_PAGINATION.LIMIT,
    offset = DEFAULT_PAGINATION.OFFSET,
    es_oferta,
    precio_min,
    precio_max,
    orden = DEFAULT_PAGINATION.ORDER
  } = req.query;

  if (!isValidId(id)) {
    return buildErrorResponse(
      res,
      400,
      'ID de categoría inválido',
      ERROR_CODES.INVALID_CATEGORY_ID
    );
  }

  const categoriaId = parseInt(id);
  const limite = parseInt(limit);
  const desplazamiento = parseInt(offset);
  const ordenSeguro = ALLOWED_ORDERS.includes(orden) ? orden : DEFAULT_PAGINATION.ORDER;

  try {
    // Verificar existencia y estado de la categoría
    const [categoria] = await pool.query(
      'SELECT nombre, activo FROM categoria WHERE categoria_id = ?',
      [categoriaId]
    );

    if (categoria.length === 0) {
      return buildErrorResponse(
        res,
        404,
        'Categoría no encontrada',
        ERROR_CODES.CATEGORY_NOT_FOUND
      );
    }

    if (!categoria[0].activo) {
      return buildErrorResponse(
        res,
        400,
        'Categoría no disponible',
        ERROR_CODES.CATEGORY_INACTIVE
      );
    }

    // Construir consulta base
    let query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM producto p 
      JOIN categoria c ON p.categoria_id = c.categoria_id 
      WHERE p.categoria_id = ?
    `;
    const params = [categoriaId];

    // Aplicar filtros
    if (es_oferta === 'true') {
      query += ' AND p.es_oferta = true';
    }

    if (precio_min) {
      query += ' AND p.precio >= ?';
      params.push(parseFloat(precio_min));
    }

    if (precio_max) {
      query += ' AND p.precio <= ?';
      params.push(parseFloat(precio_max));
    }

    // Ordenación y paginación
    query += ` ORDER BY p.${ordenSeguro} ASC`;
    query += ' LIMIT ? OFFSET ?';
    params.push(limite, desplazamiento);

    // Consulta para los productos
    const [productos] = await pool.query(query, params);

    // Consulta para el conteo total 
    let countQuery = 'SELECT COUNT(*) as total FROM producto WHERE categoria_id = ?';
    const countParams = [categoriaId];

    if (es_oferta === 'true') {
      countQuery += ' AND es_oferta = true';
    }
    if (precio_min) {
      countQuery += ' AND precio >= ?';
      countParams.push(parseFloat(precio_min));
    }
    if (precio_max) {
      countQuery += ' AND precio <= ?';
      countParams.push(parseFloat(precio_max));
    }

    const [totalCount] = await pool.query(countQuery, countParams);
    const total = totalCount[0].total;

    return res.status(200).json({
      exito: true,
      categoria: categoria[0].nombre,
      productos,
      paginacion: {
        total,
        limite,
        offset: desplazamiento,
        pagina_actual: Math.floor(desplazamiento / limite) + 1,
        total_paginas: Math.ceil(total / limite)
      }
    });

  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    return buildErrorResponse(
      res,
      500,
      'Error interno del servidor',
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}
//para el dashboard, obtener categorías con conteo de productos y ofertas
export async function obtenerCategoriasConConteo(req, res) {
  try {
    const [categorias] = await pool.query(`
      SELECT 
        c.categoria_id,
        c.nombre,
        c.activo,
        COUNT(p.producto_id) as total_productos,
        COUNT(CASE WHEN p.es_oferta = true THEN 1 END) as productos_en_oferta
      FROM categoria c
      LEFT JOIN producto p ON c.categoria_id = p.categoria_id
      WHERE c.activo = true
      GROUP BY c.categoria_id, c.nombre, c.activo
      ORDER BY c.nombre ASC
    `);

    return res.status(200).json({
      exito: true,
      categorias
    });

  } catch (error) {
    console.error('Error al obtener categorías con conteo:', error);
    return buildErrorResponse(
      res,
      500,
      'Error interno del servidor',
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

//POST /categorias-----------------------------------------------
export async function crearCategoria (req, res) {
const { nombre, activo = true } = req.body;
if (!nombre || nombre.trim() === ''){
    return buildErrorResponse(res, 400, 'El nombre de la categoria es obligatorio', 'INVALID_DATA');
}

try{
    //Insertar nueva categoría
    const [resultado] = await pool.query(
        'INSERT INTO categoria (nombre, activo) VALUES (?, ?)',
        [nombre.trim(), activo]
    );

    return res.status(201).json({
        exito: true,
        mensaje: 'Categoría creada exitosamente',
        categoria_id: resultado.insertId,
        
    });
} catch (error) {
    console.error('Error al crear categoría:', error);

    // Controlar error por nombre duplicado si aplica, ejemplo MySQL código 1062
    if (error.code === 'ER_DUP_ENTRY') {
      return buildErrorResponse(res, 409, 'Ya existe una categoría con ese nombre', 'DUPLICATE_CATEGORY');
    }

    return buildErrorResponse(res, 500, 'Error interno del servidor', 'INTERNAL_ERROR');
  }
}

//PUT /categorias----------------------------------------------

export async function actualizarCategoria(req, res) {
  const { id } = req.params;
  const { nombre, activo } = req.body;

  if (!isValidId(id)) {
    return buildErrorResponse(
      res,
      400,
      'ID de categoría inválido',
      ERROR_CODES.INVALID_ID
    );
  }

  if (!nombre || nombre.trim() === '') {
    return buildErrorResponse(
      res,
      400,
      'El nombre de la categoría es obligatorio',
      'INVALID_DATA'
    );
  }

  const categoriaId = parseInt(id);

  try {
    // Verificar que la categoría existe
    const [categoriaExistente] = await pool.query(
      'SELECT categoria_id FROM categoria WHERE categoria_id = ?',
      [categoriaId]
    );

    if (categoriaExistente.length === 0) {
      return buildErrorResponse(
        res,
        404,
        'Categoría no encontrada',
        ERROR_CODES.CATEGORY_NOT_FOUND
      );
    }

    // Actualizar la categoría
    await pool.query(
      'UPDATE categoria SET nombre = ?, activo = ? WHERE categoria_id = ?',
      [nombre.trim(), activo !== undefined ? activo : true, categoriaId]
    );

    return res.status(200).json({
      exito: true,
      mensaje: 'Categoría actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar categoría:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return buildErrorResponse(
        res,
        409,
        'Ya existe una categoría con ese nombre',
        'DUPLICATE_CATEGORY'
      );
    }

    return buildErrorResponse(
      res,
      500,
      'Error interno del servidor',
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}

//DELETE /categorias----------------------------------------------
export async function eliminarCategoria(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return buildErrorResponse(
      res,
      400,
      'ID de categoría inválido',
      ERROR_CODES.INVALID_ID
    );
  }

  const categoriaId = parseInt(id);

  try {
    // Verificar que la categoría existe
    const [categoriaExistente] = await pool.query(
      'SELECT categoria_id FROM categoria WHERE categoria_id = ?',
      [categoriaId]
    );

    if (categoriaExistente.length === 0) {
      return buildErrorResponse(
        res,
        404,
        'Categoría no encontrada',
        ERROR_CODES.CATEGORY_NOT_FOUND
      );
    }


    // Eliminar la categoría
    await pool.query(
      'DELETE FROM categoria WHERE categoria_id = ?',
      [categoriaId]
    );

    return res.status(200).json({
      exito: true,
      mensaje: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return buildErrorResponse(
      res,
      500,
      'Error interno del servidor',
      ERROR_CODES.INTERNAL_ERROR
    );
  }
}