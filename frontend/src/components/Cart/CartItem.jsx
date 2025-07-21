import { Box, Typography, IconButton, Avatar, Stack, Paper, Tooltip } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, DeleteOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CartItem = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useAuth();

  // URL de imagen con fallback
  const imageUrl = item.imagen 
    ? `${import.meta.env.VITE_API_BASE_URL}${item.imagen}` 
    : 'https://via.placeholder.com/80x80?text=IMG';

  // Cálculo del subtotal
  const subtotal = item.subtotal || (item.cantidad * item.precio_actual);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2,
        border: '1px solid #f0f0f0',
        borderRadius: 3,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#FF6B35',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(255,107,53,0.1)'
        }
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        
        {/* Imagen y detalles del producto */}
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          sx={{ flex: 1, minWidth: 0 }}
        >
          <Avatar
            variant="rounded"
            src={imageUrl}
            alt={item.nombre_producto}
            sx={{
              width: 80,
              height: 80,
              border: '2px solid #f5f5f5',
              '& img': { objectFit: 'cover' }
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/80x80?text=IMG';
            }}
          />
          
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to={`/producto/${item.producto_id}`}
              sx={{
                color: '#2c3e50',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                lineHeight: 1.2,
                mb: 0.5,
                display: 'block',
                '&:hover': {
                  color: '#FF6B35',
                  textDecoration: 'underline'
                }
              }}
            >
              {item.nombre_producto}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#7f8c8d',
                fontWeight: 500
              }}
            >
              ${item.precio_actual.toLocaleString('es-AR', { minimumFractionDigits: 2 })} c/u
            </Typography>
          </Box>
        </Stack>

        {/* Controles de cantidad */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 2,
          p: 0.5
        }}>
          <Tooltip title="Reducir cantidad" arrow>
            <IconButton
              size="small"
              onClick={() => updateCartItemQuantity(item.producto_id, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              sx={{
                color: item.cantidad <= 1 ? 'action.disabled' : '#FF6B35',
                '&:hover': { 
                  bgcolor: item.cantidad <= 1 ? 'transparent' : 'rgba(255,107,53,0.1)'
                }
              }}
            >
              <RemoveCircleOutline />
            </IconButton>
          </Tooltip>

          <Typography
            variant="h6"
            sx={{
              mx: 2,
              fontWeight: 700,
              minWidth: 30,
              textAlign: 'center',
              userSelect: 'none',
              color: '#2c3e50'
            }}
          >
            {item.cantidad}
          </Typography>

          <Tooltip title="Aumentar cantidad" arrow>
            <IconButton
              size="small"
              onClick={() => updateCartItemQuantity(item.producto_id, item.cantidad + 1)}
              sx={{
                color: '#FF6B35',
                '&:hover': { bgcolor: 'rgba(255,107,53,0.1)' }
              }}
            >
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Subtotal y eliminar */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800,
                color: '#FF6B35',
                fontSize: '1.3rem'
              }}
            >
              ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#95a5a6',
                display: 'block'
              }}
            >
              Subtotal
            </Typography>
          </Box>

          <Tooltip title="Eliminar producto" arrow>
            <IconButton
              onClick={() => removeFromCart(item.producto_id)}
              sx={{
                bgcolor: '#fff5f5',
                border: '1px solid #fed7d7',
                color: '#e53e3e',
                '&:hover': {
                  bgcolor: '#fee',
                  borderColor: '#fc8181',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Stack>

      </Stack>
    </Paper>
  );
};

export default CartItem;