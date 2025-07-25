import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import CategoryCard from "./CategoryCard";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CategorySlider = ({ categoria }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  if (!categoria || categoria.length === 0) return null;

  const swiperConfig = {
    modules: [Navigation, Pagination, Mousewheel],
    spaceBetween: isMobile ? 16 : 24,
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
        `<span class="${className}" style="background: #FF6B35; width: 8px; height: 8px;"></span>`,
    },
    breakpoints: {
      320: {
        slidesPerView: 2.2,
        spaceBetween: 12,
        centeredSlides: false,
      },
      480: {
        slidesPerView: 2.5,
        spaceBetween: 16,
        centeredSlides: false,
      },
      768: {
        slidesPerView: 3.5,
        spaceBetween: 20,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 4.5,
        spaceBetween: 24,
        centeredSlides: false,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 24,
        centeredSlides: false,
      }
    }
  };

  return (
    <Box sx={{ 
      py: { xs: 2, md: 2.5 }, 
      px: { xs: 2, md: 3 },
      maxWidth: '1400px',
      mx: 'auto',
      overflow: 'visible'
    }}>
      <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
        textAlign: 'center',
        fontWeight: 600,
        mb: { xs: 1.5, md: 2 },
        color: '#2c3e50',
        fontSize: { xs: '1.1rem', md: '1.25rem' },
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40,
          height: 2,
          background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
          borderRadius: 2,
        }
      }}>
        Categorías
      </Typography>

      <Box sx={{ 
        position: 'relative',
        '& .swiper': {
          overflow: 'visible',
          pb: isMobile ? 3 : 2,
          pt: 1.5, 
        },
        '& .swiper-wrapper': {
          ...(!isMobile && {
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
          })
        },
        '& .swiper-slide': {
          width: 'auto !important',
          minWidth: {
            xs: '140px',
            sm: '160px', 
            md: '180px',
            lg: '200px',
            xl: '220px'
          },
          py: 1
        },
        '& .swiper-button-prev-custom, & .swiper-button-next-custom': {
          position: 'absolute',
          top: '45%',
          transform: 'translateY(-50%)',
          width: { xs: 40, md: 50 },
          height: { xs: 40, md: 50 },
          background: 'white',
          borderRadius: '50%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          opacity: 0.9,
          '&:hover': {
            opacity: 1,
            transform: 'translateY(-50%) scale(1.05)',
            boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
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
          left: { xs: -8, md: -20 },
          '&::before': {
            content: '"‹"',
            fontSize: { xs: 20, md: 24 },
            color: '#FF6B35',
            fontWeight: 'bold'
          }
        },
        '& .swiper-button-next-custom': {
          right: { xs: -8, md: -20 },
          '&::before': {
            content: '"›"',
            fontSize: { xs: 20, md: 24 },
            color: '#FF6B35',
            fontWeight: 'bold'
          }
        },
        '& .swiper-pagination-custom': {
          position: 'static',
          mt: 2,
          textAlign: 'center',
          display: isMobile ? 'block' : 'none',
          '& .swiper-pagination-bullet': {
            width: '8px',
            height: '8px',
            margin: '0 4px',
            borderRadius: '50%',
            background: '#e9ecef',
            opacity: 1,
            transition: 'all 0.3s ease',
            '&.swiper-pagination-bullet-active': {
              background: '#FF6B35',
              transform: 'scale(1.2)'
            }
          }
        }
      }}>
        
        <Swiper {...swiperConfig}>
          {categoria.map((cat, index) => (
            <SwiperSlide key={cat.categoria_id}>
              <Box sx={{
                animation: `slideIn 0.6s ease-out ${index * 0.1}s both`,
                '@keyframes slideIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
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

        {!isMobile && (
          <>
            <Box sx={{
              position: 'absolute',
              left: 0,
              top: 8, 
              bottom: 0,
              width: 80,
              background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 5
            }} />
            
            <Box sx={{
              position: 'absolute',
              right: 0,
              top: 8, 
              bottom: 0,
              width: 80,
              background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 5
            }} />
          </>
        )}

        <Box className="swiper-button-prev-custom" />
        <Box className="swiper-button-next-custom" />
        
        <Box className="swiper-pagination-custom" />
      </Box>

      <Box sx={{
        mt: { xs: 2, md: 2.5 },
        mb: { xs: 1, md: 1.5 },
        display: 'flex',
        alignItems: 'center',
        maxWidth: '600px',
        mx: 'auto',
        px: { xs: 4, md: 6 }
      }}>
        <Box sx={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)'
        }} />
        <Box sx={{
          mx: 2,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
          boxShadow: '0 1px 4px rgba(255,140,0,0.2)'
        }} />
        <Box sx={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)'
        }} />
      </Box>
    </Box>
  );
};

export default CategorySlider;