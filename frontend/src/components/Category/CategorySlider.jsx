import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CategoryCard from "./CategoryCard";

const CategorySlider = ({ categoria }) => {
  const theme = useTheme();
  const sliderRef = useRef(null);

  // Estados para mostrar/ocultar flechas según posición scroll
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    const container = sliderRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setShowRightArrow(container.scrollLeft < maxScrollLeft - 1);
  };

  useEffect(() => {
    const container = sliderRef.current;
    if (container) {
      checkArrows();
      container.addEventListener('scroll', checkArrows);
    }
    return () => {
      if (container) container.removeEventListener('scroll', checkArrows);
    };
  }, [categoria]);

  const handleScroll = (scrollOffset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  if (!categoria || categoria.length === 0) return null;

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold', textAlign: 'left' }}>
        Explora Nuestras Categorías
      </Typography>

      <Box sx={{ position: 'relative', width: '100%' }}>
        <Box
          ref={sliderRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            py: 2,
            '&::-webkit-scrollbar': { display: 'none' },
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          }}
        >
          {categoria.map((cat) => (
            <Box key={cat.categoria_id} sx={{ scrollSnapAlign: 'start' }}>
              <CategoryCard categoria={cat} />
            </Box>
          ))}
        </Box>

        {/* Flecha izquierda */}
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
            opacity: showLeftArrow ? 1 : 0,
            pointerEvents: showLeftArrow ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
            '&:hover': { bgcolor: 'white' }
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Flecha derecha */}
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
