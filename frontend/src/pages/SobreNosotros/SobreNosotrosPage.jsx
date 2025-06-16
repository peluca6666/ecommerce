import { Container, Box, Typography, Paper, Grid, Avatar, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

// Iconos para la sección de valores
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import HighQualityOutlinedIcon from '@mui/icons-material/HighQualityOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const SobreNosotrosPage = () => {
    const valores = [
        {
            icon: <HighQualityOutlinedIcon fontSize="large" color="primary" />,
            titulo: 'Calidad Garantizada',
            descripcion: 'Seleccionamos solo los mejores productos de marcas líderes para asegurar tu satisfacción.'
        },
        {
            icon: <VerifiedUserOutlinedIcon fontSize="large" color="primary" />,
            titulo: 'Compra Segura',
            descripcion: 'Tu seguridad es nuestra prioridad. Contamos con los más altos estándares para proteger tus datos.'
        },
        {
            icon: <LocalShippingOutlinedIcon fontSize="large" color="primary" />,
            titulo: 'Envíos a Todo el País',
            descripcion: 'No importa dónde estés, llevamos tu pedido a la puerta de tu casa de forma rápida y segura.'
        }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            {/* Contenido principal*/}
            <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>

                {/* Sección de bienvenida*/}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Nuestra Historia
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
                        En SaloMarket, nuestra pasión es conectar a las personas con la tecnología y los productos que aman.
                    </Typography>
                </Box>

                {/*Sección de misión */}
                <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: '16px' }}>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                        Nacimos en 2025 con un objetivo claro: crear una experiencia de compra online simple, segura y satisfactoria. Creemos que la tecnología debe ser accesible para todos, y trabajamos cada día para seleccionar un catálogo de productos que no solo cumpla con tus expectativas, sino que las supere. Más que una tienda, somos tus aliados en la búsqueda de calidad e innovación.
                    </Typography>
                </Paper>

                {/*Sección de valores */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom fontWeight="600">
                        Lo Que Nos Mueve
                    </Typography>
                   <Grid container spacing={4} sx={{ mt: 2, justifyContent: 'center' }}>
                        {valores.map((valor) => (
                            <Grid item xs={12} md={4} key={valor.titulo}>
                                <Box>
                                    <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.light', mx: 'auto', mb: 2 }}>
                                        {valor.icon}
                                    </Avatar>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">
                                        {valor.titulo}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {valor.descripcion}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Sección de llamado a la acción */}
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        ¿Listo para empezar a explorar?
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        component={RouterLink}
                        to="/productos"
                        sx={{ mt: 2, px: 5, py: 1.5, borderRadius: '50px' }}
                    >
                        Ver Nuestro Catálogo
                    </Button>
                </Box>

            </Container>

            <Footer />
        </Box>
    );
};

export default SobreNosotrosPage;