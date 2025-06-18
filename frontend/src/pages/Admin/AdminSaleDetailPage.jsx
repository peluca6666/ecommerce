import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import Title from './Title';

export default function AdminSaleDetailPage() {
  const [saleDetails, setSaleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useParams para sacar el id de la venta desde la URL
  const { id } = useParams();

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/admin/ventas/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('No se pudo cargar el detalle de la venta');
        }
        const data = await response.json();
        setSaleDetails(data.datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleDetails();
  }, [id]);
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!saleDetails) return <Typography>No se encontraron detalles para esta venta.</Typography>;

  return (
    <Box>
      <Title>Detalle de Venta #{saleDetails.venta_id}</Title>
      
      <Grid container spacing={3}>
        {/* Detalles del cliente y envio */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Detalles del Cliente</Typography>
            <Typography><strong>Email:</strong> {saleDetails.email}</Typography>
            <Typography><strong>Fecha:</strong> {new Date(saleDetails.fecha_venta).toLocaleString('es-AR')}</Typography>
            <Typography><strong>Método de Pago:</strong> {saleDetails.metodo_pago}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Dirección de Envío</Typography>
            <Typography>{saleDetails.direccion_envio}</Typography>
          </Paper>
        </Grid>

        {/*Productos comprados */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Productos Comprados</Typography>
            <List disablePadding>
              {saleDetails.productos.map((item, index) => (
                <React.Fragment key={item.producto_id}>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText 
                      primary={item.nombre} 
                      secondary={`Cantidad: ${item.cantidad}`} 
                    />
                    <Typography variant="body2">
                      $ {(item.cantidad * item.precio_unitario).toLocaleString('es-AR')}
                    </Typography>
                  </ListItem>
                  {index < saleDetails.productos.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              <Divider />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  $ {Number(saleDetails.total).toLocaleString('es-AR')}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}