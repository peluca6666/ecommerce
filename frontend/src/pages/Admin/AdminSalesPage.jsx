import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Typography, IconButton, Dialog, DialogTitle, DialogContent,
  Paper, Grid, List, ListItem, ListItemText, Divider, CircularProgress,
  Link as MuiLink, FormControl, InputLabel, Select, MenuItem, Button,
  DialogActions, Snackbar, Alert, Chip, Card, CardContent, useMediaQuery, useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Title from './Title';
import { Visibility } from '@mui/icons-material';

export default function AdminSalesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/ventas`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/ventas/${sale.venta_id}`, {
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
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/ventas/${selectedSale.venta_id}/status`, {
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

  // Helper function para obtener el color del chip según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return 'success';
      case 'Cancelado': return 'error';
      case 'Procesando': return 'warning';
      case 'Enviado': return 'info';
      default: return 'default';
    }
  };

  // columnas para la tabla de ventas
  const columns = [
    { 
      field: 'venta_id', 
      headerName: 'ID', 
      width: 70,
      minWidth: 60
    },
    {
      field: 'fecha_venta',
      headerName: 'Fecha',
      width: 140,
      minWidth: 120,
      valueGetter: (value) => (value ? new Date(value).toLocaleDateString('es-AR') : ''),
      // Ocultar en móvil
      hide: window.innerWidth < 768
    },
    { 
      field: 'email', 
      headerName: 'Cliente', 
      flex: 1,
      minWidth: 200,
      maxWidth: 300
    },
    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      width: 110,
      minWidth: 90,
      valueFormatter: (value) => `${Number(value || 0).toLocaleString('es-AR')}`
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 120,
      minWidth: 100,
      renderCell: ({ value }) => (
        <Chip 
          label={value} 
          color={getStatusColor(value)} 
          size="small"
          variant="filled"
          sx={{ 
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            height: { xs: 20, sm: 24 }
          }}
        />
      )
    },
    {
      field: 'acciones',
      headerName: 'Ver',
      width: 80,
      minWidth: 60,
      sortable: false,
      renderCell: ({ row }) => (
        <Box onClick={e => e.stopPropagation()}>
          <IconButton 
            onClick={() => handleViewDetails(row)} 
            color="primary"
            size="small"
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  if (loading) return <Typography>Cargando ventas...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3
      }}>
        <Title>Gestión de Ventas</Title>
      </Box>

      {isMobile ? (
        // Vista móvil con cards
        <Box sx={{ px: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : sales.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No hay ventas para mostrar
            </Typography>
          ) : (
            <>
              {sales.slice(0, 20).map((venta) => (
                <MobileVentaCard key={venta.venta_id} venta={venta} />
              ))}
              {sales.length > 20 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mostrando las primeras 20 ventas
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      ) : (
        // Vista desktop con DataGrid
        <DataGrid
          rows={sales}
          columns={columns}
          getRowId={(row) => row.venta_id}
          initialState={{ 
            sorting: { sortModel: [{ field: 'venta_id', sort: 'desc' }] },
            pagination: { paginationModel: { pageSize: 15 } }
          }}
          pageSizeOptions={[10, 15, 25, 50]}
          disableSelectionOnClick
          autoHeight
          sx={{
            '& .MuiDataGrid-main': {
              borderRadius: 2,
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e5e5e5',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
              }
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'visible !important',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #e5e5e5',
              backgroundColor: '#f8fafc',
            }
          }}
        />
      )}

      {/* modal para detalles y gestión de estado */}
      <Dialog 
        open={isDetailModalOpen} 
        onClose={handleCloseDetailModal} 
        fullWidth 
        maxWidth="md"
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            margin: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: 'calc(100% - 64px)' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          padding: { xs: '12px 16px', sm: '16px 24px' }
        }}>
          Detalle de Venta #{selectedSale?.venta_id}
        </DialogTitle>
        <DialogContent sx={{ 
          padding: { xs: '8px 16px', sm: '16px 24px' }
        }}>
          {detailLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedSale ? (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      Detalles del Cliente
                    </Typography>
                    <Box sx={{ '& > *': { fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 } }}>
                      <Typography><strong>Nombre:</strong> {selectedSale.nombre} {selectedSale.apellido}</Typography>
                      <Typography><strong>Email:</strong> {selectedSale.email}</Typography>
                      <Typography><strong>DNI:</strong> {selectedSale.dni || 'No provisto'}</Typography>
                      <Typography><strong>Teléfono:</strong> {selectedSale.telefono || 'No provisto'}</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ '& > *': { fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 } }}>
                      <Typography><strong>Fecha:</strong> {new Date(selectedSale.fecha_venta).toLocaleString('es-AR')}</Typography>
                      <Typography><strong>Método de Pago:</strong> {selectedSale.metodo_pago}</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }} gutterBottom>
                      Dirección de Envío
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {selectedSale.direccion_envio}
                    </Typography>
                  </Paper>

                  {/* panel para cambiar estado de la venta */}
                  <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      Gestionar Estado
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={newStatus}
                        label="Estado"
                        onChange={(e) => setNewStatus(e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        <MenuItem value="Procesando">Procesando</MenuItem>
                        <MenuItem value="Enviado">Enviado</MenuItem>
                        <MenuItem value="Completado">Completado</MenuItem>
                        <MenuItem value="Cancelado">Cancelado</MenuItem>
                      </Select>
                    </FormControl>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={handleStatusChange}
                      size={isMobile ? 'medium' : 'large'}
                    >
                      Actualizar Estado
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      Productos Comprados
                    </Typography>
                    <List disablePadding>
                      {selectedSale.productos.map((item) => (
                        <ListItem key={item.detalle_id} sx={{ py: 1, px: 0 }}>
                          <ListItemText
                            primary={
                              <MuiLink
                                component={RouterLink}
                                to={`/producto/${item.producto_id}`}
                                color="primary"
                                sx={{ 
                                  textDecoration: 'none',
                                  fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}
                              >
                                {item.nombre_producto}
                              </MuiLink>
                            }
                            secondary={`Cantidad: ${item.cantidad}`}
                            secondaryTypographyProps={{
                              sx: { fontSize: { xs: '0.75rem', sm: '0.875rem' } }
                            }}
                          />
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            $ {(item.cantidad * item.precio_unitario).toLocaleString('es-AR')}
                          </Typography>
                        </ListItem>
                      ))}
                      <Divider />
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText 
                          primary="Total" 
                          primaryTypographyProps={{
                            sx: { fontSize: { xs: '1rem', sm: '1.125rem' } }
                          }}
                        />
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '1rem', sm: '1.125rem' }
                          }}
                        >
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
        <DialogActions sx={{ 
          padding: { xs: '8px 16px 16px', sm: '8px 24px 24px' }
        }}>
          <Button onClick={handleCloseDetailModal}>Cerrar</Button>
        </DialogActions>
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
        disableRestoreFocus
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
    </>
  );
}