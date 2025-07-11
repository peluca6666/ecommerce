import { useState, useEffect } from 'react';
import { Button, Box, Menu, MenuItem, CircularProgress, Divider, Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// importamos el hook useAuth para acceder al contexto
import { useAuth } from '../../context/AuthContext';

const navLinks = [
    { texto: 'OFERTAS', ruta: "/productos?es_oferta=true" },
    { texto: 'Sobre Nosotros', ruta: '/sobre-nosotros' },
    { texto: 'Contacto', ruta: '/contacto' },
];

const NavMenu = ({ mobile = false, onItemClick }) => {
    // sacamos el usuario del contexto para saber si es admin
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDelay, setOpenDelay] = useState(null);
    const [openMobileCategories, setOpenMobileCategories] = useState(false);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
               const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categoria`);
                if (!response.ok) throw new Error('error al cargar categorías');
                const data = await response.json();
                setCategories(data.datos.filter(cat => cat.activo));
            } catch (error) {
                console.error("error fetching categories:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleMenuOpen = (event) => {
        if (openDelay) {
            clearTimeout(openDelay);
            setOpenDelay(null);
        }
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        const delay = setTimeout(() => {
            setAnchorEl(null);
            if (onItemClick) onItemClick();
        }, 20);
        setOpenDelay(delay);
    };

    const handleMenuEnter = () => {
        if (openDelay) {
            clearTimeout(openDelay);
            setOpenDelay(null);
        }
    };

    const handleToggleMobileCategories = () => {
        setOpenMobileCategories(!openMobileCategories);
    };

    if (mobile) {
        const mobileButtonStyle = {
            justifyContent: 'flex-start',
            width: '100%',
            py: 1.5,
            px: 2,
            textAlign: 'left'
        };

        return (
            <Box sx={{ width: '100%' }}>
                {/* mostrar botón admin en vista móvil si es admin */}
                {user && user.rol === 'admin' && (
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/admin"
                        onClick={onItemClick}
                        sx={{ ...mobileButtonStyle, color: 'secondary.main', fontWeight: 'bold' }}
                        startIcon={<AdminPanelSettingsIcon />}
                    >
                        Panel de Admin
                    </Button>
                )}

                <Button sx={mobileButtonStyle} onClick={handleToggleMobileCategories}>
                    <ListItemText primary="Categorías" />
                    {openMobileCategories ? <ExpandLess /> : <ExpandMore />}
                </Button>

                <Collapse in={openMobileCategories} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component={RouterLink} to="/productos" onClick={onItemClick}>
                            <ListItemText primary="Ver Todo el Catálogo" />
                        </ListItemButton>
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

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* mostrar botón admin en vista escritorio si es admin */}
            {user && user.rol === 'admin' && (
                <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin"
                    variant="outlined"
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    Admin
                </Button>
            )}

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
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
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
