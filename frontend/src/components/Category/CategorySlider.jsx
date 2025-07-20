import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CategoryCard from "./CategoryCard";

const CategorySlider = ({ categoria }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  const checkArrows = () => {
    const container = sliderRef.current;
    if (!container) return;
    setShowLeftArrow(container.scrollLeft > 10);
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setShowRightArrow(container.scrollLeft < maxScrollLeft - 10);
  };

  useEffect(() => {
    const container = sliderRef.current;
    if (container) {
      checkArrows();
      container.addEventListener('scroll', checkArrows);
      // Resize observer para recalcular flechas
      const resizeObserver = new ResizeObserver(checkArrows);
      resizeObserver.observe(container);
      return () => {
        container.removeEventListener('scroll', checkArrows);
        resizeObserver.disconnect();
      };
    }
  }, [categoria]);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = isMobile ? 250 : 350;
      sliderRef.current.scrollBy({ 
        left: direction * scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  // Drag functionality para desktop
  const handleMouseDown = (e) => {
    if (isMobile) return;
    setIsDragging(true);
    setDragStart(e.pageX - sliderRef.current.offsetLeft);
    sliderRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isMobile) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const scroll = (x - dragStart) * 2;
    sliderRef.current.scrollLeft = sliderRef.current.scrollLeft - scroll;
    setDragStart(x);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  if (!categoria || categoria.length === 0) return null;

  return (
    <Box sx={{ 
      py: { xs: 4, md: 6 }, 
      px: { xs: 2, md: 4 },
      maxWidth: { xs: '100vw', md: '1400px' }, // Más ancho en desktop
      mx: 'auto'
    }}>
      {/* Título */}
      <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
        textAlign: 'center',
        fontWeight: 700,
        mb: { xs: 3, md: 4 },
        color: '#2c3e50',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
          borderRadius: 2,
        }
      }}>
        Nuestras Categorías
      </Typography>

      {/* Contenedor del slider */}
      <Box sx={{ position: 'relative' }}>
        
        {/* Flecha izquierda */}
        <IconButton
          onClick={() => handleScroll(-1)}
          sx={{
            position: 'absolute',
            left: isMobile ? -8 : -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: isMobile ? 40 : 50,
            height: isMobile ? 40 : 50,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            opacity: showLeftArrow ? 1 : 0,
            pointerEvents: showLeftArrow ? 'auto' : 'none',
            transition: 'all 0.3s ease',
            border: '1px solid #e9ecef',
            '&:hover': { 
              background: '#f8f9fa',
              transform: 'translateY(-50%) scale(1.05)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.15)'
            }
          }}
        >
          <ChevronLeft sx={{ color: '#FF6B35' }} />
        </IconButton>

        {/* Flecha derecha */}
        <IconButton
          onClick={() => handleScroll(1)}
          sx={{
            position: 'absolute',
            right: isMobile ? -8 : -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: isMobile ? 40 : 50,
            height: isMobile ? 40 : 50,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            opacity: showRightArrow ? 1 : 0,
            pointerEvents: showRightArrow ? 'auto' : 'none',
            transition: 'all 0.3s ease',
            border: '1px solid #e9ecef',
            '&:hover': { 
              background: '#f8f9fa',
              transform: 'translateY(-50%) scale(1.05)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.15)'
            }
          }}
        >
          <ChevronRight sx={{ color: '#FF6B35' }} />
        </IconButton>

        {/* Slider container */}
        <Box
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          sx={{
            display: 'flex',
            gap: { xs: 2, md: 3 },
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            pb: 2,
            px: { xs: 1, md: 2 },
            cursor: isMobile ? 'default' : 'grab',
            userSelect: 'none',
            // Scroll más suave en móvil
            scrollBehavior: isMobile ? 'smooth' : 'auto',
            // Ocultar scrollbar
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            // Más espacio en desktop para mostrar más categorías
            minHeight: { xs: 140, md: 180 }
          }}
        >
          {categoria.map((cat, index) => (
            <Box 
              key={cat.categoria_id} 
              sx={{ 
                scrollSnapAlign: 'center',
                flexShrink: 0,
                // Responsive sizing para mostrar diferentes cantidades
                minWidth: { 
                  xs: 'calc(50vw - 32px)', // 2 categorías visibles en móvil
                  sm: 'calc(33.33vw - 24px)', // 3 categorías en tablet
                  md: 250, // Tamaño fijo en desktop para más categorías
                  lg: 280
                },
                maxWidth: { 
                  xs: 180, // Límite máximo en móvil
                  md: 'none' 
                },
                // Animación de entrada escalonada
                animation: `slideIn 0.6s ease-out ${index * 0.1}s both`,
                '@keyframes slideIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px) scale(0.9)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                  }
                }
              }}
            >
              <CategoryCard categoria={cat} />
            </Box>
          ))}
        </Box>

        {/* Gradientes laterales para efecto fade */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 20,
          background: 'linear-gradient(to right, rgba(255,255,255,0.8), transparent)',
          pointerEvents: 'none',
          opacity: showLeftArrow ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} />
        
        <Box sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 20,
          background: 'linear-gradient(to left, rgba(255,255,255,0.8), transparent)',
          pointerEvents: 'none',
          opacity: showRightArrow ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} />
      </Box>

      {/* Indicador de scroll para móvil */}
      {isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 2, 
          gap: 0.5 
        }}>
          {Array.from({ length: Math.ceil(categoria.length / 2) }).map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: i === 0 ? '#FF6B35' : '#e9ecef',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CategorySlider;