import React, { useState, useRef } from 'react';
import { Box, Paper, Typography, Button, IconButton } from "@mui/material";
import Slider from "react-slick";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';

const bannerData = [
  {
    imagen: "/images/imagenesBanner/auricularesv2.jpg",
    titulo: "Auriculares al mejor precio",
    descripcion: "Disfruta de tu música con la mejor calidad de sonido y comodidad.",
    boton: "Ver productos",
  },
  {
    imagen: "/images//imagenesBanner/hornov2.jpg",
    titulo: "Ofertas en pequeños electrodomésticos",
    descripcion: "Encuentra todo lo que necesitas para tu hogar a precios increíbles.",
    boton: "Ver ofertas",
  },
  {
    imagen: "/images/imagenesBanner/utilesv2.jpg",
    titulo: "Ofertas en útiles escolares",
    descripcion: "Todo lo que necesitas para el regreso a clases, al mejor precio.",
    boton: "Ver útiles",
  }
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', my: 6 }}>
      <Slider ref={sliderRef} {...settings}>
        {bannerData.map((banner, index) => (
          <Box 
            key={index}
            sx={{
              height: { xs: 200, md: 250 },
              backgroundImage: `url(${banner.imagen})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
               borderRadius: 10,
              position: 'relative',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2
            }}
          >
            <Paper
  elevation={0}
  sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    bgcolor: 'rgba(0, 0, 0, 0.4)', // oscuro translúcido
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    p: 3
  }}
>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {banner.titulo}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
                {banner.descripcion}
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                href={banner.link}
                component="a"
              >
                {banner.boton}
              </Button>
            </Paper>
          </Box>
        ))}
      </Slider>

      {/* Controles personalizados */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 1,
        mt: 1,
        mb: 4
      }}>
        {bannerData.map((_, index) => (
          <IconButton
            key={index}
            size="small"
            onClick={() => goToSlide(index)}
            sx={{ 
              p: 0,
              color: currentSlide === index ? 'primary.main' : 'action.disabled'
            }}
          >
            {currentSlide === index ? 
              <FiberManualRecordIcon fontSize="small" /> : 
              <FiberManualRecordOutlinedIcon fontSize="small" />
            }
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default BannerCarousel;