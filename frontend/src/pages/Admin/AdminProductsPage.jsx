import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, Select, MenuItem, InputLabel, FormControl, Grid, IconButton,
  Snackbar, Alert, Chip, Input, Card, CardContent, CardActions, useMediaQuery, useTheme
} from '@mui/material';
import Title from './Title';
import { ToggleOn, ToggleOff, Edit, Add, CloudUpload } from '@mui/icons-material';

const INITIAL_STATE = { nombre_producto: '', descripcion: '', precio: '', precio_anterior: '', stock_actual: '', categoria_id: '' };

export default function AdminProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, product: null });
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [secondaryImageFiles, setSecondaryImageFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirm, setConfirm] = useState({ open: false, message: '', action: null });

  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/producto${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, ...options.headers }, ...options
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return response.json();
  };

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const fetchData = async () => {
    try {
      const [productsData, categoriesRes] = await Promise.all([
        apiCall('?incluirInactivos=true'),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categoria`)
      ]);
      setProducts(productsData.datos || []);
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.datos || []);
      }
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action, successMsg) => {
    try {
      await action();
      showSnackbar(successMsg);
      fetchData();
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    }
  };

  const handleToggleActivo = (id, estadoActual) => {
    setConfirm({
      open: true,
      message: `¿${estadoActual ? 'Desactivar' : 'Activar'} producto?`,
      action: () => executeAction(() => apiCall(`/${id}/toggle-activo`, { method: 'PUT' }), 'Estado actualizado')
    });
  };

  const openDialog = (product = null) => {
    setDialog({ open: true, product });
    setFormData(product ? { ...product } : INITIAL_STATE);
    setMainImageFile(null);
    setSecondaryImageFiles([]);
  };

  const closeDialog = () => {
    setDialog({ open: false, product: null });
    setFormData(INITIAL_STATE);
    setMainImageFile(null);
    setSecondaryImageFiles([]);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => value && data.append(key, value));
    if (mainImageFile) data.append('imagen', mainImageFile);
    secondaryImageFiles.forEach(file => data.append('imagenes', file));

    const endpoint = dialog.product ? `/${dialog.product.producto_id}` : '';
    const method = dialog.product ? 'PUT' : 'POST';
    
    await executeAction(() => apiCall(endpoint, { method, body: data }), `Producto ${dialog.product ? 'actualizado' : 'creado'}`);
    closeDialog();
  };

  useEffect(() => { fetchData(); }, []);

  const totalPages = Math.ceil(products.length / pageSize);
  const currentProducts = products.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const MobileCard = ({ product }) => (
    <Card sx={{ mb: 2, opacity: product.activo ? 1 : 0.6 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
          {product.nombre_producto}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.nombre_categoria}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', color: 'primary.main', fontWeight: 600 }}>
            ${Number(product.precio).toLocaleString('es-AR')}
          </Typography>
          {product.precio_anterior && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              ${Number(product.precio_anterior).toLocaleString('es-AR')}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label={`Stock: ${product.stock_actual}`} size="small" variant="outlined" />
          <Chip label={product.activo ? 'Activo' : 'Inactivo'} color={product.activo ? 'success' : 'error'} size="small" />
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box>
          <IconButton onClick={() => handleToggleActivo(product.producto_id, product.activo)} size="small">
            {product.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          <IconButton onClick={() => openDialog(product)} color="primary" size="small">
            <Edit />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">ID: {product.producto_id}</Typography>
      </CardActions>
    </Card>
  );

  const FormSection = ({ title, emoji, children }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
        {emoji} {title}
      </Typography>
      {children}
    </Box>
  );

  const FileUpload = ({ label, multiple, onChange, file, files }) => (
    <Box sx={{ border: '2px dashed #e0e0e0', borderRadius: 2, p: 2, textAlign: 'center', backgroundColor: '#fafafa' }}>
      <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth size={isMobile ? 'small' : 'medium'}>
        {label}
        <Input type="file" accept="image/*" multiple={multiple} onChange={onChange} sx={{ display: 'none' }} />
      </Button>
      {file && <Typography variant="body2" sx={{ color: 'success.main', mt: 1 }}>✓ {file.name}</Typography>}
      {files?.length > 0 && <Typography variant="body2" sx={{ color: 'success.main', mt: 1 }}>✓ {files.length} imagen{files.length > 1 ? 'es' : ''}</Typography>}
    </Box>
  );

  const columns = [
    { field: 'producto_id', headerName: 'ID', width: 70 },
    { field: 'nombre_producto', headerName: 'Nombre', width: 250 },
    { field: 'nombre_categoria', headerName: 'Categoría', width: 150 },
    { field: 'precio', headerName: 'Precio', width: 100, valueFormatter: (value) => `$${Number(value).toLocaleString('es-AR')}` },
    { field: 'stock_actual', headerName: 'Stock', width: 90 },
    {
      field: 'activo', headerName: 'Estado', width: 130,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); handleToggleActivo(row.producto_id, row.activo); }}>
            {row.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          <Chip label={row.activo ? 'Activo' : 'Inactivo'} color={row.activo ? 'success' : 'error'} size="small" />
        </Box>
      ),
    },
    {
      field: 'acciones', headerName: 'Acciones', width: 120, sortable: false,
      renderCell: ({ row }) => (
        <IconButton onClick={(e) => { e.stopPropagation(); openDialog(row); }} color="primary"><Edit /></IconButton>
      ),
    },
  ];

  if (loading) return <Typography>Cargando productos...</Typography>;

  return (
    <Box sx={{ width: '100%', minHeight: '80vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Title>Gestión de Productos</Title>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()} 
          sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#FF5722' } }}>
          {isMobile ? 'Agregar' : 'Agregar Producto'}
        </Button>
      </Box>

      {isMobile ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Por página</InputLabel>
              <Select value={pageSize} onChange={(e) => { setPageSize(e.target.value); setCurrentPage(0); }}>
                {[5, 10, 15, 20].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, products.length)} de {products.length}
            </Typography>
          </Box>

          <Box sx={{ px: 1 }}>
            {products.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>No hay productos</Typography>
            ) : (
              currentProducts.map(product => <MobileCard key={product.producto_id} product={product} />)
            )}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
              <Button size="small" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = totalPages <= 5 ? i : currentPage < 3 ? i : currentPage >= totalPages - 3 ? totalPages - 5 + i : currentPage - 2 + i;
                return (
                  <Button key={pageNum} size="small" variant={currentPage === pageNum ? "contained" : "text"}
                    onClick={() => setCurrentPage(pageNum)} sx={{ minWidth: 32, height: 32 }}>
                    {pageNum + 1}
                  </Button>
                );
              })}
              <Button size="small" disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</Button>
            </Box>
          )}
        </Box>
      ) : (
        <DataGrid rows={products} columns={columns} getRowId={(row) => row.producto_id}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25, 50]} disableSelectionOnClick autoHeight
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 } },
            '& .MuiDataGrid-footerContainer': { backgroundColor: '#f8fafc' },
            '& .MuiDataGrid-row:not(.Mui-selected):hover': { opacity: 0.8 }
          }}
        />
      )}

      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
          {dialog.product ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormSection title="Información Básica" emoji="📝">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField name="nombre_producto" label="Nombre del Producto *" fullWidth required
                  value={formData.nombre_producto} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField name="descripcion" label="Descripción" fullWidth multiline rows={3}
                  value={formData.descripcion} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categoría *</InputLabel>
                  <Select name="categoria_id" value={formData.categoria_id} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}>
                    {categories.map(cat => <MenuItem key={cat.categoria_id} value={cat.categoria_id}>{cat.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </FormSection>

          <FormSection title="Precios y Stock" emoji="💰">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField name="precio" label="Precio *" type="number" fullWidth required
                  value={formData.precio} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField name="precio_anterior" label="Precio Anterior" type="number" fullWidth
                  value={formData.precio_anterior} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }} helperText="Solo si está en oferta" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField name="stock_actual" label="Stock *" type="number" fullWidth required
                  value={formData.stock_actual} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection title="Imágenes" emoji="🖼️">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FileUpload label="Imagen Principal *" file={mainImageFile} 
                  onChange={(e) => e.target.files[0] && setMainImageFile(e.target.files[0])} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUpload label="Imágenes Adicionales" multiple files={secondaryImageFiles}
                  onChange={(e) => e.target.files && setSecondaryImageFiles(Array.from(e.target.files))} />
              </Grid>
            </Grid>
          </FormSection>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialog.product ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, message: '', action: null })}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent><Typography>{confirm.message}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, message: '', action: null })}>Cancelar</Button>
          <Button onClick={() => { confirm.action?.(); setConfirm({ open: false, message: '', action: null }); }} autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}