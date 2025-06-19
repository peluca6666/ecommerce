import { pool } from '../database/connectionMySQL.js';
import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 

// Para obtener la ruta del directorio actual en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convierte ruta absoluta a relativa para que se pueda usar en la app web
function convertToRelativePath(fullPath) {
  if (!fullPath) return null;
  if (fullPath.startsWith('/images/')) return fullPath;
  const publicIndex = fullPath.indexOf('public');
  if (publicIndex !== -1) {
    return '/' + fullPath.substring(publicIndex + 7).replace(/\\/g, '/');
  }
  if (fullPath.includes('images/productos')) {
    const imagePath = fullPath.substring(fullPath.indexOf('images/productos')).replace(/\\/g, '/');
    return '/' + imagePath;
  }
  return fullPath.replace(/\\/g, '/');
}

// Lista productos con filtros y paginación para admin
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

// Crea un producto, validando campos mínimos y convirtiendo rutas de imagen a relativas
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

  // Convierte ruta absoluta a relativa para almacenar en BD
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

// Actualiza producto, con manejo de imagen principal y secundarias, y cálculo de oferta
export async function updateProduct(id, productData, files) {
  // Logs para debug (pueden eliminarse en producción)
  console.log('--- SERVICE: INICIO DE updateProduct ---');
  console.log('[SERVICE] ID recibido:', id);
  console.log('[SERVICE] productData recibido:', productData);
  console.log('[SERVICE] files recibido:', files);
  console.log('--------------------------------------');

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
  // Resto de campos omitidos para brevedad...

  if (files && files.imagen && files.imagen[0]) {
    // Borra la imagen antigua si existe, antes de reemplazarla
    console.log('[SERVICE] Se detectó una nueva imagen principal. Iniciando lógica de reemplazo...');
    
    const productoExistente = await obtenerProductoPorId(id);
    console.log('[SERVICE] Producto existente encontrado:', productoExistente);

    if (productoExistente && productoExistente.imagen) {
      const rutaImagenAntigua = path.join(__dirname, '..', 'public', productoExistente.imagen);
      console.log('[SERVICE] Ruta de imagen antigua a eliminar:', rutaImagenAntigua);

      try {
        if (fs.existsSync(rutaImagenAntigua)) {
          fs.unlinkSync(rutaImagenAntigua);
          console.log(`[SERVICE] ÉXITO: Imagen antigua eliminada.`);
        } else {
          console.warn('[SERVICE] ADVERTENCIA: La imagen antigua no existe, no se eliminó nada.');
        }
      } catch (err) {
        console.error("[SERVICE] ERROR al eliminar la imagen antigua:", err);
      }
    }

    const imagenPath = convertToRelativePath(files.imagen[0].path);
    console.log('[SERVICE] Nueva ruta de imagen relativa:', imagenPath);
    setClauses.push('imagen = ?');
    params.push(imagenPath);
  } else {
    console.log('[SERVICE] No se detectó una nueva imagen principal.');
  }

  // Si hay imágenes secundarias nuevas las convertimos y guardamos como JSON
  if (files && files.imagenes && files.imagenes.length > 0) {
    // Podría agregarse lógica para borrar las imágenes viejas si se quisiera
    const imagenesPaths = files.imagenes.map(file => convertToRelativePath(file.path));
    setClauses.push('imagenes = ?');
    params.push(JSON.stringify(imagenesPaths));
  }
  
  // Actualiza campo es_oferta según precio y precio_anterior nuevos o actuales
  if (precio || precio_anterior) {
    const precioFinal = precio ? parseFloat(precio) : (await obtenerProductoPorId(id)).precio;
    const precioAnteriorFinal = precio_anterior ? parseFloat(precio_anterior) : (await obtenerProductoPorId(id)).precio_anterior;
    const esOfertaFinal = (precioAnteriorFinal != null && precioFinal < precioAnteriorFinal);
    setClauses.push('es_oferta = ?');
    params.push(esOfertaFinal);
  }

  // Permite actualizar solo imagen sin datos extra
  if (setClauses.length === 0) {
    console.error('[SERVICE] No hay datos para actualizar, no se ejecuta UPDATE.');
  }

  if (setClauses.length > 0) {
    const query = `UPDATE producto SET ${setClauses.join(', ')} WHERE producto_id = ?`;
    params.push(id);
    
    console.log('[SERVICE] Ejecutando consulta SQL:', query);
    console.log('Params:', params);
  
    const [result] = await pool.query(query, params);
    console.log('[SERVICE] Resultado UPDATE:', result);

    if (result.affectedRows === 0) return null;
  } else {
    console.log('[SERVICE] No hubo cambios en la base de datos.');
  }

  // Devuelve producto actualizado con nombre de categoría
  const [[productoActualizado]] = await pool.query(
    'SELECT p.*, c.nombre AS nombre_categoria FROM producto p LEFT JOIN categoria c ON p.categoria_id = c.categoria_id WHERE p.producto_id = ?', 
    [id]
  );
  console.log('[SERVICE] Producto final devuelto:', productoActualizado);
  return productoActualizado;
}

// Desactiva el producto en vez de eliminarlo
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

// Trae productos en oferta, limitado por parámetro
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

// Busca un producto activo por su id
export async function obtenerProductoPorId(productoId) {
    const query = 'SELECT * FROM producto WHERE producto_id = ? AND activo = true';
    const [productos] = await pool.query(query, [productoId]);

    if (productos.length === 0) {
        return null;
    }

    return productos[0];
}

// Activa o desactiva un producto
export async function toggleProductStatus(productoId) {
  const query = 'UPDATE producto SET activo = NOT activo WHERE producto_id = ?';
  const [result] = await pool.query(query, [productoId]);
  
  return result.affectedRows > 0;
}
