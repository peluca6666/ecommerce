import React, { useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import Slider from "react-slick";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Datos para cada banner
const bannerData = [
  {
    imagen: "/assets_staticos/auricularesv2.jpg",
    titulo: "Sonido Premium",
    descripcion: "Descubre auriculares de alta calidad",
    boton: "Ver Ofertas",
    link: ""
  },
  {
    imagen: "/assets_staticos/hornov2.jpg",
    titulo: "Cocina Inteligente",
    descripcion: "Electrodomésticos que facilitan tu día",
    boton: "Explorar",
    link: ""
  },
  {
    imagen: "/assets_staticos/utilesv2.jpg",
    titulo: "Vuelta a Clases",
    descripcion: "Todo lo esencial para el nuevo período",
    boton: "Comprar",
    link: ""
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
    autoplaySpeed: 5000,
    speed: 800,
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

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <Box sx={{
      maxWidth: '1200px',           // Ancho máximo del banner
      width: '100%',                // Ancho completo hasta el máximo
      height: { xs: 280, sm: 320, md: 380 }, // Alto fijo responsivo
      mx: 'auto',                   // Centrar horizontalmente
      position: 'relative',
      borderRadius: '12px',         // Bordes redondeados
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // Sombra sutil
      my: 3                         // Margen vertical
    }}>
      
      <Slider ref={sliderRef} {...settings}>
        {bannerData.map((banner, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              height: { xs: 280, sm: 320, md: 380 },
              display: 'flex !important', // Importante para que funcione con slick
              alignItems: 'center',
              // Imagen de fondo
              backgroundImage: `url(${banner.imagen})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              // Overlay oscuro para mejor legibilidad
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.35)',
                zIndex: 1,
              }
            }}
          >
            {/* Contenido del banner */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                color: 'white',
                pl: { xs: 3, md: 5 },
                pr: { xs: 3, md: 2 },
                maxWidth: { xs: '85%', md: '50%' },
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  mb: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                }}
              >
                {banner.titulo}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  opacity: 0.95,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                }}
              >
                {banner.descripcion}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                href={banner.link || '#'}
                component="a"
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: '600',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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

      {/* Flecha anterior */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 15,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: 'white',
          backdropFilter: 'blur(8px)',
          width: 44,
          height: 44,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)',
            transform: 'translateY(-50%) scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowBackIosIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>

      {/* Flecha siguiente */}
      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 15,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: 'white',
          backdropFilter: 'blur(8px)',
          width: 44,
          height: 44,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)',
            transform: 'translateY(-50%) scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>

      {/* Indicadores (dots) */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        position: 'absolute',
        bottom: 20,
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
              <FiberManualRecordIcon sx={{ fontSize: '0.7rem' }} /> :
              <FiberManualRecordOutlinedIcon sx={{ fontSize: '0.7rem' }} />
            }
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default BannerCarousel;