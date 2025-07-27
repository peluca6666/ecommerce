import { useState } from 'react';
import { Box, Typography, Button, IconButton, Chip, Stack, Alert } from '@mui/material';
import { Add, Remove, ShoppingCart, FlashOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductInfo = ({ producto }) => {
  const navigate = useNavigate();
  const { addToCart } = useAuth();
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCantidadChange = (change) => {
    setCantidad(prev => {
      const nuevaCantidad = prev + change;
      if (nuevaCantidad < 1) return 1;
      if (nuevaCantidad > producto.stock_actual) return producto.stock_actual;
      return nuevaCantidad;
    });
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addToCart(producto.producto_id, cantidad);
    } catch (error) {
      console.error('Error agregando al carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setLoading(true);
      await addToCart(producto.producto_id, cantidad);
      navigate('/carrito');
    } catch (error) {
      console.error('Error en compra directa:', error);
      setLoading(false);
    }
  };

  // Cálculos
  const hasDiscount = producto.precio_original && producto.precio_original > producto.precio;
  const discountPercentage = hasDiscount 
    ? Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100) 
    : 0;

  const isOutOfStock = !producto.stock_actual || producto.stock_actual <= 0;
  const isLowStock = producto.stock_actual > 0 && producto.stock_actual <= 5;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

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
            color: 'text.primary',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          {producto.nombre_producto}
        </Typography>

        {/* Precios */}
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
                  color: 'text.disabled',
                  fontWeight: 500
                }}
              >
                {formatPrice(producto.precio_original)}
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="h3"
            sx={{ 
              fontWeight: 800,
              color: hasDiscount ? 'error.main' : 'text.primary',
              lineHeight: 1,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            {formatPrice(producto.precio)}
          </Typography>
        </Box>

        {/* Descripción */}
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}
        >
          {producto.descripcion}
        </Typography>

        {/* Stock */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
            Stock:
          </Typography>
          <Chip 
            label={
              isOutOfStock 
                ? 'Sin Stock' 
                : isLowStock 
                  ? `¡Últimas ${producto.stock_actual} unidades!`
                  : `${producto.stock_actual} disponibles`
            } 
            color={
              isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'
            } 
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Alerta de stock bajo */}
        {isLowStock && (
          <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
            ¡Pocas unidades disponibles! Completa tu compra pronto.
          </Alert>
        )}
      </Stack>

      {/* Controles inferiores */}
      <Stack spacing={3} sx={{ mt: 4 }}>
        {/* Selector de cantidad */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Cantidad:
          </Typography>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: 3,
            background: 'background.paper'
          }}>
            <IconButton 
              onClick={() => handleCantidadChange(-1)} 
              disabled={cantidad <= 1 || loading}
              size="small"
              sx={{ 
                color: 'primary.main',
                '&:hover': { background: 'rgba(255,107,53,0.1)' },
                '&:disabled': { color: 'text.disabled' }
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
                color: 'text.primary',
                py: 1,
                px: 2
              }}
            >
              {cantidad}
            </Typography>
            
            <IconButton 
              onClick={() => handleCantidadChange(1)} 
              disabled={cantidad >= producto.stock_actual || loading}
              size="small"
              sx={{ 
                color: 'primary.main',
                '&:hover': { background: 'rgba(255,107,53,0.1)' },
                '&:disabled': { color: 'text.disabled' }
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
            disabled={isOutOfStock || loading}
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
                background: 'action.disabledBackground',
                color: 'action.disabled'
              }
            }}
          >
            {loading ? 'Agregando...' : 'Agregar al Carrito'}
          </Button>
          
          <Button 
            variant="outlined" 
            size="large" 
            onClick={handleBuyNow}
            disabled={isOutOfStock || loading}
            sx={{
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              borderWidth: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'action.hover',
                borderColor: 'primary.main',
                color: 'primary.main',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                borderColor: 'action.disabled',
                color: 'action.disabled'
              }
            }}
          >
            {loading ? 'Procesando...' : 'Comprar Ahora'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProductInfo;