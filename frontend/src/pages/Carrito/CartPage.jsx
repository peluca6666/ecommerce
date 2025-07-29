// pages/CartPage.jsx
import { Container, Grid, Paper, Typography, Box, Button, Divider, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import CartItem from '../../components/Cart/CartItem';
import CartSummary from '../../components/Cart/CartSummary';

const CartPage = () => {
  const { cart } = useAuth() || { cart: { productos: [], total: 0 } };
  const itemCount = cart.productos.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', py: 4 }}>       
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button 
            startIcon={<ArrowBack />} 
            component={RouterLink} 
            to="/productos"
            sx={{ 
              mb: 3, 
              color: 'text.secondary',
              '&:hover': {
                color: '#FF6B35',
                bgcolor: 'rgba(255, 107, 53, 0.04)'
              }
            }}
          >
            Seguir comprando
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <ShoppingCart sx={{ color: '#FF6B35', fontSize: 32 }} />
            <Typography variant="h4" component="h1" fontWeight="700" sx={{ color: '#2c3e50' }}>
              Tu Carrito
            </Typography>
            {itemCount > 0 && (
              <Chip 
                label={`${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`} 
                sx={{
                  bgcolor: '#FF6B35',
                  color: 'white',
                  fontWeight: 600
                }}
                size="small" 
              />
            )}
          </Box>
        </Box>

        {/* Estado vacío */}
        {cart.productos.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 8, 
              textAlign: 'center', 
              border: '2px dashed #e0e0e0',
              borderRadius: 3,
              bgcolor: '#fafbfc'
            }}
          >
            <ShoppingCart sx={{ fontSize: 80, color: '#bdbdbd', mb: 3 }} />
            <Typography variant="h5" gutterBottom fontWeight={600} sx={{ color: '#424242' }}>
              Tu carrito está vacío
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
              Descubrí nuestros productos y empezá a comprar
            </Typography>
            <Button 
              variant="contained" 
              component={RouterLink} 
              to="/productos"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF4500, #FF2500)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Ver productos
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {/* Lista de productos - Columna izquierda */}
            <Grid item xs={12} lg={8}>
              <Paper 
                elevation={0} 
                sx={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  borderBottom: '1px solid #f0f0f0',
                  bgcolor: '#fafbfc'
                }}>
                  <Typography variant="h6" fontWeight="700" sx={{ color: '#2c3e50' }}>
                    Productos en tu carrito
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Revisá los productos antes de finalizar tu compra
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {cart.productos.map((item, index) => (
                    <Box key={item.producto_id}>
                      <CartItem item={item} />
                      {index < cart.productos.length - 1 && (
                        <Divider sx={{ my: 3, borderColor: '#f0f0f0' }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            {/* Resumen de compra - Columna derecha (sticky) */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ 
                position: { lg: 'sticky' },
                top: { lg: 24 },
                zIndex: 1
              }}>
                <CartSummary itemCount={itemCount} total={cart.total} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;