import { AppBar, Toolbar, Box, Typography, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem } from "@mui/material";
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

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: 1, sm: 2, md: 3 },
          minHeight: { xs: 56, sm: 64 }
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h5"
          component={RouterLink}
          to="/main"
          sx={{
            flexGrow: { xs: 1, md: 0 },
            mr: { md: 4 },
            textDecoration: 'none',
            color: '#FF8C00',
            cursor: 'pointer',
          }}
        >
          Salomarket
        </Typography>

        {!isMobile && <SearchBar onSearch={(term) => console.log('buscar:', term)} />}

        {!isMobile && (
          <Box sx={{ display: 'flex', ml: 'auto', gap: 2 }}>
            <NavMenu />
          </Box>
        )}

        <Box
          sx={{
            marginLeft: isMobile ? 0 : 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
          }}
        >
          <CartDropdown />
          <UserButton />
        </Box>

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
            },
          }}
        >
          <List>
            <ListItem sx={{ px: 2, pb: 2 }}>
              <SearchBar
                onSearch={(term) => {
                  console.log('buscar:', term);
                  setDrawerOpen(false);
                }}
                initialValue=""
              />
            </ListItem>
            <ListItem
              sx={{
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 1,
              }}
            >
              <NavMenu
                mobile
                onItemClick={() => setDrawerOpen(false)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  width: '100%',
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
