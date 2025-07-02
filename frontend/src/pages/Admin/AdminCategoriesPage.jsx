import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, styled, IconButton, Snackbar, Alert} from '@mui/material';
import Title from './Title';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

// input oculto para subir archivo, queda escondido visualmente
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// estado inicial para crear o editar categoría
const initialCategoryState = { nombre: '', imagen: '', activo: true };

export default function AdminCategoriesPage() {
  // estados para las categorías, carga, modales y formularios
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState(initialCategoryState);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  // estados para snackbar (alertas)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // estados para diálogo de confirmación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // guarda función a ejecutar

  // muestra snackbar con mensaje y tipo
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // cierra snackbar salvo que se haga click fuera
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // abre confirm dialog con mensaje y acción
  const handleOpenConfirmDialog = (message, action) => {
    setConfirmDialogMessage(message);
    setConfirmAction(() => action);
    setConfirmDialogOpen(true);
  };

  // confirma la acción guardada y cierra diálogo
  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // cancela confirm dialog
  const handleCancelConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // trae categorías desde el backend
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/categorias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudieron cargar las categorías');
      const data = await response.json();
      setCategories(data.datos || []);
    } catch (err) {
      console.error("Error al buscar categorías:", err);
      setError(err.message);
      showSnackbar(`Error al cargar categorías: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // fetch al montar el componente
  useEffect(() => { fetchCategories(); }, []);

  // cierra modal y limpia estados de formulario y edición
  const handleClose = () => {
    setOpen(false);
    setNewCategory(initialCategoryState);
    setEditingCategory(null);
    setImageFile(null);
  };

  // abre modal para editar categoría cargando datos
  const handleEditClick = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
    setOpen(true);
  };

  // actualiza formulario al cambiar input
  const handleInputChange = (e) => setNewCategory({ ...newCategory, [e.target.name]: e.target.value });

  // actualiza archivo imagen al seleccionar
  const handleFileChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  // activa o desactiva categoría con confirmación
  const handleToggleStatus = async (id, estadoActual) => {
    handleOpenConfirmDialog(
      `¿Estás seguro de que querés ${estadoActual ? 'DESACTIVAR' : 'ACTIVAR'} esta categoría?`,
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/categorias/${id}/toggle-activo`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Falló al cambiar el estado de la categoría');
          showSnackbar('Estado actualizado con éxito', 'success');
          fetchCategories();
        } catch (error) {
          showSnackbar(`Error: ${error.message}`, 'error');
        }
      }
    );
  };

  // envía formulario para crear o editar categoría
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nombre', newCategory.nombre);
    if (imageFile) formData.append('imagen', imageFile);

    const token = localStorage.getItem('token');
    const url = editingCategory
      ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/categorias/${editingCategory.categoria_id}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/admin/categorias`;
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'La operación falló');
      }
      showSnackbar(`Categoría ${editingCategory ? 'actualizada' : 'creada'} con éxito`, 'success');
      handleClose();
      fetchCategories();
    } catch (error) {
      showSnackbar(`Error: ${error.message}`, 'error');
    }
  };

  // columnas para DataGrid
  const columns = [
    { field: 'categoria_id', headerName: 'ID', width: 90 },
    {
      field: 'imagen',
      headerName: 'Imagen',
      width: 100,
      renderCell: (params) => {
        const imageUrl = params.value ? `${import.meta.env.VITE_API_BASE_URL}${params.value}` : null;
        return imageUrl
          ? <img src={imageUrl} alt={params.row.nombre} style={{ width: 50, height: 50, objectFit: 'cover' }} />
          : <Typography variant="caption">Sin imagen</Typography>;
      }
    },
    { field: 'nombre', headerName: 'Nombre', width: 300 },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => (
        <Typography color={params.row.activo ? 'green' : 'red'}>
          {params.row.activo ? 'Activo' : 'Inactivo'}
        </Typography>
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEditClick(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleToggleStatus(params.row.categoria_id, params.row.activo)}>
            {params.row.activo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />}
          </IconButton>
        </Box>
      )
    }
  ];

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Title>Gestión de Categorías</Title>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => { setEditingCategory(null); setNewCategory(initialCategoryState); setOpen(true); }}
      >
        Crear Nueva Categoría
      </Button>

      <DataGrid
        rows={categories}
        columns={columns}
        getRowId={(row) => row.categoria_id}
        loading={loading}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nombre"
            label="Nombre de la Categoría"
            type="text"
            fullWidth
            value={newCategory.nombre}
            onChange={handleInputChange}
            sx={{ mt: 1 }}
          />
          <Button component="label" variant="outlined" sx={{ mt: 2 }}>
            {imageFile ? imageFile.name : (editingCategory?.imagen ? 'Cambiar Imagen' : 'Seleccionar Imagen')}
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          {imageFile && (
            <Typography variant="body2" sx={{ ml: 2, display: 'inline-block' }}>
              Archivo: {imageFile.name}
            </Typography>
          )}
          {editingCategory && !imageFile && editingCategory.imagen && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Imagen actual:</Typography>
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${editingCategory.imagen}`}
                alt="imagen actual de categoría"
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', border: '1px solid #ccc' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>

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

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmación</DialogTitle>
        <DialogContent>
          <Typography id="confirm-dialog-description">
            {confirmDialogMessage}
          </Typography>
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
