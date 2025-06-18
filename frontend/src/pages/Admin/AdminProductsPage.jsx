import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl, styled } from '@mui/material';
import Title from './Title';
import { /*...,*/ IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';


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

// componente para subir archivos
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
  // Estados para la tabla
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // Para abrir o cerrar el modal
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

  //nos sirve para poder agregar una imagen principal cuando agregamos un producto desde el dashboard de admin
  const [mainImageFile, setMainImageFile] = useState(null);

  //y esto nos sirve para poder agregar las imagenes secundarias
  const [secondaryImageFiles, setSecondaryImageFiles] = useState([]);

  // Funciones para manejar el modal y el formulario
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProduct(initialProductState); // Reseteamos el formulario al cerrar
      setMainImageFile(null);
    setSecondaryImageFiles([]); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };
  
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setMainImageFile(e.target.files[0]);
    }
  };

 const handleMultipleFileChange = (e) => {
    // e.target.files es una lista, la convertimos a un array para guardarla
    if (e.target.files) {
      setSecondaryImageFiles(Array.from(e.target.files));
    }
  };

 const handleToggleActivo = async (id, estadoActual) => {
    // Pedir confirmacion
    const confirmacion = window.confirm(
      `¿Estás seguro de que querés ${estadoActual ? 'DESACTIVAR' : 'ACTIVAR'} este producto?`
    );

    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      // Usamos un nuevo endpoint en el backend que crearemos en el siguiente paso
      const response = await fetch(`http://localhost:3000/api/producto/${id}/toggle-activo`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Falló al cambiar el estado del producto');
      }
      
      alert('Estado del producto actualizado con éxito');
      fetchProducts(); // Refrescamos la tabla para ver el cambio
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

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
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      sortable: false, // No queremos que se pueda ordenar por esta columna
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => alert('Próximamente: Editar producto ' + params.row.producto_id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleToggleActivo(params.row.producto_id, params.row.activo)}>
            {params.row.activo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />}
          </IconButton>
        </Box>
      ),
    },
  ];

   const handleCreateProduct = async () => {
  const formData = new FormData();

  // Agregamos los campos de texto
  Object.keys(newProduct).forEach(key => {
    formData.append(key, newProduct[key]);
  });

  // agregamos la imagen principal 
  if (mainImageFile) {
    formData.append('imagen', mainImageFile);
  }

  // Agregamos las imágenes secundarias 
  if (secondaryImageFiles.length > 0) {
    secondaryImageFiles.forEach(file => {
      formData.append('imagenes', file);
    });
  }
    
    console.log("Datos a enviar:", ...formData.entries());
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/producto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
           body: formData, 
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
           <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            sx={{ mt: 2 }}
            onChange={handleFileChange}
          >
            Seleccionar Imagen Principal
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          {/* Mostramos el nombre del archivo seleccionado para que el usuario sepa que se cargó */}
          {mainImageFile && <Typography sx={{ display: 'inline', ml: 2 }}>{mainImageFile.name}</Typography>}
<Box sx={{ mt: 2 }}> {/* Lo envuelvo en un Box para que quede prolijo abajo */}
  <Button
    component="label"
    variant="outlined"
  >
    Seleccionar Imágenes Secundarias
    {/* El atributo "multiple" permite elegir varios archivos */}
    <VisuallyHiddenInput type="file" multiple onChange={handleMultipleFileChange} />
  </Button>
  {/* Mostramos la cantidad de archivos seleccionados */}
  {secondaryImageFiles.length > 0 && <Typography sx={{ display: 'inline', ml: 2 }}>{secondaryImageFiles.length} archivos seleccionados</Typography>}
</Box>
         {/* Mostramos la cantidad de archivos seleccionados */}
          {secondaryImageFiles.length > 0 && <Typography sx={{ display: 'inline', ml: 2 }}>{secondaryImageFiles.length} archivos seleccionados</Typography>}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleCreateProduct}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}