import React, { useState, useEffect } from 'react';
import { Button, Box, Menu, MenuItem, CircularProgress, Divider, Collapse, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const navLinks = [
    { texto: 'OFERTAS', ruta: "/productos?es_oferta=true" },
    { texto: 'Sobre Nosotros', ruta: '/sobre-nosotros' },
    { texto: 'Contacto', ruta: '/contacto' },
];

const NavMenu = ({ mobile = false, onItemClick }) => {
    // Estados para el menú de escritorio
    const [categories, setCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);

    // Para controlar si el submenú de categorías está abierto o cerrado en móvil
    const [openMobileCategories, setOpenMobileCategories] = useState(false);

    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/categoria');
                if (!response.ok) throw new Error('Error al cargar categorías');
                const data = await response.json();
                setCategories(data.datos.filter(cat => cat.activo));
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    //Manejadores para el menu de escritorio
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => {
        setAnchorEl(null);
        if (onItemClick) onItemClick();
    };

    const handleToggleMobileCategories = () => {
        setOpenMobileCategories(!openMobileCategories);
    };

    // Renderizado para movil
    if (mobile) {
        // Estilo común para todos los botones del menú lateral
        const mobileButtonStyle = { 
            justifyContent: 'flex-start', 
            width: '100%', 
            py: 1.5, 
            px: 2,
            textAlign: 'left'
        };

        return (
            <Box sx={{ width: '100%' }}>
                {/* Botón para abrir/cerrar el acordeón de categorías */}
                <Button sx={mobileButtonStyle} onClick={handleToggleMobileCategories}>
                    <ListItemText primary="Categorías" />
                    {openMobileCategories ? <ExpandLess /> : <ExpandMore />}
                </Button>

                {/* Contenedor colapsable con la lista de categorías */}
                <Collapse in={openMobileCategories} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {/* Enlace estático a "Ver todo" con sangría */}
                        <ListItemButton sx={{ pl: 4 }} component={RouterLink} to="/productos" onClick={onItemClick}>
                            <ListItemText primary="Ver Todo el Catálogo" />
                        </ListItemButton>

                        {/* Mapeo de las categorías con sangría */}
                        {categories.map(category => (
                            <ListItemButton
                                key={category.categoria_id}
                                sx={{ pl: 4 }}
                                component={RouterLink}
                                to={`/categoria/${category.categoria_id}/productos`}
                                onClick={onItemClick}
                            >
                                <ListItemText primary={category.nombre} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                {/* Renderizamos el resto de los enlaces principales */}
                {navLinks.map((link) => (
                    <Button
                        key={link.texto}
                        color="inherit"
                        component={RouterLink}
                        to={link.ruta}
                        onClick={onItemClick}
                        sx={mobileButtonStyle}
                    >
                        {link.texto}
                    </Button>
                ))}
            </Box>
        );
    }
    
    // Renderizado para escritorio
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                color="inherit"
                onClick={handleMenuOpen}
                endIcon={<ArrowDropDownIcon />}
            >
                Categorías
            </Button>
            {navLinks.map((link) => (
                <Button key={link.texto} color="inherit" component={RouterLink} to={link.ruta}>
                    {link.texto}
                </Button>
            ))}
            <Menu
                id="categories-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem component={RouterLink} to="/productos" onClick={handleMenuClose}>
                    Ver Todo el Catálogo
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {loading ? (
                    <Box sx={{ p: 2 }}><CircularProgress size={24} /></Box>
                ) : (
                    categories.map((category, index) => (
                        <div key={category.categoria_id}>
                            <MenuItem component={RouterLink} to={`/categoria/${category.categoria_id}/productos`} onClick={handleMenuClose}>
                                {category.nombre}
                            </MenuItem>
                            {index < categories.length - 1 && <Divider />}
                        </div>
                    ))
                )}
            </Menu>
        </Box>
    );
};

export default NavMenu;