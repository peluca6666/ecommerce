// components/Cart/CartSummary.jsx
import { Box, Paper, Typography, Divider, Alert, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LockOutlined, LocalShipping } from '@mui/icons-material';

const CartSummary = ({ itemCount, total }) => {
  const hasShippingDiscount = total >= 50000;
  
  return (
    <Box sx={{ position: 'sticky', top: 24 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid #e0e0e0',
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)'
        }}
      >
        {/* Header con gradiente sutil */}
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.1rem' }}>
            Resumen de compra
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* Subtotal */}
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography color="text.secondary" sx={{ fontSize: '0.95rem' }}>
              Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
            </Typography>
            <Typography fontWeight="600" sx={{ fontSize: '0.95rem' }}>
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </Stack>

          {/* Envío */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalShipping sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Envío
              </Typography>
            </Stack>
            <Typography 
              fontWeight="600" 
              sx={{ 
                fontSize: '0.95rem',
                color: hasShippingDiscount ? '#4caf50' : 'text.primary'
              }}
            >
              {hasShippingDiscount ? 'GRATIS' : 'Calculado en checkout'}
            </Typography>
          </Stack>
          
          <Divider sx={{ mb: 3, borderColor: '#f0f0f0' }} />
          
          {/* Total destacado */}
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="700" sx={{ color: '#2c3e50' }}>
              Total
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight="800" 
              sx={{ 
                color: '#FF6B35',
                fontSize: '1.4rem'
              }}
            >
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </Stack>

          {/* Alert de envío gratis */}
          <Alert 
            severity={hasShippingDiscount ? 'success' : 'info'} 
            sx={{ 
              mb: 3, 
              fontSize: '0.875rem',
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '1.1rem'
              }
            }}
          >
            {hasShippingDiscount 
              ? '¡Felicidades! Tenés envío gratis'
              : `Te faltan ${(50000 - total).toLocaleString('es-AR')} para envío gratis`
            }
          </Alert>
          
          {/* Botón principal mejorado */}
          <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            component={RouterLink}
            to="/checkout"
            sx={{ 
              py: 1.8,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1.1rem',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
              boxShadow: '0 4px 14px rgba(255,107,53,0.25)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 18px rgba(255,107,53,0.35)',
                background: 'linear-gradient(135deg, #FF4500, #FF2500)'
              }
            }}
          >
            Finalizar compra
          </Button>
          
          {/* Footer de seguridad */}
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="center" 
            spacing={1} 
            sx={{ mt: 2.5 }}
          >
            <LockOutlined sx={{ fontSize: 16, color: '#4caf50' }} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#4caf50',
                fontWeight: 500,
                fontSize: '0.8rem'
              }}
            >
              Compra 100% segura y protegida
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CartSummary;