import React, { useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import Slider from "react-slick";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Color de fondo que se usa en el degradado del banner
export const PAGE_BACKGROUND_COLOR = '#ffffff';

// Datos para cada banner: imagen, texto y botón
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
  // Estado para guardar qué slide está activo ahora
  const [currentSlide, setCurrentSlide] = useState(0);

  // Referencia para controlar el slider (avanzar, retroceder, ir a un slide)
  const sliderRef = useRef(null);

  // Tema para usar colores definidos en Material UI
  const theme = useTheme();

  // Configuración para el slider react-slick
  const settings = {
    dots: false,             // No mostrar dots por defecto (hacemos personalizados)
    infinite: true,          // Loop infinito
    autoplay: true,          // Que avance solo
    autoplaySpeed: 6000,     // Cada 6 segundos
    speed: 1000,             // Duración animación 1 segundo
    slidesToShow: 1,         // Mostrar un slide a la vez
    slidesToScroll: 1,       // Avanzar un slide por vez
    arrows: false,           // No mostrar flechas por defecto (las hacemos aparte)
    beforeChange: (current, next) => setCurrentSlide(next), // Guardar slide activo
    pauseOnHover: true,      // Pausar autoplay al pasar mouse
    cssEase: "ease-in-out"   // Suavizar animación
  };

  // Función para ir a un slide específico (usada por los dots)
  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  // Funciones para avanzar y retroceder slide con flechas
  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <Box sx={{
      width: '100vw',          // Ancho completo de la ventana
      position: 'relative',
      left: '50%',             // Centrar con transform
      transform: 'translateX(-50%)',
      overflow: 'hidden',      // Ocultar scroll horizontal
      mt: { xs: 0, md: -2 }    // Margen arriba pequeño en desktop
    }}>
      {/* Slider principal */}
      <Slider ref={sliderRef} {...settings}>
        {bannerData.map((banner, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',        
              height: { xs: 320, sm: 380, md: 420 }, // Altura según pantalla
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // Imagen de fondo con brillo y máscara degradada
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
                filter: 'brightness(0.75)', // Oscurecer un poco
                transition: 'filter 0.5s ease',
                maskImage: 'linear-gradient(to bottom, black 40%, rgba(0,0,0,0.7) 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 40%, rgba(0,0,0,0.7) 70%, transparent 100%)',
              },
              '&:hover::before': {
                filter: 'brightness(0.65)', // Más oscuro al hover
              },
              // Degradado blanco abajo para suavizar el borde
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
            {/* Contenedor del texto y botón */}
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
                ml: { xs: 0, md: 4 },  // Margen a la izquierda en desktop
                mb: { xs: '15%', md: '8%' }
              }}
            >
              {/* Título grande */}
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: '700',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', // sombra para texto legible
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, 
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {banner.titulo}
              </Typography>

              {/* Descripción pequeña */}
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 2, md: 3 },
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)', // sombra texto para contraste
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  opacity: 0.95,
                  maxWidth: '280px' // ancho máximo para que no quede tan ancho
                }}
              >
                {banner.descripcion}
              </Typography>

              {/* Botón principal */}
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

      {/* Botón flecha para ir al slide anterior */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: { xs: 10, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-50%) scale(1.1)',
          },
          transition: 'all 0.2s ease',
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 },
        }}
      >
        <ArrowBackIosIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
      </IconButton>

      {/* Botón flecha para ir al siguiente slide */}
      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: { xs: 10, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-50%) scale(1.1)',
          },
          transition: 'all 0.2s ease',
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
      </IconButton>

      {/* Contenedor para los dots (indicadores de slide) */}
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
        {/* Mapeo para crear un dot por slide */}
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
            {/* Icono lleno si está activo, outlined si no */}
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
