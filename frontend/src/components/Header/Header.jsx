import { AppBar, Toolbar, Box, Typography, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem, Divider, Container} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import SearchBar from "./SearchBar";
import NavMenu from "./NavMenu";
import CartDropdown from "../Cart/CartDropdown.jsx";
import UserButton from "../common/UserButton.jsx";
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

    const mobileDrawer = (
        <Drawer
            variant="temporary"
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, pt: 2 },
            }}
        >
            <List>
                <ListItem sx={{ px: 2, pb: 2 }}>
                    <SearchBar onSearch={() => setDrawerOpen(false)} />
                </ListItem>
                <ListItem sx={{ px: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                    <NavMenu mobile onItemClick={() => setDrawerOpen(false)} />
                </ListItem>
                <ListItem sx={{ px: 2, pt: 2 }}>
                    <UserButton mobile />
                </ListItem>
            </List>
        </Drawer>
    );

    return (
        <AppBar 
            position="sticky" 
            sx={{ 
  backgroundColor: 'rgba(255, 255, 255, 0.98)', // 98% opaco
  backdropFilter: 'blur(8px)', // Efecto de desenfoque
  color: 'black',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}}
            elevation={0} // Elimina la sombra por defecto
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1 // Ajuste de padding vertical
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isMobile && (
                            <IconButton 
                                color="inherit" 
                                edge="start" 
                                onClick={handleDrawerToggle} 
                                sx={{ 
                                    mr: 1,
                                    color: 'black' // Color del icono negro
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography
    variant="h5"
    component={RouterLink}
    to="/main"
    sx={{ 
        textDecoration: 'none', 
        cursor: 'pointer',
        color: '#FF8C00',
        fontFamily: '"Roboto", "Arial Black", sans-serif',
        fontWeight: 900,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        border: '2px solid #FF8C00',
        borderRadius: '8px',
        padding: '4px 12px',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#FF8C00',
            color: 'white',
            transform: 'scale(1.02)'
        }
    }}
>
    S a l o m a r k e t
</Typography>
                    </Box>
                    
                    {!isMobile && (
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 4 }}>
                            <SearchBar />
                        </Box>
                    )}

                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 1, sm: 2 },
                    }}>
                        <UserButton />
                        <CartDropdown />
                    </Box>
                </Toolbar>
            </Container>
            {!isMobile && (
                <Divider sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.12)', 
                    my: 0 // Ajuste del margen del divider
                }} />
            )}
            {!isMobile && (
                <Container maxWidth="xl">
                    <Toolbar
                        variant="dense"
                        sx={{
                            justifyContent: 'center',
                            backgroundColor: 'white', // Fondo blanco para la segunda línea
                            py: 0 // Ajuste de padding
                        }}
                    >
                        <NavMenu />
                    </Toolbar>
                </Container>
            )}
            {mobileDrawer}
        </AppBar>
    );
};

export default Header;