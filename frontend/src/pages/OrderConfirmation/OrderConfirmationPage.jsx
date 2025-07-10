import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Paper, Button, Divider, List, ListItem, ListItemText, useTheme
} from '@mui/material';
import { CheckCircleOutline, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderConfirmationPage = () => {
  const { id: orderId } = useParams();
  const { getToken } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

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
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ventas/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

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

  const formatPrice = (price) => {
    const numericPrice = typeof price === 'number' && !isNaN(price) ? price : 0;
    return numericPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{
          p: { xs: 2, md: 4 },
          textAlign: 'center',
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[4]
        }}>
          <Typography color="error" align="center" variant="h5" gutterBottom>
            Error: {error}
          </Typography>
          <Button href="/productos" variant="contained" sx={{ mt: 2, borderRadius: '8px' }}>
            Ir al Catálogo
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!orden) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{
          p: { xs: 2, md: 4 },
          textAlign: 'center',
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[4]
        }}>
          <Typography align="center" variant="h5" gutterBottom>
            Orden no encontrada.
          </Typography>
          <Button href="/productos" variant="contained" sx={{ mt: 2, borderRadius: '8px' }}>
            Ir al Catálogo
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
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

          <Typography variant="h6" align="left" gutterBottom>
            Resumen del Pedido
          </Typography>
          <List dense>
            {orden.productos.map(item => (
              <ListItem key={item.producto_id} disableGutters>
                <ListItemText
                  primary={item.nombre_producto}
                  secondary={`Cantidad: ${item.cantidad}`}
                />
                <Typography fontWeight="bold" sx={{ minWidth: '80px', textAlign: 'right' }}>
                  ${formatPrice(item.precio * item.cantidad)}
                </Typography>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h5" fontWeight="bold">
              ${formatPrice(orden.total)}
            </Typography>
          </Box>

          <Box sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              size="large"
              onClick={() => navigate('/profile', { state: { activeTab: 2 } })}
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontWeight: 'bold',
                color: theme.palette.text.secondary,
                borderColor: theme.palette.text.secondary,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              Volver a Mis Compras
            </Button>

            <Button
              href="/productos"
              variant="contained"
              sx={{ mt: 2, borderRadius: '8px', py: 1.5, fontWeight: 'bold' }}
              size="large"
            >
              Seguir Comprando
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderConfirmationPage;
