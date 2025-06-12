import { useState, useRef } from 'react';
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import CategoryCard from "./CategoryCard";

const CategorySlider = ({ categories }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    const scrollAmount = 300; // Ajusta según el ancho de tus cards

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    setScrollPosition(container.scrollLeft);
  };

  return (
    <Box sx={{ position: 'relative', px: 2 }}>
      {/* Título (opcional) */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Categorías
      </Typography>

      {/* Contenedor principal */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Botón izquierdo (solo visible si hay scroll hacia la derecha) */}
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
            gap: 3,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            py: 2,
            px: 1,
            '&::-webkit-scrollbar': { display: 'none' } // Oculta la barra de scroll
          }}
        >
          {categories.map(category => (
            <Box key={category.id} sx={{ minWidth: 200 }}> {/* Ancho fijo para cada card */}
              <CategoryCard category={category} />
            </Box>
          ))}
        </Box>

        {/* Botón derecho (solo visible si hay más contenido por scroll) */}
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