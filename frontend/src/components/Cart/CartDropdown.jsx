import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { 
    IconButton, Badge, Popover, Box, Typography, 
    Divider, Button, Stack, Avatar
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
  
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClick = (event) => {
    if (!isAuthenticated) {
      showNotification('debes estar logueado para acceder al carrito', 'warning');
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const handleProductClick = (productoId) => {
    handleClose();
    navigate(`/producto/${productoId}`);
    scrollToTop();
  };

  const handleCartClick = () => {
    handleClose();
    scrollToTop();
  };

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
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              overflow: 'hidden'
            } 
          } 
        }}
      >
        {/* Header limpio con gradiente */}
        <Box sx={{ 
          p: 2.5, 
          background: 'linear-gradient(135deg, #FF6B35, #FF8C00)',
          color: 'white'
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ShoppingBag />
            <Typography variant="h6" fontWeight={700}>Tu Carrito</Typography>
            <Box sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              px: 1, 
              py: 0.3, 
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {cart.count}
            </Box>
          </Stack>
        </Box>

        {cart.productos.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingBag sx={{ fontSize: 48, color: 'grey.400', mb: 1.5 }} />
            <Typography variant="body1" color="text.secondary" mb={0.5}>
              Tu carrito está vacío
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ¡Agrega algunos productos!
            </Typography>
          </Box>
        ) : (
          <>
            {/* Lista simplificada */}
            <Box sx={{ maxHeight: 320, overflow: 'auto', py: 1 }}>
              {cart.productos.map((producto) => {
                const imageUrl = producto.imagen 
                  ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
                  : 'https://via.placeholder.com/60x60';
                
                const precio = producto.precio_actual || 0;
                const cantidad = producto.cantidad || 0;
                const subtotal = precio * cantidad;

                return (
                  <Box
                    key={producto.producto_id}
                    onClick={() => handleProductClick(producto.producto_id)}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: '1px solid #f5f5f5',
                      '&:hover': { bgcolor: '#fafafa' },
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    {/* Imagen más grande y clara */}
                    <Avatar
                      src={imageUrl}
                      variant="rounded"
                      sx={{ width: 64, height: 64 }}
                    />

                    {/* Info del producto optimizada */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap mb={0.5}>
                        {producto.nombre_producto}
                      </Typography>
                      
                      <Stack direction="row" alignItems="center" spacing={2} mb={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {cantidad}x ${precio.toLocaleString('es-AR')}
                        </Typography>
                      </Stack>
                      
                      <Typography variant="body1" color="primary" fontWeight={700}>
                        ${subtotal.toLocaleString('es-AR')}
                      </Typography>
                    </Box>

                    {/* Botón eliminar simple */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleRemove(e, producto.producto_id)}
                      sx={{ 
                        alignSelf: 'center',
                        bgcolor: 'error.50',
                        '&:hover': { bgcolor: 'error.100' }
                      }}
                    >
                      <DeleteOutline sx={{ fontSize: 18, color: 'error.main' }} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>

            {/* Footer con total y botón */}
            <Box sx={{ p: 2.5, bgcolor: '#fafbfc', borderTop: '1px solid #f0f0f0' }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={600}>Total:</Typography>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  ${(cart.total || 0).toLocaleString('es-AR')}
                </Typography>
              </Stack>
              
              <Button
                component={RouterLink}
                to="/carrito"
                variant="contained"
                fullWidth
                onClick={handleCartClick}
                sx={{
                  py: 1.2,
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