import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
    IconButton, Badge, Popover, Box, Typography, 
    Divider, Button, List, ListItem, ListItemAvatar, 
    ListItemText,
    useTheme 
} from "@mui/material";
import { ShoppingCart, DeleteOutline } from "@mui/icons-material";
import { useAuth } from '../../context/AuthContext';

const CartDropdown = () => {
  const { 
    isAuthenticated, 
    cart = { count: 0, productos: [], total: 0 }, 
    showNotification,
    removeFromCart
  } = useAuth() || {};
  const theme = useTheme(); 

  const [anchorEl, setAnchorEl] = useState(null);

  // abre el popover solo si está logueado, sino muestra aviso
  const handleClick = (event) => {
    if (!isAuthenticated) {
      showNotification('debes estar logueado para acceder al carrito', 'warning');
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  // cierra el popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'cart-popover' : undefined;

  // elimina un producto del carrito, evita que el clic propague
  const handleRemove = (e, productoId) => {
    e.stopPropagation();
    e.preventDefault();
    removeFromCart(productoId);
  };

  return (
    <>
      <IconButton color="inherit" aria-label="carrito" onClick={handleClick}>
        <Badge badgeContent={cart.count} color="primary">
          <ShoppingCart />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, borderRadius: 2 } } }} 
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">tu carrito</Typography>
        </Box>
        <Divider />

        {cart.productos.length === 0 ? (
          <Typography sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
            Tu carrito está vacío
          </Typography>
        ) : (
          <List dense>
            {cart.productos.map((producto) => {
               const imageUrl = producto.imagen 
                ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
                : 'https://via.placeholder.com/40x40?text=prod';


              const itemPrice = typeof producto.precio_actual === 'number' && !isNaN(producto.precio_actual) ? producto.precio_actual : 0;
              const itemQuantity = typeof producto.cantidad === 'number' && !isNaN(producto.cantidad) ? producto.cantidad : 0;
              const itemSubtotal = itemPrice * itemQuantity;

              return (
                <ListItem
                  key={producto.producto_id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={(e) => handleRemove(e, producto.producto_id)}>
                      <DeleteOutline fontSize="small" color="error" />
                    </IconButton>
                  }
                  component={RouterLink}
                  to={`/producto/${producto.producto_id}`}
                  onClick={handleClose}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { bgcolor: 'action.hover' },
                    py: 1
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 0, mr: 1.5 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '4px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${theme.palette.grey[200]}`,
                        bgcolor: theme.palette.grey[50],
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={producto.nombre_producto}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: 'inherit'
                        }}
                      />
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
                        {producto.nombre_producto}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {itemQuantity} × ${itemPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })} = $
                        {itemSubtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}

        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <span>total:</span>
            <span>${(cart.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
          </Typography>
          <Button
            component={RouterLink}
            to="/carrito"
            variant="contained"
            fullWidth
            sx={{ py: 1, fontWeight: 'bold', borderRadius: '8px' }}
            onClick={handleClose}
            disabled={cart.productos.length === 0}
          >
            Ver carrito completo
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default CartDropdown;
