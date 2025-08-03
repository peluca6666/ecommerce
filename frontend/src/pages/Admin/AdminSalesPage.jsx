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

const STATUS_COLORS = {
  'Completado': 'success', 'Cancelado': 'error', 
  'Procesando': 'warning', 'Enviado': 'info'
};

const STATUS_OPTIONS = ['Procesando', 'Enviado', 'Completado', 'Cancelado'];
const PAGE_SIZES = [5, 10, 15, 20];

export default function AdminSalesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', action: null });

  const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { 
      ...options.headers, 
      Authorization: `Bearer ${token}` 
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error en la solicitud');
  }
  return response.json();
};

  const showSnackbar = (message, severity = 'success') => 
    setSnackbar({ open: true, message, severity });

  const showConfirmDialog = (message, action) => 
    setConfirmDialog({ open: true, message, action });

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/admin/ventas');
      setSales(data.datos || []);
    } catch (err) {
      setError(err.message);
      showSnackbar(`Error al cargar las ventas: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  const handleViewDetails = async (sale) => {
    setSelectedSale(sale);
    setDetailLoading(true);
    try {
      const data = await apiCall(`/api/admin/ventas/${sale.venta_id}`);
      setSelectedSale(data.datos);
      setNewStatus(data.datos.estado);
    } catch (err) {
      showSnackbar(`Error al cargar el detalle: ${err.message}`, 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = () => {
    showConfirmDialog(
      `¿Estás seguro de que querés cambiar el estado a "${newStatus}"?`,
      async () => {
        try {
          await apiCall(`/api/admin/ventas/${selectedSale.venta_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: newStatus })
          });
          showSnackbar('¡Estado actualizado con éxito!');
          setSelectedSale(null);
          fetchSales();
        } catch (err) {
          showSnackbar(`Error: ${err.message}`, 'error');
        }
      }
    );
  };

  const closeDialog = () => setSelectedSale(null);
  const closeSnackbar = (_, reason) => reason !== 'clickaway' && setSnackbar(prev => ({ ...prev, open: false }));
  const closeConfirmDialog = () => setConfirmDialog({ open: false, message: '', action: null });

  // Paginación móvil
  const totalPages = Math.ceil(sales.length / pageSize);
  const currentSales = sales.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const MobileCard = ({ venta }) => (
    <Card sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }} onClick={() => handleViewDetails(venta)}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Venta #{venta.venta_id}
          </Typography>
          <Chip label={venta.estado} color={STATUS_COLORS[venta.estado] || 'default'} size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {venta.email}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            {new Date(venta.fecha_venta).toLocaleDateString('es-AR')}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'primary.main' }}>
            ${Number(venta.total || 0).toLocaleString('es-AR')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const columns = [
    { field: 'venta_id', headerName: 'ID', width: 70 },
    {
      field: 'fecha_venta', headerName: 'Fecha', width: 140,
      valueGetter: (value) => value ? new Date(value).toLocaleDateString('es-AR') : ''
    },
    { field: 'email', headerName: 'Cliente', flex: 1, minWidth: 200, maxWidth: 300 },
    {
      field: 'total', headerName: 'Total', type: 'number', width: 110,
      valueFormatter: (value) => `$${Number(value || 0).toLocaleString('es-AR')}`
    },
    {
      field: 'estado', headerName: 'Estado', width: 120,
      renderCell: ({ value }) => <Chip label={value} color={STATUS_COLORS[value] || 'default'} size="small" />
    },
    {
      field: 'acciones', headerName: 'Ver', width: 80, sortable: false,
      renderCell: ({ row }) => (
        <IconButton onClick={(e) => { e.stopPropagation(); handleViewDetails(row); }} color="primary" size="small">
          <Visibility fontSize="small" />
        </IconButton>
      )
    }
  ];

  if (loading) return <Typography>Cargando ventas...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Title>Gestión de Ventas</Title>
      </Box>

      {isMobile ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filas por página</InputLabel>
              <Select value={pageSize} label="Filas por página" onChange={(e) => { setPageSize(e.target.value); setCurrentPage(0); }}>
                {PAGE_SIZES.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, sales.length)} de {sales.length}
            </Typography>
          </Box>

          <Box sx={{ px: 1 }}>
            {sales.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>No hay ventas para mostrar</Typography>
            ) : (
              currentSales.map(venta => <MobileCard key={venta.venta_id} venta={venta} />)
            )}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
              <Button size="small" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
                Anterior
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = totalPages <= 5 ? i : 
                  currentPage < 3 ? i : 
                  currentPage >= totalPages - 3 ? totalPages - 5 + i : 
                  currentPage - 2 + i;
                return (
                  <Button
                    key={pageNum} size="small"
                    variant={currentPage === pageNum ? "contained" : "text"}
                    onClick={() => setCurrentPage(pageNum)}
                    sx={{ minWidth: 32, height: 32 }}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
              <Button size="small" disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>
                Siguiente
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <DataGrid
          rows={sales} columns={columns} getRowId={(row) => row.venta_id}
          initialState={{ 
            sorting: { sortModel: [{ field: 'venta_id', sort: 'desc' }] },
            pagination: { paginationModel: { pageSize: 15 } }
          }}
          pageSizeOptions={[10, 15, 25, 50]} disableSelectionOnClick autoHeight
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 } },
            '& .MuiDataGrid-footerContainer': { backgroundColor: '#f8fafc' }
          }}
        />
      )}

      <Dialog open={!!selectedSale} onClose={closeDialog} fullWidth maxWidth="md" fullScreen={isMobile}>
        <DialogTitle>Detalle de Venta #{selectedSale?.venta_id}</DialogTitle>
        <DialogContent>
          {detailLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
          ) : selectedSale ? (
            <Grid container spacing={3} sx={{ pt: 1 }}>
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

                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Gestionar Estado</Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={newStatus} label="Estado" onChange={(e) => setNewStatus(e.target.value)}>
                      {STATUS_OPTIONS.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Button variant="contained" fullWidth onClick={handleStatusChange}>
                    Actualizar Estado
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Productos Comprados</Typography>
                  <List disablePadding>
                    {selectedSale.productos?.map((item) => (
                      <ListItem key={item.detalle_id} sx={{ py: 1, px: 0 }}>
                        <ListItemText
                          primary={
                            <MuiLink component={RouterLink} to={`/producto/${item.producto_id}`} color="primary" sx={{ textDecoration: 'none' }}>
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
          ) : (
            <Typography>No se pudo cargar el detalle.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent><Typography>{confirmDialog.message}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancelar</Button>
          <Button onClick={() => { confirmDialog.action?.(); closeConfirmDialog(); }} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
