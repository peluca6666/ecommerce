import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Switch, FormControlLabel, Snackbar, Alert, Chip, Avatar, Input,
  useTheme, useMediaQuery, Fab
} from '@mui/material';
import Title from './Title';
import { ToggleOn, ToggleOff, Edit, Delete, Add, CloudUpload } from '@mui/icons-material';

// Configuraciones
const FORM_FIELDS = [
  { name: 'titulo', label: 'Título', required: true },
  { name: 'descripcion', label: 'Descripción', multiline: true, rows: 3 },
  { name: 'boton_texto', label: 'Texto del Botón' },
  { name: 'boton_link', label: 'Link del Botón' },
  { name: 'orden', label: 'Orden', type: 'number' }
];

const INITIAL_FORM = { titulo: '', descripcion: '', boton_texto: '', boton_link: '', orden: 0, activo: true, imagen: null };

// Hook para API
const useApiCall = () => {
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/banners${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, ...options.headers }, ...options
    });
    if (!response.ok) throw new Error(options.errorMessage || 'Error en la operación');
    return response.json();
  };
  return { apiCall };
};

// Hook para notificaciones
const useNotification = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showNotification = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const closeNotification = (_, reason) => reason !== 'clickaway' && setSnackbar(prev => ({ ...prev, open: false }));
  return { snackbar, showNotification, closeNotification };
};

