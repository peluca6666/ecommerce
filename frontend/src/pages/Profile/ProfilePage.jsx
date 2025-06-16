// src/pages/ProfilePage.jsx (ARCHIVO NUEVO)

import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab, TextField, Button, Grid } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
    const { user, getToken, showNotification } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);

    const [profileData, setProfileData] = useState({
        dni: '',
        telefono: '',
        direccion: ''
    });

    const [passwordData, setPasswordData] = useState({
        contraseniaActual: '',
        nuevaContrasenia: '',
        confirmarContrasenia: ''
    });

    // Cargar los datos del perfil del usuario al montar la página
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://localhost:3000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data) {
                    setProfileData({
                        dni: response.data.dni || '',
                        telefono: response.data.telefono || '',
                        direccion: response.data.direccion || ''
                    });
                }
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                showNotification('No se pudo cargar tu perfil.', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
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
        try {
            const token = getToken();
            const response = await axios.put('http://localhost:3000/api/profile', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification(response.data.mensaje, 'success');
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al actualizar el perfil.', 'error');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.nuevaContrasenia !== passwordData.confirmarContrasenia) {
            showNotification('Las nuevas contraseñas no coinciden.', 'error');
            return;
        }
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
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box>
            <Header />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Mi Perfil
                </Typography>
                <Paper elevation={3}>
                    <Tabs value={tabIndex} onChange={handleTabChange} centered>
                        <Tab label="Mis Datos" />
                        <Tab label="Cambiar Contraseña" />
                    </Tabs>
                    
                    {/* Panel de datos personales */}
                    <Box hidden={tabIndex !== 0} p={3}>
                        <form onSubmit={handleProfileSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="DNI" name="dni" value={profileData.dni} onChange={handleProfileChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Teléfono" name="telefono" value={profileData.telefono} onChange={handleProfileChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Dirección de Envío Principal" name="direccion" value={profileData.direccion} onChange={handleProfileChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">Guardar Cambios</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>

                    {/* Panel de cambio de contraseña */}
                    <Box hidden={tabIndex !== 1} p={3}>
                        <form onSubmit={handlePasswordSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField fullWidth type="password" label="Contraseña Actual" name="contraseniaActual" value={passwordData.contraseniaActual} onChange={handlePasswordChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth type="password" label="Nueva Contraseña" name="nuevaContrasenia" value={passwordData.nuevaContrasenia} onChange={handlePasswordChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth type="password" label="Confirmar Nueva Contraseña" name="confirmarContrasenia" value={passwordData.confirmarContrasenia} onChange={handlePasswordChange} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">Cambiar Contraseña</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default ProfilePage;