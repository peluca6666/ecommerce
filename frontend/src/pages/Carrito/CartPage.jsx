import { Container, Grid, Paper, Typography, Box, Button, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CartItem from '../../components/Cart/CartItem';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const CartPage = () => {
    // Traemos el carrito desde el contexto (productos y total)
    const { cart } = useAuth() || { cart: { productos: [], total: 0 } };

    return (
        <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Tu Carrito de Compras
                </Typography>
                <Grid container spacing={4}>
                    {/* Lista de productos */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            {cart.productos.length === 0 ? (
                                <Typography>Tu carrito está vacío. ¡Empezá a comprar!</Typography>
                            ) : (
                                cart.productos.map(item => (
                                    <CartItem key={item.producto_id} item={item} />
                                ))
                            )}
                        </Paper>
                    </Grid>

                    {/* Resumen del pedido */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Resumen de tu compra</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Subtotal</Typography>
                                <Typography fontWeight="bold">${cart.total.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Envío</Typography>
                                <Typography fontWeight="bold">A calcular</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6" fontWeight="bold">${cart.total.toFixed(2)}</Typography>
                            </Box>
                            <Button 
                                variant="contained" 
                                fullWidth 
                                size="large" 
                                sx={{ mt: 3 }}
                                disabled={cart.productos.length === 0}
                                component={RouterLink}
                                to="/checkout"          
                            >
                                Continuar Compra
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default CartPage;
