import { Container, Box, Typography, Grid } from '@mui/material';
import ContactForm from '../../components/contactForm/ContactForm.jsx';

const ContactoPage = () => {
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

                <Grid container spacing={4} justifyContent="center">
                    
                    {/* Contact Form */}
                  <Grid item xs={12} md={8} lg={6}>
                        <ContactForm />
                    </Grid>
                </Grid>

                {/* Footer Info */}
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