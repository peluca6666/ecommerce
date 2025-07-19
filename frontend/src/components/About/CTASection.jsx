import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CTASection = () => {
  return (
    <Box sx={{
      textAlign: 'center',
      p: { xs: 4, md: 6 },
      borderRadius: 3,
      background: 'rgba(255,140,0,0.05)',
      border: '1px solid rgba(255,140,0,0.1)'
    }}>
      <Typography variant="h5" sx={{ 
        fontWeight: 700, 
        color: '#2c3e50', 
        mb: 2
      }}>
        ¿Querés ver qué tenemos para vos?
      </Typography>
      <Typography variant="body1" sx={{ color: '#6c757d', mb: 3 }}>
        Explorá nuestro catálogo y encontrá exactamente lo que estás buscando
      </Typography>
      <Button
        variant="contained"
        size="large"
        component={RouterLink}
        to="/productos"
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 3,
          fontWeight: 600,
          textTransform: 'none',
          background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
          color: 'white',
          fontSize: '1.1rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(255,107,53,0.4)'
          }
        }}
      >
        Ver Productos
      </Button>
    </Box>
  );
};

export default CTASection;