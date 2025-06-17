import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Title from './Title';

const columns = [
  { field: 'producto_id', headerName: 'ID', width: 70 },
  { field: 'nombre_producto', headerName: 'Nombre del Producto', width: 300 },
  { field: 'nombre_categoria', headerName: 'Categoría', width: 180 },
  { field: 'precio', headerName: 'Precio', type: 'number', width: 130 },
  { field: 'stock_actual', headerName: 'Stock', type: 'number', width: 100 },
  { 
    field: 'activo', 
    headerName: 'Estado', 
    width: 130,
    renderCell: (params) => (
      <Typography color={params.value ? 'green' : 'red'}>
        {params.value ? 'Activo' : 'Inactivo'}
      </Typography>
    ),
  },
];

const initialProductState = {
  nombre_producto: '',
  descripcion: '',
  precio: '',
  precio_anterior: '',
  stock_actual: '',
  categoria_id: '',
};

export default function AdminProductsPage() {
  // Estados para la tabla
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // Para abrir/cerrar el modal
  const [newProduct, setNewProduct] = useState(initialProductState); // Para los datos del nuevo producto
  const [categories, setCategories] = useState([]); // Para el menú de categorias

  // useEffect para traer las categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categoria'); 
        if (!response.ok) throw new Error('No se pudieron cargar las categorías');
        const data = await response.json();
        setCategories(data.datos || []);
      } catch (catError) {
        console.error("Error fetching categories:", catError);
      }
    };
    fetchCategories();
  }, []);

  // Use Effect para traer los productos 
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/producto', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudo conectar con la API');
      const data = await response.json();
      setProducts(data.datos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para traer los productos la primera vez
  useEffect(() => {
    fetchProducts();
  }, []);

  // Funciones para manejar el modal y el formulario
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProduct(initialProductState); // Reseteamos el formulario al cerrar
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };
  
   const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/producto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        // Si la API tira un error, lo podemos mostrar
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Falló la creación del producto');
      }

      // Si todo sale ok
      alert('¡Producto creado con éxito!'); 
      handleClose();
      fetchProducts(); //Se vuelven a buscar los productos para actualizar la tabla

    } catch (err) {
      // Mostramos cualquier error que ocurra
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };


    if (loading) return <Typography>Cargando productos...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Title>Gestión de Productos</Title>
       <Box sx={{ mb: 2 }}>
         <Button variant="contained" onClick={handleClickOpen}>
           Crear Nuevo Producto
         </Button>
       </Box>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.producto_id}
      />
      {/* Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Crear Nuevo Producto</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="nombre_producto" label="Nombre del Producto" type="text" fullWidth variant="outlined" value={newProduct.nombre_producto} onChange={handleInputChange} />
          <TextField margin="dense" name="descripcion" label="Descripción" type="text" fullWidth multiline rows={4} variant="outlined" value={newProduct.descripcion} onChange={handleInputChange} />
           <TextField margin="dense" name="precio" label="Precio" type="number" fullWidth variant="outlined" value={newProduct.precio} onChange={handleInputChange} />
            <TextField margin="dense" name="precio_anterior" label="Precio anterior (Para publicar ofertas)" type="number" fullWidth variant="outlined" value={newProduct.precio_anterior} onChange={handleInputChange} />
          <TextField margin="dense" name="stock_actual" label="Stock Inicial" type="number" fullWidth variant="outlined" value={newProduct.stock_actual} onChange={handleInputChange} />
          <FormControl fullWidth margin="dense">
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleCreateProduct}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}