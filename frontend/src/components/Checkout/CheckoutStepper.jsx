// components/Checkout/CheckoutStepper.jsx
import { useState } from 'react';
import { 
    Container, Box, Typography, Stepper, Step, StepLabel, Button,
    Stack, Paper, Alert
} from '@mui/material';
import { 
    ArrowBack, 
    ArrowForward,
    LocalShipping,
    Payment,
    ShoppingCart
} from '@mui/icons-material';
import ShippingForm from './ShippingForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import OrderSummary from './OrderSummary';

const CheckoutStepper = ({ 
    shippingData, 
    onShippingChange, 
    paymentMethod, 
    onPaymentChange,
    shipping,
    cart,
    onPlaceOrder,
    isProcessing
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});

    const steps = [
        { label: 'Datos de Envío', icon: <LocalShipping /> },
        { label: 'Método de Pago', icon: <Payment /> },
        { label: 'Confirmar Pedido', icon: <ShoppingCart /> }
    ];

    // Validaciones simples
    const validateStep = (step) => {
        if (step === 0) {
            const newErrors = {};
            const required = ['nombre', 'apellido', 'dni', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
            
            required.forEach(field => {
                if (!shippingData[field]?.trim()) {
                    newErrors[field] = 'Campo requerido';
                }
            });

            // DNI: exactamente 8 dígitos
            if (shippingData.dni && !/^\d{8}$/.test(shippingData.dni)) {
                newErrors.dni = 'DNI debe tener 8 dígitos';
            }

            // Teléfono opcional: si está presente, validar formato
            if (shippingData.telefono && !/^0?[0-9\s-]{10,12}$/.test(shippingData.telefono)) {
                newErrors.telefono = 'Formato de teléfono inválido';
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }
        
        if (step === 1) {
            if (!paymentMethod) {
                setErrors({ payment: 'Seleccione un método de pago' });
                return false;
            }
        }
        
        setErrors({});
        return true;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
        setErrors({});
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <ShippingForm data={shippingData} onChange={onShippingChange} shipping={shipping} errors={errors} />;
            case 1:
                return <PaymentMethodSelector value={paymentMethod} onChange={onPaymentChange} error={errors.payment} />;
            case 2:
                return <OrderSummary cart={cart} shipping={shipping} isProcessing={isProcessing} onPlaceOrder={onPlaceOrder} />;
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={0} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Stepper activeStep={activeStep} sx={{ p: 3 }}>
                    {steps.map((step) => (
                        <Step key={step.label}>
                            <StepLabel icon={step.icon}>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 4 }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                            {steps[activeStep].label}
                        </Typography>
                    </Box>

                    {Object.keys(errors).length > 0 && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            Por favor, corregí los errores en el formulario
                        </Alert>
                    )}

                    <Box sx={{ mb: 4 }}>
                        {renderStepContent(activeStep)}
                    </Box>

                    {activeStep < 2 && (
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                startIcon={<ArrowBack />}
                                variant="outlined"
                            >
                                Anterior
                            </Button>

                            <Button
                                onClick={handleNext}
                                endIcon={<ArrowForward />}
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                                    fontWeight: 600,
                                    px: 4
                                }}
                            >
                                Siguiente
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default CheckoutStepper;