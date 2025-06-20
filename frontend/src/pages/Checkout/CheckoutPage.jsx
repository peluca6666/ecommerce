import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Box, Button, Divider, RadioGroup, FormControlLabel, Radio, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user, cart, getToken, showNotification, refreshCart } = useAuth();

    const [shippingAddress, setShippingAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('tarjeta_simulado'); // Método de pago por defecto
    const [isProcessing, setIsProcessing] = useState(false);

    // Traemos la dirección del usuario para mostrarla en el checkout
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://localhost:3000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setShippingAddress(response.data.direccion);
            } catch (error) {
                console.error("Error al cargar la dirección del perfil:", error);
                showNotification('No se pudo cargar tu dirección de perfil.', 'error');
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user, getToken, showNotification]);

    // Maneja el envío del pedido al backend
    const handlePlaceOrder = async () => {
        if (!shippingAddress) {
            showNotification('Por favor, completa tu dirección de envío en tu perfil.', 'warning');
            navigate('/profile'); // Lo mandamos al perfil si no tiene dirección
            return;
        }

        setIsProcessing(true);
        try {
            const token = getToken();
            const orderData = {
                productos: cart.productos.map(p => ({ producto_id: p.producto_id, cantidad: p.cantidad })),
                metodo_pago: paymentMethod,
                direccion_envio: shippingAddress
            };

            const response = await axios.post('http://localhost:3000/api/ventas', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showNotification('¡Compra realizada con éxito!', 'success');
            await refreshCart(); // Limpiamos el carrito

            // Redirigimos a la página de confirmación con el ID de la venta
            navigate(`/orden-confirmada/${response.data.venta.venta_id}`);

        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al procesar la compra.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Finalizar Compra
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>1. Dirección de Envío</Typography>
                            {shippingAddress ? (
                                <Typography>{shippingAddress}</Typography>
                            ) : (
                                <Typography color="text.secondary">Cargando dirección...</Typography>
                            )}
                            <Button component={RouterLink} to="/profile" sx={{ mt: 1 }}>Editar Dirección</Button>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>2. Método de Pago</Typography>
                            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <FormControlLabel value="tarjeta_simulado" control={<Radio />} label="Tarjeta de Crédito / Débito (Simulado)" />
                                <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo Contra Entrega" />
                                <FormControlLabel value="transferencia" control={<Radio />} label="Transferencia Bancaria" />
                            </RadioGroup>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 3, position: 'sticky', top: '80px' }}>
                            <Typography variant="h6" gutterBottom>Resumen de tu Pedido</Typography>
                            <Divider sx={{ my: 2 }} />
                            <List dense>
                                {cart.productos.map(p => (
                                    <ListItem key={p.producto_id} disableGutters>
                                        <ListItemText primary={`${p.nombre_producto} (x${p.cantidad})`} />
                                        <Typography>${(p.subtotal).toFixed(2)}</Typography>
                                    </ListItem>
                                ))}
                            </List>
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
                                disabled={cart.productos.length === 0 || isProcessing}
                                onClick={handlePlaceOrder}
                            >
                                {isProcessing ? 'Procesando...' : 'Realizar Pedido'}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CheckoutPage;
