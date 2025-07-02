import { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab, TextField, Button, Grid, Stack, CircularProgress, Divider } from '@mui/material';
import { PersonOutline, LockOutlined, ReceiptOutlined, Edit as EditIcon, Email as EmailIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PurchaseHistoryTab from '../../components/Profile/PurchaseHistoryTab';
import { useLocation } from 'react-router-dom';

// muestra un dato con label, valor y opcional icono
const ProfileDataItem = ({ label, value, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        {icon && <Box sx={{ color: 'text.secondary' }}>{icon}</Box>}
        <Box>
            <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
            <Typography variant="body1">{value || 'No especificado'}</Typography>
        </Box>
    </Box>
);

// muestra contenido solo si la pestaña está activa
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
            {value === index && <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>}
        </div>
    );
};

const ProfilePage = () => {
    const { user, getToken, showNotification } = useAuth();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    // inicia con el tab que venga en location.state o 0 por defecto
    const [tabIndex, setTabIndex] = useState(location.state?.activeTab || 0);

    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // estado para todos los campos del perfil
    const [profileData, setProfileData] = useState({
        nombre: '',
        apellido: '',
        email: '',
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

    // actualiza el tabIndex si cambia location.state
    useEffect(() => {
        if (location.state?.activeTab !== undefined) {
            setTabIndex(location.state.activeTab);
        }
    }, [location.state?.activeTab]);

    // obtiene datos del perfil desde backend
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

    const handleTabChange = (event, newValue) => setTabIndex(newValue);
    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    const handleCancelEdit = () => {
        setIsEditing(false);
        fetchProfile();
    };

    // guarda cambios en perfil
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

    // cambia la contraseña
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
        <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">Mi Cuenta</Typography>
                <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
                        <Tab icon={<PersonOutline />} iconPosition="start" label="Mis Datos" />
                        <Tab icon={<LockOutlined />} iconPosition="start" label="Seguridad" />
                        <Tab icon={<ReceiptOutlined />} iconPosition="start" label="Mis compras" />
                    </Tabs>

                    <TabPanel value={tabIndex} index={0}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Información Personal y de Envío</Typography>
                            {!isEditing && (
                                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>Editar</Button>
                            )}
                        </Box>

                        {isEditing ? (
                            <form onSubmit={handleProfileSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Nombre" name="nombre" value={profileData.nombre} onChange={handleProfileChange} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Apellido" name="apellido" value={profileData.apellido} onChange={handleProfileChange} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Email" name="email" value={profileData.email} disabled />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="DNI" name="dni" value={profileData.dni} onChange={handleProfileChange} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Teléfono" name="telefono" value={profileData.telefono} onChange={handleProfileChange} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Dirección" name="direccion" value={profileData.direccion} onChange={handleProfileChange} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Localidad" name="localidad" value={profileData.localidad} onChange={handleProfileChange} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Código Postal" name="codigo_postal" value={profileData.codigo_postal} onChange={handleProfileChange} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Provincia" name="provincia" value={profileData.provincia} onChange={handleProfileChange} />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                        <Button type="submit" variant="contained" disabled={isSubmittingProfile}>
                                            {isSubmittingProfile ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                                        </Button>
                                        <Button variant="text" color="secondary" onClick={handleCancelEdit}>Cancelar</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        ) : (
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <ProfileDataItem label="Nombre y Apellido" value={`${profileData.nombre} ${profileData.apellido}`} icon={<PersonOutline />} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ProfileDataItem label="Email" value={profileData.email} icon={<EmailIcon />} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ProfileDataItem label="DNI" value={profileData.dni} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ProfileDataItem label="Teléfono" value={profileData.telefono} />
                                </Grid>
                                <Grid item xs={12}>
                                    <ProfileDataItem label="Dirección" value={profileData.direccion} />
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <ProfileDataItem label="Localidad" value={profileData.localidad} />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <ProfileDataItem label="Código Postal" value={profileData.codigo_postal} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ProfileDataItem label="Provincia" value={profileData.provincia} />
                                </Grid>
                            </Grid>
                        )}
                    </TabPanel>

                    <TabPanel value={tabIndex} index={1}>
                        <Typography variant="h6" sx={{ mb: 3 }}>Actualizar Contraseña</Typography>
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
                                />
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Nueva Contraseña"
                                    name="nuevaContrasenia"
                                    value={passwordData.nuevaContrasenia}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Confirmar Nueva Contraseña"
                                    name="confirmarContrasenia"
                                    value={passwordData.confirmarContrasenia}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <Button variant="contained" type="submit" disabled={isSubmittingPassword}>
                                    {isSubmittingPassword ? <CircularProgress size={24} /> : 'Actualizar Contraseña'}
                                </Button>
                            </Stack>
                        </form>
                    </TabPanel>

                    <TabPanel value={tabIndex} index={2}>
                        <PurchaseHistoryTab />
                    </TabPanel>
                </Paper>
            </Container>
        </Box>
    );
};

export default ProfilePage;
