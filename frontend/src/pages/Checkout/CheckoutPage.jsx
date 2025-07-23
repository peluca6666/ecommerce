import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getShippingInfo } from '../../utils/shippingUtils';
import axios from 'axios';
import { 
    Container, Box, Typography, Stepper, Step, StepLabel, Button,
    Stack, Paper, CircularProgress, StepContent
} from '@mui/material';
import { 
    ArrowBack, 
    ArrowForward,
    LocalShipping,
    Payment,
    ShoppingCart
} from '@mui/icons-material';
import ShippingForm from '../../components/Checkout/ShippingForm';
import PaymentMethodSelector from '../../components/Checkout/PaymentMethodSelector';
import OrderSummary from '../../components/Checkout/OrderSummary';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user, cart, getToken, showNotification, refreshCart } = useAuth();

    // Estados
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({
        nombre: '', apellido: '', direccion: '', localidad: '', provincia: '', codigo_postal: '', telefono: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Calcular información de envío
    const shipping = getShippingInfo(shippingData.localidad, cart.total);

    // Configuración de pasos
    const steps = [
        {
            label: 'Datos de Envío',
            icon: <LocalShipping />,
            description: 'Completá tu información personal y dirección'
        },
        {
            label: 'Método de Pago',
            icon: <Payment />,
            description: 'Elegí cómo querés pagar tu pedido'
        },
        {
            label: 'Confirmar Pedido',
            icon: <ShoppingCart />,
            description: 'Revisá tu pedido antes de finalizar'
        }
    ];

    // Cargar datos del perfil
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

    // Handlers
    const handleShippingChange = (e) => {
        setShippingData({
            ...shippingData,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    // Validación por paso
    const validateStep = (step) => {
        if (step === 0) {
            const requiredFields = ['nombre', 'apellido', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
            return requiredFields.every(field => shippingData[field].trim() !== '');
        }
        if (step === 1) {
            return paymentMethod !== '';
        }
        return true;
    };

    // Navegación entre pasos
    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prev) => prev + 1);
        } else {
            showNotification('Por favor completá todos los campos obligatorios', 'error');
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    // Procesar pedido
    const handlePlaceOrder = async () => {
        if (!validateStep(0) || !validateStep(1)) {
            showNotification('Por favor verificá que todos los datos estén completos', 'error');
            return;
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

    // Renderizar contenido del paso activo
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <ShippingForm 
                        data={shippingData}
                        onChange={handleShippingChange}
                        shipping={shipping}
                    />
                );
            case 1:
                return (
                    <PaymentMethodSelector 
                        value={paymentMethod}
                        onChange={handlePaymentChange}
                    />
                );
            case 2:
                return (
                    <OrderSummary 
                        cart={cart}
                        shipping={shipping}
                        isProcessing={isProcessing}
                        onPlaceOrder={handlePlaceOrder}
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return <Container sx={{py: 5, textAlign: 'center'}}><CircularProgress /></Container>;
    }

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
                        Finalizar Compra
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Completá los siguientes pasos para confirmar tu pedido
                    </Typography>
                </Box>

                {/* Stepper */}
                <Paper elevation={0} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                    <Stepper 
                        activeStep={activeStep} 
                        sx={{ 
                            p: 3,
                            '& .MuiStepLabel-root .Mui-completed': {
                                color: '#4caf50'
                            },
                            '& .MuiStepLabel-root .Mui-active': {
                                color: '#FF6B35'
                            }
                        }}
                    >
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel 
                                    icon={step.icon}
                                    sx={{
                                        '& .MuiStepLabel-labelContainer': {
                                            '& .MuiStepLabel-label': {
                                                fontWeight: 600,
                                                fontSize: '0.95rem'
                                            }
                                        }
                                    }}
                                >
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper>

                {/* Contenido del paso */}
                <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 4 }}>
                        {/* Descripción del paso */}
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#2c3e50' }}>
                                {steps[activeStep].label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {steps[activeStep].description}
                            </Typography>
                        </Box>

                        {/* Contenido */}
                        <Box sx={{ mb: 4 }}>
                            {renderStepContent(activeStep)}
                        </Box>

                        {/* Navegación */}
                        {activeStep < 2 && (
                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    startIcon={<ArrowBack />}
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#e9ecef',
                                        color: '#6c757d',
                                        '&:hover': {
                                            borderColor: '#FF6B35',
                                            color: '#FF6B35'
                                        }
                                    }}
                                >
                                    Anterior
                                </Button>

                                <Button
                                    onClick={handleNext}
                                    endIcon={<ArrowForward />}
                                    variant="contained"
                                    disabled={!validateStep(activeStep)}
                                    sx={{
                                        background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                                        fontWeight: 600,
                                        px: 4,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #FF4500, #FF2500)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Paper>

            </Container>
        </Box>
    );
};

export default CheckoutPage;