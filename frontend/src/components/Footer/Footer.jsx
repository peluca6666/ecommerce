import { Container, Box, Typography, Link, IconButton, Divider } from "@mui/material";
import { Email, Phone, Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Link as RouterLink } from 'react-router-dom';
import { Grid } from '@mui/material';

const Footer = () => (
    <Box 
        component="footer" 
        sx={{
            py: 6,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) => 
                theme.palette.mode === 'light' 
                ? theme.palette.grey[200] 
                : theme.palette.grey[800],
        }}
    >
        <Container maxWidth="lg">
            <Grid container spacing={5}>
                
                {/*  Sobre Nosotros */}
                <Grid xs={12} sm={4}>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                        SaloMarket
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tu tienda online confiable desde 2025. Ofrecemos la mejor calidad y servicio para nuestros clientes en toda Argentina.
                    </Typography>
                </Grid>

                {/* Navegación */}
                <Grid xs={12} sm={4}>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                        Navegación
                    </Typography>
                    <Link component={RouterLink} to="/productos" display="block" variant="body2" color="text.secondary" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>
                        Catálogo
                    </Link>
                    <Link component={RouterLink} to="/productos?es_oferta=true" display="block" variant="body2" color="text.secondary" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>
                        Ofertas
                    </Link>
                    <Link component={RouterLink} to="/sobre-nosotros" display="block" variant="body2" color="text.secondary" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>
                        Sobre Nosotros
                    </Link>   
                </Grid>

                {/*Contacto y Redes Sociales*/}
                <Grid xs={12} sm={4}>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                        Contacto
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            contacto@salomarket.com
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            +54 123 456 789
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton aria-label="Facebook" color="inherit" component="a" href="https://facebook.com">
                            <Facebook />
                        </IconButton>
                        <IconButton aria-label="Instagram" color="inherit" component="a" href="https://instagram.com">
                            <Instagram />
                        </IconButton>
                        <IconButton aria-label="Twitter" color="inherit" component="a" href="https://twitter.com">
                            <Twitter />
                        </IconButton>
                    </Box>
                </Grid>

            </Grid>

            {/*Barra de Copyright */}
            <Divider sx={{ my: 4 }} />
            <Typography variant="body2" color="text.secondary" align="center">
                {'© '}
                {new Date().getFullYear()}
                {' SaloMarket. Todos los derechos reservados.'}
            </Typography>
        </Container>
    </Box>
);

export default Footer;