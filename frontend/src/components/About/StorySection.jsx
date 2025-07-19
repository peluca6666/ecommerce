import { Typography, Paper } from '@mui/material';

const StorySection = () => {
  return (
    <Paper sx={{
      p: { xs: 4, md: 6 },
      mb: 6,
      borderRadius: 4,
      background: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #f1f3f4',
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
        mb: 3,
        textAlign: 'center'
      }}>
        Nuestra Historia
      </Typography>
      <Typography variant="body1" sx={{ 
        fontSize: '1.1rem',
        lineHeight: 1.8, 
        color: '#495057',
        textAlign: 'center',
        mb: 3
      }}>
        Somos un pequeño emprendimiento familiar en Santa Rosa de Calamuchita. 
      </Typography>
      <Typography variant="body1" sx={{ 
        fontSize: '1.1rem',
        lineHeight: 1.8, 
        color: '#495057',
        textAlign: 'center'
      }}>
        Vendemos productos electrónicos, accesorios, útiles y artículos varios. 
        Cada producto que elegimos para nuestro catálogo pasa por nuestras manos, 
        porque creemos en ofrecer solo lo que nosotros mismos compraríamos.
      </Typography>
    </Paper>
  );
};

export default StorySection;