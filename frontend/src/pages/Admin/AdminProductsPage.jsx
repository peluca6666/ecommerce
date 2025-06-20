import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, Button, Typography, Dialog, DialogActions, DialogContent, 
  DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl, 
  styled, Grid, IconButton 
} from '@mui/material';
import Title from './Title';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

// Estado inicial para crear/editar producto con campos vacíos
const initialProductState = {
  nombre_producto: '',
  descripcion: '',
  precio: '',
  precio_anterior: '',
  stock_actual: '',
  categoria_id: '',
};

// Input invisible para estilizar botones de subir archivo
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
  // --- ESTADOS DEL COMPONENTE ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [open, setOpen] = useState(false); 
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [categories, setCategories] = useState([]); 
  const [editingProduct, setEditingProduct] = useState(null); 
  const [mainImageFile, setMainImageFile] = useState(null); 
  const [secondaryImageFiles, setSecondaryImageFiles] = useState([]); 

  // --- FETCH DE PRODUCTOS DESDE LA API ---
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token'); // Token para autenticación
      const response = await fetch('http://localhost:3000/api/producto', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudo conectar con la API de productos');
      const data = await response.json();
      setProducts(data.datos || []); // Actualiza estado con productos recibidos
    } catch (err) {
      setError(err.message); // Manejo simple de error
    } finally {
      setLoading(false); // Finaliza estado de carga
    }
  };

  // --- USEEFFECT PARA CARGAR CATEGORÍAS Y PRODUCTOS AL MONTAR ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categoria');
        if (!response.ok) throw new Error('No se pudieron cargar las categorías');
        const data = await response.json();
        setCategories(data.datos || []); // Actualiza estado con categorías
      } catch (catError) {
        console.error("Error fetching categories:", catError);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  // --- MANEJADORES DE EVENTOS ---

  // Cierra el modal y resetea estados de producto e imágenes
  const handleClose = () => {
    setOpen(false);
    setNewProduct(initialProductState);
    setEditingProduct(null);
    setMainImageFile(null);
    setSecondaryImageFiles([]);
  };

  // Abre modal con datos para editar un producto
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product }); // Clona producto para editar sin mutar original
    setOpen(true);
  };

  // Actualiza los campos del formulario de producto conforme se escriben
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Selección de imagen principal
  const handleFileChange = (e) => {
    if (e.target.files[0]) setMainImageFile(e.target.files[0]);
  };

  // Selección de imágenes secundarias 
  const handleMultipleFileChange = (e) => {
    if (e.target.files) setSecondaryImageFiles(Array.from(e.target.files));
  };

  // Cambia el estado activo/inactivo de un producto 
  const handleToggleActivo = async (id, estadoActual) => {
    const confirmacion = window.confirm(`¿Estás seguro de que querés ${estadoActual ? 'DESACTIVAR' : 'ACTIVAR'} este producto?`);
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/producto/${id}/toggle-activo`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falló al cambiar el estado del producto');
      alert('Estado del producto actualizado con éxito');
      fetchProducts(); // Refresca lista después de cambiar estado
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // --- FUNCIONES PARA CREAR Y ACTUALIZAR PRODUCTOS ---

  // Crear un nuevo producto enviando formulario con archivos
  const handleCreateProduct = async () => {
    const formData = new FormData();
    Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
    if (mainImageFile) formData.append('imagen', mainImageFile);
    if (secondaryImageFiles.length > 0) {
      secondaryImageFiles.forEach(file => formData.append('imagenes', file));
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/producto', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData, 
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Falló la creación del producto');
      }
      alert('¡Producto creado con éxito!'); 
      handleClose();
      fetchProducts(); // Refresca la lista para mostrar nuevo producto
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Actualizar un producto existente con datos y archivos nuevos
  const handleUpdateProduct = async () => {
    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
      if (newProduct[key] !== null && newProduct[key] !== undefined) {
        formData.append(key, newProduct[key]);
      }
    });

    if (mainImageFile) formData.append('imagen', mainImageFile);
    if (secondaryImageFiles.length > 0) {
      secondaryImageFiles.forEach(file => formData.append('imagenes', file));
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/producto/${editingProduct.producto_id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData, // FormData maneja Content-Type automáticamente
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Falló la actualización del producto');
      }
      alert('¡Producto actualizado con éxito!');
      handleClose();
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // --- DEFINICIÓN DE LAS COLUMNAS DE LA TABLA ---

  const columns = [
    { field: 'producto_id', headerName: 'ID', width: 70 },
    { field: 'nombre_producto', headerName: 'Nombre', width: 250 },
    { field: 'nombre_categoria', headerName: 'Categoría', width: 150 },
    { field: 'precio', headerName: 'Precio', type: 'number', width: 100 },
    { field: 'stock_actual', headerName: 'Stock', type: 'number', width: 90 },
    { 
      field: 'activo', 
      headerName: 'Estado', 
      width: 110,
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
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleToggleActivo(params.row.producto_id, params.row.activo)}>
            {params.row.activo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />}
          </IconButton>
        </Box>
      ),
    },
  ];

  // --- RENDERIZADO ---

  if (loading) return <Typography>Cargando productos...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Title>Gestión de Productos</Title>

      {/* Botón para abrir modal de creación */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => { setEditingProduct(null); setOpen(true); }}>
          Crear Nuevo Producto
        </Button>
      </Box>

      {/* Tabla de productos */}
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.producto_id}
      />

      {/* Modal para creación/edición */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Campos de texto y select para datos */}
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
              {/* Select para elegir categoría */}
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

            {/* Botón para seleccionar imagen principal */}
            <Grid item xs={12}>
              <Button component="label" variant="contained" onChange={handleFileChange}>
                Seleccionar Imagen Principal
                <VisuallyHiddenInput type="file" />
              </Button>
              {mainImageFile && <Typography sx={{ display: 'inline', ml: 2 }}>{mainImageFile.name}</Typography>}
            </Grid>

            {/* Botón para seleccionar imágenes secundarias */}
            <Grid item xs={12}>
              <Button component="label" variant="outlined" onChange={handleMultipleFileChange}>
                Seleccionar Imágenes Secundarias
                <VisuallyHiddenInput type="file" multiple />
              </Button>
              {secondaryImageFiles.length > 0 && <Typography sx={{ display: 'inline', ml: 2 }}>{secondaryImageFiles.length} archivos seleccionados</Typography>}
            </Grid>
          </Grid>
        </DialogContent>

        {/* Botones para cancelar o guardar */}
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
