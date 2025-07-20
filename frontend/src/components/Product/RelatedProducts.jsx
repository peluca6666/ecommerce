import { Box, Typography, Divider } from '@mui/material';
import ProductGrid from './ProductGrid';

const RelatedProducts = ({ productos }) => {
  // Si no hay productos relacionados, no renderizar nada
  if (!productos || productos.length === 0) return null;

  return (
    <Box sx={{ mt: { xs: 6, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 700,
            color: '#2c3e50',
            mb: 2,
            position: 'relative'
          }}
        >
          Productos Similares
        </Typography>
        
        <Divider 
          sx={{ 
            width: 80,
            height: 3,
            mx: 'auto',
            background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
            borderRadius: 2,
            border: 'none'
          }} 
        />
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#6c757d',
            mt: 2,
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          Otros productos que podrían interesarte de la misma categoría
        </Typography>
      </Box>
      
      <ProductGrid productos={productos} />
    </Box>
  );
};

export default RelatedProducts;