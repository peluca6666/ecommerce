import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Switch, FormControlLabel, Snackbar, Alert, Chip, Avatar, Input
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

// Hook para API - ARREGLADO para manejar FormData correctamente
const useApiCall = () => {
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // NO agregar Content-Type si es FormData (el navegador lo maneja automáticamente)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/banners${endpoint}`, {
      headers: { ...headers, ...options.headers }, 
      ...options
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

  // ARREGLADO - Mejor manejo del FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return showNotification('El título es obligatorio', 'error');
    if (!editingBanner && !formData.imagen) return showNotification('La imagen es obligatoria', 'error');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'imagen') {
        // Solo agregar imagen si hay una nueva seleccionada
        if (value instanceof File) {
          data.append(key, value);
        }
      } else {
        // Convertir todos los valores a string para FormData
        data.append(key, String(value));
      }
    });
    
    console.log('Enviando FormData:', [...data.entries()]); // Para debug
    await saveBanner(data);
  };

  useEffect(() => { fetchBanners(); }, []);

  // Configuración de columnas
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
        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
          <IconButton onClick={() => handleToggleStatus(row.id, row.activo)}>
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
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Title>Gestión de Banners</Title>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()} 
          sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#FF5722' } }}>
          Agregar Banner
        </Button>
      </Box>

      <DataGrid rows={banners} columns={columns} pageSize={10} disableSelectionOnClick 
        sx={{ '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' } }} />

      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBanner ? 'Editar Banner' : 'Crear Nuevo Banner'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {FORM_FIELDS.map(({ name, label, ...props }) => (
              <TextField key={name} fullWidth label={label} name={name} margin="normal"
                value={formData[name]} onChange={handleInputChange} {...props} />
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
          
          <DialogActions>
            <Button onClick={closeDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">{editingBanner ? 'Actualizar' : 'Crear'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
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