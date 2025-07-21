import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getShippingInfo } from '../../utils/shippingUtils';
import axios from 'axios';
import { 
    Paper, Box, Avatar, Typography, Divider, Grid, Stack,
    Container, CircularProgress
} from '@mui/material';
import {  
    LocalShippingOutlined as LocalShippingOutlinedIcon, 
    CreditCardOutlined as CreditCardOutlinedIcon
} from '@mui/icons-material';
import OrderSummary from '../../components/Checkout/OrderSummary';
import ShippingForm from '../../components/Checkout/ShippingForm';
import PaymentMethodSelector from '../../components/Checkout/PaymentMethodSelector';

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
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Calcular información de envío basada en la localidad
    const shipping = getShippingInfo(shippingData.localidad, cart.total);

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

    const handleShippingChange = (e) => {
        setShippingData({
            ...shippingData,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

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
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-order`,
                    { 
                        direccion_envio: formattedAddress,
                        costo_envio: shipping.cost,
                        total_con_envio: shipping.total
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const { init_point } = response.data;
                window.location.href = init_point;

            } else {
                const orderData = {
                    productos: cart.productos.map(p => ({ producto_id: p.producto_id, cantidad: p.cantidad })),
                    metodo_pago: paymentMethod,
                    direccion_envio: formattedAddress,
                    costo_envio: shipping.cost,
                    total_con_envio: shipping.total
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
                    {/* Formulario */}
                    <Grid item xs={12} md={7}>
                        <Stack spacing={3}>
                            <CheckoutStep title="1. Dirección de Envío" icon={<LocalShippingOutlinedIcon />}>
                                <ShippingForm 
                                    data={shippingData}
                                    onChange={handleShippingChange}
                                    shipping={shipping}
                                />
                            </CheckoutStep>

                            <CheckoutStep title="2. Método de Pago" icon={<CreditCardOutlinedIcon />}>
                                <PaymentMethodSelector 
                                    value={paymentMethod}
                                    onChange={handlePaymentChange}
                                />
                            </CheckoutStep>
                        </Stack>
                    </Grid>

                    {/* Resumen */}
                    <Grid item xs={12} md={5}>
                        <OrderSummary 
                            cart={cart}
                            shipping={shipping}
                            isProcessing={isProcessing}
                            onPlaceOrder={handlePlaceOrder}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CheckoutPage;