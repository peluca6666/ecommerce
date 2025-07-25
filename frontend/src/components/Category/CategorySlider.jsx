import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import CategoryCard from "./CategoryCard";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CategorySlider = ({ categoria }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  if (!categoria || categoria.length === 0) return null;

  // Configuración responsive de slides
  const swiperConfig = {
    modules: [Navigation, Pagination, Mousewheel],
    spaceBetween: isMobile ? 12 : 20,
    slidesPerView: 'auto',
    centeredSlides: isMobile,
    loop: categoria.length > 4,
    mousewheel: {
      forceToAxis: true,
    },
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    pagination: {
      el: '.swiper-pagination-custom',
      clickable: true,
      renderBullet: (index, className) => 
        `<span class="${className}" style="background: #FF6B35; width: 6px; height: 6px;"></span>`,
    },
    breakpoints: {
      320: {
        slidesPerView: 2.5,
        spaceBetween: 10,
        centeredSlides: false,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 12,
        centeredSlides: false,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 16,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 20,
        centeredSlides: false,
      },
      1200: {
        slidesPerView: 6,
        spaceBetween: 20,
        centeredSlides: false,
      }
    }
  };

  return (
    <Box sx={{ 
      py: { xs: 1.5, md: 2 }, // ✅ DRÁSTICAMENTE reducido (antes py: { xs: 4, md: 6 })
      px: { xs: 2, md: 3 },
      maxWidth: '1400px',
      mx: 'auto',
      overflow: 'hidden'
    }}>
      {/* Titulo más compacto */}
      <Typography variant={isMobile ? "h6" : "h5"} sx={{ // ✅ Variante más pequeña
        textAlign: 'center',
        fontWeight: 600, // ✅ Menos peso
        mb: { xs: 1, md: 1.5 }, // ✅ MUCHO menos margen (antes mb: { xs: 3, md: 4 })
        color: '#2c3e50',
        fontSize: { xs: '1.1rem', md: '1.25rem' }, // ✅ Tamaño específico más pequeño
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -6, // ✅ Más cerca del texto
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40, // ✅ Línea más pequeña (antes 60)
          height: 2, // ✅ Más delgada (antes 3)
          background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
          borderRadius: 2,
        }
      }}>
        Categorías
      </Typography>

      {/* Swiper Container */}
      <Box sx={{ 
        position: 'relative',
        '& .swiper': {
          overflow: 'visible',
          pb: isMobile ? 2 : 1, // ✅ Menos padding bottom (antes pb: isMobile ? 4 : 3)
          pt: 0.5, // ✅ Menos padding top
        },
        '& .swiper-wrapper': {
          // Mask para fade effect en desktop
          ...(!isMobile && {
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
          })
        },
        '& .swiper-slide': {
          width: 'auto !important',
          minWidth: {
            xs: '110px', // ✅ Más pequeño (antes 140px)
            sm: '130px', // ✅ Más pequeño (antes 160px)
            md: '150px', // ✅ Más pequeño (antes 180px)
            lg: '160px', // ✅ Más pequeño (antes 200px)
            xl: '180px'  // ✅ Más pequeño (antes 220px)
          },
          py: 0.5 // ✅ Menos padding vertical
        },
        // Estilos para flechas custom más pequeñas
        '& .swiper-button-prev-custom, & .swiper-button-next-custom': {
          position: 'absolute',
          top: '45%',
          transform: 'translateY(-50%)',
          width: { xs: 32, md: 40 }, // ✅ Más pequeñas (antes 40, 50)
          height: { xs: 32, md: 40 }, // ✅ Más pequeñas
          background: 'white',
          borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)', // ✅ Sombra más sutil
          border: '1px solid #e9ecef',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          opacity: 0.8, // ✅ Menos opacidad
          '&:hover': {
            opacity: 1,
            transform: 'translateY(-50%) scale(1.05)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            background: '#f8f9fa'
          },
          '&.swiper-button-disabled': {
            opacity: 0.3,
            pointerEvents: 'none'
          },
          '&::after': {
            content: 'none'
          }
        },
        '& .swiper-button-prev-custom': {
          left: { xs: -6, md: -16 }, // ✅ Menos separación
          '&::before': {
            content: '"‹"',
            fontSize: { xs: 16, md: 20 }, // ✅ Íconos más pequeños
            color: '#FF6B35',
            fontWeight: 'bold'
          }
        },
        '& .swiper-button-next-custom': {
          right: { xs: -6, md: -16 }, // ✅ Menos separación
          '&::before': {
            content: '"›"',
            fontSize: { xs: 16, md: 20 }, // ✅ Íconos más pequeños
            color: '#FF6B35',
            fontWeight: 'bold'
          }
        },
        // Estilos para paginación más pequeña
        '& .swiper-pagination-custom': {
          position: 'static',
          mt: 1, // ✅ Menos margen (antes mt: 2)
          textAlign: 'center',
          display: isMobile ? 'block' : 'none',
          '& .swiper-pagination-bullet': {
            width: '6px', // ✅ Más pequeño
            height: '6px',
            margin: '0 3px',
            borderRadius: '50%',
            background: '#e9ecef',
            opacity: 1,
            transition: 'all 0.3s ease',
            '&.swiper-pagination-bullet-active': {
              background: '#FF6B35',
              transform: 'scale(1.1)' // ✅ Menos escala
            }
          }
        }
      }}>
        
        <Swiper {...swiperConfig}>
          {categoria.map((cat, index) => (
            <SwiperSlide key={cat.categoria_id}>
              <Box sx={{
                animation: `slideIn 0.4s ease-out ${index * 0.05}s both`, // ✅ Animación más rápida
                '@keyframes slideIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(10px)', // ✅ Menos movimiento
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  }
                }
              }}>
                <CategoryCard categoria={cat} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

                
        {/* Gradientes laterales más sutiles */}
        {!isMobile && (
          <>
            <Box sx={{
              position: 'absolute',
              left: 0,
              top: 4, // ✅ Menos espacio
              bottom: 0,
              width: 60, // ✅ Más estrecho (antes 80)
              background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 5
            }} />
            
            <Box sx={{
              position: 'absolute',
              right: 0,
              top: 4, // ✅ Menos espacio
              bottom: 0,
              width: 60, // ✅ Más estrecho
              background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 5
            }} />
          </>
        )}

        {/* Flechas de navegación*/}
        <Box className="swiper-button-prev-custom" />
        <Box className="swiper-button-next-custom" />
        
        <Box className="swiper-pagination-custom" />
      </Box>

      {/* ✅ SEPARADOR más compacto */}
      <Box sx={{
        mt: { xs: 1, md: 1.5 }, // ✅ MUCHO menos margen (antes mt: { xs: 4, md: 6 })
        mb: { xs: 0.5, md: 1 }, // ✅ MUCHO menos margen (antes mb: { xs: 2, md: 3 })
        display: 'flex',
        alignItems: 'center',
        maxWidth: '600px', // ✅ Más estrecho (antes 800px)
        mx: 'auto',
        px: { xs: 4, md: 6 }
      }}>
        <Box sx={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)' // ✅ Más sutil
        }} />
        <Box sx={{
          mx: 2, // ✅ Menos separación (antes mx: 3)
          width: 6, // ✅ Más pequeño (antes 8)
          height: 6,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
          boxShadow: '0 1px 4px rgba(255,140,0,0.2)' // ✅ Sombra más sutil
        }} />
        <Box sx={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)' // ✅ Más sutil
        }} />
      </Box>
    </Box>
  );
};

export default CategorySlider;