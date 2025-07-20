import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, Fullscreen } from '@mui/icons-material';

const ProductImageGallery = ({ producto }) => {
  // Preparar imágenes
  const allImages = [producto.imagen, ...(Array.isArray(producto.imagenes) ? producto.imagenes : [])] 
    .filter(Boolean)
    .map(imgRelativa => `${import.meta.env.VITE_API_BASE_URL}${imgRelativa}`);

  // Si no hay imágenes, usar placeholder
  if (allImages.length === 0) {
    allImages.push('https://via.placeholder.com/500x500?text=Imagen+no+disponible');
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openFullscreen = () => {
    const img = document.createElement('img');
    img.src = allImages[selectedImageIndex];
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.objectFit = 'contain';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.9); display: flex; align-items: center;
      justify-content: center; z-index: 9999; cursor: pointer;
    `;
    overlay.appendChild(img);
    overlay.onclick = () => document.body.removeChild(overlay);
    document.body.appendChild(overlay);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      {/* Imagen principal */}
      <Box sx={{ 
        position: 'relative',
        mb: 3,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Box
          component="img"
          src={allImages[selectedImageIndex]}
          alt={producto.nombre_producto}
          sx={{
            width: '100%',
            height: { xs: 350, sm: 450, md: 500 },
            objectFit: 'contain',
            background: '#f8f9fa',
            cursor: 'pointer'
          }}
          onClick={openFullscreen}
        />
        
        {/* Controles de navegación */}
        {allImages.length > 1 && (
          <>
            <IconButton
              onClick={prevImage}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                color: '#FF6B35',
                width: 48,
                height: 48,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'white',
                  transform: 'translateY(-50%) scale(1.1)'
                }
              }}
            >
              <ChevronLeft />
            </IconButton>
            
            <IconButton
              onClick={nextImage}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                color: '#FF6B35',
                width: 48,
                height: 48,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'white',
                  transform: 'translateY(-50%) scale(1.1)'
                }
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
        
        {/* Botón fullscreen */}
        <IconButton
          onClick={openFullscreen}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,107,53,0.9)',
            color: 'white',
            width: 40,
            height: 40,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255,107,53,1)',
              transform: 'scale(1.1)'
            }
          }}
        >
          <Fullscreen />
        </IconButton>
      </Box>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <Box sx={{ 
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          justifyContent: 'center',
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { 
            background: '#FF6B35',
            borderRadius: 2
          }
        }}>
          {allImages.map((img, index) => (
            <Box
              key={index}
              component="img"
              src={img}
              alt={`Vista ${index + 1}`}
              onClick={() => setSelectedImageIndex(index)}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 2,
                cursor: 'pointer',
                border: selectedImageIndex === index ? '3px solid #FF6B35' : '2px solid #e9ecef',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: '#FF8C00'
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductImageGallery;