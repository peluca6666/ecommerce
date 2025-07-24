import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Button, Stack } from '@mui/material';
import { CheckCircleOutline, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderConfirmationPage = () => {
  const { id: orderId } = useParams();
  const { getToken } = useAuth();
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
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.exito) {
          setOrden(response.data.datos);
        } else {
          setError(response.data.mensaje || "No se pudo cargar la orden.");
        }
      } catch (err) {
        setError("Error al obtener los detalles de tu orden.");
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, getToken]);

  const formatPrice = (price) => {
    return (price || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 });
  };

  if (loading) return <LoadingSpinner />;

  if (error || !orden) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="error" variant="h6" gutterBottom>
            {error || "Orden no encontrada"}
          </Typography>
          <Button href="/productos" variant="contained" sx={{ mt: 2, borderRadius: 2 }}>
            Ir al Catálogo
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        {/* Header */}
        <CheckCircleOutline sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ¡Compra exitosa!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Orden #{orden.venta_id}
        </Typography>

        {/* Productos */}
        <Box sx={{ textAlign: 'left', my: 3 }}>
          <Typography variant="h6" gutterBottom>Resumen</Typography>
          {orden.productos.map(item => (
            <Stack key={item.producto_id} direction="row" justifyContent="space-between" sx={{ py: 1 }}>
              <Box>
                <Typography variant="body1">{item.nombre_producto}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Cantidad: {item.cantidad}
                </Typography>
              </Box>
              <Typography fontWeight="bold">
                ${formatPrice(item.precio * item.cantidad)}
              </Typography>
            </Stack>
          ))}
          
          <Stack direction="row" justifyContent="space-between" sx={{ pt: 2, mt: 2, borderTop: 1, borderColor: 'grey.300' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              ${formatPrice(orden.total)}
            </Typography>
          </Stack>
        </Box>

        {/* Botones */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/profile', { state: { activeTab: 3 } })}
            sx={{ borderRadius: 2 }}
          >
            Mis Compras
          </Button>
          <Button
            href="/productos"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Seguir Comprando
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default OrderConfirmationPage;