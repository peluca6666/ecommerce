import { AppBar, Toolbar, Box, Typography, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import SearchBar from "./SearchBar";
import NavMenu from "./NavMenu";
import CartButton from "../Cart/CartDropdown.jsx";
import UserButton from "../common/UserButton.jsx";

const Header = ({ cartCount }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center',
        px: { xs: 1, sm: 2, md: 3 },
        minHeight: { xs: 56, sm: 64 }
      }}>
        
        {/* Menu hamburguesa */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Typography 
          variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
          sx={{ 
            flexGrow: 0, 
            mr: { xs: 1, sm: 2, md: 4 },
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
          }}
        >
          SaloMarket
        </Typography>

        {/* El buscador se oculta en movil*/}
        {!isMobile && (
          <SearchBar 
            onSearch={(term) => console.log('Buscar:', term)} 
            initialValue="" 
          />
        )}

        {/* Navmenu solo visible en desktop*/}
        {!isMobile && (
          <Box sx={{ display: 'flex', ml: { sm: 2, md: 4 }, gap: 2 }}>
            <NavMenu />
          </Box>
        )}

        {/* Carrito y usuario siempre visible */}
        <Box sx={{ 
          marginLeft: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 } 
        }}>
          <CartButton count={cartCount} />
          <UserButton />
        </Box>

        {/* Drawer para navegación en celular */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, //Mejora el rendimiento en celulares
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              pt: 2
            },
          }}
        >
          <List>
            <ListItem sx={{ px: 2, pb: 2 }}>
              {/* Buscador en el drawer */}
              <SearchBar 
                onSearch={(term) => {
                  console.log('Buscar:', term);
                  setDrawerOpen(false);
                }} 
                initialValue=""
              />
            </ListItem>
            <ListItem sx={{ 
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 1
            }}>
              <NavMenu 
                mobile 
                onItemClick={() => setDrawerOpen(false)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  width: '100%'
                }}
              />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>


    </AppBar>
  );
};

export default Header;