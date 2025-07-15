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
            </List>
        </Drawer>
    );

    return (
        <AppBar position="sticky" color="white" elevation={1}>
            <Container maxWidth="xl">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1 }}>
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
        fontWeight: '600',
        letterSpacing: '0.5px',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            width: '0',
            height: '2px',
            backgroundColor: '#FF8C00',
            transition: 'all 0.3s ease',
            transform: 'translateX(-50%)'
        },
        '&:hover': {
            color: '#FF6B35',
            '&:after': {
                width: '100%'
            }
        }
    }}
>
    Salomarket
</Typography>
                </Box>
                
                {!isMobile && (
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 4 }}>
                         <SearchBar />
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                   <UserButton />
                  <CartDropdown />                   
                </Box>
            </Toolbar>
            </Container>
  {!isMobile && <Divider />}
            {!isMobile && (
              <Container maxWidth="xl">
                 <Toolbar 
                    variant="dense" 
                    sx={{ 
                        justifyContent: 'center',         
                        color: 'black' 
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