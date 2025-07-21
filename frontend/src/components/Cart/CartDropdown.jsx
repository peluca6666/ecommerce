import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { 
    IconButton, Badge, Popover, Box, Typography, 
    Divider, Button, Stack, Card, CardContent,
    Avatar, Tooltip, Fade
} from "@mui/material";
import { 
    ShoppingCart, 
    DeleteOutline, 
    ShoppingBag, 
    Add, 
    Remove,
    ArrowForward
} from "@mui/icons-material";
import { useAuth } from '../../context/AuthContext';

const CartDropdown = () => {
  const { 
    isAuthenticated, 
    cart = { count: 0, productos: [], total: 0 }, 
    showNotification,
    removeFromCart,
    updateCartQuantity // Asumiendo que tienes esta función
  } = useAuth() || {};
  
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleClick = (event) => {
    if (!isAuthenticated) {
      showNotification('debes estar logueado para acceder al carrito', 'warning');
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoveredItem(null);
  };

  const open = Boolean(anchorEl);

  const handleProductClick = (productoId) => {
    handleClose();
    navigate(`/producto/${productoId}`);
  };

  const handleRemove = (e, productoId) => {
    e.stopPropagation();
    e.preventDefault();
    removeFromCart(productoId);
  };

  // Función para actualizar cantidad (si existe en tu contexto)
  const handleQuantityChange = (e, productoId, newQuantity) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (newQuantity === 0) {
      removeFromCart(productoId);
    } else if (updateCartQuantity) {
      updateCartQuantity(productoId, newQuantity);
    }
  };

  // Componente mejorado para cada producto
  const ProductItem = ({ producto, isHovered, onHover, onLeave }) => {
    const imageUrl = producto.imagen 
      ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
      : 'https://via.placeholder.com/80x80?text=IMG';

    const itemPrice = typeof producto.precio_actual === 'number' && !isNaN(producto.precio_actual) ? producto.precio_actual : 0;
    const itemQuantity = typeof producto.cantidad === 'number' && !isNaN(producto.cantidad) ? producto.cantidad : 0;
    const itemSubtotal = itemPrice * itemQuantity;

    return (
      <Card
        elevation={isHovered ? 4 : 1}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={() => handleProductClick(producto.producto_id)}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: isHovered ? '2px solid #FF6B35' : '2px solid transparent',
          transform: isHovered ? 'translateY(-2px)' : 'none',
          '&:hover': {
            '& .delete-button': { opacity: 1 }
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Imagen del producto */}
            <Avatar
              src={imageUrl}
              alt={producto.nombre_producto}
              variant="rounded"
              sx={{
                width: 70,
                height: 70,
                border: '2px solid #f0f0f0',
                '& img': { objectFit: 'cover' }
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/70x70?text=IMG';
              }}
            />

            {/* Información principal */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700,
                  color: '#2c3e50',
                  mb: 0.5,
                  lineHeight: 1.2
                }}
                noWrap
              >
                {producto.nombre_producto}
              </Typography>

              {/* Precio unitario */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#7f8c8d',
                  mb: 1,
                  fontSize: '0.85rem'
                }}
              >
                Precio: ${itemPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </Typography>

              {/* Control de cantidad */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#7f8c8d', minWidth: 50 }}>
                  Cantidad:
                </Typography>
                
                {updateCartQuantity ? (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleQuantityChange(e, producto.producto_id, itemQuantity - 1)}
                      disabled={itemQuantity <= 1}
                      sx={{ 
                        width: 24, 
                        height: 24,
                        bgcolor: '#f8f9fa',
                        '&:hover': { bgcolor: '#e9ecef' }
                      }}
                    >
                      <Remove sx={{ fontSize: 14 }} />
                    </IconButton>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        minWidth: 30, 
                        textAlign: 'center',
                        fontWeight: 600,
                        bgcolor: '#fff',
                        border: '1px solid #e9ecef',
                        borderRadius: 1,
                        py: 0.5
                      }}
                    >
                      {itemQuantity}
                    </Typography>
                    
                    <IconButton 
                      size="small"
                      onClick={(e) => handleQuantityChange(e, producto.producto_id, itemQuantity + 1)}
                      sx={{ 
                        width: 24, 
                        height: 24,
                        bgcolor: '#f8f9fa',
                        '&:hover': { bgcolor: '#e9ecef' }
                      }}
                    >
                      <Add sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {itemQuantity}
                  </Typography>
                )}
              </Stack>

              {/* Subtotal destacado */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800,
                  color: '#FF6B35',
                  fontSize: '1.1rem'
                }}
              >
                ${itemSubtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>

            {/* Botón eliminar */}
            <Box sx={{ alignSelf: 'flex-start' }}>
              <Tooltip title="Eliminar producto" arrow>
                <IconButton
                  className="delete-button"
                  onClick={(e) => handleRemove(e, producto.producto_id)}
                  sx={{
                    opacity: 0.6,
                    transition: 'all 0.2s ease',
                    bgcolor: '#fff0f0',
                    border: '1px solid #ffcccb',
                    width: 36,
                    height: 36,
                    '&:hover': {
                      bgcolor: '#ffe6e6',
                      transform: 'scale(1.1)',
                      opacity: 1
                    }
                  }}
                >
                  <DeleteOutline sx={{ fontSize: 18, color: '#dc3545' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Botón del carrito animado */}
      <Tooltip title="Ver carrito" arrow>
        <IconButton 
          color="inherit" 
          onClick={handleClick}
          sx={{
            position: 'relative',
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'scale(1.1)' }
          }}
        >
          <Badge 
            badgeContent={cart.count} 
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#FF6B35',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                animation: cart.count > 0 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' }
                }
              }
            }}
          >
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Popover mejorado */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
        slotProps={{ 
          paper: { 
            sx: { 
              width: 420,
              maxHeight: '80vh',
              borderRadius: 4,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              border: '1px solid #f0f0f0',
              overflow: 'hidden'
            } 
          } 
        }}
      >
        {/* Header elegante */}
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)',
          color: 'white'
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ShoppingBag sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Tu Carrito
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {cart.count} {cart.count === 1 ? 'producto' : 'productos'} • 
                ${(cart.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Contenido */}
        {cart.productos.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <ShoppingBag sx={{ fontSize: 64, color: '#bdc3c7', mb: 3 }} />
            <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
              Tu carrito está vacío
            </Typography>
            <Typography variant="body2" sx={{ color: '#95a5a6', mb: 3 }}>
              ¡Descubre nuestros productos y agrega algunos!
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                '&:hover': { 
                  bgcolor: '#FF6B35', 
                  color: 'white' 
                }
              }}
            >
              Seguir comprando
            </Button>
          </Box>
        ) : (
          <>
            {/* Lista de productos */}
            <Box sx={{ 
              maxHeight: 400, 
              overflow: 'auto', 
              p: 2,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-track': { bgcolor: '#f1f1f1', borderRadius: 3 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#FF6B35', borderRadius: 3 }
            }}>
              <Stack spacing={2}>
                {cart.productos.map((producto) => (
                  <ProductItem
                    key={producto.producto_id}
                    producto={producto}
                    isHovered={hoveredItem === producto.producto_id}
                    onHover={() => setHoveredItem(producto.producto_id)}
                    onLeave={() => setHoveredItem(null)}
                  />
                ))}
              </Stack>
            </Box>

            {/* Footer con resumen y acciones */}
            <Box sx={{ 
              p: 3, 
              bgcolor: '#fafbfc',
              borderTop: '2px solid #f0f0f0'
            }}>
              {/* Resumen */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total ({cart.count} {cart.count === 1 ? 'item' : 'items'})
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>
                    ${(cart.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Stack>

              {/* Botones de acción */}
              <Stack spacing={2}>
                <Button
                  component={RouterLink}
                  to="/carrito"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForward />}
                  onClick={handleClose}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 3,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                    boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(255,107,53,0.4)'
                    }
                  }}
                >
                  Ir al Carrito Completo
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleClose}
                  sx={{
                    py: 1,
                    borderRadius: 3,
                    borderColor: '#e9ecef',
                    color: '#6c757d',
                    '&:hover': {
                      borderColor: '#FF6B35',
                      color: '#FF6B35',
                      bgcolor: 'rgba(255,107,53,0.04)'
                    }
                  }}
                >
                  Seguir Comprando
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default CartDropdown;