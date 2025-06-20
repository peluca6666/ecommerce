import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Typography, IconButton, Dialog, DialogTitle, DialogContent,
  Paper, Grid, List, ListItem, ListItemText, Divider, CircularProgress,
  Link as MuiLink, FormControl, InputLabel, Select, MenuItem, Button,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Title from './Title';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function AdminSalesPage() {
  // estados para ventas, carga, error, modal detalle, venta seleccionada y nuevo estado
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // estados para alertas (snackbar)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // estados para diálogo de confirmación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  // muestra snackbar con mensaje y tipo
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // cierra snackbar excepto si es clickaway
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // abre diálogo de confirmación con mensaje y acción a ejecutar
  const handleOpenConfirmDialog = (message, action) => {
    setConfirmDialogMessage(message);
    setConfirmAction(() => action);
    setConfirmDialogOpen(true);
  };

  // confirma acción y cierra diálogo
  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // cancela y cierra diálogo de confirmación
  const handleCancelConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // obtiene todas las ventas usando token y actualiza estados
  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/ventas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudieron cargar las ventas');
      const data = await response.json();
      setSales(data.datos || []);
    } catch (err) {
      setError(err.message);
      showSnackbar(`Error al cargar las ventas: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // carga ventas cuando el componente se monta
  useEffect(() => {
    fetchSales();
  }, []);

  // abre modal y carga detalle de venta específica
  const handleViewDetails = async (sale) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/ventas/${sale.venta_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudo cargar el detalle de la venta');
      const data = await response.json();
      setSelectedSale(data.datos);
      setNewStatus(data.datos.estado);
    } catch (err) {
      console.error(err);
      showSnackbar(`Error al cargar el detalle de la venta: ${err.message}`, 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  // cierra modal y limpia venta seleccionada
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedSale(null);
  };

  // actualiza estado de venta tras confirmación y refresca lista
  const handleStatusChange = async () => {
    handleOpenConfirmDialog(
      `¿Estás seguro de que querés cambiar el estado a "${newStatus}"?`,
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/admin/ventas/${selectedSale.venta_id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ estado: newStatus })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || 'Falló la actualización del estado');
          }

          showSnackbar('¡Estado actualizado con éxito!', 'success');
          handleCloseDetailModal();
          fetchSales();
        } catch (err) {
          showSnackbar(`Error: ${err.message}`, 'error');
        }
      }
    );
  };

  // columnas para la tabla de ventas
  const columns = [
    { field: 'venta_id', headerName: 'ID Venta', width: 90 },
    {
      field: 'fecha_venta',
      headerName: 'Fecha',
      width: 180,
      valueGetter: (value) => (value ? new Date(value).toLocaleString('es-AR') : '')
    },
    { field: 'email', headerName: 'Cliente', width: 250 },
    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      width: 130,
      valueFormatter: (value) => `$ ${Number(value || 0).toLocaleString('es-AR')}`
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => {
        let color = 'default';
        if (params.value === 'Completado') color = 'success';
        if (params.value === 'Cancelado') color = 'error';
        if (params.value === 'Procesando') color = 'warning';
        return (
          <Typography color={`${color}.main`} sx={{ fontWeight: 'bold' }}>
            {params.value}
          </Typography>
        );
      }
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleViewDetails(params.row)}>
          <VisibilityIcon />
        </IconButton>
      )
    }
  ];

  if (loading) return <Typography>Cargando ventas...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Title>Gestión de Ventas</Title>
      <DataGrid
        rows={sales}
        columns={columns}
        getRowId={(row) => row.venta_id}
        initialState={{ sorting: { sortModel: [{ field: 'venta_id', sort: 'desc' }] } }}
      />

      {/* modal para detalles y gestión de estado */}
      <Dialog open={isDetailModalOpen} onClose={handleCloseDetailModal} fullWidth maxWidth="md">
        <DialogTitle>Detalle de Venta #{selectedSale?.venta_id}</DialogTitle>
        <DialogContent>
          {detailLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedSale ? (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Detalles del Cliente</Typography>
                    <Typography><strong>Nombre:</strong> {selectedSale.nombre} {selectedSale.apellido}</Typography>
                    <Typography><strong>Email:</strong> {selectedSale.email}</Typography>
                    <Typography><strong>DNI:</strong> {selectedSale.dni || 'No provisto'}</Typography>
                    <Typography><strong>Teléfono:</strong> {selectedSale.telefono || 'No provisto'}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography><strong>Fecha:</strong> {new Date(selectedSale.fecha_venta).toLocaleString('es-AR')}</Typography>
                    <Typography><strong>Método de Pago:</strong> {selectedSale.metodo_pago}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Dirección de Envío</Typography>
                    <Typography>{selectedSale.direccion_envio}</Typography>
                  </Paper>

                  {/* panel para cambiar estado de la venta */}
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Gestionar Estado</Typography>
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
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Productos Comprados</Typography>
                    <List disablePadding>
                      {selectedSale.productos.map((item) => (
                        <ListItem key={item.detalle_id} sx={{ py: 1, px: 0 }}>
                          <ListItemText
                            primary={
                              <MuiLink
                                component={RouterLink}
                                to={`/producto/${item.producto_id}`}
                                color="primary"
                                sx={{ textDecoration: 'none' }}
                              >
                                {item.nombre_producto}
                              </MuiLink>
                            }
                            secondary={`Cantidad: ${item.cantidad}`}
                          />
                          <Typography variant="body2">
                            $ {(item.cantidad * item.precio_unitario).toLocaleString('es-AR')}
                          </Typography>
                        </ListItem>
                      ))}
                      <Divider />
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText primary="Total" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          $ {Number(selectedSale.total).toLocaleString('es-AR')}
                        </Typography>
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography>No se pudo cargar el detalle.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* snackbar para mensajes de éxito o error */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* diálogo de confirmación personalizado */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmación</DialogTitle>
        <DialogContent>
          <Typography id="confirm-dialog-description">{confirmDialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
