import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Button, Typography, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl,
  styled, Grid, IconButton,
  Snackbar, Alert, Chip, Avatar, Input
} from '@mui/material';
import Title from './Title';
import { ToggleOn, ToggleOff, Edit, Add, CloudUpload } from '@mui/icons-material';

// estado inicial para crear o editar producto
const initialProductState = {
  nombre_producto: '',
  descripcion: '',
  precio: '',
  precio_anterior: '',
  stock_actual: '',
  categoria_id: '',
};

// input invisible para estilizar botones de subir archivos
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

export default function AdminProductsPage() {
  // --- estados del componente ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [secondaryImageFiles, setSecondaryImageFiles] = useState([]);

  // estados para snackbar (alertas)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // estados para diálogo de confirmación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  // muestra snackbar con mensaje y severidad
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // cierra snackbar
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

  // confirma acción del diálogo
  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // cancela diálogo
  const handleCancelConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  // --- fetch de productos desde API ---
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/producto?incluirInactivos=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('no se pudo conectar con la API de productos');
      const data = await response.json();
      setProducts(data.datos || []);
    } catch (err) {
      setError(err.message);
      showSnackbar(`Error al cargar productos: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- useEffect para cargar categorías y productos al montar ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categoria`);
        if (!response.ok) throw new Error('no se pudieron cargar las categorías');
        const data = await response.json();
        setCategories(data.datos || []);
      } catch (catError) {
        console.error("Error fetching categories:", catError);
        showSnackbar(`Error al cargar categorías: ${catError.message}`, 'error');
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  // --- manejadores de eventos ---

  // cierra modal y resetea estados
  const handleClose = () => {
    setOpen(false);
    setNewProduct(initialProductState);
    setEditingProduct(null);
    setMainImageFile(null);
    setSecondaryImageFiles([]);
  };

  // abre modal para editar producto
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product });
    setOpen(true);
  };

  // actualiza campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // selecciona imagen principal
  const handleFileChange = (e) => {
    if (e.target.files[0]) setMainImageFile(e.target.files[0]);
  };

  // selecciona imágenes secundarias
  const handleMultipleFileChange = (e) => {
    if (e.target.files) setSecondaryImageFiles(Array.from(e.target.files));
  };

  // cambia estado activo/inactivo con confirmación
  const handleToggleActivo = async (id, estadoActual) => {
    handleOpenConfirmDialog(
      `¿Estás seguro de que querés ${estadoActual ? 'desactivar' : 'activar'} este producto?`,
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/producto/${id}/toggle-activo`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Falló al cambiar el estado del producto');
          showSnackbar('Estado del producto actualizado con éxito', 'success');
          fetchProducts();
        } catch (err) {
          showSnackbar(`Error: ${err.message}`, 'error');
        }
      }
    );
  };

  // crea un producto enviando formulario con archivos
  const handleCreateProduct = async () => {
    const formData = new FormData();
    Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
    if (mainImageFile) formData.append('imagen', mainImageFile);
    if (secondaryImageFiles.length > 0)
      secondaryImageFiles.forEach(file => formData.append('imagenes', file));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/producto`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'falló la creación del producto');
      }
      showSnackbar('¡Producto creado con éxito!', 'success');
      handleClose();
      fetchProducts();
    } catch (err) {
      setError(err.message);
      showSnackbar(`Error: ${err.message}`, 'error');
    }
  };

  // actualiza producto existente
  const handleUpdateProduct = async () => {
    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
      if (newProduct[key] !== null && newProduct[key] !== undefined) {
        formData.append(key, newProduct[key]);
      }
    });
    if (mainImageFile) formData.append('imagen', mainImageFile);
    if (secondaryImageFiles.length > 0)
      secondaryImageFiles.forEach(file => formData.append('imagenes', file));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/producto/${editingProduct.producto_id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'falló la actualización del producto');
      }
      showSnackbar('¡Producto actualizado con éxito!', 'success');
      handleClose();
      fetchProducts();
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    }
  };

  // --- definición de columnas para la tabla ---
  const columns = [
    { field: 'producto_id', headerName: 'ID', width: 70 },
    { field: 'nombre_producto', headerName: 'Nombre', width: 250 },
    { field: 'nombre_categoria', headerName: 'Categoría', width: 150 },
    { field: 'precio', headerName: 'Precio', type: 'number', width: 100 },
    { field: 'stock_actual', headerName: 'Stock', type: 'number', width: 90 },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 130,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); handleToggleActivo(row.producto_id, row.activo); }}>
            {row.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          <Chip label={row.activo ? 'Activo' : 'Inactivo'} color={row.activo ? 'success' : 'default'} size="small" />
        </Box>
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Box onClick={e => e.stopPropagation()}>
          <IconButton onClick={() => handleEditClick(row)} color="primary"><Edit /></IconButton>
        </Box>
      ),
    },
  ];

  // --- renderizado ---

  if (loading) return <Typography>Cargando productos...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Title>Gestión de Productos</Title>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => { setEditingProduct(null); setNewProduct(initialProductState); setOpen(true); }}
          sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#FF5722' } }}
        >
          Agregar Producto
        </Button>
      </Box>

      {/* tabla de productos */}
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.producto_id}
        pageSize={10}
        disableSelectionOnClick
      />

      {/* modal para creación/edición */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* campos de texto y select para datos */}
            <Grid item xs={12}>
              <TextField
                name="nombre_producto"
                label="Nombre del Producto"
                fullWidth
                variant="outlined"
                value={newProduct.nombre_producto}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descripcion"
                label="Descripción"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={newProduct.descripcion}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="precio"
                label="Precio"
                type="number"
                fullWidth
                variant="outlined"
                value={newProduct.precio}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="precio_anterior"
                label="Precio anterior (Oferta)"
                type="number"
                fullWidth
                variant="outlined"
                value={newProduct.precio_anterior}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stock_actual"
                label="Stock Actual"
                type="number"
                fullWidth
                variant="outlined"
                value={newProduct.stock_actual}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="categoria_id"
                  value={newProduct.categoria_id}
                  label="Categoría"
                  onChange={handleInputChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.categoria_id} value={cat.categoria_id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* botón para seleccionar imagen principal */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth>
                Seleccionar imagen principal
                <Input type="file" onChange={handleFileChange} sx={{ display: 'none' }} />
              </Button>
              {mainImageFile && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Archivo: {mainImageFile.name}
                </Typography>
              )}
            </Grid>

            {/* botón para seleccionar imágenes secundarias */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth>
                Seleccionar imágenes secundarias
                <Input type="file" multiple onChange={handleMultipleFileChange} sx={{ display: 'none' }} />
              </Button>
              {secondaryImageFiles.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  {secondaryImageFiles.length} archivos seleccionados
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        {/* botones cancelar y guardar */}
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
            variant="contained"
          >
            {editingProduct ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* snackbar para mensajes */}
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

      {/* diálogo de confirmación */}
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
    </Box>
  );
}