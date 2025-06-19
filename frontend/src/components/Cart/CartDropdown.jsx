import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
    IconButton, Badge, Popover, Box, Typography, 
    Divider, Button, List, ListItem, ListItemAvatar, 
    Avatar, ListItemText 
} from "@mui/material";
import { ShoppingCart, DeleteOutline } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const CartDropdown = () => {
  const { 
    isAuthenticated, 
    cart = { count: 0, productos: [], total: 0 }, 
    showNotification,
    removeFromCart
  } = useAuth() || {};

  const [anchorEl, setAnchorEl] = useState(null);

  // Abre el popover si el usuario está logueado, sino muestra aviso
  const handleClick = (event) => {
    if (!isAuthenticated) {
      showNotification('Debes estar logueado para acceder al carrito', 'warning');
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'cart-popover' : undefined;

  // Elimina un producto del carrito sin que se active el link
  const handleRemove = (e, productoId) => {
    e.stopPropagation();
    e.preventDefault(); 
    removeFromCart(productoId);
  };

  return (
    <>
      <IconButton color="inherit" aria-label="Carrito" onClick={handleClick}>
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
          <Typography variant="h6" component="div">Tu Carrito</Typography>
        </Box>
        <Divider />

        {cart.productos.length === 0 ? (
          <Typography sx={{ p: 2, color: 'text.secondary' }}>Tu carrito está vacío</Typography>
        ) : (
          <List dense>
            {cart.productos.map((producto) => (
              <ListItem
                key={producto.producto_id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={(e) => handleRemove(e, producto.producto_id)}>
                    <DeleteOutline />
                  </IconButton>
                }
                component={RouterLink}
                to={`/producto/${producto.producto_id}`}
                sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemAvatar>
                  <Avatar variant="rounded" src={producto.imagen} />
                </ListItemAvatar>
                <ListItemText
                  primary={producto.nombre_producto}
                  secondary={`Cantidad: ${producto.cantidad} - $${(producto.subtotal).toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total:</span>
            <span>${(cart.total || 0).toFixed(2)}</span>
          </Typography>
          <Button
            component={RouterLink}
            to="/carrito"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleClose}
          >
            Ir al Carrito
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default CartDropdown;
