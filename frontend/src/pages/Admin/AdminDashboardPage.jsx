import * as React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { mainListItems } from './listItems';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#" sx={{ textDecoration: 'none' }}>
        Mi Tienda Admin
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const drawerWidth = 280; // 👈 Más ancho para mejor UX

// 🎨 AppBar con gradiente y mejores estilos
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// 🎨 Drawer con mejor diseño
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRight: '1px solid rgba(0,0,0,0.08)',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// 🎨 Tema personalizado con mejores colores
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8fa5f3',
      dark: '#4c63d2',
    },
    secondary: {
      main: '#764ba2',
      light: '#9c7eb8',
      dark: '#5a3a7c',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(102, 126, 234, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.16)',
            },
          },
          transition: 'all 0.2s ease',
        },
      },
    },
  },
});

export default function AdminDashboardPage() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* 🎨 AppBar mejorado */}
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{ 
                  marginRight: '36px', 
                  ...(open && { display: 'none' }),
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Box>
                <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ fontWeight: 600 }}>
                  Panel de Administrador
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Gestión completa del sistema
                </Typography>
              </Box>
            </Box>

            {/* 🎨 Controles del usuario */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label="Admin" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 500
                }} 
              />
              <IconButton 
                color="inherit"
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton 
                color="inherit"
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <SettingsIcon />
              </IconButton>
              <Avatar sx={{ 
                width: 32, 
                height: 32, 
                ml: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }
              }}>
                <AccountCircleIcon />
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* 🎨 Drawer mejorado */}
        <Drawer variant="permanent" open={open}>
          {/* Header del drawer */}
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: open ? 'space-between' : 'center',
              px: [1],
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            {open && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  backgroundColor: 'rgba(255,255,255,0.2)' 
                }}>
                  MT
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1 }}>
                    Mi Tienda
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>
                    v1.0.0
                  </Typography>
                </Box>
              </Box>
            )}
            <IconButton 
              onClick={toggleDrawer}
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          
          <Divider />
          <List component="nav" sx={{ px: 1, py: 2 }}>
            {mainListItems}
            <Divider sx={{ my: 2, mx: 1 }} />
            <ListItemButton 
              component={RouterLink} 
              to="/main"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  '& .MuiListItemIcon-root': {
                    color: '#22c55e',
                  }
                }
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Volver a Main" 
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                  }
                }}
              />
            </ListItemButton>
          </List>
        </Drawer>

        {/* 🎨 Contenido principal mejorado */}
        <Box
          component="main"
          sx={{
            backgroundColor: '#f8fafc',
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Contenedor para páginas con mejor estilo */}
            <Box sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
              overflow: 'hidden',
              minHeight: 'calc(100vh - 200px)',
            }}>
              <Outlet />
            </Box>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}