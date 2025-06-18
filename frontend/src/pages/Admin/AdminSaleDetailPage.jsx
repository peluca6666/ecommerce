import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Box, Typography, Paper, Grid, List, ListItem, ListItemText, 
  Divider, CircularProgress, FormControl, InputLabel, Select, MenuItem, Button 
} from '@mui/material';
import Title from './Title';

export default function AdminSaleDetailPage() {
  const [saleDetails, setSaleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 1. Nuevo estado para manejar el cambio de status
  const [newStatus, setNewStatus] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchSaleDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/admin/ventas/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar el detalle de la venta');
        const data = await response.json();
        setSaleDetails(data.datos);
        setNewStatus(data.datos.estado); // Inicializamos el select con el estado actual
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleDetails();
  }, [id]);

  // función para manejar la actualización del estado
  const handleStatusChange = async () => {
    const confirmacion = window.confirm(`¿Estás seguro de que querés cambiar el estado a "${newStatus}"?`);
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/ventas/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Falló la actualización del estado');
      }

      alert('¡Estado actualizado con éxito!');
      // Actualizamos el estado en la página para que se refleje el cambio al instante
      setSaleDetails(prevDetails => ({ ...prevDetails, estado: newStatus }));
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!saleDetails) return <Typography>No se encontraron detalles para esta venta.</Typography>;

  return (
    <Box>
      <Title>Detalle de Venta #{saleDetails.venta_id}</Title>
      
      <Grid container spacing={3}>
        {/*Detalles del cliente, envío y gestion de estado */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Detalles del Cliente</Typography>
            <Typography><strong>Nombre:</strong> {saleDetails.nombre} {saleDetails.apellido}</Typography>
            <Typography><strong>Email:</strong> {saleDetails.email}</Typography>
            <Typography><strong>DNI:</strong> {saleDetails.dni || 'No provisto'}</Typography>
            <Typography><strong>Teléfono:</strong> {saleDetails.telefono || 'No provisto'}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography><strong>Fecha:</strong> {new Date(saleDetails.fecha_venta).toLocaleString('es-AR')}</Typography>
            <Typography><strong>Método de Pago:</strong> {saleDetails.metodo_pago}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Dirección de Envío</Typography>
            <Typography>{saleDetails.direccion_envio}</Typography>
          </Paper>

          {/* Panel para gestionar el estado */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Gestionar Estado de la Venta</Typography>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={newStatus}
                label="Estado"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="Procesando">Procesando</MenuItem>
                <MenuItem value="Enviado">Enviado</MenuItem>
                <MenuItem value="Completado">Completado</MenuItem>
                <MenuItem value="Cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleStatusChange}>
              Actualizar Estado
            </Button>
          </Paper>
        </Grid>

        {/*Productos comprados */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Productos Comprados</Typography>
            <List disablePadding>
              {saleDetails.productos.map((item, index) => (
                <React.Fragment key={item.detalle_id}>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText 
                      primary={
                        // El nombre del producto es un link que nos lleva a la pagina de detalle de ese
                        <Typography component={RouterLink} to={`/producto/${item.producto_id}`} color="primary" sx={{ textDecoration: 'none' }}>
                          {item.nombre_producto}
                        </Typography>
                      }
                      secondary={`Cantidad: ${item.cantidad}`} 
                    />
                    <Typography variant="body2">$ {(item.cantidad * item.precio_unitario).toLocaleString('es-AR')}</Typography>
                  </ListItem>
                  {index < saleDetails.productos.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              <Divider />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>$ {Number(saleDetails.total).toLocaleString('es-AR')}</Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}