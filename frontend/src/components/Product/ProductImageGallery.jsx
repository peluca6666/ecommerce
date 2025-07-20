import { Box } from '@mui/material';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const ProductImageGallery = ({ producto }) => {
  // Preparar imágenes para la galería
  const allImages = [producto.imagen, ...(Array.isArray(producto.imagenes) ? producto.imagenes : [])] 
    .filter(Boolean)
    .map(imgRelativa => {
      const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${imgRelativa}`;
      return {
        original: fullUrl,
        thumbnail: fullUrl,
        originalAlt: producto.nombre_producto,
        thumbnailAlt: producto.nombre_producto
      };
    });

  // Si no hay imágenes, usar placeholder
  if (allImages.length === 0) {
    allImages.push({
      original: 'https://via.placeholder.com/500x500?text=Imagen+no+disponible',
      thumbnail: 'https://via.placeholder.com/80x80?text=Sin+imagen',
      originalAlt: producto.nombre_producto,
      thumbnailAlt: producto.nombre_producto
    });
  }

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: 600,
      mx: 'auto',
      '& .image-gallery': {
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      },
      '& .image-gallery-slide img': {
        borderRadius: '12px 12px 0 0',
        maxHeight: { xs: 350, sm: 450, md: 500 },
        objectFit: 'contain',
        background: '#f8f9fa'
      },
      '& .image-gallery-thumbnail': {
        border: '2px solid transparent',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#FF8C00'
        },
        '&.active': {
          borderColor: '#FF6B35'
        }
      },
      '& .image-gallery-thumbnail img': {
        borderRadius: 1
      },
      '& .image-gallery-icon': {
        color: '#FF6B35',
        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))',
        '&:hover': {
          color: '#FF4500'
        }
      },
      '& .image-gallery-left-nav, & .image-gallery-right-nav': {
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '50%',
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'rgba(255,255,255,1)',
          transform: 'scale(1.1)'
        }
      },
      '& .image-gallery-fullscreen-button, & .image-gallery-play-button': {
        background: 'rgba(255,107,53,0.9)',
        borderRadius: 2,
        '&:hover': {
          background: 'rgba(255,107,53,1)'
        }
      }
    }}>
      <ImageGallery
        items={allImages}
        showPlayButton={false}
        showFullscreenButton={true}
        showNav={allImages.length > 1}
        showThumbnails={allImages.length > 1}
        thumbnailPosition="bottom"
        useBrowserFullscreen={true}
        lazyLoad={true}
        slideDuration={300}
        slideInterval={4000}
        renderLeftNav={(onClick, disabled) => (
          <button
            className="image-gallery-icon image-gallery-left-nav"
            disabled={disabled}
            onClick={onClick}
            aria-label="Previous Image"
          >
            ‹
          </button>
        )}
        renderRightNav={(onClick, disabled) => (
          <button
            className="image-gallery-icon image-gallery-right-nav"
            disabled={disabled}
            onClick={onClick}
            aria-label="Next Image"
          >
            ›
          </button>
        )}
      />
    </Box>
  );
};

export default ProductImageGallery;