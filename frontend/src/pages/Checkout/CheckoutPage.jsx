import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Paper, Box, Avatar, Typography, Divider, Grid, Stack, TextField,RadioGroup, FormControlLabel, Radio, Button, Container, CircularProgress, ListItem, ListItemText } from '@mui/material';
import {  LocalShippingOutlined as LocalShippingOutlinedIcon, CreditCardOutlined as CreditCardOutlinedIcon } from '@mui/icons-material';

// componente reutilizable para mostrar cada paso del checkout
const CheckoutStep = ({ title, icon, children }) => (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 3, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                {icon}
            </Avatar>
            <Typography variant="h6">{title}</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {children}
    </Paper>
);

// componente principal del checkout
const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user, cart, getToken, showNotification, refreshCart } = useAuth();

    // estados para manejar datos de envío, método de pago y carga
    const [shippingData, setShippingData] = useState({
        nombre: '', apellido: '', direccion: '', localidad: '', provincia: '', codigo_postal: '', telefono: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('tarjeta_simulado');
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    // al montar, si hay usuario, se traen sus datos del perfil
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const token = getToken();
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profile = response.data;

                // se rellenan los campos del formulario con datos del perfil
                setShippingData({
                    nombre: profile.nombre || '',
                    apellido: profile.apellido || '',
                    direccion: profile.direccion || '',
                    localidad: profile.localidad || '',
                    provincia: profile.provincia || '',
                    codigo_postal: profile.codigo_postal || '',
                    telefono: profile.telefono || ''
                });
            } catch (error) {
                console.error("Error al cargar los datos del perfil:", error);
                showNotification('No se pudo cargar tu perfil. Por favor, complétalo.', 'warning');
                navigate('/profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, getToken, showNotification, navigate]);

    // cuando cambia algún campo del form de dirección
    const handleShippingChange = (e) => {
        setShippingData({
            ...shippingData,
            [e.target.name]: e.target.value
        });
    };

    // cuando el usuario confirma la compra
    const handlePlaceOrder = async () => {
    const requiredFields = ['nombre', 'apellido', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
    for (const field of requiredFields) {
        if (!shippingData[field]) {
            showNotification(`El campo "${field.replace('_', ' ')}" es obligatorio.`, 'error');
            return;
        }
    }

    setIsProcessing(true);
    const token = getToken();
    const formattedAddress = `${shippingData.direccion}, ${shippingData.localidad}, ${shippingData.provincia} (${shippingData.codigo_postal})`;

    try {
        if (paymentMethod === 'mercadopago') {
            // si el método es Mercado Pago, llamamos a la ruta de creación de orden
            
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-order`,
                { direccion_envio: formattedAddress }, // Solo enviamos la dirección
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // obtenemos el init_point de la respuesta del backend
            const { init_point } = response.data;

            // redirigimos al usuario a la pasarela de pago de Mercado Pago
            window.location.href = init_point;

        } else {
            
            const orderData = {
                productos: cart.productos.map(p => ({ producto_id: p.producto_id, cantidad: p.cantidad })),
                metodo_pago: paymentMethod,
                direccion_envio: formattedAddress
            };

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ventas`,
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showNotification('¡Pedido realizado con éxito!', 'success');
            await refreshCart();
            navigate(`/orden-confirmada/${response.data.venta.venta_id}`);
        }

    } catch (error) {
        showNotification(error.response?.data?.mensaje || 'Error al procesar el pedido.', 'error');
    } finally {
        setIsProcessing(false);
    }
};
    if (loading) {
        return <Container sx={{py: 5, textAlign: 'center'}}><CircularProgress /></Container>;
    }

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
                    Finalizar Compra
                </Typography>
                <Grid container spacing={4}>
                    {/* columna izquierda con los pasos del formulario */}
                    <Grid item xs={12} md={7}>
                        <Stack spacing={3}>
                            <CheckoutStep title="1. Dirección de Envío" icon={<LocalShippingOutlinedIcon />}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}><TextField name="nombre" label="Nombre" value={shippingData.nombre} onChange={handleShippingChange} fullWidth required /></Grid>
                                    <Grid item xs={12} sm={6}><TextField name="apellido" label="Apellido" value={shippingData.apellido} onChange={handleShippingChange} fullWidth required /></Grid>
                                    <Grid item xs={12}><TextField name="direccion" label="Dirección (Calle y Nro)" value={shippingData.direccion} onChange={handleShippingChange} fullWidth required /></Grid>
                                    <Grid item xs={12} sm={6}><TextField name="localidad" label="Localidad" value={shippingData.localidad} onChange={handleShippingChange} fullWidth required /></Grid>
                                    <Grid item xs={12} sm={6}><TextField name="codigo_postal" label="Código Postal" value={shippingData.codigo_postal} onChange={handleShippingChange} fullWidth required /></Grid>
                                    <Grid item xs={12} sm={6}><TextField name="provincia" label="Provincia" value={shippingData.provincia} onChange={handleShippingChange} fullWidth required /></Grid>
                                    <Grid item xs={12} sm={6}><TextField name="telefono" label="Teléfono (Opcional)" value={shippingData.telefono} onChange={handleShippingChange} fullWidth /></Grid>
                                </Grid>
                            </CheckoutStep>

                            <CheckoutStep title="2. Método de Pago" icon={<CreditCardOutlinedIcon />}>
                                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <FormControlLabel value="tarjeta_simulado" control={<Radio />} label="Tarjeta de Crédito / Débito (Simulado)" />
                                    <FormControlLabel value="transferencia" control={<Radio />} label="Transferencia Bancaria" />
                                </RadioGroup>
                            </CheckoutStep>
                        </Stack>
                    </Grid>

                    {/* columna derecha con resumen del pedido */}
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 3, position: 'sticky', top: '80px', borderRadius: '16px', border: '1px solid #e0e0e0' }} elevation={0}>
                            <Typography variant="h6" gutterBottom>Resumen del Pedido</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={1.5} sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                                {cart.productos.map(p => (
                                    <ListItem key={p.producto_id} disableGutters sx={{p:0}}>
                                        <ListItemText primary={p.nombre_producto} secondary={`Cantidad: ${p.cantidad}`} />
                                        <Typography variant="body1" fontWeight="500">${(p.subtotal).toFixed(2)}</Typography>
                                    </ListItem>
                                ))}
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary.main">${cart.total.toFixed(2)}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                sx={{ mt: 3, py: 1.5, borderRadius: '12px', fontWeight: 'bold' }}
                                disabled={cart.productos.length === 0 || isProcessing}
                                onClick={handlePlaceOrder}
                            >
                                {isProcessing ? <CircularProgress size={26} color="inherit"/> : 'Realizar Pedido'}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CheckoutPage;
