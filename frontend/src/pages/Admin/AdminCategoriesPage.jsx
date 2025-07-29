import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, IconButton, Snackbar, Alert, Chip, Avatar, Input, Card, CardContent, 
  CardActions, useMediaQuery, useTheme, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import Title from './Title';
import { ToggleOn, ToggleOff, Edit, Add, CloudUpload } from '@mui/icons-material';

const INITIAL_STATE = { nombre: '', imagen: '', activo: true };

export default function AdminCategoriesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, category: null });
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirm, setConfirm] = useState({ open: false, message: '', action: null });

  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/categorias${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, ...options.headers }, ...options
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return response.json();
  };

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const closeSnackbar = (_, reason) => reason !== 'clickaway' && setSnackbar(prev => ({ ...prev, open: false }));

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall('');
      setCategories(data.datos || []);
    } catch (err) {
      setError(err.message);
      showSnackbar(`Error al cargar categorías: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action, successMsg) => {
    try {
      await action();
      showSnackbar(successMsg);
      fetchCategories();
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    }
  };

  const handleToggleStatus = (id, estadoActual) => {
    setConfirm({
      open: true,
      message: `¿${estadoActual ? 'Desactivar' : 'Activar'} categoría?`,
      action: () => executeAction(
        () => apiCall(`/${id}/toggle-activo`, { method: 'PUT' }),
        'Estado actualizado exitosamente'
      )
    });
  };

  const openDialog = (category = null) => {
    if (category) {
      setDialog({ open: true, category });
      setFormData(category);
      setImagePreview(category.imagen ? `${import.meta.env.VITE_API_BASE_URL}${category.imagen}` : null);
    } else {
      setDialog({ open: true, category: null });
      setFormData({ ...INITIAL_STATE, activo: true });
      setImagePreview(null);
    }
    setImageFile(null);
  };

  const closeDialog = () => {
    setDialog({ open: false, category: null });
    setFormData(INITIAL_STATE);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('nombre', formData.nombre);
    if (imageFile) data.append('imagen', imageFile);

    const endpoint = dialog.category ? `/${dialog.category.categoria_id}` : '';
    const method = dialog.category ? 'PUT' : 'POST';
    
    await executeAction(
      () => apiCall(endpoint, { method, body: data }),
      `Categoría ${dialog.category ? 'actualizada' : 'creada'} correctamente`
    );
    closeDialog();
  };

  useEffect(() => { fetchCategories(); }, []);

  // Paginación móvil
  const totalPages = Math.ceil(categories.length / pageSize);
  const currentCategories = categories.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const MobileCard = ({ category }) => (
    <Card sx={{ mb: 2, opacity: category.activo ? 1 : 0.6 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar 
            src={category.imagen ? `${import.meta.env.VITE_API_BASE_URL}${category.imagen}` : null} 
            variant="rounded" 
            sx={{ width: 80, height: 60, flexShrink: 0 }} 
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1 }}>
              {category.nombre}
            </Typography>
            <Chip 
              label={category.activo ? 'Activo' : 'Inactivo'} 
              color={category.activo ? 'success' : 'error'} 
              size="small" 
            />
          </Box>
        </Box>
      </CardContent>
      
      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box>
          <IconButton onClick={() => handleToggleStatus(category.categoria_id, category.activo)} size="small">
            {category.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          <IconButton onClick={() => openDialog(category)} color="primary" size="small">
            <Edit />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          ID: {category.categoria_id}
        </Typography>
      </CardActions>
    </Card>
  );

  const columns = [
    { field: 'categoria_id', headerName: 'ID', width: 90 },
    {
      field: 'imagen', headerName: 'Imagen', width: 100,
      renderCell: ({ value }) => <Avatar src={value ? `${import.meta.env.VITE_API_BASE_URL}${value}` : null} variant="rounded" sx={{ width: 60, height: 40 }} />
    },
    { field: 'nombre', headerName: 'Nombre', width: 300 },
    {
      field: 'activo', headerName: 'Estado', width: 130,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); handleToggleStatus(row.categoria_id, row.activo); }}>
            {row.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          <Chip label={row.activo ? 'Activo' : 'Inactivo'} color={row.activo ? 'success' : 'error'} size="small" />
        </Box>
      ),
    },
    {
      field: 'acciones', headerName: 'Acciones', width: 120, sortable: false,
      renderCell: ({ row }) => (
        <IconButton onClick={(e) => { e.stopPropagation(); openDialog(row); }} color="primary">
          <Edit />
        </IconButton>
      )
    }
  ];

  if (loading) return <Typography>Cargando categorías...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ width: '100%', minHeight: '80vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Title>Gestión de Categorías</Title>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()} 
          sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#FF5722' } }}>
          {isMobile ? 'Agregar' : 'Agregar Categoría'}
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
              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, categories.length)} de {categories.length}
            </Typography>
          </Box>

          <Box sx={{ px: 1 }}>
            {categories.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>No hay categorías</Typography>
            ) : (
              currentCategories.map(category => <MobileCard key={category.categoria_id} category={category} />)
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
        <DataGrid rows={categories} columns={columns} getRowId={(row) => row.categoria_id}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25, 50]} disableSelectionOnClick autoHeight
          getRowClassName={(params) => params.row.activo ? '' : 'category-inactive'}
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 } },
            '& .MuiDataGrid-footerContainer': { backgroundColor: '#f8fafc' },
            '& .category-inactive': { opacity: 0.6, backgroundColor: '#fafafa' }
          }}
        />
      )}

      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>{dialog.category ? 'Editar Categoría' : 'Crear Nueva Categoría'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" name="nombre" label="Nombre de la Categoría" type="text" fullWidth
            value={formData.nombre} onChange={handleInputChange} sx={{ mt: 1 }}
            size={isMobile ? 'small' : 'medium'}
          />
          
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth 
              size={isMobile ? 'small' : 'medium'}>
              {dialog.category ? 'Cambiar Imagen' : 'Seleccionar Imagen *'}
              <Input type="file" accept="image/*" onChange={handleFileChange} sx={{ display: 'none' }} />
            </Button>
            
            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img src={imagePreview} alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: isMobile ? '150px' : '200px', 
                    borderRadius: '8px', 
                    border: '1px solid #ddd' 
                  }} 
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
          <Button onClick={closeDialog} size={isMobile ? 'small' : 'medium'}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" size={isMobile ? 'small' : 'medium'}>
            {dialog.category ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
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