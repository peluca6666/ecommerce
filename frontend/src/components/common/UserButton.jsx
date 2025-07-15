import  { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, MenuItem, Button, Box, Typography,  useTheme, useMediaQuery, Divider } from "@mui/material";
import {  AccountCircle, Logout } from "@mui/icons-material";

import { AuthContext } from "../../context/AuthContext";

const UserButton = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // abre el menú desplegable
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);

  // cierra el menú desplegable
  const handleCloseMenu = () => setAnchorEl(null);

  // navega a login y cierra menú
  const handleLogin = () => {
    handleCloseMenu();
    navigate("/login");
  };

  // navega a registro y cierra menú
  const handleRegister = () => {
    handleCloseMenu();
    navigate("/register");
  };

  // cierra sesión y redirige a home
  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate("/");
  };

  // navega a perfil y cierra menú
  const handleProfile = () => {
    handleCloseMenu();
    navigate("/profile");
  };

  // si no está logueado, muestra botones de login y registro (ocultos en móvil)
 if (!isAuthenticated) {
    return (
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
                variant="text"
                color="inherit" // Usa el color del texto del contenedor (ej. negro o blanco)
                onClick={handleLogin}
                sx={{ textTransform: 'none', fontWeight: 500 }}
            >
                Iniciar sesión  
            </Button>
            
            <Divider orientation="vertical" flexItem />
            
            <Button
                variant="text"
                color="inherit"
                onClick={handleRegister}
                sx={{ textTransform: 'none', fontWeight: 500 }}
            >
               Registrarse 
            </Button>
        </Box>
    );
}

  // si está logueado, muestra botón con nombre y menú desplegable
  return (
    <>
      <Button
        color="inherit"
        aria-label="mi cuenta"
        onClick={handleOpenMenu}
        sx={{
          textTransform: 'none',
          color: 'text.primary',
          fontWeight: 'medium',
          borderRadius: '20px',
          bgcolor: 'transparent',
          '&:hover': {
            bgcolor: theme.palette.action.hover,
            transform: 'translateY(-1px)'
          },
          transition: 'all 0.3s ease-in-out',
          px: 1.5,
          py: 0.5
        }}
      >
        <AccountCircle sx={{ mr: 0.5 }} />
        <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {user?.nombre || 'mi cuenta'}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '8px',
              boxShadow: theme.shadows[6],
            }
          }
        }}
      >
        <MenuItem onClick={handleProfile} sx={{ py: 1.2, fontWeight: 'medium' }}>
          <AccountCircle sx={{ mr: 1, color: 'text.secondary' }} /> Mi perfil
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1.2, fontWeight: 'medium' }}>
          <Logout sx={{ mr: 1, color: 'error.main' }} /> Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserButton;
