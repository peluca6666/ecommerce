import { useState } from 'react';
import { Container, Box, Typography, Paper, TextField, Button, Grid, List, ListItem, ListItemIcon, ListItemText, Divider, useTheme, CircularProgress, InputAdornment } from '@mui/material';
import { Send as SendIcon, EmailOutlined as EmailIcon, PhoneOutlined as PhoneIcon, LocationOnOutlined as LocationIcon, PersonOutline as PersonOutlineIcon, AlternateEmail as AlternateEmailIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ContactoPage = () => {
    const { showNotification } = useAuth();
    const theme = useTheme();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [isSending, setIsSending] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSending(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contacto`, formData);
            showNotification(response.data.mensaje, 'success');
            setFormData({ nombre: '', email: '', mensaje: '' });
        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || 'No se pudo enviar el mensaje. Intenta de nuevo.';
            showNotification(mensajeError, 'error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 30%, ${theme.palette.background.default} 90%)`,
                [theme.breakpoints.down('sm')]: {
                    background: theme.palette.background.default,
                },
                py: { xs: 2, md: 4 }
            }}
        >
            <Container component="main" maxWidth="lg" sx={{ my: { xs: 2, md: 6 } }}>
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 3, md: 6 },
                        borderRadius: theme.shape.borderRadius * 3,
                        boxShadow: theme.shadows[10],
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box sx={{ mb: { xs: 3, md: 5 }, textAlign: 'center' }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            fontWeight="bold"
                            gutterBottom
                            color="primary.main"
                        >
                            Contactanos
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                            Estamos acá para ayudarte. Completa el formulario y nos pondremos en contacto, o utiliza nuestros canales directos.
                        </Typography>
                    </Box>

                    <Grid container spacing={{ xs: 4, md: 6 }}>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: { xs: 2, md: 3 } }}>
                                Canales Directos
                            </Typography>
                            <List sx={{ '.MuiListItem-root': { mb: 1, '&:last-child': { mb: 0 } } }}>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                                        <EmailIcon fontSize="medium" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight="medium" color="text.primary">Email</Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">contacto@salomarket.com</Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                                        <PhoneIcon fontSize="medium" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight="medium" color="text.primary">Teléfono</Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">+54 358 518-2894</Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                                        <LocationIcon fontSize="medium" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight="medium" color="text.primary">Nuestra Oficina</Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">Santa Rosa de Calamuchita, Córdoba, Argentina</Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                            <Divider sx={{ my: { xs: 3, md: 4 } }} />
                            <Typography variant="body2" color="text.secondary">
                                Nuestro horario de atención es de Lunes a Viernes, de 9:00 a 18:00 hs.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: { xs: 2, md: 3 } }}>
                                Envíanos un Mensaje
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Tu Nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            variant="outlined"
                                            size="medium"
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            type="email"
                                            label="Tu Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            variant="outlined"
                                            size="medium"
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            multiline
                                            rows={6}
                                            label="Tu Mensaje"
                                            name="mensaje"
                                            value={formData.mensaje}
                                            onChange={handleChange}
                                            variant="outlined"
                                            size="medium"
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            endIcon={isSending ? null : <SendIcon />}
                                            disabled={isSending}
                                            sx={{
                                                py: 1.5,
                                                fontWeight: 'bold',
                                                borderRadius: '10px',
                                                boxShadow: theme.shadows[4],
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: theme.shadows[7],
                                                },
                                                transition: 'all 0.3s ease-in-out'
                                            }}
                                        >
                                            {isSending ? <CircularProgress size={24} color="inherit" /> : 'Enviar Mensaje'}
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