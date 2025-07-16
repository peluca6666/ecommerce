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
                backgroundColor: 'rgba(255, 255, 255, 0.92)', // 92% opaco (más translúcido)
                backdropFilter: 'blur(12px)', // Mayor efecto de desenfoque
                color: 'black',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                backgroundImage: 'none',
                transition: 'all 0.3s ease', // Transición suave para cambios
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.96)', // Menos translúcido al hacer hover
                }
            }}
            elevation={0}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1,
                    backgroundColor: 'transparent' // Hace que el Toolbar herede la transparencia
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isMobile && (
                            <IconButton 
                                color="inherit" 
                                edge="start" 
                                onClick={handleDrawerToggle} 
                                sx={{ 
                                    mr: 1,
                                    color: 'black',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)' // Efecto hover translúcido
                                    }
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
                                background: 'linear-gradient(45deg, #FF8C00, #FF6B35, #FF4500)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                letterSpacing: '0.5px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    filter: 'brightness(1.2)'
                                }
                            }}
                        >
                            S a l o m a r k e t
                        </Typography>
                    </Box>
                    
                    {!isMobile && (
                        <Box sx={{ 
                            flex: 1, 
                            display: 'flex', 
                            justifyContent: 'center', 
                            px: 4,
                            backdropFilter: 'blur(2px)' // Efecto sutil en el área de búsqueda
                        }}>
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
                    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Divider más translúcido
                    my: 0
                }} />
            )}
            {!isMobile && (
                <Container maxWidth="xl">
                    <Toolbar
                        variant="dense"
                        sx={{
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.85)', // Segunda línea con diferente opacidad
                            py: 0,
                            backdropFilter: 'blur(8px)'
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