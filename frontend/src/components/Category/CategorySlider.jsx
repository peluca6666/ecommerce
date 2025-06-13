import { useState, useRef } from 'react';
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import CategoryCard from "./CategoryCard";

const CategorySlider = ({ categoria }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef(null);



  const handleScroll = (direction) => {
    const container = sliderRef.current;
    const scrollAmount = 300;

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    setScrollPosition(container.scrollLeft);
  };

  // Si no hay categorías, mostrar mensaje
  if (!categoria || categoria.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
          Categorías
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No hay categorías disponibles
        </Typography>
      </Box>
    );
  }

  return (
 <Box
  sx={{
    position: 'relative',
    px: 2,
    py: 4,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // gris con 30% de opacidad
    borderRadius: 2,
    boxShadow: 0,
    my: 4
  }}
>
      {/* Título */}
      <Typography
    variant="h5"
    gutterBottom
    sx={{ mb: 2, fontWeight: 'bold', color: '#fffff' }}
  >
    Explora nuestras categorías
  </Typography>


      {/* Contenedor principal */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Botón izquierdo */}
        <IconButton
          onClick={() => handleScroll('left')}
          sx={{
            visibility: scrollPosition > 0 ? 'visible' : 'hidden',
            position: 'absolute',
            left: 0,
            zIndex: 1,
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ArrowBackIos />
        </IconButton>

        {/* Carrusel de categorías */}
        <Box
          ref={sliderRef}
          sx={{
            display: 'flex',
            gap: 4,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            py: 2,
            px: 1,
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          {categoria.map((cat, index) => {
            return (
              <Box key={cat.categoria_id || index} sx={{ minWidth: 200 }}> {/* Usar categoria_id */}
                <CategoryCard categoria={cat} />
              </Box>
            );
          })}
        </Box>

        {/* Botón derecho */}
        <IconButton
          onClick={() => handleScroll('right')}
          sx={{
            visibility: sliderRef.current?.scrollWidth > sliderRef.current?.clientWidth + scrollPosition ? 'visible' : 'hidden',
            position: 'absolute',
            right: 0,
            zIndex: 1,
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CategorySlider;