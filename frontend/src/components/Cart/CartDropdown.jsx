import { useState, useEffect, useContext } from "react";
import { IconButton, Badge, Menu, MenuItem, Snackbar, Alert, Box, Typography } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext"; // Ajusta la ruta según dónde esté tu contexto

const CartDropdown = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  // Abrir dropdown (si está logueado, carga el carrito y abre el menú, si no alerta)
  const handleClick = (event) => {
    if (!isAuthenticated) {
      setAlertOpen(true);
      return;
    }
    setAnchorEl(event.currentTarget);
    fetchCarrito();
  };

  // Cerrar dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Cerrar alerta
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Función para traer productos del carrito desde backend
  const fetchCarrito = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/carrito", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al cargar el carrito");
      const data = await res.json();
      setCarrito(data.carrito || []); // ajusta según la estructura que devuelve tu backend
    } catch (error) {
      console.error(error);
      setCarrito([]);
    }
  };

  // Contar productos para el badge
  const productCount = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <>
      <IconButton color="inherit" aria-label="Carrito" onClick={handleClick}>
        <Badge badgeContent={productCount} color="primary">
          <ShoppingCart />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {carrito.length === 0 ? (
          <MenuItem disabled>Tu carrito está vacío</MenuItem>
        ) : (
          carrito.map((producto) => (
            <MenuItem key={producto.id}>
              {producto.nombre} x {producto.cantidad}
            </MenuItem>
          ))
        )}
      </Menu>

      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleAlertClose} severity="warning" sx={{ width: '100%' }}>
          Debes estar logueado para acceder al carrito
        </Alert>
      </Snackbar>
    </>
  );
};

export default CartDropdown;
