import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Switch, FormControlLabel, Snackbar, Alert, Chip, Avatar, Input,
  Card, CardContent, CardActions, useMediaQuery, useTheme, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import Title from './Title';
import { ToggleOn, ToggleOff, Edit, Delete, Add, CloudUpload } from '@mui/icons-material';

const FORM_FIELDS = [
  { name: 'titulo', label: 'Título', required: true },
  { name: 'descripcion', label: 'Descripción', multiline: true, rows: 3 },
  { name: 'boton_texto', label: 'Texto del Botón' },
  { name: 'boton_link', label: 'Link del Botón' },
  { name: 'orden', label: 'Orden', type: 'number' }
];

const INITIAL_FORM = { titulo: '', descripcion: '', boton_texto: '', boton_link: '', orden: 0, activo: true, imagen: null };

export default function AdminBannersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, banner: null });
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirm, setConfirm] = useState({ open: false, message: '', action: null });

  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/banners${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, ...options.headers }, ...options
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return response.json();
  };

  const showNotification = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const closeSnackbar = (_, reason) => reason !== 'clickaway' && setSnackbar(prev => ({ ...prev, open: false }));

  const fetchBanners = async () => {
    try {
      const data = await apiCall('');
      setBanners(data.datos || []);
    } catch (err) {
      showNotification(`Error al cargar banners: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action, id, successMsg) => {
    try {
      await action(id);
      showNotification(successMsg);
      fetchBanners();
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleToggleStatus = (id, estadoActual) => {
    setConfirm({
      open: true,
      message: `¿Seguro que querés ${estadoActual ? 'desactivar' : 'activar'} este banner?`,
      action: () => executeAction(() => apiCall(`/${id}/toggle-activo`, { method: 'PUT' }), id, 'Estado cambiado exitosamente')
    });
  };

  const handleDelete = (id) => {
    setConfirm({
      open: true,
      message: '¿Eliminar este banner?',
      action: () => executeAction(() => apiCall(`/${id}`, { method: 'DELETE' }), id, 'Banner eliminado correctamente')
    });
  };

  const openDialog = (banner = null) => {
    if (banner) {
      setDialog({ open: true, banner });
      setFormData({ ...banner, imagen: null });
      setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${banner.imagen}`);
    } else {
      setDialog({ open: true, banner: null });
      setFormData({ ...INITIAL_FORM, orden: banners.length });
      setImagePreview(null);
    }
  };

  const closeDialog = () => {
    setDialog({ open: false, banner: null });
    setFormData(INITIAL_FORM);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return showNotification('El título es obligatorio', 'error');
    if (!dialog.banner && !formData.imagen) return showNotification('La imagen es obligatoria', 'error');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'imagen' && value) data.append(key, value);
      else if (key !== 'imagen') data.append(key, value);
    });

    const endpoint = dialog.banner ? `/${dialog.banner.id}` : '';
    const method = dialog.banner ? 'PUT' : 'POST';
    await executeAction(() => apiCall(endpoint, { method, body: data }), null, `Banner ${dialog.banner ? 'actualizado' : 'creado'} correctamente`);
    closeDialog();
  };

  useEffect(() => { fetchBanners(); }, []);

  // Paginación y datos actuales
  const totalPages = Math.ceil(banners.length / pageSize);
  const currentBanners = banners.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const MobileCard = ({ banner }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar src={`${import.meta.env.VITE_API_BASE_URL}${banner.imagen}`} variant="rounded" sx={{ width: 80, height: 60 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>{banner.titulo}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {banner.descripcion}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Chip label={banner.activo ? 'Activo' : 'Inactivo'} color={banner.activo ? 'success' : 'default'} size="small" />
              <Typography variant="body2" color="text.secondary">Orden: {banner.orden}</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box>
          <IconButton onClick={() => handleToggleStatus(banner.id, banner.activo)} size="small">
            {banner.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          <IconButton onClick={() => openDialog(banner)} color="primary" size="small"><Edit /></IconButton>
          <IconButton onClick={() => handleDelete(banner.id)} color="error" size="small"><Delete /></IconButton>
        </Box>
        {banner.boton_texto && <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{banner.boton_texto}"</Typography>}
      </CardActions>
    </Card>
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'imagen', headerName: 'Imagen', width: 100,
      renderCell: ({ value }) => <Avatar src={`${import.meta.env.VITE_API_BASE_URL}${value}`} variant="rounded" sx={{ width: 60, height: 40 }} />
    },
    { field: 'titulo', headerName: 'Título', width: 200 },
    { field: 'descripcion', headerName: 'Descripción', width: 250 },
    { field: 'boton_texto', headerName: 'Botón', width: 120 },
    { field: 'orden', headerName: 'Orden', width: 80 },
    {
      field: 'activo', headerName: 'Estado', width: 120,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); handleToggleStatus(row.id, row.activo); }}>
            {row.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          <Chip label={row.activo ? 'Activo' : 'Inactivo'} color={row.activo ? 'success' : 'default'} size="small" />
        </Box>
      )
    },
    {
      field: 'acciones', headerName: 'Acciones', width: 120, sortable: false,
      renderCell: ({ row }) => (
        <Box onClick={e => e.stopPropagation()}>
          <IconButton onClick={() => openDialog(row)} color="primary"><Edit /></IconButton>
          <IconButton onClick={() => handleDelete(row.id)} color="error"><Delete /></IconButton>
        </Box>
      )
    }
  ];

  if (loading) return <Typography>Cargando banners...</Typography>;

  return (
    <Box sx={{ width: '100%', minHeight: '80vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Title>Gestión de Banners</Title>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()} 
          sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#FF5722' } }}>
          {isMobile ? 'Agregar' : 'Agregar Banner'}
        </Button>
      </Box>

      {isMobile ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Por página</InputLabel>
              <Select value={pageSize} label="Por página" onChange={(e) => { setPageSize(e.target.value); setCurrentPage(0); }}>
                {[5, 10, 15, 20].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, banners.length)} de {banners.length}
            </Typography>
          </Box>

          <Box sx={{ px: 1 }}>
            {banners.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>No hay banners para mostrar</Typography>
            ) : (
              currentBanners.map(banner => <MobileCard key={banner.id} banner={banner} />)
            )}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
              <Button size="small" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
                Anterior
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = totalPages <= 5 ? i : currentPage < 3 ? i : currentPage >= totalPages - 3 ? totalPages - 5 + i : currentPage - 2 + i;
                return (
                  <Button key={pageNum} size="small" variant={currentPage === pageNum ? "contained" : "text"}
                    onClick={() => setCurrentPage(pageNum)} sx={{ minWidth: 32, height: 32 }}>
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
        <DataGrid rows={banners} columns={columns} 
          initialState={{ 
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'orden', sort: 'asc' }] }
          }}
          pageSizeOptions={[5, 10, 25, 50]} disableSelectionOnClick autoHeight
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 } },
            '& .MuiDataGrid-footerContainer': { backgroundColor: '#f8fafc' }
          }}
        />
      )}

      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>{dialog.banner ? 'Editar Banner' : 'Crear Nuevo Banner'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {FORM_FIELDS.map(({ name, label, ...props }) => (
              <TextField key={name} fullWidth label={label} name={name} margin="normal"
                value={formData[name]} onChange={handleInputChange} size={isMobile ? 'small' : 'medium'} {...props} />
            ))}
            
            <FormControlLabel control={<Switch checked={formData.activo} onChange={handleInputChange} name="activo" />}
              label="Activo" sx={{ mt: 2, mb: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth size={isMobile ? 'small' : 'medium'}>
                {dialog.banner ? 'Cambiar Imagen' : 'Seleccionar Imagen *'}
                <Input type="file" accept="image/*" onChange={handleFileChange} sx={{ display: 'none' }} />
              </Button>
              
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img src={imagePreview} alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: isMobile ? '150px' : '200px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </Box>
              )}
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
            <Button onClick={closeDialog} size={isMobile ? 'small' : 'medium'}>Cancelar</Button>
            <Button type="submit" variant="contained" size={isMobile ? 'small' : 'medium'}>
              {dialog.banner ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, message: '', action: null })}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent><Typography>{confirm.message}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, message: '', action: null })}>Cancelar</Button>
          <Button onClick={() => { confirm.action?.(); setConfirm({ open: false, message: '', action: null }); }} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}