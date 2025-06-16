import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material"; // Usaremos estos iconos, son más estándar
import CategoryCard from "./CategoryCard";

const CategorySlider = ({ categoria }) => {
  const theme = useTheme();
  const sliderRef = useRef(null);

  // Estados para controlar la visibilidad de las flechas 
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // FUNCIÓN PARA VERIFICAR LA POSICIÓN DEL SCROLL Y MOSTRAR/OCULTAR FLECHAS 
  const checkArrows = () => {
    const container = sliderRef.current;
    if (!container) return;

    // Mostrar flecha izquierda si no estamos al principio
    setShowLeftArrow(container.scrollLeft > 0);

    // Mostrar flecha derecha si todavía hay contenido por ver a la derecha
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setShowRightArrow(container.scrollLeft < maxScrollLeft - 1); // -1 para precisión de píxeles
  };

  // Usamos useEffect para agregar y limpiar el listener del evento de scroll 
  useEffect(() => {
    const container = sliderRef.current;
    if (container) {
      checkArrows(); // Verificamos el estado inicial
      container.addEventListener('scroll', checkArrows);
    }

    // Función de limpieza para evitar fugas de memoria
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkArrows);
      }
    };
  }, [categoria]); // Se vuelve a ejecutar si las categorías cambian

  const handleScroll = (scrollOffset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  if (!categoria || categoria.length === 0) {
    return null; // Si no hay categorías, no renderizamos nada
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold', textAlign: 'left' }}>
        Explora Nuestras Categorías
      </Typography>

      <Box sx={{ position: 'relative', width: '100%' }}>

        {/* Contenido del carousel */}
        <Box
          ref={sliderRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            py: 2,
            '&::-webkit-scrollbar': { display: 'none' },
            // Gradientes en los extremos para un efecto "fade-out"
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          }}
        >
          {categoria.map((cat) => (
            <Box key={cat.categoria_id} sx={{ scrollSnapAlign: 'start' }}>
              <CategoryCard categoria={cat} />
            </Box>
          ))}
        </Box>

        {/* Botones de navegacion*/}
        <IconButton
          onClick={() => handleScroll(-300)}
          sx={{
            position: 'absolute',
            left: -16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${theme.palette.divider}`,
            // Lógica de transición para fade-in/out
            opacity: showLeftArrow ? 1 : 0,
            pointerEvents: showLeftArrow ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
            '&:hover': { bgcolor: 'white' }
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={() => handleScroll(300)}
          sx={{
            position: 'absolute',
            right: -16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${theme.palette.divider}`,
            // Lógica de transición para fade-in/out
            opacity: showRightArrow ? 1 : 0,
            pointerEvents: showRightArrow ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
            '&:hover': { bgcolor: 'white' }
          }}
        >
          <ChevronRight />
        </IconButton>

      </Box>
    </Box>
  );
};

export default CategorySlider;