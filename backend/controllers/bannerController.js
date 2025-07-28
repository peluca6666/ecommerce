import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET - Obtener todos los banners activos (público)
export const obtenerBannersPublicos = async (req, res) => {
  try {
    const [banners] = await pool.execute(
      'SELECT * FROM banners WHERE activo = 1 ORDER BY orden ASC'
    );
    res.json({
      exito: true,
      datos: banners
    });
  } catch (error) {
    console.error('Error al obtener banners:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// GET - Obtener todos los banners para admin
export const obtenerBannersAdmin = async (req, res) => {
  try {
    const [banners] = await pool.execute(
      'SELECT * FROM banners ORDER BY orden ASC'
    );
    res.json({
      exito: true,
      datos: banners
    });
  } catch (error) {
    console.error('Error al obtener banners:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// GET - Obtener banner por ID
export const obtenerBannerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [banner] = await pool.execute(
      'SELECT * FROM banners WHERE id = ?',
      [id]
    );
    
    if (banner.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Banner no encontrado'
      });
    }

    res.json({
      exito: true,
      datos: banner[0]
    });
  } catch (error) {
    console.error('Error al obtener banner:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// POST - Crear nuevo banner
export const crearBanner = async (req, res) => {
  try {
    const { titulo, descripcion, boton_texto, boton_link, orden, activo } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        exito: false,
        mensaje: 'La imagen es obligatoria'
      });
    }

    if (!titulo) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El título es obligatorio'
      });
    }

    const imagen = `/assets_staticos/${req.file.filename}`;
    
    const [result] = await pool.execute(
      'INSERT INTO banners (titulo, descripcion, imagen, boton_texto, boton_link, orden, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, imagen, boton_texto || '', boton_link || '', orden || 0, activo !== 'false']
    );

    const [newBanner] = await pool.execute(
      'SELECT * FROM banners WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      exito: true,
      mensaje: 'Banner creado exitosamente',
      datos: newBanner[0]
    });
  } catch (error) {
    console.error('Error al crear banner:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// PUT - Actualizar banner
export const actualizarBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, boton_texto, boton_link, orden, activo } = req.body;
    
    // Obtener banner actual
    const [currentBanner] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);
    if (currentBanner.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Banner no encontrado'
      });
    }

    let imagen = currentBanner[0].imagen;
    
    // Si hay nueva imagen, eliminar la anterior y usar la nueva
    if (req.file) {
      // Eliminar imagen anterior si no es una imagen por defecto
      if (currentBanner[0].imagen && !currentBanner[0].imagen.includes('v2.jpg')) {
        const oldImagePath = path.join(__dirname, '../public', currentBanner[0].imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagen = `/assets_staticos/${req.file.filename}`;
    }

    if (!titulo) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El título es obligatorio'
      });
    }

    await pool.execute(
      'UPDATE banners SET titulo = ?, descripcion = ?, imagen = ?, boton_texto = ?, boton_link = ?, orden = ?, activo = ? WHERE id = ?',
      [titulo, descripcion, imagen, boton_texto || '', boton_link || '', orden || 0, activo !== 'false', id]
    );

    const [updatedBanner] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);
    
    res.json({
      exito: true,
      mensaje: 'Banner actualizado exitosamente',
      datos: updatedBanner[0]
    });
  } catch (error) {
    console.error('Error al actualizar banner:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// DELETE - Eliminar banner
export const eliminarBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener banner para eliminar imagen
    const [banner] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);
    if (banner.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Banner no encontrado'
      });
    }

    // Eliminar imagen si no es una imagen por defecto
    if (banner[0].imagen && !banner[0].imagen.includes('v2.jpg')) {
      const imagePath = path.join(__dirname, '../public', banner[0].imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.execute('DELETE FROM banners WHERE id = ?', [id]);
    
    res.json({
      exito: true,
      mensaje: 'Banner eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar banner:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// PUT - Cambiar estado activo/inactivo
export const toggleActivoBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el banner existe
    const [banner] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);
    if (banner.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Banner no encontrado'
      });
    }

    const nuevoEstado = !banner[0].activo;

    await pool.execute(
      'UPDATE banners SET activo = ? WHERE id = ?',
      [nuevoEstado, id]
    );

    const [bannerActualizado] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);

    res.json({
      exito: true,
      mensaje: `Banner ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
      datos: bannerActualizado[0]
    });
  } catch (error) {
    console.error('Error al cambiar estado del banner:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};