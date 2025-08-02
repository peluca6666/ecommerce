import { useState, useContext } from "react";
import { useNavigate} from "react-router-dom";
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    handleCloseMenu();
    navigate("/login");
    scrollToTop();
  };

  const handleRegister = () => {
    handleCloseMenu();
    navigate("/register");
    scrollToTop();
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate("/");
    scrollToTop();
  };

  const handleProfile = () => {
    handleCloseMenu();
    navigate("/profile");
    scrollToTop();
  };

  // Estilos para botones con línea hover
  const buttonWithLineStyles = {
    textTransform: 'none', 
    fontWeight: 500,
    color: 'inherit',
    pb: 1, 
    position: 'relative',
    transition: 'all 0.3s ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: '0%',
      height: '2px',
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      transform: 'translateX(-50%)',
      boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
    },
    '&:hover': {
      transform: 'translateY(-1px)',
      '&::after': {
        width: '100%'
      }
    }
  };

  // Versión para móvil no autenticado 
  if (!isAuthenticated && isMobile) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          color="inherit"
          onClick={handleLogin}
          aria-label="Iniciar sesión"
          sx={{ 
            p: 1,
            pb: 1.5, 
            position: 'relative',
            transition: 'all 0.3s ease',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: '0%',
              height: '2px',
              backgroundColor: 'white',
              transition: 'all 0.3s ease',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
            },
            '&:hover': {
              transform: 'translateY(-1px)',
              '&::after': {
                width: '100%'
              }
            }
          }}
        >
          <Login />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={handleRegister}
          aria-label="Registrarse"
          sx={{ 
            p: 1,
            pb: 1.5, 
            position: 'relative',
            transition: 'all 0.3s ease',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: '0%',
              height: '2px',
              backgroundColor: 'white',
              transition: 'all 0.3s ease',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
            },
            '&:hover': {
              transform: 'translateY(-1px)',
              '&::after': {
                width: '100%'
              }
            }
          }}
        >
          <PersonAdd />
        </IconButton>
      </Box>
    );
  }

  // Versión para desktop no autenticado
  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={handleLogin}
          sx={buttonWithLineStyles}
        >
          Iniciar sesión  
        </Button>
        
        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            mx: 0.5
          }} 
        />
        
        <Button
          variant="text"
          color="inherit"
          onClick={handleRegister}
          sx={buttonWithLineStyles}
        >
          Registrarse 
        </Button>
      </Box>
    );
  }

  // Usuario autenticado 
  return (
    <>
      <Button
        color="inherit"
        aria-label="Mi cuenta"
        onClick={handleOpenMenu}
        sx={{
          textTransform: 'none',
          color: 'text.primary',
          fontWeight: 'medium',
          borderRadius: '20px',
          bgcolor: 'transparent',
          pb: 1.25, 
          position: 'relative',
          transition: 'all 0.3s ease',
          px: 1.5,
          py: 0.5,
          minWidth: 'auto',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '0%',
            height: '2px',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
          },
          '&:hover': {
            bgcolor: theme.palette.action.hover,
            transform: 'translateY(-1px)',
            '&::after': {
              width: '100%'
            }
          }
        }}
      >
        <AccountCircle sx={{ mr: { xs: 0, sm: 0.5 } }} />
        <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {user?.nombre || 'Mi cuenta'}
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