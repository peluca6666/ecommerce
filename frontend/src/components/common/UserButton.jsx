import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, MenuItem, Button, Box, Typography, useTheme, useMediaQuery, Divider, IconButton } from "@mui/material";
import { AccountCircle, Logout, Login, PersonAdd } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const UserButton = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogin = () => {
    handleCloseMenu();
    navigate("/login");
  };

  const handleRegister = () => {
    handleCloseMenu();
    navigate("/register");
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate("/");
  };

  const handleProfile = () => {
    handleCloseMenu();
    navigate("/profile");
  };

  // Versión para móvil no autenticado (iconos)
  if (!isAuthenticated && isMobile) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          color="inherit"
          onClick={handleLogin}
          aria-label="Iniciar sesión"
          sx={{ p: 1 }}
        >
          <Login />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={handleRegister}
          aria-label="Registrarse"
          sx={{ p: 1 }}
        >
          <PersonAdd />
        </IconButton>
      </Box>
    );
  }

  // Versión para desktop no autenticado (texto completo)
  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="text"
          color="inherit"
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

  // Usuario autenticado (todas las pantallas)
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
          py: 0.5,
          minWidth: 'auto'
        }}
      >
        <AccountCircle sx={{ mr: { xs: 0, sm: 0.5 } }} />
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
              minWidth: '180px'
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