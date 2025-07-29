import { pool } from '../database/connectionMySQL.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BannerService {
  // Obtener todos los banners activos (público)
  static async obtenerBannersPublicos() {
    const [banners] = await pool.execute(
      'SELECT * FROM banners WHERE activo = 1 ORDER BY orden ASC'
    );
    return banners;
  }

  // Obtener todos los banners para admin
  static async obtenerBannersAdmin() {
    const [banners] = await pool.execute(
      'SELECT * FROM banners ORDER BY orden ASC'
    );
    return banners;
  }

  // Obtener banner por ID
  static async obtenerBannerPorId(id) {
    const [banner] = await pool.execute(
      'SELECT * FROM banners WHERE id = ?',
      [id]
    );
    
    if (banner.length === 0) {
      return null;
    }

    return banner[0];
  }

  // Crear nuevo banner
  static async crearBanner(datoBanner, archivo) {
    const { titulo, descripcion, boton_texto, boton_link, orden, activo } = datoBanner;
    
    if (!archivo) {
      throw new Error('La imagen es obligatoria');
    }

    if (!titulo) {
      throw new Error('El título es obligatorio');
    }

    // Usar /images/banners/ como productos y categorías
    const imagen = `/images/banners/${archivo.filename}`;
    
    const [result] = await pool.execute(
      'INSERT INTO banners (titulo, descripcion, imagen, boton_texto, boton_link, orden, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, imagen, boton_texto || '', boton_link || '', orden || 0, activo !== 'false']
    );

    const [newBanner] = await pool.execute(
      'SELECT * FROM banners WHERE id = ?',
      [result.insertId]
    );

    return newBanner[0];
  }

  // Actualizar banner
  static async actualizarBanner(id, datoBanner, archivo) {
    const { titulo, descripcion, boton_texto, boton_link, orden, activo } = datoBanner;
    
    // Obtener banner actual
    const [currentBanner] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);
    if (currentBanner.length === 0) {
      throw new Error('Banner no encontrado');
    }

    let imagen = currentBanner[0].imagen;
    
    // Si hay nueva imagen, eliminar la anterior y usar la nueva
    if (archivo) {
      // Verificar que sea una imagen de banners antes de eliminar
      if (currentBanner[0].imagen && currentBanner[0].imagen.startsWith('/images/banners/')) {
        const oldImagePath = path.join(__dirname, '../public', currentBanner[0].imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Usar /images/banners/
      imagen = `/images/banners/${archivo.filename}`;
    }

    if (!titulo) {
      throw new Error('El título es obligatorio');
    }

    await pool.execute(
      'UPDATE banners SET titulo = ?, descripcion = ?, imagen = ?, boton_texto = ?, boton_link = ?, orden = ?, activo = ? WHERE id = ?',
      [titulo, descripcion, imagen, boton_texto || '', boton_link || '', orden || 0, activo !== 'false', id]
    );

    const [updatedBanner] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);
    
    return updatedBanner[0];
  }

  // Eliminar banner
  static async eliminarBanner(id) {
    // Obtener banner para eliminar imagen
    const [banner] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);
    if (banner.length === 0) {
      throw new Error('Banner no encontrado');
    }

    // Verificar que sea una imagen de banners antes de eliminar
    if (banner[0].imagen && banner[0].imagen.startsWith('/images/banners/')) {
      const imagePath = path.join(__dirname, '../public', banner[0].imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.execute('DELETE FROM banners WHERE id = ?', [id]);
    
    return true;
  }

  // Cambiar estado activo/inactivo
  static async toggleActivoBanner(id) {
    // Verificar que el banner existe
    const [banner] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);
    if (banner.length === 0) {
      throw new Error('Banner no encontrado');
    }

    const nuevoEstado = !banner[0].activo;

    await pool.execute(
      'UPDATE banners SET activo = ? WHERE id = ?',
      [nuevoEstado, id]
    );

    const [bannerActualizado] = await pool.execute('SELECT * FROM banners WHERE id = ?', [id]);

    return {
      banner: bannerActualizado[0],
      nuevoEstado
    };
  }
}