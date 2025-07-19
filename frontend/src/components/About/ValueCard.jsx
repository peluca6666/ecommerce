import { Box, Typography } from '@mui/material';

const ValueCard = ({ icon, titulo, descripcion }) => {
  return (
    <Box sx={{
      p: 3,
      borderRadius: 3,
      background: 'white',
      border: '1px solid #e9ecef',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        borderColor: '#FF8C00'
      }
    }}>
      <Box sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        color: 'white'
      }}>
        {icon}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#2c3e50' }}>
        {titulo}
      </Typography>
      <Typography variant="body2" sx={{ color: '#6c757d', lineHeight: 1.6 }}>
        {descripcion}
      </Typography>
    </Box>
  );
};

export default ValueCard;