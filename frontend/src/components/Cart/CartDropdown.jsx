import { useState } from "react";
import { IconButton, Badge, Menu, MenuItem } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const CartDropdown = () => {

  // Si el objeto del contexto no tiene 'cart', se le asigna un valor por defecto
  const { 
    isAuthenticated = false, 
    cart = { count: 0, productos: [] }, 
    showNotification = () => {} 
  } = useAuth() || {};

  const [anchorEl, setAnchorEl] = useState(null);

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

  return (
    <>
      <IconButton color="inherit" aria-label="Carrito" onClick={handleClick}>
        <Badge badgeContent={cart.count} color="primary">
          <ShoppingCart />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {cart.productos.length === 0 ? (
          <MenuItem disabled>Tu carrito está vacío</MenuItem>
        ) : (
          cart.productos.map((producto) => (
            <MenuItem key={producto.producto_id}>
              {producto.nombre_producto} x {producto.cantidad}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default CartDropdown;