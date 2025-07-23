// components/Checkout/CheckoutStepper.jsx
import { useState } from 'react';
import { 
    Container, Box, Typography, Stepper, Step, StepLabel, Button,
    Stack, Paper
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

    // Validación por paso
    const validateStep = (step) => {
        if (step === 0) {
            const requiredFields = ['nombre', 'apellido', 'dni', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
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
            // Aquí podrías emitir un evento o callback para mostrar error
            console.log('Validación fallida');
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    // Renderiza contenido del paso activo
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <ShippingForm 
                        data={shippingData}
                        onChange={onShippingChange}
                        shipping={shipping}
                    />
                );
            case 1:
                return (
                    <PaymentMethodSelector 
                        value={paymentMethod}
                        onChange={onPaymentChange}
                    />
                );
            case 2:
                return (
                    <OrderSummary 
                        cart={cart}
                        shipping={shipping}
                        isProcessing={isProcessing}
                        onPlaceOrder={onPlaceOrder}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md">
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
    );
};

export default CheckoutStepper;