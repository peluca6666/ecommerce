import { Container, Grid, Paper, Typography, Box, Button, Divider, Alert, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCart, LocalShipping, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import CartItem from '../../components/Cart/CartItem';

const CartPage = () => {
    const { cart } = useAuth() || { cart: { productos: [], total: 0 } };
    const itemCount = cart.productos.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 3 }}>       
            <Container maxWidth="lg">
                {/* Header mejorado */}
                <Box sx={{ mb: 4 }}>
                    <Button 
                        startIcon={<ArrowBack />} 
                        component={RouterLink} 
                        to="/productos"
                        sx={{ mb: 2, color: 'text.secondary' }}
                    >
                        Seguir comprando
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <ShoppingCart sx={{ color: 'primary.main' }} />
                        <Typography variant="h4" component="h1" fontWeight="600">
                            Tu Carrito
                        </Typography>
                        {itemCount > 0 && (
                            <Chip 
                                label={`${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`} 
                                color="primary" 
                                size="small" 
                            />
                        )}
                    </Box>
                </Box>

                {cart.productos.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid', borderColor: 'grey.200' }}>
                        <ShoppingCart sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" gutterBottom color="text.secondary">
                            Tu carrito está vacío
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Descubrí nuestros productos y empezá a comprar
                        </Typography>
                        <Button 
                            variant="contained" 
                            component={RouterLink} 
                            to="/productos"
                            size="large"
                        >
                            Ver productos
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {/* Lista de productos */}
                        <Grid item xs={12} lg={8}>
                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
                                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                                    <Typography variant="h6" fontWeight="600">
                                        Productos en tu carrito
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2 }}>
                                    {cart.productos.map((item, index) => (
                                        <Box key={item.producto_id}>
                                            <CartItem item={item} />
                                            {index < cart.productos.length - 1 && (
                                                <Divider sx={{ my: 2 }} />
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} lg={4}>
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
                                                ${cart.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </Box>
                                 
                                        
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                            <Typography variant="h6" fontWeight="600">Total</Typography>
                                            <Typography variant="h6" fontWeight="600" color="primary.main">
                                                ${cart.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
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
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default CartPage;