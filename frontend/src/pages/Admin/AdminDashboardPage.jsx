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
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems } from './listItems';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#" sx={{ textDecoration: 'none' }}>
        Mi Tienda
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const drawerWidth = 260;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#ffffff',
  color: '#1a1a1a',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  borderBottom: '1px solid #e5e5e5',
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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      backgroundColor: '#fafafa',
      borderRight: '1px solid #e0e0e0',
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

const cleanTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 12px',
          paddingLeft: 16,
          paddingRight: 16,
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
          '&.Mui-selected': {
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            '& .MuiListItemIcon-root': {
              color: '#0369a1',
            },
            '&:hover': {
              backgroundColor: '#e0f2fe',
            },
          },
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
    <ThemeProvider theme={cleanTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ 
                marginRight: '36px', 
                ...(open && { display: 'none' }),
                color: '#6b7280'
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Panel de Administrador
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <IconButton onClick={toggleDrawer} sx={{ color: '#6b7280' }}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          
          <List component="nav" sx={{ pt: 2 }}>
            {mainListItems}
            <Divider sx={{ my: 2, mx: 2 }} />
            <ListItemButton component={RouterLink} to="/main">
              <ListItemIcon sx={{ color: '#6b7280' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Volver a Main" />
            </ListItemButton>
          </List>
        </Drawer>

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
          <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
            <Box sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e5e5',
              minHeight: 'calc(100vh - 180px)',
              p: 3,
            }}>
              <Outlet />
            </Box>
            <Copyright sx={{ pt: 3 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}