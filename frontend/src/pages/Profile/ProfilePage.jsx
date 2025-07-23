import { useState, useEffect, useCallback } from 'react';
import { 
    Container, Box, Typography, Paper, Tabs, Tab, TextField, Button, 
    Grid, Stack, CircularProgress, Divider, Avatar, Card, CardContent,
    IconButton, Fade, Chip, alpha
} from '@mui/material';
import { 
    PersonOutline, LockOutlined, ReceiptOutlined, Edit as EditIcon, 
    Email as EmailIcon, Phone, LocationOn, Badge, Save, Cancel,
    CheckCircle, Security, Person
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PurchaseHistoryTab from '../../components/Profile/PurchaseHistoryTab';
import { useLocation } from 'react-router-dom';

// Componente para mostrar datos con estilo elegante
const ProfileDataCard = ({ label, value, icon, gradient }) => (
    <Card 
        elevation={0}
        sx={{ 
            height: '100%',
            background: gradient || 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '1px solid #e9ecef',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
            }
        }}
    >
        <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar 
                    sx={{ 
                        bgcolor: 'white',
                        color: '#FF6B35',
                        width: 40,
                        height: 40
                    }}
                >
                    {icon}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500 }}>
                        {label}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 600, 
                            color: '#2c3e50',
                            wordBreak: 'break-word'
                        }}
                    >
                        {value || 'No especificado'}
                    </Typography>
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

// Panel de pestañas mejorado
const TabPanel = ({ children, value, index }) => (
    <Fade in={value === index} timeout={300}>
        <div hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                    {children}
                </Box>
            )}
        </div>
    </Fade>
);

