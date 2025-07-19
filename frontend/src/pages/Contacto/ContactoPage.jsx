import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { Send as SendIcon, Email, Phone, LocationOn } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ContactoPage = () => {
    const { showNotification } = useAuth();
    const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contacto`, formData);
            showNotification(response.data.mensaje, 'success');
            setFormData({ nombre: '', email: '', mensaje: '' });
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al enviar mensaje', 'error');
        } finally {
            setIsSending(false);
        }
    };

    const ContactCard = ({ icon: Icon, title, info, accent = false }) => (
        <Box sx={{
            p: 3,
            borderRadius: 3,
            background: accent ? 'linear-gradient(135deg, #FF8C00, #FF6B35)' : '#f8f9fa',
            color: accent ? 'white' : '#2c3e50',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            border: accent ? 'none' : '1px solid #e9ecef',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: accent ? '0 12px 25px rgba(255,140,0,0.3)' : '0 8px 25px rgba(0,0,0,0.1)'
            }
        }}>
            <Icon sx={{ fontSize: 32, mb: 2, color: accent ? 'white' : '#FF6B35' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
            <Typography variant="body2" sx={{ opacity: accent ? 0.9 : 0.7 }}>{info}</Typography>
        </Box>
    );

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: '#fafbfc',
            py: { xs: 4, md: 8 }
        }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" sx={{ 
                        fontWeight: 800, 
                        color: '#2c3e50',
                        mb: 2,
                        fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}>
                        Hablemos
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#6c757d', maxWidth: 500, mx: 'auto' }}>
                        ¿Tenés alguna pregunta? Escribinos y nos pondremos en contacto.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* info de contacto */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                            <ContactCard 
                                icon={Email} 
                                title="Email" 
                                info="gercab666@gmail.com"
                                accent
                            />
                            <ContactCard 
                                icon={Phone} 
                                title="Teléfono" 
                                info="+54 3546 417985"
                            />
                            <ContactCard 
                                icon={LocationOn} 
                                title="Ubicación" 
                                info="Santa Rosa de Calamuchita, Córdoba"
                            />
                        </Box>
                    </Grid>

                    {/* formulario de contacto*/}
                    <Grid item xs={12} md={7}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                            borderRadius: 4,
                            p: { xs: 3, md: 5 },
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            border: '1px solid rgba(255,140,0,0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
                            }
                        }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700, 
                                color: '#2c3e50', 
                                mb: 1,
                                textAlign: 'center'
                            }}>
                                Enviar mensaje
                            </Typography>
                            <Typography variant="body2" sx={{ 
                                color: '#6c757d', 
                                textAlign: 'center',
                                mb: 4
                            }}>
                                Completá los campos y te responderemos pronto
                            </Typography>
                            
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <TextField
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="¿Cómo te llamas?"
                                            required
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    fontSize: '1.1rem',
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.3s ease',
                                                    '& fieldset': { 
                                                        borderColor: 'transparent',
                                                        borderWidth: 2
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#ffffff',
                                                        '& fieldset': { borderColor: '#FF8C00' }
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: '#ffffff',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 20px rgba(255,140,0,0.15)',
                                                        '& fieldset': { borderColor: '#FF6B35', borderWidth: 2 }
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                    
                                    <Box sx={{ position: 'relative' }}>
                                        <TextField
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="tu.email@ejemplo.com"
                                            required
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    fontSize: '1.1rem',
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.3s ease',
                                                    '& fieldset': { 
                                                        borderColor: 'transparent',
                                                        borderWidth: 2
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#ffffff',
                                                        '& fieldset': { borderColor: '#FF8C00' }
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: '#ffffff',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 20px rgba(255,140,0,0.15)',
                                                        '& fieldset': { borderColor: '#FF6B35', borderWidth: 2 }
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                    
                                    <Box sx={{ position: 'relative' }}>
                                        <TextField
                                            name="mensaje"
                                            value={formData.mensaje}
                                            onChange={handleChange}
                                            placeholder="Contanos en qué podemos ayudarte..."
                                            multiline
                                            rows={5}
                                            required
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    fontSize: '1.1rem',
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.3s ease',
                                                    '& fieldset': { 
                                                        borderColor: 'transparent',
                                                        borderWidth: 2
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#ffffff',
                                                        '& fieldset': { borderColor: '#FF8C00' }
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: '#ffffff',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 20px rgba(255,140,0,0.15)',
                                                        '& fieldset': { borderColor: '#FF6B35', borderWidth: 2 }
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                    
                                    <Button
                                        type="submit"
                                        disabled={isSending}
                                        fullWidth
                                        endIcon={isSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                        sx={{
                                            py: 2.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
                                            color: 'white',
                                            border: 'none',
                                            marginTop: 2,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                transition: 'left 0.6s ease'
                                            },
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 12px 30px rgba(255,107,53,0.4)',
                                                '&::before': {
                                                    left: '100%'
                                                }
                                            },
                                            '&:disabled': {
                                                background: 'linear-gradient(135deg, #FFB366, #FF9966)',
                                                transform: 'none',
                                                boxShadow: 'none'
                                            }
                                        }}
                                    >
                                        {isSending ? 'Enviando...' : 'Enviar mensaje'}
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Grid>
                </Grid>

                {/* Footer info */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mt: 6, 
                    p: 3, 
                    borderRadius: 3, 
                    background: 'rgba(255,140,0,0.05)',
                    border: '1px solid rgba(255,140,0,0.1)'
                }}>
                    <Typography variant="body1" sx={{ color: '#6c757d' }}>
                        Horario de atención: <strong>Lunes a Viernes, 9:00 - 18:00 hs</strong>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default ContactoPage;