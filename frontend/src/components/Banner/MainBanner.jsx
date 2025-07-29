import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from "@mui/material";
import Slider from "react-slick";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Cargar banners desde la API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banners`);
        if (response.ok) {
          const data = await response.json();
          setBanners(data.datos || []);
        }
      } catch (error) {
        console.error('Error al cargar banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: false,
    infinite: banners.length > 1,
    autoplay: banners.length > 1,
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
    sliderRef.current?.slickGoTo(index);
  };

  const nextSlide = () => {
    sliderRef.current?.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current?.slickPrev();
  };

  if (loading) {
    return (
      <Box sx={{
        width: '100vw',
        height: { xs: 260, sm: 300, md: 300 },
        position: 'relative',
        ml: 'calc(-50vw + 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        my: 3,
        mt: 2
      }}>
        <Typography>Cargando banners...</Typography>
      </Box>
    );
  }

  if (!banners.length) {
    return null; // No mostrar nada si no hay banners
  }

  return (
    <Box sx={{
      width: '100vw',
      height: { xs: 260, sm: 300, md: 300 },
      position: 'relative',
      ml: 'calc(-50vw + 50%)',
      borderRadius: 0,        
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      my: 3,
      mt: 2
    }}>
      
      <Slider ref={sliderRef} {...settings}>
        {banners.map((banner, index) => (
          <Box
            key={banner.id}
            sx={{
              position: 'relative',
              height: { xs: 280, sm: 320, md: 320 },
              display: 'flex !important',
              alignItems: 'center',
              backgroundImage: `url(${import.meta.env.VITE_API_BASE_URL}${banner.imagen})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
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
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.2rem' },
                  lineHeight: 1.2,
                  mb: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                }}
              >
                {banner.titulo}
              </Typography>

              {banner.descripcion && (
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
              )}

              {banner.boton_texto && (
                <Button
                  variant="contained"
                  color="primary"
                  href={banner.boton_link || '#'}
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
                  {banner.boton_texto}
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Slider>

      {/* Flechas - Solo mostrar si hay más de 1 banner */}
      {banners.length > 1 && (
        <>
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
              width: 20,
              height: 20,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)',
                transform: 'translateY(-50%) scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: '1.5rem' }} />
          </IconButton>

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
              width: 20,
              height: 20,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)',
                transform: 'translateY(-50%) scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        </>
      )}

      {/* Indicadores - Solo mostrar si hay más de 1 banner */}
      {banners.length > 1 && (
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
          {banners.map((_, index) => (
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
      )}
    </Box>
  );
};

export default BannerCarousel;