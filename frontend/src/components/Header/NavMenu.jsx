import { useState, useEffect } from 'react';
import { Button, Box, Drawer, Typography, IconButton, CircularProgress, Collapse } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { ExpandLess, ExpandMore, AdminPanelSettings, Close, ViewList, LocalOffer, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

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

    const handleClose = () => {
        if (mobile) onItemClick?.();
        else setSidebarOpen(false);
    };

    // Estilos base reutilizables
    const baseButton = {
        color: 'white',
        textTransform: 'none',
        borderRadius: 2,
        transition: 'all 0.2s ease'
    };

    const navButton = {
        ...baseButton,
        py: 0.75,
        px: 1.5,
        pb: 1.25,
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '0%',
            height: '2px',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
        },
        '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&::after': { width: '100%' }
        }
    };

    const mobileButton = {
        ...baseButton,
        width: '100%',
        justifyContent: 'flex-start',
        py: 1.5,
        px: 2.5,
        mb: 1,
        background: 'rgba(255,255,255,0.15)',
        fontWeight: 600,
        fontSize: '0.9rem',
        border: '1px solid rgba(255,255,255,0.25)',
        '&:hover': {
            background: 'rgba(255,255,255,0.25)',
            transform: 'translateY(-1px)'
        }
    };

    // Vista móvil
    if (mobile) {
        return (
            <Box sx={{
                width: '100%',
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
                borderRadius: '0 0 16px 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                p: 2.5
            }}>
                {user?.rol === 'admin' && (
                    <Button component={RouterLink} to="/admin" onClick={onItemClick} startIcon={<AdminPanelSettings />} sx={mobileButton}>
                        Panel Admin
                    </Button>
                )}

                <Button 
                    onClick={() => setOpenMobileCategories(!openMobileCategories)}
                    startIcon={<ViewList />}
                    endIcon={openMobileCategories ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                        ...mobileButton,
                        justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        '&:hover': { background: 'rgba(255,255,255,0.2)' }
                    }}
                >
                    Categorías
                </Button>

                <Collapse in={openMobileCategories} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 1, pt: 1, pb: 1 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2, gap: 1.5 }}>
                                <CircularProgress size={18} sx={{ color: 'white' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                    Cargando...
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Button component={RouterLink} to="/productos" onClick={onItemClick} sx={{
                                    justifyContent: 'flex-start', py: 1.5, px: 2.5, borderRadius: 2, 
                                    color: 'white', fontWeight: 600, fontSize: '0.95rem', textTransform: 'none', 
                                    transition: 'all 0.2s ease', background: 'rgba(255,255,255,0.1)',
                                    '&:hover': { background: 'rgba(255,255,255,0.2)', transform: 'translateX(4px)' }
                                }}>
                                    📦 Ver todo el catálogo
                                </Button>
                                
                                <Box sx={{ height: '1px', background: 'rgba(255,255,255,0.3)', mx: 2, my: 1 }} />
                                
                                {categories.map((cat) => (
                                    <Button key={cat.categoria_id} component={RouterLink} to={`/categoria/${cat.categoria_id}/productos`} onClick={onItemClick} sx={{
                                        justifyContent: 'flex-start', py: 1.5, px: 2.5, borderRadius: 2, 
                                        color: 'white', fontWeight: 600, fontSize: '0.95rem', textTransform: 'none', 
                                        transition: 'all 0.2s ease', background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        '&:hover': { 
                                            background: 'rgba(255,255,255,0.2)', 
                                            transform: 'translateX(4px)',
                                            borderColor: 'rgba(255,255,255,0.3)'
                                        }
                                    }}>
                                        {cat.nombre}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Collapse>

                <Button component={RouterLink} to="/productos?es_oferta=true" onClick={onItemClick} startIcon={<LocalOffer />} sx={{ ...mobileButton, mt: 1 }}>
                    OFERTAS
                </Button>
            </Box>
        );
    }

    // Vista desktop
    return (
        <Box>
            {user?.rol === 'admin' && (
                <Button component={RouterLink} to="/admin" variant="outlined" sx={{
                    ...navButton,
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
                }}>
                    Admin
                </Button>
            )}

            <Button component={RouterLink} to="/" sx={navButton}>INICIO</Button>
            <Button onClick={() => setSidebarOpen(true)} startIcon={<MenuIcon />} sx={navButton}>Categorías</Button>
            <Button component={RouterLink} to="/productos?es_oferta=true" startIcon={<LocalOffer />} sx={{
                ...navButton,
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}>
                OFERTAS
            </Button>

            {!loading && categories.map((cat) => (
                <Button key={cat.categoria_id} component={RouterLink} to={`/categoria/${cat.categoria_id}/productos`} sx={{
                    ...navButton, whiteSpace: 'nowrap', minWidth: 'auto'
                }}>
                    {cat.nombre}
                </Button>
            ))}

            <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)} slotProps={{
                paper: { sx: { background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)', color: 'white' } }
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)', color: 'white' }}>
                    <Typography variant="h6" fontWeight={700}>Categorías</Typography>
                    <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
                </Box>

                <Box sx={{ p: 1.5, height: '100%', overflowY: 'auto' }}>
                    <Button fullWidth component={RouterLink} to="/productos" onClick={handleClose} sx={{
                        background: 'rgba(255,255,255,0.15)', color: 'white', py: 1.5, borderRadius: 2, fontWeight: 600,
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': { background: 'rgba(255,255,255,0.25)', transform: 'translateY(-2px)' }
                    }}>
                        Ver Todo el Catálogo
                    </Button>

                    <Box sx={{ height: '1px', background: 'rgba(255,255,255,0.2)', my: 2 }} />

                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, gap: 2 }}>
                            <CircularProgress size={30} sx={{ color: 'white' }} />
                            <Typography variant="body2" color="white">Cargando...</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {categories.map((cat) => (
                                <Button key={cat.categoria_id} component={RouterLink} to={`/categoria/${cat.categoria_id}/productos`} onClick={handleClose} sx={{
                                    justifyContent: 'flex-start', py: 1.25, px: 2, borderRadius: 2, color: 'white', mb: 0.5,
                                    fontWeight: 500, fontSize: '0.85rem', textTransform: 'none', transition: 'all 0.2s ease',
                                    '&:hover': { background: 'rgba(255,255,255,0.1)', transform: 'translateX(4px)' }
                                }}>
                                    {cat.nombre}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Box>
            </Drawer>
        </Box>
    );
};

export default NavMenu;