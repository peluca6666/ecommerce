import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Fullscreen } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

const ProductImageGallery = ({ producto }) => {
  // Preparar imágenes
  const allImages = [producto.imagen, ...(Array.isArray(producto.imagenes) ? producto.imagenes : [])] 
    .filter(Boolean)
    .map(imgRelativa => `${import.meta.env.VITE_API_BASE_URL}${imgRelativa}`);

  // Si no hay imágenes, usar placeholder
  if (allImages.length === 0) {
    allImages.push('https://via.placeholder.com/500x500?text=Imagen+no+disponible');
  }

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);

  const openFullscreen = (imageUrl) => {
    const img = document.createElement('img');
    img.src = imageUrl;
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
    <Box sx={{ 
      width: '100%', 
      maxWidth: 600, 
      mx: 'auto',
      '& .swiper': {
        borderRadius: 3,
        overflow: 'hidden'
      },
      '& .swiper-slide': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
      },
      '& .swiper-button-next, & .swiper-button-prev': {
        background: 'rgba(255,255,255,0.9)',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        color: '#FF6B35',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'white',
          transform: 'scale(1.1)',
          color: '#FF4500'
        },
        '&::after': {
          fontSize: '20px',
          fontWeight: 'bold'
        }
      },
      '& .swiper-pagination-bullet': {
        background: '#e9ecef',
        opacity: 1,
        width: '12px',
        height: '12px',
        '&.swiper-pagination-bullet-active': {
          background: '#FF6B35',
          transform: 'scale(1.2)'
        }
      }
    }}>
      {/* Swiper principal */}
      <Box sx={{ 
        position: 'relative',
        mb: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Zoom]}
          spaceBetween={10}
          navigation={allImages.length > 1}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          zoom={true}
          onSwiper={setMainSwiper}
          style={{ 
            height: '500px',
            maxHeight: '60vh'
          }}
        >
          {allImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-zoom-container">
                <Box
                  component="img"
                  src={img}
                  alt={`${producto.nombre_producto} - Vista ${index + 1}`}
                  onClick={() => openFullscreen(img)}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Botón fullscreen */}
        <IconButton
          onClick={() => {
            const activeIndex = mainSwiper?.activeIndex || 0;
            openFullscreen(allImages[activeIndex]);
          }}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,107,53,0.9)',
            color: 'white',
            width: 48,
            height: 48,
            zIndex: 10,
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

      {/* Swiper de thumbnails */}
      {allImages.length > 1 && (
        <Box sx={{
          '& .swiper-slide': {
            width: 'auto !important',
            cursor: 'pointer'
          },
          '& .swiper-slide-thumb-active img': {
            borderColor: '#FF6B35 !important'
          }
        }}>
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={12}
            slidesPerView="auto"
            watchSlidesProgress={true}
            centeredSlides={true}
            style={{
              padding: '8px 0'
            }}
          >
            {allImages.map((img, index) => (
              <SwiperSlide key={index} style={{ width: 'auto' }}>
                <Box
                  component="img"
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '2px solid #e9ecef',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      borderColor: '#FF8C00'
                    }
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
};

export default ProductImageGallery;