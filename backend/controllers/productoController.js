import { pool } from '../database/connectionMySQL.js'

// GET /api/productos----------------------------------------------------
export async function obtenerProductos(req, res) {
    const { categoria, busqueda, minPrice, maxPrice, sortBy } = req.query;

    const { pagina = 1, limite = 10 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    let query = `SELECT * FROM producto WHERE activo = true`;
    let params = [];

    if (categoria) {
        query += ` AND categoria_id = ?`;
        params.push(categoria);
    }

    if (busqueda) {
        query += ` AND nombre_producto LIKE ?`;
        params.push(`%${busqueda}%`);
    }
    //Filtros de precio
    if (minPrice && !isNaN(minPrice)) {
        query += ` AND precio >= ?`;
        params.push(parseFloat(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
        query += ` AND precio <= ?`;
        params.push(parseFloat(maxPrice));
    }

    if (sortBy === 'precio_asc') {
        query += ` ORDER BY precio ASC`;
    } else if (sortBy === 'precio_desc') {
        query += ` ORDER BY precio DESC`;
    } else if (sortBy === 'nombre_asc') {
        query += ` ORDER BY nombre_producto ASC`;
    } else if (sortBy === 'nombre_desc') {
        query += ` ORDER BY nombre_producto DESC`;
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limite), offset);

    try {
        const [producto] = await pool.query(query, params);
        res.json(producto);
    } catch (error) {
        console.error(" Error en obtenerProductos:", error); // 
        res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
    }
}

// POST /api/productos---------------------------------------------------

export async function agregarProducto(req, res) {
    const {
        nombre_producto,
        descripcion,
        precio,
        categoria_id,
        imagen,
        imagenes,
        stock_actual,
        es_oferta = false  // Valor por defecto si no se especifica
    } = req.body;

    // Validaciones básicas
    if (!nombre_producto || !precio || !stock_actual) {
        return res.status(400).json({ mensaje: 'Nombre, precio y stock son requeridos' });
    }

    if (isNaN(parseFloat(precio)) || isNaN(parseInt(stock_actual))) {
        return res.status(400).json({ mensaje: 'Precio y stock deben ser números válidos' });
    }

    // Validar que el precio sea positivo
    if (parseFloat(precio) <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser mayor que cero' });
    }

    // Validar que el stock no sea negativo
    if (parseInt(stock_actual) < 0) {
        return res.status(400).json({ mensaje: 'El stock no puede ser negativo' });
    }

    try {
        // Validar que imagenes sea un array
        const imagenesArray = Array.isArray(imagenes) ? imagenes : [];

        // Convertir es_oferta a booleano (por si viene como string)
        const esOfertaBoolean = Boolean(es_oferta);

        const query = `INSERT INTO producto 
                  (nombre_producto, descripcion, precio, categoria_id, imagen, imagenes, stock_actual, activo, es_oferta) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, true, ?)`;
        const params = [
            nombre_producto,
            descripcion || null,
            parseFloat(precio),
            categoria_id || null,
            imagen || null,
            JSON.stringify(imagenesArray),
            parseInt(stock_actual),
            esOfertaBoolean
        ];

        const [result] = await pool.query(query, params);

        res.status(201).json({
            mensaje: 'Producto agregado correctamente',
            productoId: result.insertId,
            datos: {
                nombre_producto,
                descripcion: descripcion || null,
                precio: parseFloat(precio),
                categoria_id: categoria_id || null,
                stock: parseInt(stock_actual),
                es_oferta: esOfertaBoolean,
                activo: true  // Por defecto lo creamos como activo
            }
        });
    } catch (error) {
        console.error("Error agregando producto:", error);
        res.status(500).json({
            mensaje: 'Error al agregar producto',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno',
            detalles: process.env.NODE_ENV === 'development' ? { stack: error.stack } : null
        });
    }
}

//PUT /api/productos---------------------------------------------------

export async function actualizarProducto(req, res) {
    const { id } = req.params;
    const {
        nombre_producto,
        descripcion,
        precio,
        categoria_id,
        imagen,
        imagenes,
        stock_actual,
        es_oferta,
        activo
    } = req.body;

    // Validación del ID
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            error: 'ID de producto inválido',
            codigo: 'INVALID_ID'
        });
    }

    const productoId = parseInt(id);

    try {
        // Verificar si el producto existe
        const [productoExistente] = await pool.query(
            'SELECT * FROM producto WHERE producto_id = ?',
            [productoId]
        );

        if (productoExistente.length === 0) {
            return res.status(404).json({
                error: 'Producto no encontrado',
                codigo: 'PRODUCT_NOT_FOUND'
            });
        }

        // Validaciones de campos específicos
        const erroresValidacion = [];

        if (nombre_producto !== undefined) {
            if (typeof nombre_producto !== 'string' || nombre_producto.trim().length === 0) {
                erroresValidacion.push('El nombre del producto no puede estar vacío');
            } else if (nombre_producto.trim().length > 255) {
                erroresValidacion.push('El nombre del producto no puede exceder 255 caracteres');
            }
        }

        if (precio !== undefined) {
            const precioNum = parseFloat(precio);
            if (isNaN(precioNum) || precioNum < 0) {
                erroresValidacion.push('El precio debe ser un número mayor o igual a 0');
            }
        }

        if (stock_actual !== undefined) {
            const stockNum = parseInt(stock_actual);
            if (isNaN(stockNum) || stockNum < 0) {
                erroresValidacion.push('El stock debe ser un número entero mayor o igual a 0');
            }
        }

        if (categoria_id !== undefined) {
            if (typeof categoria_id !== 'string' || categoria_id.trim().length === 0) {
                erroresValidacion.push('La categoría no puede estar vacía');
            }
        }

        if (descripcion !== undefined && descripcion !== null) {
            if (typeof descripcion !== 'string') {
                erroresValidacion.push('La descripción debe ser un texto válido');
            } else if (descripcion.length > 1000) {
                erroresValidacion.push('La descripción no puede exceder 1000 caracteres');
            }
        }

        if (es_oferta !== undefined) {
            if (typeof es_oferta !== 'boolean' && es_oferta !== 0 && es_oferta !== 1) {
                erroresValidacion.push('El campo es_oferta debe ser verdadero o falso');
            }
        }

        if (activo !== undefined) {
            if (typeof activo !== 'boolean' && activo !== 0 && activo !== 1) {
                erroresValidacion.push('El campo activo debe ser verdadero o falso');
            }
        }

        if (imagen !== undefined && imagen !== null) {
            if (typeof imagen !== 'string' || imagen.trim().length === 0) {
                erroresValidacion.push('La URL de la imagen debe ser válida');
            }
        }

        if (imagenes !== undefined && imagenes !== null) {
            if (!Array.isArray(imagenes)) {
                erroresValidacion.push('Las imágenes deben ser un arreglo válido');
            } else {
                imagenes.forEach((img, index) => {
                    if (typeof img !== 'string' || img.trim().length === 0) {
                        erroresValidacion.push(`La imagen en posición ${index + 1} no es válida`);
                    }
                });
            }
        }

        // Si hay errores de validación, retornar
        if (erroresValidacion.length > 0) {
            return res.status(400).json({
                error: 'Errores de validación',
                codigo: 'VALIDATION_ERROR',
                detalles: erroresValidacion
            });
        }

        // Construir la consulta dinámica (solo actualiza los campos enviados)
        const camposActualizar = [];
        const valores = [];
        const cambiosRealizados = {};

        if (nombre_producto !== undefined) {
            camposActualizar.push('nombre_producto = ?');
            valores.push(nombre_producto.trim());
            cambiosRealizados.nombre_producto = nombre_producto.trim();
        }

        if (descripcion !== undefined) {
            camposActualizar.push('descripcion = ?');
            valores.push(descripcion);
            cambiosRealizados.descripcion = descripcion;
        }

        if (precio !== undefined) {
            const precioFormateado = parseFloat(precio);
            camposActualizar.push('precio = ?');
            valores.push(precioFormateado);
            cambiosRealizados.precio = precioFormateado;
        }

        if (categoria_id !== undefined) {
            camposActualizar.push('categoria_id = ?');
            valores.push(categoria_id.trim());
            cambiosRealizados.categoria_id = categoria_id.trim();
        }

        if (imagen !== undefined) {
            camposActualizar.push('imagen = ?');
            valores.push(imagen);
            cambiosRealizados.imagen = imagen;
        }

        if (imagenes !== undefined) {
            // Convertir el array a JSON para almacenar en la base de datos
            const imagenesJson = JSON.stringify(imagenes);
            camposActualizar.push('imagenes = ?');
            valores.push(imagenesJson);
            cambiosRealizados.imagenes = imagenes;
        }

        if (stock_actual !== undefined) {
            const stockFormateado = parseInt(stock_actual);
            camposActualizar.push('stock_actual = ?');
            valores.push(stockFormateado);
            cambiosRealizados.stock_actual = stockFormateado;
        }

        if (es_oferta !== undefined) {
            const esOfertaFormateado = Boolean(es_oferta);
            camposActualizar.push('es_oferta = ?');
            valores.push(esOfertaFormateado);
            cambiosRealizados.es_oferta = esOfertaFormateado;
        }

        if (activo !== undefined) {
            const activoFormateado = Boolean(activo);
            camposActualizar.push('activo = ?');
            valores.push(activoFormateado);
            cambiosRealizados.activo = activoFormateado;
        }

        // Verificar que se proporcionaron campos para actualizar
        if (camposActualizar.length === 0) {
            return res.status(400).json({
                error: 'No se proporcionaron campos para actualizar',
                codigo: 'NO_FIELDS_TO_UPDATE'
            });
        }

        // Construir y ejecutar la consulta
        const query = `
            UPDATE producto 
            SET ${camposActualizar.join(', ')} 
            WHERE producto_id = ?
        `;
        valores.push(productoId);

        const [result] = await pool.query(query, valores);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'No se pudo actualizar el producto',
                codigo: 'UPDATE_FAILED'
            });
        }

        // Obtener el producto actualizado para devolver los datos completos
        const [productoActualizado] = await pool.query(
            'SELECT * FROM producto WHERE producto_id = ?',
            [productoId]
        );

        // Respuesta exitosa
        res.status(200).json({
            exito: true,
            mensaje: 'Producto actualizado correctamente',
            producto: {
                id: productoId,
                ...productoActualizado[0]
            },
            cambios_realizados: cambiosRealizados,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error actualizando producto:', error);

        // Manejo específico de errores de base de datos
        let mensajeError = 'Error interno del servidor';
        let codigoError = 'INTERNAL_ERROR';

        if (error.code === 'ER_DUP_ENTRY') {
            mensajeError = 'Ya existe un producto con ese nombre';
            codigoError = 'DUPLICATE_PRODUCT';
        } else if (error.code === 'ER_DATA_TOO_LONG') {
            mensajeError = 'Uno de los campos excede la longitud máxima permitida';
            codigoError = 'DATA_TOO_LONG';
        } else if (error.code === 'ER_BAD_NULL_ERROR') {
            mensajeError = 'Falta un campo requerido';
            codigoError = 'MISSING_REQUIRED_FIELD';
        }

        res.status(500).json({
            error: mensajeError,
            codigo: codigoError,
            timestamp: new Date().toISOString(),
            detalles: process.env.NODE_ENV === 'development' ? {
                mensaje: error.message,
                codigo_sql: error.code,
                stack: error.stack
            } : null
        });
    }
}

// DELETE /api/productos/--------------------------------------------
export async function eliminarProducto(req, res) {
    const { id } = req.params;

    // Validar ID
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            error: 'ID de producto inválido',
            codigo: 'INVALID_ID'
        });
    }

    const productoId = parseInt(id);

    try {
        // Verificar si el producto existe
        const [producto] = await pool.query(
            'SELECT * FROM producto WHERE producto_id = ?',
            [productoId]
        );

        if (producto.length === 0) {
            return res.status(404).json({
                error: 'Producto no encontrado',
                codigo: 'PRODUCT_NOT_FOUND'
            });
        }

        // Eliminar producto
        const [result] = await pool.query(
            'DELETE FROM producto WHERE producto_id = ?',
            [productoId]
        );

        // Log de auditoría 
        console.log(`Producto eliminado: ID ${productoId}, Usuario: ${req.user?.id || 'N/A'}`);

        res.status(200).json({
            exito: true,
            mensaje: 'Producto eliminado correctamente',
            producto_eliminado: {
                id: productoId,
                ...producto[0]
            }
        });

    } catch (error) {
        console.error('Error al eliminar producto:', error);

        // Manejo específico de errores de base de datos
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                error: 'No se puede eliminar el producto porque está siendo usado en otras tablas',
                codigo: 'FOREIGN_KEY_CONSTRAINT'
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor',
            codigo: 'INTERNAL_ERROR',
            detalles: process.env.NODE_ENV === 'development' ? {
                mensaje: error.message,
                stack: error.stack,
                codigo_db: error.code
            } : null
        });
    }
}