const ProfilePage = () => {
    const { user, getToken, showNotification } = useAuth();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(location.state?.activeTab || 0);
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState({
        nombre: '', apellido: '', email: '', dni: '', telefono: '',
        direccion: '', provincia: '', localidad: '', codigo_postal: ''
    });

    const [passwordData, setPasswordData] = useState({
        contraseniaActual: '', nuevaContrasenia: '', confirmarContrasenia: ''
    });

    // Funciones originales mantenidas
    const fetchProfile = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setProfileData({
                    nombre: response.data.nombre || '',
                    apellido: response.data.apellido || '',
                    email: response.data.email || '',
                    dni: response.data.dni || '',
                    telefono: response.data.telefono || '',
                    direccion: response.data.direccion || '',
                    provincia: response.data.provincia || '',
                    localidad: response.data.localidad || '',
                    codigo_postal: response.data.codigo_postal || ''
                });
            }
        } catch (error) {
            showNotification('No se pudo cargar tu perfil.', 'error');
        } finally {
            setLoading(false);
        }
    }, [user, getToken, showNotification]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (location.state?.activeTab !== undefined) {
            setTabIndex(location.state.activeTab);
        }
    }, [location.state?.activeTab]);

    const handleTabChange = (event, newValue) => setTabIndex(newValue);
    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    const handleCancelEdit = () => {
        setIsEditing(false);
        fetchProfile();
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingProfile(true);
        try {
            const token = getToken();
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification(response.data.mensaje, 'success');
            setIsEditing(false);
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al actualizar.', 'error');
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.nuevaContrasenia !== passwordData.confirmarContrasenia) {
            showNotification('Las contraseñas no coinciden.', 'error');
            return;
        }
        setIsSubmittingPassword(true);
        try {
            const token = getToken();
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/profile/change-password`,
                {
                    contraseniaActual: passwordData.contraseniaActual,
                    nuevaContrasenia: passwordData.nuevaContrasenia
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showNotification(response.data.mensaje, 'success');
            setPasswordData({ contraseniaActual: '', nuevaContrasenia: '', confirmarContrasenia: '' });
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al cambiar contraseña.', 'error');
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box sx={{ 
            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            pt: 4,
            pb: 6
        }}>
            <Container maxWidth="lg">
                {/* Header espectacular */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: '#FF6B35',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            mx: 'auto',
                            mb: 2,
                            boxShadow: '0 8px 32px rgba(255,107,53,0.3)'
                        }}
                    >
                        {profileData.nombre?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Typography variant="h3" component="h1" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                        ¡Hola, {profileData.nombre || 'Usuario'}!
                    </Typography>
                    <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.8) }}>
                        Gestioná tu cuenta y preferencias
                    </Typography>
                </Box>

                {/* Card principal con glassmorphism */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        background: alpha('#ffffff', 0.95),
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Tabs mejorados */}
                    <Box sx={{ 
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)',
                        color: 'white'
                    }}>
                        <Tabs 
                            value={tabIndex} 
                            onChange={handleTabChange} 
                            variant="fullWidth"
                            sx={{
                                '& .MuiTab-root': {
                                    color: alpha('#ffffff', 0.7),
                                    fontWeight: 600,
                                    py: 2,
                                    '&.Mui-selected': {
                                        color: 'white'
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    bgcolor: 'white',
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            <Tab icon={<Person />} iconPosition="start" label="Mi Perfil" />
                            <Tab icon={<Security />} iconPosition="start" label="Seguridad" />
                            <Tab icon={<ReceiptOutlined />} iconPosition="start" label="Mis Compras" />
                        </Tabs>
                    </Box>

                    {/* Panel 1: Perfil */}
                    <TabPanel value={tabIndex} index={0}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" color="#2c3e50">
                                    Información Personal
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Mantené tus datos actualizados para un mejor servicio
                                </Typography>
                            </Box>
                            {!isEditing && (
                                <Button 
                                    variant="contained"
                                    startIcon={<EditIcon />} 
                                    onClick={() => setIsEditing(true)}
                                    sx={{
                                        background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                                        borderRadius: 3,
                                        px: 3,
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(255,107,53,0.3)'
                                        }
                                    }}
                                >
                                    Editar
                                </Button>
                            )}
                        </Stack>

                        {isEditing ? (
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 3,
                                    border: '2px solid #f0f0f0',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                                }}
                            >
                                <form onSubmit={handleProfileSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth 
                                                label="Nombre" 
                                                name="nombre" 
                                                value={profileData.nombre} 
                                                onChange={handleProfileChange}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#FF8C00' },
                                                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth 
                                                label="Apellido" 
                                                name="apellido" 
                                                value={profileData.apellido} 
                                                onChange={handleProfileChange}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#FF8C00' },
                                                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth 
                                                label="Email" 
                                                name="email" 
                                                value={profileData.email} 
                                                disabled
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth 
                                                label="DNI" 
                                                name="dni" 
                                                value={profileData.dni} 
                                                onChange={handleProfileChange}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#FF8C00' },
                                                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth 
                                                label="Teléfono" 
                                                name="telefono" 
                                                value={profileData.telefono} 
                                                onChange={handleProfileChange}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#FF8C00' },
                                                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth 
                                                label="Dirección" 
                                                name="direccion" 
                                                value={profileData.direccion} 
                                                onChange={handleProfileChange}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#FF8C00' },
                                                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField 
                                                fullWidth 
                                                label="Localidad" 
                                                name="localidad" 
                                                value={profileData.localidad} 
                                                onChange={handleProfileChange}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#FF8C00' },
                                                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField 
                                                fullWidth 
                                                label="Código Postal" 
                                                name="codigo_postal" 
                                                value={profileData.codigo_postal} 
                                                onChange={handleProfileChange}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#FF8C00' },
                                                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField 
                                                fullWidth 
                                                label="Provincia" 
                                                name="provincia" 
                                                value={profileData.provincia} 
                                                onChange={handleProfileChange}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#FF8C00' },
                                                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                disabled={isSubmittingProfile}
                                                startIcon={isSubmittingProfile ? <CircularProgress size={20} /> : <Save />}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #4caf50, #45a049)',
                                                    borderRadius: 2,
                                                    px: 4
                                                }}
                                            >
                                                {isSubmittingProfile ? 'Guardando...' : 'Guardar Cambios'}
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                startIcon={<Cancel />}
                                                onClick={handleCancelEdit}
                                                sx={{ borderRadius: 2, px: 4 }}
                                            >
                                                Cancelar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        ) : (
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <ProfileDataCard 
                                        label="Nombre Completo" 
                                        value={`${profileData.nombre} ${profileData.apellido}`} 
                                        icon={<Person />}
                                        gradient="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ProfileDataCard 
                                        label="Email" 
                                        value={profileData.email} 
                                        icon={<EmailIcon />}
                                        gradient="linear-gradient(135deg, #fff3e0 0%, #ffcc82 100%)"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ProfileDataCard 
                                        label="DNI" 
                                        value={profileData.dni} 
                                        icon={<Badge />}
                                        gradient="linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ProfileDataCard 
                                        label="Teléfono" 
                                        value={profileData.telefono} 
                                        icon={<Phone />}
                                        gradient="linear-gradient(135deg, #e8f5e8 0%, #a5d6a7 100%)"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ProfileDataCard 
                                        label="Dirección Completa" 
                                        value={`${profileData.direccion}, ${profileData.localidad}, ${profileData.provincia} (${profileData.codigo_postal})`} 
                                        icon={<LocationOn />}
                                        gradient="linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)"
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </TabPanel>

                    {/* Panel 2: Seguridad */}
                    <TabPanel value={tabIndex} index={1}>
                        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: '#2c3e50' }}>
                                Cambiar Contraseña
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Mantené tu cuenta segura con una contraseña fuerte
                            </Typography>
                            
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 3,
                                    border: '2px solid #f0f0f0',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                                }}
                            >
                                <form onSubmit={handlePasswordSubmit}>
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            label="Contraseña Actual"
                                            name="contraseniaActual"
                                            value={passwordData.contraseniaActual}
                                            onChange={handlePasswordChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': { borderColor: '#FF8C00' },
                                                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            type="password"
                                            label="Nueva Contraseña"
                                            name="nuevaContrasenia"
                                            value={passwordData.nuevaContrasenia}
                                            onChange={handlePasswordChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': { borderColor: '#FF8C00' },
                                                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            type="password"
                                            label="Confirmar Nueva Contraseña"
                                            name="confirmarContrasenia"
                                            value={passwordData.confirmarContrasenia}
                                            onChange={handlePasswordChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': { borderColor: '#FF8C00' },
                                                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                                }
                                            }}
                                        />
                                        <Button 
                                            variant="contained" 
                                            type="submit" 
                                            disabled={isSubmittingPassword}
                                            startIcon={isSubmittingPassword ? <CircularProgress size={20} /> : <Security />}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(255,107,53,0.3)'
                                                }
                                            }}
                                        >
                                            {isSubmittingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                                        </Button>
                                    </Stack>
                                </form>
                            </Paper>
                        </Box>
                    </TabPanel>

                    {/* Panel 3: Compras */}
                    <TabPanel value={tabIndex} index={2}>
                        <PurchaseHistoryTab />
                    </TabPanel>
                </Paper>
            </Container>
        </Box>
    );
};

export default ProfilePage;