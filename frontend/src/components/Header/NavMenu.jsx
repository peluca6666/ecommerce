import { useState, useEffect } from 'react';
import {  Button, Box, Drawer, List, ListItemButton, ListItemText, ListItemIcon, Typography, Divider, IconButton, CircularProgress, Collapse, Badge, MenuItem} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { ExpandLess, ExpandMore, AdminPanelSettings, Category, Close, ViewList, LocalOffer, ArrowForwardIos,  Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
    { text: 'OFERTAS', path: "/productos?es_oferta=true", icon: <LocalOffer /> }
];

const styles = {
    // Estilos generales para el drawer del sidebar
    drawerPaper: { width: 350, border: 'none' },
    sidebarHeader: { 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        p: 3 
    },
    // Estilo para el botón "Ver Todo el Catálogo" en el sidebar
    catalogButton: {
        background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)', 
        color: 'white', 
        py: 2, 
        borderRadius: 3,
        textTransform: 'none', 
        fontWeight: 600, 
        boxShadow: '0 4px 20px rgba(255,107,107,0.3)',
        '&:hover': { 
            background: 'linear-gradient(45deg, #FF5252, #FF7979)', 
            transform: 'translateY(-2px)' 
        }
    },
    // Estilo base para los ítems de categoría en el sidebar 
    sidebarCategoryItem: {
        mb: 1, 
        borderRadius: 2, 
        background: 'rgba(0,0,0,0.02)',
        color: 'black', 
        '&:hover': { 
            background: 'rgba(0,0,0,0.05)', 
            color: 'black', 
            transform: 'translateX(8px)',
            '& .category-arrow': { opacity: 1, transform: 'translateX(0)' }
        },
        '& .MuiListItemIcon-root': { 
            minWidth: 40,
            '& .MuiSvgIcon-root': {
                fontSize: 22, 
                color: 'black' 
            }
        },
        '& .category-arrow': { 
            fontSize: 14, 
            opacity: 0, 
            transform: 'translateX(-10px)'
        }
    },
    // Estilo base para todos los botones de navegación (desktop y móvil)
    navButtonBase: {
        textTransform: 'none', 
        fontWeight: 600, 
        borderRadius: 2,
        color: 'black',
        '&:hover': { 
            bgcolor: 'rgba(0,0,0,0.05)', 
            transform: 'translateY(-1px)',
            color: 'black' 
        },
        '& .MuiSvgIcon-root': {
            color: 'black' 
        }
    },
    mobileButton: {
        width: '100%', 
        justifyContent: 'flex-start', 
        py: 1.5, 
        px: 2, 
        mb: 1, 
        borderRadius: 2
    }
};

