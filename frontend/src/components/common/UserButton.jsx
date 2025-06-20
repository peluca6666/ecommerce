import  { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, MenuItem, Button, Box, Typography,  useTheme, useMediaQuery } from "@mui/material";
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
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleLogin}
          sx={{
            textTransform: 'none',
            fontWeight: 'medium',
            borderRadius: '8px',
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.light,
              borderColor: theme.palette.primary.dark,
              color: theme.palette.primary.dark,
            },
            transition: 'all 0.3s ease-in-out',
            px: 2,
            py: 0.8
          }}
        >
          Iniciar sesión
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: 'medium',
            borderRadius: '8px',
            boxShadow: theme.shadows[3],
            '&:hover': {
              boxShadow: theme.shadows[6],
              transform: 'translateY(-1px)',
              bgcolor: theme.palette.primary.dark
            },
            transition: 'all 0.3s ease-in-out',
            px: 2,
            py: 0.8
          }}
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
