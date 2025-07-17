import { AppBar, Toolbar, Box, Typography, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem, Divider } from "@mui/material";
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
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
                '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: 240, 
                    pt: 2,
                    background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B35 100%)',
                    color: 'white'
                },
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
                background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B35 50%, #FF4500 100%)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(255, 140, 0, 0.3)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: 0,
                margin: 0
            }}
            elevation={0}
        >
            <Box sx={{
                width: '100%',
                maxWidth: '100%',
                margin: 0,
                padding: 0
            }}>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: { xs: 0.5, sm: 1 },
                    minHeight: { xs: 56, sm: 64 },
                    maxWidth: 'xl',
                    margin: '0 auto',
                    width: '100%',
                    px: { xs: 1, sm: 2, md: 6 }
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        flex: isMobile ? 1 : 'initial'
                    }}>
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{
                                    mr: { xs: 0.5, sm: 1 },
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography
                            variant={isSmallScreen ? "h6" : "h5"}
                            component={RouterLink}
                            to="/main"
                            sx={{
                                textDecoration: 'none',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: '700',
                                letterSpacing: { xs: '0.5px', sm: '1px' },
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                                whiteSpace: 'nowrap',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-4px',
                                    left: '50%',
                                    width: '0',
                                    height: '2px',
                                    backgroundColor: 'white',
                                    transition: 'all 0.3s ease',
                                    transform: 'translateX(-50%)',
                                    boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)'
                                },
                                '&:hover': {
                                    color: '#FFF8DC',
                                    transform: 'translateY(-1px)',
                                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                    '&:after': {
                                        width: '100%'
                                    }
                                }
                            }}
                        >
                            {isSmallScreen ? 'Salomarket' : 'S a l o m a r k e t'}
                        </Typography>
                    </Box>

                    {!isMobile && (
                        <Box sx={{ 
                            flex: 1, 
                            display: 'flex', 
                            justifyContent: 'center', 
                            px: { md: 2, lg: 4 },
                            maxWidth: '600px'
                        }}>
                            <SearchBar />
                        </Box>
                    )}

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.5, sm: 1, md: 2 },
                    }}>
                        <UserButton />
                        <CartDropdown />
                    </Box>
                </Toolbar>

                {!isMobile && (
                    <>
                        <Divider sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            my: 0
                        }} />
                        <Toolbar
                            variant="dense"
                            sx={{
                                justifyContent: 'center',
                                py: 0.5,
                                minHeight: 48,
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                maxWidth: 'xl',
                                margin: '0 auto',
                                width: '100%',
                                px: { xs: 2, sm: 4, md: 6 }
                            }}
                        >
                            <NavMenu />
                        </Toolbar>
                    </>
                )}
            </Box>
            {mobileDrawer}
        </AppBar>
    );
};

export default Header;