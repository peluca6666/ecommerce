import { useState } from 'react';
import { Box, Typography, Button, Divider, IconButton, Chip, Stack } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductInfo = ({ producto }) => {
  const navigate = useNavigate();
  const { addToCart } = useAuth();
  const [cantidad, setCantidad] = useState(1);

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
    <Stack spacing={3}>
      {/* Título */}
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontWeight: 700,
          lineHeight: 1.2, 
          color: '#2c3e50'
        }}
      >
        {producto.nombre_producto}
      </Typography>

      {/* Precios */}
      <Box>
        {hasDiscount && (
          <Typography 
            variant="h6" 
            sx={{ 
              textDecoration: 'line-through', 
              color: '#999',
              mb: 0.5
            }}
          >
            ${producto.precio_original?.toLocaleString('es-AR')}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography 
            variant="h3"
            sx={{ 
              fontWeight: 800,
              color: hasDiscount ? '#FF4500' : '#2c3e50',
              lineHeight: 1
            }}
          >
            ${producto.precio?.toLocaleString('es-AR')}
          </Typography>
          {hasDiscount && (
            <Chip 
              label={`${discountPercentage}% OFF`}
              sx={{
                background: 'linear-gradient(135deg, #FF4500, #FF6B35)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                height: 40
              }}
            />
          )}
        </Box>
      </Box>

      <Divider />

      {/* Descripción */}
      <Typography 
        variant="body1" 
        sx={{ 
          whiteSpace: 'pre-wrap',
          color: '#495057',
          lineHeight: 1.7,
          fontSize: '1.1rem'
        }}
      >
        {producto.descripcion}
      </Typography>

      <Divider />

      {/* Stock */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
            Disponibilidad:
          </Typography>
          <Chip 
            label={producto.stock_actual > 0 ? `En Stock (${producto.stock_actual})` : 'Sin Stock'} 
            color={producto.stock_actual > 0 ? 'success' : 'error'} 
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      <Divider />

      {/* Selector de cantidad */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
          Cantidad:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => handleCantidadChange(-1)} 
            disabled={cantidad <= 1}
            sx={{ 
              border: '2px solid #e9ecef',
              borderRadius: 2,
              width: 48,
              height: 48,
              color: '#FF6B35',
              '&:hover': { 
                borderColor: '#FF6B35',
                background: 'rgba(255,107,53,0.1)'
              },
              '&:disabled': {
                borderColor: '#e9ecef',
                color: '#ccc'
              }
            }}
          >
            <RemoveCircleOutline />
          </IconButton>
          
          <Typography 
            variant="h5" 
            sx={{ 
              minWidth: 60,
              textAlign: 'center',
              fontWeight: 700,
              color: '#2c3e50',
              py: 1,
              px: 2,
              border: '2px solid #e9ecef',
              borderRadius: 2,
              background: '#f8f9fa'
            }}
          >
            {cantidad}
          </Typography>
          
          <IconButton 
            onClick={() => handleCantidadChange(1)} 
            disabled={cantidad >= producto.stock_actual}
            sx={{ 
              border: '2px solid #e9ecef',
              borderRadius: 2,
              width: 48,
              height: 48,
              color: '#FF6B35',
              '&:hover': { 
                borderColor: '#FF6B35',
                background: 'rgba(255,107,53,0.1)'
              },
              '&:disabled': {
                borderColor: '#e9ecef',
                color: '#ccc'
              }
            }}
          >
            <AddCircleOutline />
          </IconButton>
        </Box>
      </Box>

      {/* Botones de acción */}
      <Stack spacing={2} sx={{ pt: 2 }}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleAddToCart} 
          startIcon={<ShoppingCart />}
          disabled={producto.stock_actual <= 0}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 700,
            borderRadius: 3,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
            boxShadow: '0 4px 15px rgba(255,140,0,0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(255,107,53,0.5)'
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
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 3,
            textTransform: 'none',
            borderColor: '#FF6B35',
            color: '#FF6B35',
            borderWidth: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255,107,53,0.1)',
              borderColor: '#FF4500',
              color: '#FF4500',
              transform: 'translateY(-2px)'
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
  );
};

export default ProductInfo;