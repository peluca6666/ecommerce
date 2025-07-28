import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, 
  Typography, 
  IconButton, 
  Dialog, 
  DialogTitle,
  DialogContent, 
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Input
} from '@mui/material';
import Title from './Title';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AdminBannersPage() {
  // Estados principales
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del modal
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    boton_texto: '',
    boton_link: '',
    orden: 0,
    activo: true,
    imagen: null
  });

  // Estados para alertas
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Estados para confirmación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleOpenConfirmDialog = (message, action) => {
    setConfirmDialogMessage(message);
    setConfirmAction(() => action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleCancelConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // Cargar banners
  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/banners`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('No se pudieron cargar los banners');
      
      const data = await response.json();
      setBanners(data.datos || []);
    } catch (err) {
      setError(err.message);
      showSnackbar(`Error al cargar banners: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Manejar cambio de estado activo/inactivo
  const handleToggleStatus = async (id, estadoActual) => {
    handleOpenConfirmDialog(
      `¿Seguro que querés ${estadoActual ? 'desactivar' : 'activar'} este banner?`,
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/banners/${id}/toggle-activo`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!response.ok) throw new Error('Error al cambiar el estado');
          
          showSnackbar('Estado del banner cambiado exitosamente.');
          fetchBanners();
        } catch (err) {
          showSnackbar(`Error al cambiar el estado: ${err.message}`, 'error');
        }
      }
    );
  };

  // Abrir modal para crear/editar
  const handleOpenDialog = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        titulo: banner.titulo,
        descripcion: banner.descripcion,
        boton_texto: banner.boton_texto,
        boton_link: banner.boton_link,
        orden: banner.orden,
        activo: banner.activo,
        imagen: null
      });
      setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${banner.imagen}`);
    } else {
      setEditingBanner(null);
      setFormData({
        titulo: '',
        descripcion: '',
        boton_texto: '',
        boton_link: '',
        orden: banners.length,
        activo: true,
        imagen: null
      });
      setImagePreview(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBanner(null);
    setImagePreview(null);
    setFormData({
      titulo: '',
      descripcion: '',
      boton_texto: '',
      boton_link: '',
      orden: 0,
      activo: true,
      imagen: null
    });
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambio de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      showSnackbar('El título es obligatorio', 'error');
      return;
    }

    if (!editingBanner && !formData.imagen) {
      showSnackbar('La imagen es obligatoria', 'error');
      return;
    }

    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('descripcion', formData.descripcion);
    data.append('boton_texto', formData.boton_texto);
    data.append('boton_link', formData.boton_link);
    data.append('orden', formData.orden);
    data.append('activo', formData.activo);
    
    if (formData.imagen) {
      data.append('imagen', formData.imagen);
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingBanner 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/banners/${editingBanner.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/admin/banners`;
      
      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al guardar banner');
      }

      showSnackbar(`Banner ${editingBanner ? 'actualizado' : 'creado'} correctamente`);
      fetchBanners();
      handleCloseDialog();
    } catch (err) {
      showSnackbar(`Error al guardar banner: ${err.message}`, 'error');
    }
  };

  // Eliminar banner
  const handleDelete = async (id) => {
    handleOpenConfirmDialog(
      '¿Estás seguro de eliminar este banner? Esta acción no se puede deshacer.',
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/banners/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!response.ok) throw new Error('Error al eliminar banner');
          
          showSnackbar('Banner eliminado correctamente');
          fetchBanners();
        } catch (err) {
          showSnackbar(`Error al eliminar banner: ${err.message}`, 'error');
        }
      }
    );
  };

  // Definición de columnas
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'imagen',
      headerName: 'Imagen',
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={`${import.meta.env.VITE_API_BASE_URL}${params.value}`}
          variant="rounded"
          sx={{ width: 60, height: 40 }}
        />
      )
    },
    { field: 'titulo', headerName: 'Título', width: 200 },
    { field: 'descripcion', headerName: 'Descripción', width: 250 },
    { field: 'boton_texto', headerName: 'Botón', width: 120 },
    { field: 'orden', headerName: 'Orden', width: 80 },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
          <IconButton onClick={() => handleToggleStatus(params.row.id, params.row.activo)}>
            {params.row.activo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />}
          </IconButton>
          <Chip
            label={params.row.activo ? 'Activo' : 'Inactivo'}
            color={params.row.activo ? 'success' : 'default'}
            size="small"
          />
        </Box>
      )
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box onClick={(e) => e.stopPropagation()}>
          <IconButton onClick={() => handleOpenDialog(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            bgcolor: '#FF6B35',
            '&:hover': { bgcolor: '#FF5722' }
          }}
        >
          Agregar Banner
        </Button>
      </Box>

      <DataGrid
        rows={banners}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center'
          }
        }}
      />

      {/* Dialog para crear/editar banner */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBanner ? 'Editar Banner' : 'Crear Nuevo Banner'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Título"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Texto del Botón"
              name="boton_texto"
              value={formData.boton_texto}
              onChange={handleInputChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Link del Botón"
              name="boton_link"
              value={formData.boton_link}
              onChange={handleInputChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Orden"
              name="orden"
              type="number"
              value={formData.orden}
              onChange={handleInputChange}
              margin="normal"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.activo}
                  onChange={handleInputChange}
                  name="activo"
                />
              }
              label="Activo"
              sx={{ mt: 2, mb: 2 }}
            />

            {/* Campo de imagen */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                {editingBanner ? 'Cambiar Imagen' : 'Seleccionar Imagen *'}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  sx={{ display: 'none' }}
                />
              </Button>
              
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingBanner ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog de confirmación */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelConfirmDialog}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirmDialog}>Cancelar</Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}