// Hook para confirmaciones
const useConfirmation = () => {
  const [confirm, setConfirm] = useState({ open: false, message: '', action: null });
  const showConfirmation = (message, action) => setConfirm({ open: true, message, action: () => action });
  const handleConfirm = () => { confirm.action(); closeConfirmation(); };
  const closeConfirmation = () => setConfirm({ open: false, message: '', action: null });
  return { confirm, showConfirmation, handleConfirm, closeConfirmation };
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { apiCall } = useApiCall();
  const { snackbar, showNotification, closeNotification } = useNotification();
  const { confirm, showConfirmation, handleConfirm, closeConfirmation } = useConfirmation();

  // Funciones de API
  const fetchBanners = async () => {
    try {
      const data = await apiCall('');
      setBanners(data.datos || []);
    } catch (err) {
      setError(err.message);
      showNotification(`Error al cargar banners: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleBannerStatus = async (id) => {
    try {
      await apiCall(`/${id}/toggle-activo`, { method: 'PUT' });
      showNotification('Estado cambiado exitosamente.');
      fetchBanners();
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const saveBanner = async (data) => {
    const endpoint = editingBanner ? `/${editingBanner.id}` : '';
    const method = editingBanner ? 'PUT' : 'POST';
    try {
      await apiCall(endpoint, { method, body: data });
      showNotification(`Banner ${editingBanner ? 'actualizado' : 'creado'} correctamente`);
      fetchBanners();
      closeDialog();
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const deleteBanner = async (id) => {
    try {
      await apiCall(`/${id}`, { method: 'DELETE' });
      showNotification('Banner eliminado correctamente');
      fetchBanners();
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Manejadores de eventos
  const handleToggleStatus = (id, estadoActual) => {
    showConfirmation(
      `¿Seguro que querés ${estadoActual ? 'desactivar' : 'activar'} este banner?`,
      () => toggleBannerStatus(id)
    );
  };

  const handleDelete = (id) => {
    showConfirmation('¿Eliminar este banner?', () => deleteBanner(id));
  };

  const openDialog = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({ ...banner, imagen: null });
      setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${banner.imagen}`);
    } else {
      setEditingBanner(null);
      setFormData({ ...INITIAL_FORM, orden: banners.length });
      setImagePreview(null);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingBanner(null);
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
    if (!editingBanner && !formData.imagen) return showNotification('La imagen es obligatoria', 'error');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'imagen' && value) data.append(key, value);
      else if (key !== 'imagen') data.append(key, value);
    });
    await saveBanner(data);
  };

  useEffect(() => { fetchBanners(); }, []);

  // Configuración de columnas - responsiva automáticamente con DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70, hide: isMobile },
    {
      field: 'imagen', headerName: 'Imagen', width: isMobile ? 80 : 100,
      renderCell: ({ value }) => <Avatar src={`${import.meta.env.VITE_API_BASE_URL}${value}`} variant="rounded" sx={{ width: isMobile ? 40 : 60, height: isMobile ? 30 : 40 }} />
    },
    { field: 'titulo', headerName: 'Título', flex: 1, minWidth: 150 },
    { field: 'descripcion', headerName: 'Descripción', flex: 1, minWidth: 200, hide: isMobile },
    { field: 'boton_texto', headerName: 'Botón', width: 120, hide: isMobile },
    { field: 'orden', headerName: 'Orden', width: 80, hide: isMobile },
    {
      field: 'activo', headerName: 'Estado', width: isMobile ? 100 : 140,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} onClick={e => e.stopPropagation()}>
          <IconButton onClick={() => handleToggleStatus(row.id, row.activo)} size="small">
            {row.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          {!isMobile && <Chip label={row.activo ? 'Activo' : 'Inactivo'} color={row.activo ? 'success' : 'default'} size="small" />}
        </Box>
      )
    },
    {
      field: 'acciones', headerName: 'Acciones', width: isMobile ? 80 : 120, sortable: false,
      renderCell: ({ row }) => (
        <Box onClick={e => e.stopPropagation()}>
          <IconButton onClick={() => openDialog(row)} color="primary" size="small"><Edit /></IconButton>
          <IconButton onClick={() => handleDelete(row.id)} color="error" size="small"><Delete /></IconButton>
        </Box>
      )
    }
  ];

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando banners...</Typography>;
  if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%', p: { xs: 1, sm: 2 } }}>
      {/* Header responsive */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Title>Gestión de Banners</Title>
        {!isMobile && (
          <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()} 
            sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#FF5722' } }}>
            Agregar Banner
          </Button>
        )}
      </Box>

      {/* DataGrid con configuración responsive automática */}
      <DataGrid 
        rows={banners} 
        columns={columns} 
        pageSize={isMobile ? 5 : 10}
        rowsPerPageOptions={isMobile ? [5, 10] : [10, 25, 50]}
        disableSelectionOnClick 
        autoHeight={isMobile}
        density={isMobile ? 'compact' : 'standard'}
        sx={{ 
          '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5' },
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }} 
      />

      {/* FAB solo para móvil */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={() => openDialog()}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#FF6B35',
            '&:hover': { bgcolor: '#FF5722' }
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Dialog responsive */}
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>{editingBanner ? 'Editar Banner' : 'Crear Nuevo Banner'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {FORM_FIELDS.map(({ name, label, ...props }) => (
              <TextField key={name} fullWidth label={label} name={name} margin="normal"
                value={formData[name]} onChange={handleInputChange} size={isMobile ? "small" : "medium"} {...props} />
            ))}
            
            <FormControlLabel
              control={<Switch checked={formData.activo} onChange={handleInputChange} name="activo" />}
              label="Activo" sx={{ mt: 2, mb: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth>
                {editingBanner ? 'Cambiar Imagen' : 'Seleccionar Imagen *'}
                <Input type="file" accept="image/*" onChange={handleFileChange} sx={{ display: 'none' }} />
              </Button>
              
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img src={imagePreview} alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </Box>
              )}
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 1, p: 2 }}>
            <Button onClick={closeDialog} fullWidth={isMobile}>Cancelar</Button>
            <Button type="submit" variant="contained" fullWidth={isMobile}
              sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#FF5722' } }}>
              {editingBanner ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}>
        <Alert onClose={closeNotification} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={confirm.open} onClose={closeConfirmation}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent><Typography>{confirm.message}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmation}>Cancelar</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}