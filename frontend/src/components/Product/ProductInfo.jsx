import { useState } from 'react';
import { Box, Typography, Button, IconButton, Chip, Stack } from '@mui/material';
import { Add, Remove, ShoppingCart, FlashOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductInfo = ({ producto }) => {
  const navigate = useNavigate();
  const { addToCart } = useAuth();
  const [cantidad, setCantidad] = useState(1);

  // LÓGICA ORIGINAL EXACTA
  const handleCantidadChange = (change) => {
    setCantidad(prev => {
      const nuevaCantidad = prev + change;
      if (nuevaCantidad < 1) return 1;
      if (nuevaCantidad > producto.stock_actual) return producto.stock_actual;
      return nuevaCantidad;
    });
  };

  const handleAddToCart = async () => {
    await addToCart(producto.producto_id, cantidad);
  };

  const handleBuyNow = async () => {
    await addToCart(producto.producto_id, cantidad);
    navigate('/carrito');
  };

  const hasDiscount = producto.precio_original && producto.precio_original > producto.precio;
  const discountPercentage = hasDiscount 
    ? Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100) 
    : 0;

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Contenido superior */}
      <Stack spacing={4}>
        {/* Título */}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            lineHeight: 1.2, 
            color: '#2c3e50',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          {producto.nombre_producto}
        </Typography>

        {/* Precios con badge */}
        <Box>
          {hasDiscount && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip 
                icon={<FlashOn />}
                label={`${discountPercentage}% OFF`}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #FF4500, #FF6B35)',
                  color: 'white',
                  fontWeight: 700
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  textDecoration: 'line-through', 
                  color: '#999'
                }}
              >
                ${producto.precio_original?.toLocaleString('es-AR')}
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="h3"
            sx={{ 
              fontWeight: 800,
              color: hasDiscount ? '#FF4500' : '#2c3e50',
              lineHeight: 1,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            ${producto.precio?.toLocaleString('es-AR')}
          </Typography>
        </Box>

        {/* Descripción */}
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#6c757d',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}
        >
          {producto.descripcion}
        </Typography>

        {/* Stock */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
            Stock:
          </Typography>
          <Chip 
            label={producto.stock_actual > 0 ? `${producto.stock_actual} disponibles` : 'Sin Stock'} 
            color={producto.stock_actual > 0 ? 'success' : 'error'} 
            size="small"
            variant="outlined"
          />
        </Box>
      </Stack>

      {/* Controles inferiores */}
      <Stack spacing={3} sx={{ mt: 4 }}>
        {/* Selector de cantidad */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#495057' }}>
            Cantidad:
          </Typography>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            border: '2px solid #e9ecef',
            borderRadius: 3,
            background: 'white'
          }}>
            <IconButton 
              onClick={() => handleCantidadChange(-1)} 
              disabled={cantidad <= 1}
              size="small"
              sx={{ 
                color: '#FF6B35',
                '&:hover': { background: 'rgba(255,107,53,0.1)' },
                '&:disabled': { color: '#ccc' }
              }}
            >
              <Remove />
            </IconButton>
            
            <Typography 
              variant="h6" 
              sx={{ 
                minWidth: 50,
                textAlign: 'center',
                fontWeight: 600,
                color: '#2c3e50',
                py: 1,
                px: 2
              }}
            >
              {cantidad}
            </Typography>
            
            <IconButton 
              onClick={() => handleCantidadChange(1)} 
              disabled={cantidad >= producto.stock_actual}
              size="small"
              sx={{ 
                color: '#FF6B35',
                '&:hover': { background: 'rgba(255,107,53,0.1)' },
                '&:disabled': { color: '#ccc' }
              }}
            >
              <Add />
            </IconButton>
          </Box>
        </Box>

        {/* Botones de acción */}
        <Stack spacing={2}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleAddToCart} 
            startIcon={<ShoppingCart />}
            disabled={producto.stock_actual <= 0}
            sx={{
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(255,107,53,0.3)'
              },
              '&:disabled': {
                background: '#e9ecef',
                color: '#6c757d'
              }
            }}
          >
            Agregar al Carrito
          </Button>
          
          <Button 
            variant="outlined" 
            size="large" 
            onClick={handleBuyNow}
            disabled={producto.stock_actual <= 0}
            sx={{
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              borderColor: '#e9ecef',
              color: '#495057',
              borderWidth: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#f8f9fa',
                borderColor: '#FF6B35',
                color: '#FF6B35',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                borderColor: '#e9ecef',
                color: '#6c757d'
              }
            }}
          >
            Comprar Ahora
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProductInfo;