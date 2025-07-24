import { Container, Box, Typography, Link, Divider, Grid } from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const linkStyles = {
    color: '#BDC3C7',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    position: 'relative',
    width: 'fit-content',
    '&:hover': {
      color: '#FF8C00',
      transform: 'translateX(8px)'
    },
    '&::before': {
      content: '"→"',
      position: 'absolute',
      left: '-20px',
      opacity: 0,
      transition: 'all 0.3s ease',
      color: '#FF8C00'
    },
    '&:hover::before': {
      opacity: 1,
      left: '-16px'
    }
  };

  const contactBoxStyles = {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
    p: 2,
    borderRadius: 2,
    background: 'rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 140, 0, 0.1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 140, 0, 0.2)'
    }
  };

  const iconStyles = {
    mr: 2,
    color: '#FF8C00',
    p: 1,
    borderRadius: '50%',
    background: 'rgba(255, 140, 0, 0.1)'
  };

  const sectionTitleStyles = {
    fontWeight: 600,
    mb: 3,
    color: '#ECF0F1',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-8px',
      left: 0,
      width: '40px',
      height: '2px',
      background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
      borderRadius: '1px'
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #FF8C00 0%, #FF6B35 50%, #FF4500 100%)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>

            {/* Sección Empresa */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(45deg, #FF8C00, #FFD700)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Salomarket
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#BDC3C7',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                Tu tienda online confiable desde 2025. Ofrecemos la mejor calidad y servicio
                para nuestros clientes en toda Argentina.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#95A5A6' }}>
                <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                <Typography variant="body2">
                  Santa Rosa de Calamuchita, Córdoba, Argentina
                </Typography>
              </Box>
            </Grid>

            {/* Sección Navegación */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={sectionTitleStyles}>
                Navegación
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Link component={RouterLink} to="/productos" sx={linkStyles} onClick={() => window.scrollTo(0, 0)}>
                  Catálogo
                </Link>
                <Link component={RouterLink} to="/productos?es_oferta=true" sx={linkStyles} onClick={() => window.scrollTo(0, 0)}>
                  Ofertas
                </Link>
                <Link component={RouterLink} to="/sobre-nosotros" sx={linkStyles} onClick={() => window.scrollTo(0, 0)}>
                  Sobre nosotros
                </Link>
                <Link component={RouterLink} to="/contacto" sx={linkStyles} onClick={() => window.scrollTo(0, 0)}>
                  Contacto</Link>
              </Box>
            </Grid>
          </Grid>
        </Box>


        <Divider sx={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 140, 0, 0.3) 50%, transparent 100%)',
          height: '1px',
          border: 'none'
        }} />

        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#95A5A6',
              fontSize: '0.85rem'
            }}
          >
            © {new Date().getFullYear()} Salomarket. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;