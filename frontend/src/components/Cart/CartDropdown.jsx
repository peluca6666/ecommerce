import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
    IconButton, Badge, Popover, Box, Typography, 
    Divider, Button, List, ListItem, ListItemAvatar, 
    ListItemText, Stack
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

  // Funcionalidad original mantenida
  const handleClick = (event) => {
    if (!isAuthenticated) {
      showNotification('debes estar logueado para acceder al carrito', 'warning');
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'cart-popover' : undefined;

  // Funcionalidad original del eliminar mantenida
  const handleRemove = (e, productoId) => {
    e.stopPropagation();
    e.preventDefault();
    removeFromCart(productoId);
  };

  return (
    <>
      {/* Botón del carrito - mejorado visualmente */}
      <IconButton 
        color="inherit" 
        aria-label="carrito" 
        onClick={handleClick}
        sx={{
          '&:hover': { transform: 'scale(1.05)' }
        }}
      >
        <Badge 
          badgeContent={cart.count} 
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#FF6B35',
              color: 'white',
              fontWeight: 'bold'
            }
          }}
        >
          <ShoppingCart />
        </Badge>
      </IconButton>

      {/* Popover mejorado */}
      <Popover
        id={id}
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
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0'
            } 
          } 
        }}
      >
        {/* Header limpio */}
        <Box sx={{ px: 3, py: 2.5, bgcolor: '#fafbfc', borderBottom: '1px solid #f0f0f0' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ShoppingBag sx={{ color: '#FF6B35', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              Tu carrito
            </Typography>
            {cart.count > 0 && (
              <Box sx={{ 
                bgcolor: '#FF6B35', 
                color: 'white', 
                px: 1, 
                py: 0.3, 
                borderRadius: 2,
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {cart.count} {cart.count === 1 ? 'item' : 'items'}
              </Box>
            )}
          </Stack>
        </Box>

        {/* Lista de productos - estructura original mantenida */}
        {cart.productos.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingBag sx={{ fontSize: 48, color: '#bdc3c7', mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#7f8c8d', mb: 0.5 }}>
              Tu carrito está vacío
            </Typography>
            <Typography variant="body2" sx={{ color: '#95a5a6' }}>
              ¡Agrega algunos productos!
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ py: 0, maxHeight: 350, overflow: 'auto' }}>
            {cart.productos.map((producto) => {
              const imageUrl = producto.imagen 
                ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
                : 'https://via.placeholder.com/60x60?text=prod';

              const itemPrice = typeof producto.precio_actual === 'number' && !isNaN(producto.precio_actual) ? producto.precio_actual : 0;
              const itemQuantity = typeof producto.cantidad === 'number' && !isNaN(producto.cantidad) ? producto.cantidad : 0;
              const itemSubtotal = itemPrice * itemQuantity;

              return (
                <ListItem
                  key={producto.producto_id}
                  component={RouterLink}
                  to={`/producto/${producto.producto_id}`}
                  onClick={handleClose}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    py: 1.5,
                    px: 2,
                    borderBottom: '1px solid #f8f9fa',
                    '&:hover': { 
                      bgcolor: '#f8f9fa'
                    },
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  {/* Avatar con imagen mejorada */}
                  <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #e9ecef',
                        bgcolor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={producto.nombre_producto}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </ListItemAvatar>

                  {/* Información del producto más clara */}
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          lineHeight: 1.3,
                          color: '#2c3e50',
                          mb: 0.5
                        }}
                      >
                        {producto.nombre_producto}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 0.5 }}>
                          {itemQuantity} × ${itemPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#FF6B35',
                            fontSize: '0.95rem'
                          }}
                        >
                          ${itemSubtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    }
                  />

                  {/* Botón eliminar más visible pero discreto */}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => handleRemove(e, producto.producto_id)}
                    sx={{
                      ml: 1,
                      bgcolor: '#fff5f5',
                      border: '1px solid #fed7d7',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        bgcolor: '#fee',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <DeleteOutline sx={{ fontSize: 16, color: '#e53e3e' }} />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        )}

        {/* Footer con total y botón */}
        {cart.productos.length > 0 && (
          <>
            <Divider sx={{ borderColor: '#f0f0f0' }} />
            <Box sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  Total:
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#FF6B35',
                    fontSize: '1.3rem'
                  }}
                >
                  ${(cart.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </Typography>
              </Stack>
              <Button
                component={RouterLink}
                to="/carrito"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: '#FF6B35',
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: '#FF4500',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
                  }
                }}
                onClick={handleClose}
                disabled={cart.productos.length === 0}
              >
                Ver carrito completo
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default CartDropdown;