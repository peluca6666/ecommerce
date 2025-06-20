import { useState } from 'react';
import { Container, Box, Typography, Paper, TextField, Button, Grid, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Send as SendIcon, EmailOutlined as EmailIcon, PhoneOutlined as PhoneIcon, LocationOnOutlined as LocationIcon, AccountCircle, AlternateEmail } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ContactoPage = () => {
    const { showNotification } = useAuth();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [isSending, setIsSending] = useState(false);

    // Actualiza el estado del formulario a medida que el usuario escribe
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Envía el formulario al backend
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSending(true);
        try {
            const response = await axios.post('http://localhost:3000/api/contacto', formData);
            showNotification(response.data.mensaje, 'success');
            // Limpiamos el formulario después de enviar con éxito
            setFormData({ nombre: '', email: '', mensaje: '' });
        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || 'No se pudo enviar el mensaje.';
            showNotification(mensajeError, 'error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
            <Container component="main" maxWidth="lg" sx={{ my: { xs: 2, md: 6 } }}>
                <Paper elevation={6} sx={{ p: { xs: 2, md: 5 }, borderRadius: '16px' }}>
                    <Box sx={{ mb: 5, textAlign: 'center' }}>
                        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                            Contactanos!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Estamos acá para ayudarte. Completa el formulario o utiliza nuestros canales directos.
                        </Typography>
                    </Box>

                    <Grid container spacing={5}>
                        {/* Información de contacto */}
                        <Grid xs={12} md={5}>
                            <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
                                Información Directa
                            </Typography>
                            <List>
                                <ListItem disablePadding sx={{ mb: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                                        <EmailIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Email" secondary="contacto@salomarket.com" />
                                </ListItem>
                                <ListItem disablePadding sx={{ mb: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                                        <PhoneIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Teléfono" secondary="+54 123 456 789" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                                        <LocationIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Nuestra Oficina" secondary="Av. Siempre Viva 742, Córdoba, Argentina" />
                                </ListItem>
                            </List>
                            <Divider sx={{ my: 4 }} />
                            <Typography variant="body2" color="text.secondary">
                                Nuestro horario de atención es de Lunes a Viernes, de 9:00 a 18:00 hs.
                            </Typography>
                        </Grid>

                        {/* Formulario de contacto */}
                        <Grid xs={12} md={7}>
                            <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
                                Envíanos un Mensaje
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Tu Nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <AccountCircle sx={{ mr: 1, color: 'action.active' }} />,
                                                }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            required
                                            type="email"
                                            label="Tu Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <AlternateEmail sx={{ mr: 1, color: 'action.active' }} />,
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            multiline
                                            rows={5}
                                            label="Tu Mensaje"
                                            name="mensaje"
                                            value={formData.mensaje}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            endIcon={<SendIcon />}
                                            disabled={isSending}
                                            sx={{ py: 1.5, fontWeight: 'bold' }}
                                        >
                                            {isSending ? 'Enviando...' : 'Enviar Mensaje'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default ContactoPage;
