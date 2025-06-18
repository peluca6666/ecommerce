import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, IconButton } from '@mui/material';
import Title from './Title';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

export default function AdminSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem('token');
        // Usamos el endpoint que ya teníamos para traer todas las ventas
        const response = await fetch('http://localhost:3000/api/admin/ventas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('No se pudieron cargar las ventas');
        }
        const data = await response.json();
        setSales(data.datos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const columns = [
    { field: 'venta_id', headerName: 'ID Venta', width: 90 },
    { 
      field: 'fecha_venta', 
      headerName: 'Fecha', 
      width: 180,
      valueGetter: (value) => value ? new Date(value).toLocaleString('es-AR') : ''
    },
    { field: 'email', headerName: 'Cliente', width: 250 }, 
    { 
      field: 'total', 
      headerName: 'Total', 
      type: 'number',
      width: 130,
      // Formateamos el total como moneda
      valueFormatter: (value) => `$ ${Number(value || 0).toLocaleString('es-AR')}`
    },
    { 
      field: 'estado', 
      headerName: 'Estado', 
      width: 150,
      renderCell: (params) => {
        let color = 'default';
        if (params.value === 'Completado') color = 'success';
        if (params.value === 'Cancelado') color = 'error';
        if (params.value === 'Procesando') color = 'warning';
        return <Typography color={`${color}.main`} sx={{ fontWeight: 'bold' }}>{params.value}</Typography>
      }
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      renderCell: (params) => (
       <IconButton onClick={() => navigate(`/admin/ventas/${params.row.venta_id}`)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  if (loading) return <Typography>Cargando ventas...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Title>Gestión de Ventas</Title>
      <DataGrid
        rows={sales}
        columns={columns}
        getRowId={(row) => row.venta_id}
        // Ordenamos por defecto para que las ventas más nuevas aparezcan arriba
        initialState={{
          sorting: {
            sortModel: [{ field: 'venta_id', sort: 'desc' }],
          },
        }}
      />
    </Box>
  );
}