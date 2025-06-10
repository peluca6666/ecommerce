import { pool } from '../database/connectionMySQL.js'

export async function obtenerProductos(req, res) {
const { categoria, busqueda, minPrice, maxPrice, sortBy } = req.query;

const { pagina = 1, limite = 10 } = req.query;
const offset = (parseInt(pagina) - 1) * parseInt(limite);

  let query = `SELECT * FROM producto WHERE activo = true`;
  let params = [];

  if (categoria) {
    query += ` AND categoria = ?`;
    params.push(categoria);
  }

  if (busqueda) {
    query += ` AND nombre_producto LIKE ?`;
    params.push(`%${busqueda}%`);
  }

if (minPrice) {
  query += ` AND precio >= ?`;
  params.push(minPrice);
}

if (maxPrice) {
  query += ` AND precio <= ?`;
  params.push(maxPrice);
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
  console.error("❌ Error en obtenerProductos:", error); // 👈 Esto te lo muestra en consola
  res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message }); // 👈 Esto te da más detalle en la respuesta
}
  }
