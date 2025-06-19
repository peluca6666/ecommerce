import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, styled, IconButton } from '@mui/material';
import Title from './Title';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

// Input oculto para carga de archivo con accesibilidad visual oculta
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

// Estado inicial de la categoría para creación/edición
const initialCategoryState = { nombre: '', imagen: '', activo: true };

export default function AdminCategoriesPage() {
  // Estado para lista de categorías
  const [categories, setCategories] = useState([]);
  // Estado para loading durante fetch
  const [loading, setLoading] = useState(true);
  // Estado para controlar si modal de edición/creación está abierto
  const [open, setOpen] = useState(false);
  // Estado para categoría que se está editando (null si es creación)
  const [editingCategory, setEditingCategory] = useState(null);
  // Estado para datos del formulario (nombre, imagen, activo)
  const [newCategory, setNewCategory] = useState(initialCategoryState);
  // Archivo seleccionado para imagen (si hay)
  const [imageFile, setImageFile] = useState(null);
  // Estado para guardar errores al cargar categorías
  const [error, setError] = useState(null);

  // Función para obtener las categorías desde backend
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener token para autenticación
      const token = localStorage.getItem('token');
      // Petición GET a la API de categorías admin
      const response = await fetch('http://localhost:3000/api/admin/categorias', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudieron cargar las categorías');
      const data = await response.json();
      // Guardar categorías recibidas o arreglo vacío
      setCategories(data.datos || []);
    } catch (err) {
      console.error("Error al buscar categorías:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetch al montar componente
  useEffect(() => { fetchCategories(); }, []);

  // Cerrar modal y resetear estados relacionados a edición/creación
  const handleClose = () => {
    setOpen(false);
    setNewCategory(initialCategoryState);
    setEditingCategory(null);
    setImageFile(null);
  };

  // Abrir modal para edición y cargar categoría seleccionada
  const handleEditClick = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
    setOpen(true);
  };

  // Manejar cambios en inputs de texto del formulario
  const handleInputChange = (e) => setNewCategory({ ...newCategory, [e.target.name]: e.target.value });

  // Manejar selección de archivo para imagen
  const handleFileChange = (e) => { if (e.target.files[0]) setImageFile(e.target.files[0]); };

  // Cambiar estado "activo" de categoría (activar/desactivar)
  const handleToggleStatus = async (id, estadoActual) => {
    const confirmacion = window.confirm(`¿Estás seguro de que querés ${estadoActual ? 'DESACTIVAR' : 'ACTIVAR'} esta categoría?`);
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      // PUT para cambiar estado activo/inactivo
      const response = await fetch(`http://localhost:3000/api/admin/categorias/${id}/toggle-activo`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falló al cambiar el estado de la categoría');
      alert('Estado actualizado con éxito');
      // Refrescar lista tras cambio
      fetchCategories();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Enviar formulario para crear o editar categoría
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nombre', newCategory.nombre);
    // Si se seleccionó una imagen nueva, incluirla en FormData
    if (imageFile) {
      formData.append('imagen', imageFile);
    }

    const token = localStorage.getItem('token');
    // Definir URL y método según si es edición o creación
    const url = editingCategory 
      ? `http://localhost:3000/api/admin/categorias/${editingCategory.categoria_id}` 
      : 'http://localhost:3000/api/admin/categorias';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      // Enviar formulario al backend
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

  // Definición de columnas para DataGrid
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
          {/* Botón para editar categoría */}
          <IconButton onClick={() => handleEditClick(params.row)}><EditIcon /></IconButton>
          {/* Botón para activar o desactivar */}
          <IconButton onClick={() => handleToggleStatus(params.row.categoria_id, params.row.activo)}>
            {params.row.activo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />}
          </IconButton>
        </Box>
      )
    }
  ];

  // Renderizado condicional según loading o error
  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Title>Gestión de Categorías</Title>

      {/* Botón para abrir modal de creación */}
      <Button 
        variant="contained" 
        sx={{ mb: 2 }} 
        onClick={() => { setEditingCategory(null); setNewCategory(initialCategoryState); setOpen(true); }}
      >
        Crear Nueva Categoría
      </Button>

      {/* Tabla con categorías */}
      <DataGrid 
        rows={categories} 
        columns={columns} 
        getRowId={(row) => row.categoria_id} 
        loading={loading} 
      />

      {/* Modal para crear o editar categoría */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}</DialogTitle>
        <DialogContent>
          {/* Input nombre */}
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
          {/* Botón para cargar imagen */}
          <Button component="label" variant="outlined" sx={{ mt: 2 }}>
            {imageFile ? imageFile.name : (editingCategory?.imagen ? 'Cambiar Imagen' : 'Seleccionar Imagen')}
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          {/* Botones cancelar y guardar */}
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
