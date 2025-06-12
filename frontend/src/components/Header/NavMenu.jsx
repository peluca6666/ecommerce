import { Button, Menu, MenuItem, Box, Container } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";

const NavMenu = ({ categories }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', py: 1 }}>
          <Button startIcon={<MenuIcon />} onClick={handleOpen}>
            CATEGORÍAS
          </Button>
          
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {categories.map((cat) => (
              <MenuItem key={cat.id} onClick={handleClose}>
                {cat.nombre}
              </MenuItem>
            ))}
          </Menu>

          <Button color="inherit">OFERTAS</Button>
          {/* Otros botones de navegación... */}
        </Box>
      </Container>
    </Box>
  );
};

export default NavMenu;