import { useState, useEffect } from 'react';
import { Button, Box, Drawer, List, ListItemButton, ListItemText, Typography, Divider, IconButton, CircularProgress, Collapse } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { ExpandLess, ExpandMore, AdminPanelSettings, Close, ViewList, LocalOffer, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// --- DEFINICIÓN DE ESTILOS ---

const styles = {
    // Estilos del Drawer (Sidebar)
    drawer: {
        paper: { width: 320, borderRight: '1px solid rgba(0,0,0,0.08)' }
    },
    sidebar: {
        header: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
        },
        headerTitle: { display: 'flex', alignItems: 'center', gap: 1.5 },
        content: { p: 1.5, height: '100%', overflowY: 'auto' },
        catalogButton: {
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)', color: 'white', py: 1.5,
            borderRadius: 2, fontWeight: 600, boxShadow: '0 4px 20px rgba(255,107,107,0.3)',
            '&:hover': { background: 'linear-gradient(45deg, #FF5252, #FF7979)', transform: 'translateY(-2px)' },
        },
        listItem: {
            mb: 0.5, borderRadius: 2, transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
                background: 'rgba(0,0,0,0.04)', transform: 'translateX(4px)',
            },
        },
        loaderBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, gap: 2 },
    },
    // Estilos base para botones de navegación
    navButton: {
        color: 'black',
        textTransform: 'none', borderRadius: 2, py: 0.75, px: 1.5,
        transition: 'transform 0.2s, background-color 0.2s',
        '&:hover': { transform: 'translateY(-1px)' },
    },
    // Estilos para la vista de escritorio
    desktop: {
        adminButton: { borderColor: 'rgba(0,0,0,0.2)', color: 'text.primary', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } },
        offerButton: { color: '#c0392b', bgcolor: 'rgba(231, 76, 60, 0.1)', '&:hover': { bgcolor: 'rgba(231, 76, 60, 0.2)' } },
    },
    // Estilos para la vista móvil
    mobile: {
        container: { width: '100%', p: 1 },
        baseButton: { justifyContent: 'flex-start', width: '100%', mb: 1, py: 1.25, px: 2 },
        adminButton: { color: 'secondary.main', fontWeight: 'bold', border: '1px solid', borderColor: 'secondary.light' },
        categoryToggle: { bgcolor: 'action.hover' },
        offerButton: { background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)', color: 'white', '& .MuiSvgIcon-root': { color: 'white' } },
        listItem: { pl: 4, mb: 0.5, borderRadius: 2 },
    },
    // Estilos para el contenedor principal
    desktopNavContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
    },
    // Estilos para botones de categoría
    categoryButton: {
        whiteSpace: 'nowrap',
        textTransform: 'none',
        borderRadius: 2,
        px: 1.5,
        py: 0.75,
        color: 'text.primary',
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
            transform: 'translateY(-1px)'
        },
        transition: 'all 0.2s ease',
        minWidth: 'auto'
    },
    // Estilo para items de categoría simplificados
    simpleCategoryItem: {
        pl: 3,
        mb: 0.5,
        borderRadius: 2,
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
        }
    }
};

// --- SUB-COMPONENTES PARA MAYOR CLARIDAD ---

/** Muestra la lista de categorías simplificada */
const SimpleCategoryList = ({ categories, onItemClick, mobile = false }) => (
    <List disablePadding sx={{ mt: mobile ? 1 : 0 }}>
        {mobile && (
            <ListItemButton 
                component={RouterLink} 
                to="/productos" 
                onClick={onItemClick} 
                sx={styles.mobile.listItem}
            >
                <ListItemText primary="- Ver Todo el Catálogo" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
        )}
        {categories.map((cat) => (
            <ListItemButton
                key={cat.categoria_id}
                component={RouterLink}
                to={`/categoria/${cat.categoria_id}/productos`}
                onClick={onItemClick}
                sx={mobile ? styles.mobile.listItem : styles.simpleCategoryItem}
            >
                <ListItemText primary={`- ${cat.nombre}`} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
        ))}
    </List>
);

