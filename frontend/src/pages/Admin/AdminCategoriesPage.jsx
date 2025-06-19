import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, styled, IconButton } from '@mui/material';
import Title from './Title';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

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

// Le agregamos 'activo' para poder manejarlo en el formulario de edición
const initialCategoryState = { nombre: '', imagen: '', activo: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState(initialCategoryState);
  const [imageFile, setImageFile] = useState(null);

 const [error, setError] = useState(null);

const fetchCategories = async () => {
    setLoading(true);
    setError(null); 
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/categorias', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudieron cargar las categorías');
      const data = await response.json();
      setCategories(data.datos || []);
    } catch (err) {
      console.error("Error al buscar categorías:", err);
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleClose = () => {
    setOpen(false);
    setNewCategory(initialCategoryState);
    setEditingCategory(null);
    setImageFile(null);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
    setOpen(true);
  };

  const handleInputChange = (e) => setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  const handleFileChange = (e) => { if (e.target.files[0]) setImageFile(e.target.files[0]); };

  const handleToggleStatus = async (id, estadoActual) => {
    const confirmacion = window.confirm(`¿Estás seguro de que querés ${estadoActual ? 'DESACTIVAR' : 'ACTIVAR'} esta categoría?`);
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/categorias/${id}/toggle-activo`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falló al cambiar el estado de la categoría');
      alert('Estado actualizado con éxito');
      fetchCategories();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Función de submit
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nombre', newCategory.nombre);
    
    // Si estamos editando, también se envia el estado 'activo'
    if (editingCategory) {
      formData.append('activo', newCategory.activo);
    }

    // Si se seleccionó un archivo nuevo, lo agregamos, si no, no mandamos nada
    if (imageFile) {
      formData.append('imagen', imageFile);
    }

    const token = localStorage.getItem('token');
    const url = editingCategory 
      ? `http://localhost:3000/api/admin/categorias/${editingCategory.categoria_id}` 
      : 'http://localhost:3000/api/admin/categorias';
    
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('La operación falló');
      alert(`Categoría ${editingCategory ? 'actualizada' : 'creada'} con éxito`);
      handleClose();
      fetchCategories();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const columns = [
    { field: 'categoria_id', headerName: 'ID', width: 90 },
    {
      field: 'imagen',
      headerName: 'Imagen',
      width: 100,
      renderCell: (params) => {
         const BASE_URL = 'http://localhost:3000';
        const imageUrl = params.value ? `${BASE_URL}${params.value}` : null;
       return (
          imageUrl
            ? <img src={imageUrl} alt={params.row.nombre} style={{ width: 50, height: 50, objectFit: 'cover' }} />
            : 'Sin imagen'
        );
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
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setEditingCategory(null); setNewCategory(initialCategoryState); setOpen(true); }}>
        Crear Nueva Categoría
      </Button>
      <DataGrid rows={categories} columns={columns} getRowId={(row) => row.categoria_id} loading={loading} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="nombre" label="Nombre de la Categoría" type="text" fullWidth value={newCategory.nombre} onChange={handleInputChange} sx={{ mt: 1 }} />
          <Button component="label" variant="outlined" sx={{ mt: 2 }}>
            {imageFile ? imageFile.name : (editingCategory?.imagen ? 'Cambiar Imagen' : 'Seleccionar Imagen')}
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}