import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ContactForm = () => {
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

    const fieldStyles = {
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
    };

    return (
        <Box sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            borderRadius: 4,
            p: { xs: 3, md: 7 },
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
                    <TextField
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="¿Cómo te llamas?"
                        required
                        fullWidth
                        sx={fieldStyles}
                    />
                    
                    <TextField
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu.email@ejemplo.com"
                        required
                        fullWidth
                        sx={fieldStyles}
                    />
                    
                    <TextField
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        placeholder="Contanos en qué podemos ayudarte..."
                        multiline
                        rows={5}
                        required
                        fullWidth
                        sx={fieldStyles}
                    />
                    
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
    );
};

export default ContactForm;