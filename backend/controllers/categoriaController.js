import * as categoriaService from '../services/categoriaService.js';

// Función de ayuda para validar el ID de la categoría, asegurando que sea un numero valido 
const isValidId = (id) => id && !isNaN(parseInt(id));

// Esta función es una ayuda para construir respuestas de error de manera consistente
const buildErrorResponse = (res, status, message) => {
    return res.status(status).json({ exito: false, mensaje: message });
};

export async function obtenerCategorias(req, res) {
    try {
        const { activo } = req.query;
        const categorias = await categoriaService.getAllCategories(activo === 'true');
        return res.status(200).json({
            exito: true,
            mensaje: 'Categorías obtenidas exitosamente',
            datos: categorias,
            total: categorias.length
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return buildErrorResponse(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerCategoriaPorId(req, res) {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return buildErrorResponse(res, 400, 'ID de categoría inválido');
        }
        const categoria = await categoriaService.getCategoryById(parseInt(id));
        if (!categoria) {
            return buildErrorResponse(res, 404, 'Categoría no encontrada');
        }
        return res.status(200).json({ exito: true, datos: categoria });
    } catch (error) {
        console.error('Error al obtener categoría por ID:', error);
        return buildErrorResponse(res, 500, 'Error interno del servidor');
    }
}

export async function crearCategoria(req, res) {
    try {
        const { nombre, activo = true } = req.body;
        if (!nombre || nombre.trim() === '') {
            return buildErrorResponse(res, 400, 'El nombre de la categoría es obligatorio');
        }
        const nuevaCategoria = await categoriaService.createCategory(nombre, activo);
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
        const { nombre, activo } = req.body;

        if (!isValidId(id)) {
            return buildErrorResponse(res, 400, 'ID de categoría inválido');
        }
        if (!nombre || nombre.trim() === '') {
            return buildErrorResponse(res, 400, 'El nombre de la categoría es obligatorio');
        }

        await categoriaService.updateCategory(parseInt(id), nombre, activo !== undefined ? activo : true);
        return res.status(200).json({ exito: true, mensaje: 'Categoría actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        return buildErrorResponse(res, error.statusCode || 500, error.message || 'Error interno del servidor');
    }
}

export async function eliminarCategoria(req, res) {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return buildErrorResponse(res, 400, 'ID de categoría inválido');
        }
        const fueEliminada = await categoriaService.deleteCategory(parseInt(id));
        if (!fueEliminada) {
            return buildErrorResponse(res, 404, 'Categoría no encontrada');
        }
        return res.status(200).json({ exito: true, mensaje: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        return buildErrorResponse(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerCategoriasConConteo(req, res) {
    try {
        const categorias = await categoriaService.getCategoriesWithProductCount();
        return res.status(200).json({ exito: true, datos: categorias });
    } catch (error) {
        console.error('Error al obtener categorías con conteo:', error);
        return buildErrorResponse(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerProductosPorCategoria(req, res) {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return buildErrorResponse(res, 400, 'ID de categoría inválido');
        }

        //Pasamos todo el request.query al servicio para manejar  la paginacion y filtros
        const resultado = await categoriaService.getProductsByCategoryId(parseInt(id), req.query);
        
        // Formateamos la respuesta de paginacion para que sea mejor entendida por el usuario
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