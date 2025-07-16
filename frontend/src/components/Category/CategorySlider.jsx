import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CategoryCard from "./CategoryCard";

const CategorySlider = ({ categoria }) => {
  const theme = useTheme();
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // chequea si mostrar flechas según scroll actual
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

  // mueve el scroll horizontalmente con animación smooth
  const handleScroll = (scrollOffset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  if (!categoria || categoria.length === 0) return null;

  return (
    <Box
      sx={{
        mt: { xs: 3, sm: 4, md: 5 },
        position: 'relative',
        zIndex: 2,
        maxWidth: 'lg',
        mx: 'auto',
        px: { xs: 2, md: 0 },
      }}
    >
      {/* Título con gradiente sutil */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: 'text.primary',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 3,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            borderRadius: 2,
          }
        }}
      >
        Explora nuestras categorías
      </Typography>

      {/* Contenedor principal con fondo mejorado */}
      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            zIndex: 1,
          }
        }}
      >
        <Box
          ref={sliderRef}
          sx={{
            display: 'flex',
            gap: { xs: 2, md: 3 },
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            py: 2,
            px: 1,
            justifyContent: { xs: 'flex-start', md: 'center' },
            '&::-webkit-scrollbar': { 
              display: 'none' 
            },
            maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            // Animación sutil al hacer scroll
            transition: 'all 0.3s ease',
          }}
        >
          {categoria.map((cat, index) => (
            <Box 
              key={cat.categoria_id} 
              sx={{ 
                scrollSnapAlign: 'start', 
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                // Animación escalonada al cargar
                animation: `slideInFromBottom 0.6s ease-out ${index * 0.1}s both`,
                '@keyframes slideInFromBottom': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  }
                }
              }}
            >
              <CategoryCard categoria={cat} />
            </Box>
          ))}
        </Box>

        {/* Flechas con diseño mejorado */}
        <IconButton
          onClick={() => handleScroll(-200)}
          sx={{
            position: 'absolute',
            left: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: `2px solid ${theme.palette.divider}`,
            opacity: showLeftArrow ? 1 : 0,
            pointerEvents: showLeftArrow ? 'auto' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
              transform: 'translateY(-50%) scale(1.05)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              borderColor: theme.palette.primary.main,
            },
            '&:active': {
              transform: 'translateY(-50%) scale(0.95)',
            }
          }}
        >
          <ChevronLeft sx={{ fontSize: 24, color: theme.palette.primary.main }} />
        </IconButton>

        <IconButton
          onClick={() => handleScroll(200)}
          sx={{
            position: 'absolute',
            right: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: `2px solid ${theme.palette.divider}`,
            opacity: showRightArrow ? 1 : 0,
            pointerEvents: showRightArrow ? 'auto' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
              transform: 'translateY(-50%) scale(1.05)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              borderColor: theme.palette.primary.main,
            },
            '&:active': {
              transform: 'translateY(-50%) scale(0.95)',
            }
          }}
        >
          <ChevronRight sx={{ fontSize: 24, color: theme.palette.primary.main }} />
        </IconButton>

        {/* Indicadores de scroll decorativos */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: showLeftArrow ? 'primary.main' : 'grey.300',
              transition: 'all 0.3s ease',
              opacity: 0.7,
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: showRightArrow ? 'primary.main' : 'grey.300',
              transition: 'all 0.3s ease',
              opacity: 0.7,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CategorySlider;