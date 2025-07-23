import { Box, Typography, CircularProgress, Container } from '@mui/material';         
import { useCheckout } from '../../hooks/useCheckout';                                  
import CheckoutStepper from '../../components/Checkout/CheckoutStepper';              
                                                                                     
const CheckoutPage = () => {                                                         
    const {                                                                           
        shippingData,                                                                 
        paymentMethod,                                                                
        isProcessing,                                                               
        loading,                                                                   
        shipping,                                                                  
        cart,                                                                       
        handleShippingChange,                                                       
        handlePaymentChange,                                                          
        handlePlaceOrder                                                              
    } = useCheckout();                                                                
                                                                                     
    if (loading) {                                                                    
        return (                                                                     
            <Container sx={{ py: 5, textAlign: 'center' }}>                      
                <CircularProgress />                                               
            </Container>                                                           
        );                                                                         
    }                                                                              
                                                                                    
    return (                                                                       
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>                 
            <Box sx={{ py: 4 }}>                                                
                                                                                 
                {/* Header */}                                                  
                <Box sx={{ textAlign: 'center', mb: 4 }}>                          
                    <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>  
                        Finalizar Compra                                           
                    </Typography>                                                  
                    <Typography variant="body1" color="text.secondary">          
                        Completá los siguientes pasos para confirmar tu pedido     
                    </Typography>                                                 
                </Box>                                                            
                                                                                 
                {/* Stepper Component */}                                         
                <CheckoutStepper                                                   
                    shippingData={shippingData}                                      
                    onShippingChange={handleShippingChange}                         
                    paymentMethod={paymentMethod}                                 
                    onPaymentChange={handlePaymentChange}                           
                    shipping={shipping}                                              
                    cart={cart}                                                       
                    onPlaceOrder={handlePlaceOrder}                                  
                    isProcessing={isProcessing}                                       
                />                                                                   
                                                                                    
            </Box>                                                                    
        </Box>                                                                        
    );                                                                                
};                                                                                   
                                                                                      
export default CheckoutPage;                       