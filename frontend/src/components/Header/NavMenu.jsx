import { Button, Menu, MenuItem, Box, Container } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";

const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/categoria")
      .then((res) => {
        if (!res.ok) throw new Error("Respuesta no válida del servidor");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.categorias)) {
          setCategories(data.categorias);
        } else {
          console.error("La propiedad 'categorias' no es un array:", data);
          setCategories([]);
        }
      })
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

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
              <MenuItem key={cat.categoria_id} onClick={handleClose}>
                {cat.nombre}
              </MenuItem>
            ))}
          </Menu>

          <Button color="inherit">OFERTAS</Button>
          <Button color="inherit">Sobre Nosotros</Button>
          <Button color="inherit">Contacto</Button>
          <Button color="inherit">Envios y Devoluciones</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NavMenu;
