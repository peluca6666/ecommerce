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
    const [openDelay, setOpenDelay] = useState(null);

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

    // Manejadores para el menu de escritorio con hover
    const handleMenuOpen = (event) => {
        // Cancelar cualquier cierre pendiente
        if (openDelay) {
            clearTimeout(openDelay);
            setOpenDelay(null);
        }
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        // Retrasar el cierre para permitir el hover
        const delay = setTimeout(() => {
            setAnchorEl(null);
            if (onItemClick) onItemClick();
        }, 300); // 300ms de retraso
        setOpenDelay(delay);
    };

    const handleMenuEnter = () => {
        // Si el usuario entra al menú, cancelar el cierre
        if (openDelay) {
            clearTimeout(openDelay);
            setOpenDelay(null);
        }
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
                {/* Botón para abrir/cerrar el dropdown de catregorias */}
                <Button sx={mobileButtonStyle} onClick={handleToggleMobileCategories}>
                    <ListItemText primary="Categorías" />
                    {openMobileCategories ? <ExpandLess /> : <ExpandMore />}
                </Button>

                {/* Contenedor colapsable con la lista de categorías */}
                <Collapse in={openMobileCategories} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {/* Enlace estático a "ver todo" */}
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
            <Box 
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
            >
                <Button
                    color="inherit"
                    endIcon={<ArrowDropDownIcon />}
                >
                    Categorías
                </Button>
                <Menu
                    id="categories-menu"
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    slotProps={{
                        list: {
                            onMouseEnter: handleMenuEnter,
                            onMouseLeave: handleMenuClose,
                            style: { pointerEvents: 'auto' }
                        },
                        paper: {
                            style: {
                                marginTop: '8px', 
                                pointerEvents: 'auto',
                            },
                            onMouseEnter: handleMenuEnter,
                            onMouseLeave: handleMenuClose,
                        }
                    }}
                    // Estilos para que el menú aparezca justo debajo del botón sin espacio
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    // Deshabilitar el cierre al hacer click fuera
                    disableAutoFocusItem
                    disableEnforceFocus
                    disableAutoFocus
                    keepMounted
                >
                    <MenuItem 
                        component={RouterLink} 
                        to="/productos" 
                        onClick={handleMenuClose}
                        dense
                    >
                        Ver Todo el Catálogo
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    {loading ? (
                        <Box sx={{ p: 2 }}><CircularProgress size={24} /></Box>
                    ) : (
                        categories.map((category, index) => (
                            <div key={category.categoria_id}>
                                <MenuItem 
                                    component={RouterLink} 
                                    to={`/categoria/${category.categoria_id}/productos`} 
                                    onClick={handleMenuClose}
                                    dense
                                >
                                    {category.nombre}
                                </MenuItem>
                                {index < categories.length - 1 && <Divider />}
                            </div>
                        ))
                    )}
                </Menu>
            </Box>
            {navLinks.map((link) => (
                <Button key={link.texto} color="inherit" component={RouterLink} to={link.ruta}>
                    {link.texto}
                </Button>
            ))}
        </Box>
    );
};

export default NavMenu;