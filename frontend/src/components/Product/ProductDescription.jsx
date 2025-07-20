import { Paper, Typography, Box } from '@mui/material';

const ProductDescription = ({ descripcionLarga }) => {
  // Si no hay descripción larga, no renderizar nada
  if (!descripcionLarga) return null;

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        background: 'white',
        border: '1px solid #f0f0f0',
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
      }}
    >
      <Typography 
        variant="h5" 
        component="h3" 
        sx={{ 
          fontWeight: 700,
          mb: 3,
          color: '#2c3e50',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
            borderRadius: 2,
          }
        }}
      >
        Descripción Completa
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
          color: '#495057',
          fontSize: '1.05rem'
        }}
      >
        {descripcionLarga}
      </Typography>
    </Paper>
  );
};

export default ProductDescription;