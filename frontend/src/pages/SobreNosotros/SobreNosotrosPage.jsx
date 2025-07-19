import { Container, Box, Typography, Grid } from '@mui/material'; 
import { Favorite, Home, LocalShipping } from '@mui/icons-material';
import ValueCard from '../../components/About/ValueCard';
import StorySection from '../../components/About/StorySection';
import CTASection from '../../components/About/CTASection';

const SobreNosotrosPage = () => {
  const valores = [
    {
      icon: <Home />,
      titulo: 'Emprendimiento Familiar',
      descripcion: 'Somos un matrimonio que arrancó vendiendo desde casa con mucha pasión y dedicación.'
    },
    {
      icon: <Favorite />,
      titulo: 'Atención Personalizada',
      descripcion: 'Cada cliente es importante para nosotros. Te ofrecemos una atención post venta personalizada.'
    },
    {
      icon: <LocalShipping />,
      titulo: 'Envíos a Todo el País',
      descripcion: 'Desde Santa Rosa de Calamuchita llegamos a toda Argentina con nuestros productos.'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#fafbfc',
      py: { xs: 4, md: 8 }
    }}>
      <Container maxWidth="md">
        
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 800, 
            color: '#2c3e50',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
            Sobre Nosotros
          </Typography>
          <Typography variant="h6" sx={{ color: '#6c757d', maxWidth: 600, mx: 'auto' }}>
            Conocé la historia detrás de Salomarket
          </Typography>
        </Box>

        {/* Historia */}
        <StorySection />

        {/* Valores */}
        <Grid container spacing={4} sx={{ mb: 6 }} justifyContent="center">
          {valores.map((valor, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ValueCard 
                icon={valor.icon}
                titulo={valor.titulo}
                descripcion={valor.descripcion}
              />
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <CTASection />
      </Container>
    </Box>
  );
};

export default SobreNosotrosPage;