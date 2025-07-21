import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
    IconButton, Badge, Popover, Box, Typography, 
    Divider, Button, Stack, Chip, alpha
} from "@mui/material";
import { ShoppingCart, DeleteOutline, ShoppingBag } from "@mui/icons-material";
import { useAuth } from '../../context/AuthContext';

const CartDropdown = () => {
  const { 
    isAuthenticated, 
    cart = { count: 0, productos: [], total: 0 }, 
    showNotification,
    removeFromCart
  } = useAuth() || {};

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (!isAuthenticated) {
      showNotification('Debes estar logueado para acceder al carrito', 'warning');
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleRemove = (e, productoId) => {
    e.stopPropagation();
    e.preventDefault();
    removeFromCart(productoId);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge 
          badgeContent={cart.count} 
          sx={{ '& .MuiBadge-badge': { bgcolor: '#FF6B35', fontWeight: 'bold' } }}
        >
          <ShoppingCart />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ 
          paper: { 
            sx: { 
              width: 380, 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)' 
            } 
          } 
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ShoppingBag color="primary" />
            <Typography variant="h6" fontWeight={700}>Tu Carrito</Typography>
            {cart.count > 0 && (
              <Chip 
                label={`${cart.count} items`} 
                size="small" 
                sx={{ bgcolor: 'primary.main', color: 'white' }}
              />
            )}
          </Stack>
        </Box>

        {/* Items */}
        {cart.productos.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingBag sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography color="text.secondary">Tu carrito está vacío</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 300, overflow: 'auto', p: 1 }}>
            {cart.productos.map((producto) => {
              const imageUrl = producto.imagen 
                ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
                : 'https://via.placeholder.com/50x50?text=IMG';
              
              const precio = producto.precio_actual || 0;
              const cantidad = producto.cantidad || 0;
              const subtotal = precio * cantidad;

              return (
                <Box
                  key={producto.producto_id}
                  component={RouterLink}
                  to={`/producto/${producto.producto_id}`}
                  onClick={handleClose}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: 'inherit',
                    position: 'relative',
                    '&:hover': { 
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {/* Imagen */}
                  <img
                    src={imageUrl}
                    alt={producto.nombre_producto}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0'
                    }}
                  />

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {producto.nombre_producto}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Chip 
                        label={`${cantidad}x`} 
                        size="small" 
                        sx={{ height: 18, fontSize: '0.7rem' }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        ${precio.toLocaleString('es-AR')}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="primary" fontWeight={700}>
                      ${subtotal.toLocaleString('es-AR')}
                    </Typography>
                  </Box>

                  {/* Botón eliminar */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleRemove(e, producto.producto_id)}
                    sx={{ 
                      position: 'absolute', 
                      top: 4, 
                      right: 4,
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                      '&:hover': { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) }
                    }}
                  >
                    <DeleteOutline sx={{ fontSize: 14, color: 'error.main' }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Footer */}
        {cart.productos.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography fontWeight={600}>Total:</Typography>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  ${(cart.total || 0).toLocaleString('es-AR')}
                </Typography>
              </Stack>
              <Button
                component={RouterLink}
                to="/carrito"
                variant="contained"
                fullWidth
                onClick={handleClose}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                  '&:hover': { transform: 'translateY(-1px)' }
                }}
              >
                Ver Carrito Completo
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default CartDropdown;