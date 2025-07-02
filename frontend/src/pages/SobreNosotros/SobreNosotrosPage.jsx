import { Container, Box, Typography, Paper, Grid, Avatar, Button, useTheme, Divider } from '@mui/material'; 
import { Link as RouterLink } from 'react-router-dom';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import HighQualityOutlinedIcon from '@mui/icons-material/HighQualityOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const SobreNosotrosPage = () => {
  const theme = useTheme(); 

  const valores = [
    {
      icon: <HighQualityOutlinedIcon fontSize="large" />, 
      titulo: 'Calidad Garantizada',
      descripcion: 'Seleccionamos solo los mejores productos de marcas líderes para asegurar tu satisfacción, garantizando durabilidad y rendimiento.'
    },
    {
      icon: <VerifiedUserOutlinedIcon fontSize="large" />, 
      titulo: 'Compra Segura',
      descripcion: 'Tu seguridad es nuestra prioridad. Contamos con los más altos estándares de cifrado para proteger tus datos personales y financieros.'
    },
    {
      icon: <LocalShippingOutlinedIcon fontSize="large" />, 
      titulo: 'Envíos a Todo el País',
      descripcion: 'No importa dónde estés en Argentina, llevamos tu pedido a la puerta de tu casa de forma rápida, segura y eficiente.'
    }
  ];

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
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        
        {/* título y descripción principal */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            color="#ffffff"
          >
            Nuestra Historia
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
          >
            En SaloMarket, nuestra pasión es conectar a las personas con la tecnología y los productos que aman. Nacimos en 2025 con un objetivo claro: crear una experiencia de compra online simple, segura y satisfactoria para todos nuestros clientes.
          </Typography>
        </Box>

        {/* sección misión */}
        <Paper 
          elevation={6}
          sx={{ 
            p: { xs: 3, md: 6 },
            mb: { xs: 4, md: 8 },
            borderRadius: theme.shape.borderRadius * 3,
            boxShadow: theme.shadows[10],
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary" gutterBottom sx={{ mb: { xs: 2, md: 3 } }}>
            Nuestra Misión
          </Typography>
          <Typography 
            variant="body1" 
            component="p"
            sx={{ 
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7, 
              color: 'text.secondary' 
            }}
          >
            Creemos que la tecnología y los productos innovadores deben ser accesibles para todos. Trabajamos cada día para seleccionar un catálogo que no solo cumpla con tus expectativas, sino que las supere, ofreciendo calidad, variedad y los mejores precios. Más que una tienda online, somos tus aliados en la búsqueda de la calidad y la innovación que necesitas en tu vida diaria.
          </Typography>
        </Paper>

        {/* sección valores */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            fontWeight="bold"
            color="text.primary"
          >
            Nuestros Valores
          </Typography>
          <Divider sx={{ my: { xs: 2, md: 4 }, width: '50px', mx: 'auto', borderBottomWidth: '3px', borderColor: 'primary.main' }} />
          
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mt: 2, justifyContent: 'center' }}>
            {valores.map((valor) => (
              <Grid item xs={12} sm={6} md={4} key={valor.titulo}>
                <Box sx={{ 
                  p: { xs: 2, md: 3 },
                  borderRadius: theme.shape.borderRadius * 2,
                  bgcolor: 'background.paper',
                  boxShadow: theme.shadows[2],
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  }
                }}>
                  <Avatar sx={{ 
                    width: 80,
                    height: 80,
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    mx: 'auto',
                    mb: { xs: 2, md: 3 },
                    fontSize: '2.5rem'
                  }}>
                    {valor.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                    {valor.titulo}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.6 }}>
                    {valor.descripcion}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* llamado a la acción */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: { xs: 4, md: 6 },
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="text.primary">
            ¿Listo para explorar lo que tenemos para vos?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Descubrí un mundo de productos de calidad, ofertas increíbles y la mejor experiencia de compra.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/productos"
            sx={{ 
              mt: 2, 
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', md: '1.1rem' },
              boxShadow: theme.shadows[6],
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: theme.shadows[10],
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            Ver Nuestro Catálogo
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SobreNosotrosPage;
