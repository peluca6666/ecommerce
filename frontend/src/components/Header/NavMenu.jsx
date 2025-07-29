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

    const navButton = {
        color: 'white',
        textTransform: 'none',
        borderRadius: 2,
        py: 0.75,
        px: 1.5,
        pb: 1.25,
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Transición más suave
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '0%',
            height: '2px',
            backgroundColor: 'white',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', // Más suave
            transform: 'translateX(-50%)',
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
        },
        '&:hover': {
            transform: 'translateY(-2px)', // Movimiento más sutil
            backgroundColor: 'rgba(255,255,255,0.08)', // Fondo más sutil
            color: '#FFF8DC', // Color más suave
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            '&::after': { 
                width: '100%',
                boxShadow: '0 0 12px rgba(255, 255, 255, 0.6)' // Glow más suave
            }
        }
    };

    const mobileButton = {
        width: '100%',
        justifyContent: 'flex-start',
        py: 1.5,
        px: 2.5,
        mb: 1,
        color: '#333', // Texto negro
        background: '#f5f5f5', // Fondo gris claro
        fontWeight: 600,
        fontSize: '0.9rem',
        border: '1px solid #e0e0e0', // Borde gris
        borderRadius: 2,
        textTransform: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: '#eeeeee',
            color: '#FF6B35',
            transform: 'translateY(-1px)',
            borderColor: '#d0d0d0'
        }
    };

    const categoryButton = {
        width: '100%',
        justifyContent: 'flex-start',
        py: 1.5,
        px: 2,
        color: '#333',
        fontWeight: 500,
        fontSize: '0.95rem',
        textTransform: 'none',
        backgroundColor: 'transparent',
        borderRadius: 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Transición más suave
        '&:hover': { 
            backgroundColor: 'rgba(255, 107, 53, 0.08)', // Fondo naranja muy sutil
            color: '#FF6B35',
            transform: 'translateX(6px)', // Movimiento más sutil
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.15)' // Sombra suave
        }
    };

    // Vista móvil - Sidebar completamente blanco
    if (mobile) {
        return (
            <Box sx={{
                width: '100%',
                backgroundColor: 'white', // Fondo blanco
                borderRadius: '0 0 16px 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                p: 2.5,
                border: '1px solid #e0e0e0' // Borde para definir
            }}>
                {user?.rol === 'admin' && (
                    <Button component={RouterLink} to="/admin/productos" onClick={onItemClick} startIcon={<AdminPanelSettings />} sx={mobileButton}>
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
                        background: '#f8f8f8',
                        border: '1px solid #d0d0d0',
                        '&:hover': { 
                            background: '#e8e8e8',
                            color: '#FF6B35'
                        }
                    }}
                >
                    Categorías
                </Button>

                <Collapse in={openMobileCategories} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 1, pt: 1, pb: 1 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                                <CircularProgress size={18} sx={{ color: '#FF6B35' }} />
                                <Typography variant="body2" sx={{ color: '#666', ml: 1 }}>
                                    Cargando...
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                <Button component={RouterLink} to="/productos" onClick={onItemClick} sx={categoryButton}>
                                    Ver todo el catálogo
                                </Button>
                                
                                <Box sx={{ height: '1px', background: '#e0e0e0', my: 1 }} />
                                
                                {categories.map((cat, index) => (
                                    <Box key={cat.categoria_id}>
                                        <Button component={RouterLink} to={`/categoria/${cat.categoria_id}/productos`} onClick={onItemClick} sx={categoryButton}>
                                            {cat.nombre}
                                        </Button>
                                        {index < categories.length - 1 && (
                                            <Box sx={{ height: '1px', background: '#f0f0f0', mx: 2, my: 0.5 }} />
                                        )}
                                    </Box>
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
                <Button component={RouterLink} to="/admin/productos" variant="outlined" sx={{
                    ...navButton,
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { 
                        backgroundColor: 'rgba(255,255,255,0.08)', 
                        borderColor: 'rgba(255,255,255,0.6)',
                        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)'
                    }
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
                '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: 'rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)'
                }
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
                paper: { sx: { backgroundColor: 'white', color: '#333' } }
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 4,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
                    color: 'white'
                }}>
                    <Typography variant="h6" fontWeight={700}>Categorías</Typography>
                    <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Box>

                <Box sx={{ p: 2, backgroundColor: 'white' }}>
                    <Button fullWidth component={RouterLink} to="/productos" onClick={handleClose} sx={{
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        py: 1.5,
                        fontWeight: 600,
                        border: '1px solid #e0e0e0',
                        mb: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { 
                            backgroundColor: '#eeeeee',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                    }}>
                        Ver Todo el Catálogo
                    </Button>

                    <Box sx={{ height: '1px', backgroundColor: '#e0e0e0', mb: 2 }} />

                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={30} sx={{ color: '#FF6B35' }} />
                            <Typography variant="body2" color="#666" sx={{ ml: 2 }}>Cargando...</Typography>
                        </Box>
                    ) : (
                        <Box>
                            {categories.map((cat, index) => (
                                <Box key={cat.categoria_id}>
                                    <Button component={RouterLink} to={`/categoria/${cat.categoria_id}/productos`} onClick={handleClose} sx={categoryButton}>
                                        {cat.nombre}
                                    </Button>
                                    {index < categories.length - 1 && (
                                        <Box sx={{ height: '1px', backgroundColor: '#f0f0f0', mx: 2, my: 0.5 }} />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Drawer>
        </Box>
    );
};

export default NavMenu;