/** Renderiza el contenido completo del Sidebar. */
const SidebarContent = ({ loading, categories, onItemClick, onClose }) => (
    <>
        <Box sx={styles.sidebar.header}>
            <Box sx={styles.sidebar.headerTitle}>
                <MenuIcon />
                <Typography variant="h6" fontWeight={700}>Categorías</Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
        </Box>

        <Box sx={styles.sidebar.content}>
            <Button fullWidth component={RouterLink} to="/productos" onClick={onItemClick} sx={styles.sidebar.catalogButton}>
                Ver Todo el Catálogo
            </Button>
            <Divider sx={{ my: 2 }} />
            {loading ? (
                <Box sx={styles.sidebar.loaderBox}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" color="text.secondary">Cargando...</Typography>
                </Box>
            ) : (
                <SimpleCategoryList categories={categories} onItemClick={onItemClick} />
            )}
        </Box>
    </>
);

// --- COMPONENTE PRINCIPAL ---

const NavMenu = ({ mobile = false, onItemClick }) => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMobileCategories, setOpenMobileCategories] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categoria`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setCategories(data.datos.filter(cat => cat.activo));
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const createAndClose = () => {
        if (mobile) onItemClick?.();
        else setSidebarOpen(false);
    };

    // --- RENDERIZADO VISTA MÓVIL ---
    if (mobile) {
        return (
            <Box sx={styles.mobile.container}>
                {user?.rol === 'admin' && (
                    <Button component={RouterLink} to="/admin" onClick={onItemClick} startIcon={<AdminPanelSettings />} sx={{ ...styles.navButton, ...styles.mobile.baseButton, ...styles.mobile.adminButton }}>
                        Panel Admin
                    </Button>
                )}

                <Button onClick={() => setOpenMobileCategories(!openMobileCategories)} startIcon={<MenuIcon />} endIcon={openMobileCategories ? <ExpandLess /> : <ExpandMore />} sx={{ ...styles.navButton, ...styles.mobile.baseButton, ...styles.mobile.categoryToggle }}>
                    Categorías
                </Button>

                <Collapse in={openMobileCategories} timeout="auto" unmountOnExit>
                    {loading ? <CircularProgress sx={{ ml: 4, my: 2 }} size={24}/> : <SimpleCategoryList categories={categories} onItemClick={onItemClick} mobile />}
                </Collapse>

                <Button 
                    component={RouterLink} 
                    to="/productos?es_oferta=true" 
                    onClick={onItemClick} 
                    startIcon={<LocalOffer />} 
                    sx={{ ...styles.navButton, ...styles.mobile.baseButton, ...styles.mobile.offerButton }}
                >
                    OFERTAS
                </Button>
            </Box>
        );
    }

    // --- RENDERIZADO VISTA DESKTOP ---
    return (
        <Box sx={styles.desktopNavContainer}>
            {user?.rol === 'admin' && (
                <Button component={RouterLink} to="/admin" variant="outlined" sx={{ ...styles.navButton, ...styles.desktop.adminButton }}>
                    Admin
                </Button>
            )}

            <Button component={RouterLink} to="/" sx={styles.navButton}>INICIO</Button>

            <Button onClick={() => setSidebarOpen(true)} startIcon={<MenuIcon />} sx={styles.navButton}>
                Categorías
            </Button>

            <Button 
                component={RouterLink} 
                to="/productos?es_oferta=true" 
                startIcon={<LocalOffer />} 
                sx={{ ...styles.navButton, ...styles.desktop.offerButton }}
            >
                OFERTAS
            </Button>

            {!loading && categories.map((cat) => (
                <Button
                    key={cat.categoria_id}
                    component={RouterLink}
                    to={`/categoria/${cat.categoria_id}/productos`}
                    sx={styles.categoryButton}
                >
                    {cat.nombre}
                </Button>
            ))}

            <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)} slotProps={{ paper: { sx: styles.drawer.paper } }}>
                <SidebarContent loading={loading} categories={categories} onItemClick={createAndClose} onClose={() => setSidebarOpen(false)} />
            </Drawer>
        </Box>
    );
};

export default NavMenu;