import { useState, useEffect } from 'react';
import { Button, Box, Drawer, List, ListItemButton, ListItemText, ListItemIcon, Typography, Divider, IconButton, CircularProgress, Collapse, Badge } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { ExpandLess, ExpandMore, AdminPanelSettings, Category, Close, ViewList, LocalOffer, ArrowForwardIos, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// --- DEFINICIÓN DE DATOS Y ESTILOS ---

const navLinks = [
    { text: 'OFERTAS', path: "/productos?es_oferta=true", icon: <LocalOffer /> }
];

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
                '& .category-arrow': { opacity: 1 },
            },
        },
        listItemIcon: { minWidth: 38, color: 'text.secondary' },
        arrowIcon: { opacity: 0, transition: 'opacity 0.2s', fontSize: '1rem', color: 'text.secondary' },
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
    }
};

// --- SUB-COMPONENTES PARA MAYOR CLARIDAD ---

/** Muestra la lista de categorías, adaptable para sidebar o móvil. */
const CategoryList = ({ categories, onItemClick, mobile = false }) => (
    <List disablePadding sx={{ mt: mobile ? 1 : 0 }}>
        {mobile && (
             <ListItemButton component={RouterLink} to="/productos" onClick={onItemClick} sx={styles.mobile.listItem}>
                <ListItemIcon sx={styles.sidebar.listItemIcon}><ViewList fontSize="small" /></ListItemIcon>
                <ListItemText primary="Ver Todo el Catálogo" />
            </ListItemButton>
        )}
        {categories.map((cat) => (
            <ListItemButton
                key={cat.categoria_id}
                component={RouterLink}
                to={`/categoria/${cat.categoria_id}/productos`}
                onClick={onItemClick}
                sx={mobile ? styles.mobile.listItem : styles.sidebar.listItem}
            >
                <ListItemIcon sx={!mobile && styles.sidebar.listItemIcon}><Category fontSize="small" /></ListItemIcon>
                <ListItemText primary={cat.nombre} primaryTypographyProps={{ fontWeight: 500 }} />
                {!mobile && <ArrowForwardIos sx={styles.sidebar.arrowIcon} className="category-arrow" />}
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
            <Button fullWidth component={RouterLink} to="/productos" onClick={onItemClick} sx={styles.sidebar.catalogButton} >
                Ver Todo el Catálogo
            </Button>
            <Divider sx={{ my: 2 }} />
            {loading ? (
                <Box sx={styles.sidebar.loaderBox}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" color="text.secondary">Cargando...</Typography>
                </Box>
            ) : (
                <CategoryList categories={categories} onItemClick={onItemClick} />
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
                    {loading ? <CircularProgress sx={{ ml: 4, my: 2 }} size={24}/> : <CategoryList categories={categories} onItemClick={onItemClick} mobile />}
                </Collapse>

                {navLinks.map(link => (
                    <Button key={link.text} component={RouterLink} to={link.path} onClick={onItemClick} startIcon={link.icon} sx={{ ...styles.navButton, ...styles.mobile.baseButton, ...styles.mobile.offerButton }}>
                        {link.text}
                    </Button>
                ))}
            </Box>
        );
    }

    // --- RENDERIZADO VISTA DESKTOP ---
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user?.rol === 'admin' && (
                <Button component={RouterLink} to="/admin" variant="outlined" sx={{ ...styles.navButton, ...styles.desktop.adminButton }}>
                    Admin
                </Button>
            )}

            <Button component={RouterLink} to="/" sx={styles.navButton}>INICIO</Button>

            <Button onClick={() => setSidebarOpen(true)} startIcon={<MenuIcon />} sx={styles.navButton}>
                Categorías
                {!loading && categories.length > 0 && <Badge badgeContent={categories.length} color="secondary" sx={{ ml: 1.5 }} />}
            </Button>
            
            <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)} PaperProps={{ sx: styles.drawer.paper }}>
                <SidebarContent loading={loading} categories={categories} onItemClick={createAndClose} onClose={() => setSidebarOpen(false)} />
            </Drawer>

            {navLinks.map(link => (
                <Button key={link.text} component={RouterLink} to={link.path} startIcon={link.icon} sx={{ ...styles.navButton, ...styles.desktop.offerButton }}>
                    {link.text}
                </Button>
            ))}
        </Box>
    );
};

export default NavMenu;