const NavMenu = ({ mobile = false, onItemClick }) => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMobileCategories, setOpenMobileCategories] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Función para obtener categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categoria`);
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data = await res.json();
                setCategories(data.datos.filter(cat => cat.activo));
            } catch (err) {
                console.error("Error fetching categories:", err);
                setCategories([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Manejador para cerrar el sidebar y ejecutar el click del ítem
    const handleSidebarCloseAndClick = () => {
        setSidebarOpen(false);
        onItemClick?.(); 
    };

    // Componente interno para el Sidebar de categorías
    const CategorySidebar = () => (
        <Box sx={styles.sidebar}>
            {/* Header del Sidebar */}
            <Box sx={styles.sidebarHeader}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Aquí es donde haces el cambio */}
            <MenuIcon sx={{ fontSize: 28 }} /> 
            <Typography variant="h5" fontWeight={700}>Categorías</Typography>
        </Box>
        <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: 'white' }}>
            <Close />
        </IconButton>
    </Box>
            </Box>

            {/* Contenido del Sidebar */}
            <Box sx={{ p: 2, height: 'calc(100% - 80px)', overflow: 'auto' }}>
                <Button
                    component={RouterLink} to="/productos" onClick={handleSidebarCloseAndClick}
                    fullWidth variant="contained" size="large" sx={styles.catalogButton}
                    startIcon={<ViewList />}
                >
                    Ver Todo el Catálogo
                </Button>
                
                <Divider sx={{ my: 3 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 6, gap: 2 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" color="text.secondary">Cargando...</Typography>
                    </Box>
                ) : (
                    <List disablePadding> 
                        {categories.map((category) => (
                            <ListItemButton
                                key={category.categoria_id}
                                component={RouterLink}
                                to={`/categoria/${category.categoria_id}/productos`}
                                onClick={handleSidebarCloseAndClick}
                                sx={styles.sidebarCategoryItem} 
                            >
                                <ListItemIcon><Category /></ListItemIcon> 
                                <ListItemText primary={category.nombre} />
                                <ArrowForwardIos className="category-arrow" />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );

    // --- Vista móvil ---
    if (mobile) {
        return (
            <Box sx={{ width: '100%', p: 1 }}>
                {user?.rol === 'admin' && (
                    <Button
                        component={RouterLink} to="/admin" onClick={onItemClick}
                        sx={{ 
                            ...styles.navButtonBase, 
                            ...styles.mobileButton, 
                            color: 'secondary.main', 
                            fontWeight: 'bold', 
                            border: '1px solid', borderColor: 'secondary.main', mb: 2,
                            '& .MuiSvgIcon-root': { color: 'secondary.main' } 
                        }}
                    >
                        Panel de Admin
                    </Button>
                )}

                <Button 
                    sx={{ 
                        ...styles.navButtonBase, 
                        ...styles.mobileButton, 
                        bgcolor: 'rgba(0,0,0,0.02)', 
                        border: '1px solid rgba(0,0,0,0.08)' 
                    }} 
                    onClick={() => setOpenMobileCategories(!openMobileCategories)}
                    startIcon={<MenuItem sx={{ color: 'secondary.main' }} />} 
                    endIcon={openMobileCategories ? <ExpandLess /> : <ExpandMore />} 
                >
                    Categorías
                </Button>

                <Collapse in={openMobileCategories} timeout="auto" unmountOnExit>
                    <List sx={{ pl: 2, mt: 1 }}>
                        <ListItemButton 
                            component={RouterLink} to="/productos" onClick={onItemClick}
                            sx={{ 
                                ...styles.navButtonBase, 
                                borderRadius: 2, mb: 0.5, 
                                bgcolor: 'rgba(255,107,107,0.1)',
                                '&:hover': { bgcolor: 'rgba(255,107,107,0.2)' },
                                '& .MuiSvgIcon-root': { fontSize: 20 } 
                            }}
                        >
                            <ListItemIcon><ViewList /></ListItemIcon> 
                            <ListItemText primary="Ver Todo el Catálogo" />
                        </ListItemButton>
                        {categories.map(category => (
                            <ListItemButton
                                key={category.categoria_id}
                                component={RouterLink}
                                to={`/categoria/${category.categoria_id}/productos`}
                                onClick={onItemClick}
                                sx={{ 
                                    ...styles.navButtonBase, 
                                    borderRadius: 2, mb: 0.5,
                                    '& .MuiSvgIcon-root': { fontSize: 18 } 
                                }}
                            >
                                <ListItemIcon><Category /></ListItemIcon> 
                                <ListItemText primary={category.nombre} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                {navLinks.map((navLink) => (
                    <Button
                        key={navLink.text} component={RouterLink} to={navLink.path} onClick={onItemClick}
                        sx={{ 
                            ...styles.mobileButton, 
                            background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)', 
                            color: 'white', 
                            fontWeight: 600,
                            '& .MuiSvgIcon-root': { color: 'white' }
                        }}
                        startIcon={navLink.icon} 
                    >
                        {navLink.text}
                    </Button>
                ))}
            </Box>
        );
    }

    // --- Vista desktop ---
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user?.rol === 'admin' && (
                <Button
                    component={RouterLink} to="/admin" variant="outlined"
                    sx={{ 
                        ...styles.navButtonBase, 
                        borderColor: 'rgba(0, 0, 0, 0.5)', 
                        '&:hover': {
                            borderColor: 'black', 
                            bgcolor: 'rgba(0, 0, 0, 0.1)' 
                        }
                    }}
                >
                    Admin
                </Button>
            )}

            <Button component={RouterLink} to="/" sx={styles.navButtonBase}>INICIO</Button>

            <Button onClick={() => setSidebarOpen(true)} startIcon={<MenuIcon />} sx={styles.navButtonBase}>
    Categorías
    {categories.length > 0 && <Badge badgeContent={categories.length} color="secondary" sx={{ ml: 1 }} />}
</Button>
            <Drawer
                anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}
                sx={{ '& .MuiDrawer-paper': styles.drawerPaper }}
            >
                <CategorySidebar />
            </Drawer>
                                        
            {navLinks.map((navLink) => (
                <Button 
                    key={navLink.text} component={RouterLink} to={navLink.path} 
                    startIcon={navLink.icon}
                    sx={{ 
                        ...styles.navButtonBase,
                        background: 'linear-gradient(45deg, rgba(255,107,107,0.1), rgba(255,142,142,0.1))',
                        color: 'black', 
                        '&:hover': {
                            bgcolor: 'rgba(255,107,107,0.2)' 
                        }
                    }}
                >
                    {navLink.text}
                </Button>
            ))}
        </Box>
    );
};

export default NavMenu;