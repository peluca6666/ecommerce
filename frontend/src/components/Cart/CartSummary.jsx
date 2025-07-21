// components/Cart/CartSummary.jsx
import { Box, Paper, Typography, Divider, Alert, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CartSummary = ({ itemCount, total }) => {
  return (
    <Box sx={{ position: 'sticky', top: 24 }}>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="h6" fontWeight="600">
            Resumen de compra
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography color="text.secondary">
              Subtotal ({itemCount} productos)
            </Typography>
            <Typography fontWeight="500">
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight="600">Total</Typography>
            <Typography variant="h6" fontWeight="600" color="primary.main">
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3, fontSize: '0.875rem' }}>
            Envío gratis en compras superiores a $50.000
          </Alert>
          
          <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            component={RouterLink}
            to="/checkout"
            sx={{ 
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Finalizar compra
          </Button>
          
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ display: 'block', textAlign: 'center', mt: 2 }}
          >
            Compra 100% segura y protegida
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CartSummary;