import * as categoriaService from '../services/categoriaService.js';

const isValidId = (id) => id && !isNaN(parseInt(id));
const buildErrorResponse = (res, status, message) => res.status(status).json({ exito: false, mensaje: message });

// Controladores para el lado publico de la tienda

export async function obtenerCategorias(req, res) {
    try {
        const categorias = await categoriaService.obtenerCategorias(true);
        return res.status(200).json({ exito: true, datos: categorias });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return buildErrorResponse(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerCategoriasConConteo(req, res) {
    try {
        const categorias = await categoriaService.obtenerCategoriasConConteo();
        return res.status(200).json({ exito: true, datos: categorias });
    } catch (error) {
        console.error('Error al obtener categorías con conteo:', error);
        return buildErrorResponse(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerProductosPorCategoria(req, res) {
    try {
        const { id } = req.params;
        if (!isValidId(id)) return buildErrorResponse(res, 400, 'ID de categoría inválido');

        const resultado = await categoriaService.obtenerProductosPorCategoria(parseInt(id), req.query);
        
        const { nombre_categoria, productos, paginacion } = resultado;
        return res.status(200).json({
            exito: true,
            categoria: nombre_categoria,
            datos: productos,
            paginacion: {
                total_items: paginacion.total,
                limite: paginacion.limit,
                offset: paginacion.offset,
                pagina_actual: Math.floor(paginacion.offset / paginacion.limit) + 1,
                total_paginas: Math.ceil(paginacion.total / paginacion.limit)
            }
        });
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        return buildErrorResponse(res, error.statusCode || 500, error.message || 'Error interno del servidor');
    }
}

//Controladores para el panel de administrador

export async function obtenerTodasCategoriasAdmin(req, res) {
  try {
    const categorias = await categoriaService.obtenerTodasCategoriasAdmin();
    res.json({ exito: true, datos: categorias });
  } catch (error) {
    console.error('Error en controller al obtener todas las categorías:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
}

export async function crearCategoria(req, res) {
  try {
    const nuevaCategoria = await categoriaService.crearCategoria(req.body, req.file);
    return res.status(201).json({
        exito: true,
        mensaje: 'Categoría creada exitosamente',
        datos: nuevaCategoria
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return buildErrorResponse(res, error.statusCode || 500, error.message || 'Error interno del servidor');
  }
}

export async function actualizarCategoria(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return buildErrorResponse(res, 400, 'ID de categoría inválido');
    const categoriaActualizada = await categoriaService.actualizarCategoria(id, req.body, req.file);
    if (!categoriaActualizada) return buildErrorResponse(res, 404, 'Categoría no encontrada');
    return res.status(200).json({ exito: true, mensaje: 'Categoría actualizada exitosamente', datos: categoriaActualizada });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return buildErrorResponse(res, error.statusCode || 500, error.message || 'Error interno del servidor');
  }
}

export async function obtenerCategoriaPorId(req, res) {
    try {
        const { id } = req.params;
        if (!isValidId(id)) return buildErrorResponse(res, 400, 'ID de categoría inválido');
        const categoria = await categoriaService.obtenerCategoriaPorId(parseInt(id));
        if (!categoria) return buildErrorResponse(res, 404, 'Categoría no encontrada');
        return res.status(200).json({ exito: true, datos: categoria });
    } catch (error) {
        console.error('Error al obtener categoría por ID:', error);
        return buildErrorResponse(res, 500, 'Error interno del servidor');
    }
}

export async function cambiarEstadoCategoria(req, res) {
  try {
    const { id } = req.params;
    const resultado = await categoriaService.cambiarEstadoCategoria(parseInt(id));
    if (!resultado) return buildErrorResponse(res, 404, 'Categoría no encontrada');
    return res.status(200).json({ exito: true, mensaje: 'Estado de la categoría actualizado' });
  } catch (error) {
    console.error('Error al cambiar estado de categoría:', error);
    return buildErrorResponse(res, 500, 'Error interno del servidor');
  }
}