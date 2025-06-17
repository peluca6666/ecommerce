import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import Title from './Title';

const columns = [
  { field: 'producto_id', headerName: 'ID', width: 70 },
  { field: 'nombre', headerName: 'Nombre del Producto', width: 300 },
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

export default function AdminProductsPage() {
  // estado para guardar los productos que traemos de la api
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/producto', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo conectar con la API');
        }

        const data = await response.json();
        // El endpoint devuelve un objeto: exito: true, datos: [...] 
        setProducts(data.datos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // El array vacío asegura que se ejecute solo una vez

  if (loading) return <Typography>Cargando productos...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Title>Gestión de Productos</Title>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained">
          Crear Nuevo Producto
        </Button>

      </Box>
      <DataGrid
        rows={products}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.producto_id}
      />
    </Box>
  );
}