import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab, TextField, Button, Grid, Stack } from '@mui/material';
import { PersonOutline, LockOutlined, ReceiptOutlined } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PurchaseHistoryTab from '../../components/Profile/PurchaseHistoryTab';

// componente auxiliar para manejar el contenido de cada pestaña
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const ProfilePage = () => {
    const { user, getToken, showNotification } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        dni: '',
        telefono: '',
        direccion: '',
        provincia: '',
        localidad: '',
        codigo_postal: ''
    });

    const [passwordData, setPasswordData] = useState({
        contraseniaActual: '',
        nuevaContrasenia: '',
        confirmarContrasenia: ''
    });

    // Carga los datos del perfil del usuario al montar la página
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const token = getToken();
                const response = await axios.get('http://localhost:3000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data) {
                    setProfileData({
                        dni: response.data.dni || '',
                        telefono: response.data.telefono || '',
                        direccion: response.data.direccion || '',
                        provincia: response.data.provincia || '',
                        localidad: response.data.localidad || '',
                        codigo_postal: response.data.codigo_postal || ''
                    });
                }
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                showNotification('No se pudo cargar tu perfil.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, getToken, showNotification]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };
    
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingProfile(true);
        try {
            const token = getToken();
            const response = await axios.put('http://localhost:3000/api/profile', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification(response.data.mensaje, 'success');
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al actualizar el perfil.', 'error');
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        // Lógica de validación de contraseña...
        if (passwordData.nuevaContrasenia !== passwordData.confirmarContrasenia) {
            showNotification('Las nuevas contraseñas no coinciden.', 'error');
            return;
        }
        setIsSubmittingPassword(true);
        try {
            const token = getToken();
            const response = await axios.post('http://localhost:3000/api/profile/change-password', {
                contraseniaActual: passwordData.contraseniaActual,
                nuevaContrasenia: passwordData.nuevaContrasenia
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification(response.data.mensaje, 'success');
            setPasswordData({ contraseniaActual: '', nuevaContrasenia: '', confirmarContrasenia: '' });
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al cambiar la contraseña.', 'error');
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Mi Cuenta
                </Typography>
                <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>

                    <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
                        <Tab icon={<PersonOutline />} iconPosition="start" label="Mis Datos" />
                        <Tab icon={<LockOutlined />} iconPosition="start" label="Seguridad" />
                        <Tab icon={<ReceiptOutlined/>} iconPosition="start" label="Mis compras" />
                    </Tabs>
                    
                    <TabPanel value={tabIndex} index={0}>
                        <Typography variant="h6" sx={{ mb: 3 }}>Información Personal y de Envío</Typography>
                        <form onSubmit={handleProfileSubmit}>
                            {/* CAMBIO: Se eliminó la prop 'item' de todos los Grid hijos */}
                            <Grid container spacing={3}>
                                <Grid xs={12} sm={6}><TextField fullWidth label="DNI" name="dni" value={profileData.dni} onChange={handleProfileChange} /></Grid>
                                <Grid xs={12} sm={6}><TextField fullWidth label="Teléfono" name="telefono" value={profileData.telefono} onChange={handleProfileChange} /></Grid>
                                <Grid xs={12}><TextField fullWidth label="Dirección (Calle y Número)" name="direccion" value={profileData.direccion} onChange={handleProfileChange} /></Grid>
                                <Grid xs={12} sm={6}><TextField fullWidth label="Localidad" name="localidad" value={profileData.localidad} onChange={handleProfileChange} /></Grid>
                                <Grid xs={12} sm={6}><TextField fullWidth label="Código Postal" name="codigo_postal" value={profileData.codigo_postal} onChange={handleProfileChange} /></Grid>
                                <Grid xs={12}><TextField fullWidth label="Provincia" name="provincia" value={profileData.provincia} onChange={handleProfileChange} /></Grid>
                                <Grid xs={12}>
                                    <Button type="submit" variant="contained" disabled={isSubmittingProfile}>
                                        {isSubmittingProfile ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </TabPanel>

                    <TabPanel value={tabIndex} index={1}>
                        <Typography variant="h6" sx={{ mb: 3 }}>Actualizar Contraseña</Typography>
                        <form onSubmit={handlePasswordSubmit}>
                           <Stack spacing={3}>
                                <TextField fullWidth type="password" label="Contraseña Actual" name="contraseniaActual" value={passwordData.contraseniaActual} onChange={handlePasswordChange} required />
                                <TextField fullWidth type="password" label="Nueva Contraseña" name="nuevaContrasenia" value={passwordData.nuevaContrasenia} onChange={handlePasswordChange} required />
                                <TextField fullWidth type="password" label="Confirmar Nueva Contraseña" name="confirmarContrasenia" value={passwordData.confirmarContrasenia} onChange={handlePasswordChange} required />
                                <Box>
                                    <Button type="submit" variant="contained" disabled={isSubmittingPassword}>
                                        {isSubmittingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
                                    </Button>
                                </Box>
                           </Stack>
                        </form>
                    </TabPanel>
                    
                    <TabPanel value={tabIndex} index={2}>
                        <PurchaseHistoryTab />
                    </TabPanel>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default ProfilePage;