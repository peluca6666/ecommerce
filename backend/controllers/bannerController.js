import { BannerService } from '../services/bannerService.js';

// GET - Obtener todos los banners activos (público)
export const obtenerBannersPublicos = async (req, res) => {
  try {
    const banners = await BannerService.obtenerBannersPublicos();
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
    const banners = await BannerService.obtenerBannersAdmin();
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
    const banner = await BannerService.obtenerBannerPorId(id);
    
    if (!banner) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Banner no encontrado'
      });
    }

    res.json({
      exito: true,
      datos: banner
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
    const newBanner = await BannerService.crearBanner(req.body, req.file);

    res.status(201).json({
      exito: true,
      mensaje: 'Banner creado exitosamente',
      datos: newBanner
    });
  } catch (error) {
    console.error('Error al crear banner:', error);
    
    // Manejar errores de validación específicos
    if (error.message === 'La imagen es obligatoria' || error.message === 'El título es obligatorio') {
      return res.status(400).json({
        exito: false,
        mensaje: error.message
      });
    }
    
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
    const updatedBanner = await BannerService.actualizarBanner(id, req.body, req.file);
    
    res.json({
      exito: true,
      mensaje: 'Banner actualizado exitosamente',
      datos: updatedBanner
    });
  } catch (error) {
    console.error('Error al actualizar banner:', error);
    
    // Manejar errores específicos
    if (error.message === 'Banner no encontrado') {
      return res.status(404).json({
        exito: false,
        mensaje: error.message
      });
    }
    
    if (error.message === 'El título es obligatorio') {
      return res.status(400).json({
        exito: false,
        mensaje: error.message
      });
    }
    
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
    await BannerService.eliminarBanner(id);
    
    res.json({
      exito: true,
      mensaje: 'Banner eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar banner:', error);
    
    if (error.message === 'Banner no encontrado') {
      return res.status(404).json({
        exito: false,
        mensaje: error.message
      });
    }
    
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
    const resultado = await BannerService.toggleActivoBanner(id);

    res.json({
      exito: true,
      mensaje: `Banner ${resultado.nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
      datos: resultado.banner
    });
  } catch (error) {
    console.error('Error al cambiar estado del banner:', error);
    
    if (error.message === 'Banner no encontrado') {
      return res.status(404).json({
        exito: false,
        mensaje: error.message
      });
    }
    
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};