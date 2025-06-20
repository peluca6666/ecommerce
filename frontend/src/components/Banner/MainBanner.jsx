import React, { useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import Slider from "react-slick";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const PAGE_BACKGROUND_COLOR = '#ffffff';

const bannerData = [
  {
    imagen: "/images/imagenesBanner/auricularesv2.jpg",
    titulo: "Sonido Premium",
    descripcion: "Descubre auriculares de alta calidad",
    boton: "Ver Ofertas",
    link: "/productos/auriculares"
  },
  {
    imagen: "/images/imagenesBanner/hornov2.jpg",
    titulo: "Cocina Inteligente",
    descripcion: "Electrodomésticos que facilitan tu día",
    boton: "Explorar",
    link: "/ofertas/electrodomesticos"
  },
  {
    imagen: "/images/imagenesBanner/utilesv2.jpg",
    titulo: "Vuelta a Clases",
    descripcion: "Todo lo esencial para el nuevo período",
    boton: "Comprar",
    link: "/ofertas/utiles-escolares"
  }
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const theme = useTheme();

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setCurrentSlide(next),
    pauseOnHover: true,
    cssEase: "ease-in-out"
  };

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  return (
    <Box sx={{
      width: '100vw',
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)',
      overflow: 'hidden',
      // Reducir margen para menos invasividad
      mt: { xs: 0, md: -2 }
    }}>
      <Slider ref={sliderRef} {...settings}>
        {bannerData.map((banner, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',        
              height: { xs: 320, sm: 380, md: 420 },
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${banner.imagen})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%',
                filter: 'brightness(0.75)',
                transition: 'filter 0.5s ease',
                maskImage: 'linear-gradient(to bottom, black 40%, rgba(0,0,0,0.7) 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 40%, rgba(0,0,0,0.7) 70%, transparent 100%)',
              },
              '&:hover::before': {
                filter: 'brightness(0.65)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '50%', 
                background: `linear-gradient(to top, ${PAGE_BACKGROUND_COLOR} 0%, rgba(240,240,240,0.8) 30%, transparent 100%)`,
                pointerEvents: 'none',
                zIndex: 1,
              }
            }}
          >
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' },
                color: 'white',
                p: { xs: 2, md: 4 },
                maxWidth: { xs: '85%', md: '45%' },
                ml: { xs: 0, md: 4 }, // Posicionar a la izquierda en desktop
                mb: { xs: '15%', md: '8%' }
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: '700',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, 
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {banner.titulo}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 2, md: 3 },
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  opacity: 0.95,
                  maxWidth: '280px' // Limitar ancho para mejor lectura
                }}
              >
                {banner.descripcion}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href={banner.link || '#'}
                component="a"
                size="medium"
                sx={{
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  borderRadius: '25px',
                  fontWeight: '600',
                  textTransform: 'none', 
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  boxShadow: `0px 4px 8px ${theme.palette.primary.dark}30`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0px 6px 12px ${theme.palette.primary.dark}40`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {banner.boton}
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        position: 'absolute',
        bottom: { xs: 15, md: 25 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3
      }}>
        {bannerData.map((_, index) => (
          <IconButton
            key={index}
            size="small"
            onClick={() => goToSlide(index)}
            sx={{
              p: 0.5,
              color: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'rgba(255,255,255,0.8)',
                transform: 'scale(1.1)',
              }
            }}
          >
            {currentSlide === index ?
              <FiberManualRecordIcon sx={{ fontSize: '0.8rem' }} /> :
              <FiberManualRecordOutlinedIcon sx={{ fontSize: '0.8rem' }} />
            }
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default BannerCarousel;