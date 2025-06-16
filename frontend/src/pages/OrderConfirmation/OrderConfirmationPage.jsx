import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, Paper, Button, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderConfirmationPage = () => {
    const { id: orderId } = useParams(); 
    const { getToken } = useAuth();

    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError("No se especificó un número de orden.");
                setLoading(false);
                return;
            }
            try {
                const token = getToken();
                const response = await axios.get(`http://localhost:3000/api/ventas/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.exito) {
                    setOrden(response.data.datos);
                } else {
                    setError(response.data.mensaje || "No se pudo cargar la orden.");
                }
            } catch (err) {
                setError("Error al obtener los detalles de tu orden. Por favor, contacta a soporte.");
                console.error('Error fetching order:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, getToken]);

    if (loading) return <LoadingSpinner />;
    if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>Error: {error}</Typography>;
    if (!orden) return <Typography align="center" sx={{ mt: 4 }}>Orden no encontrada.</Typography>;

   return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
                <CheckCircleOutline sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    ¡Gracias por tu compra!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Tu pedido ha sido confirmado.
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    Número de Orden: <strong>#{orden.venta_id}</strong>
                </Typography>
                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" align="left" gutterBottom>Resumen del Pedido</Typography>
                <List dense>
                    {orden.productos.map(item => (
                        <ListItem key={item.producto_id} disableGutters>
                            <ListItemAvatar>
                                <Avatar 
                                    variant="rounded" 
                                    src={item.imagen} 
                                    alt={item.nombre_producto}
                                    sx={{ width: 56, height: 56 }}
                                />
                            </ListItemAvatar>
                            <ListItemText 
                                primary={item.nombre_producto}
                                secondary={`Cantidad: ${item.cantidad}`}
                            />
                            <Typography fontWeight="bold" sx={{ minWidth: '80px', textAlign: 'right' }}>
                                ${(item.subtotal).toFixed(2)}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                     <Typography variant="h6">Total:</Typography>
                     <Typography variant="h5" fontWeight="bold">${orden.total.toFixed(2)}</Typography>
                </Box>

                <Button
                    component={RouterLink}
                    to="/productos"
                    variant="contained"
                    sx={{ mt: 4 }}
                >
                    Seguir Comprando
                </Button>
            </Paper>
        </Container>
        <Footer />
    </Box>
);
}

export default OrderConfirmationPage;