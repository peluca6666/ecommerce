import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Box, Typography, IconButton, Select, MenuItem, Dialog, DialogTitle,DialogContent, List, ListItem, ListItemText, Divider, 
CircularProgress, Link as MuiLink, Button, DialogActions,Snackbar,Alert} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Title from './Title';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function AdminUsersPage() {
  // estados de usuarios y carga
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // estados del modal y usuario seleccionado
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSales, setUserSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);

  // estado para mostrar alertas tipo snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // estado para manejar el diálogo de confirmación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleOpenConfirmDialog = (message, action) => {
    setConfirmDialogMessage(message);
    setConfirmAction(() => action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleCancelConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudieron cargar los usuarios');
      const data = await response.json();
      setUsers(data.datos || []);
    } catch (err) {
      setError(err.message);
      showSnackbar(`Error al cargar usuarios: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // carga inicial de usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, nuevoRol) => {
    handleOpenConfirmDialog(
      `¿Estás seguro de que querés cambiar el rol a "${nuevoRol}"?`,
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/admin/usuarios/${id}/rol`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rol: nuevoRol })
          });
          if (!response.ok) throw new Error('Error al cambiar el rol');
          showSnackbar('Rol cambiado exitosamente.', 'success');
          fetchUsers();
        } catch (err) {
          showSnackbar(`Error al cambiar el rol: ${err.message}`, 'error');
        }
      }
    );
  };

  const handleToggleStatus = async (id, estadoActual) => {
    handleOpenConfirmDialog(
      `¿Seguro que querés ${estadoActual ? 'desactivar' : 'activar'} este usuario?`,
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/admin/usuarios/${id}/toggle-activo`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Error al cambiar el estado');
          showSnackbar('Estado de usuario cambiado exitosamente.', 'success');
          fetchUsers();
        } catch (err) {
          showSnackbar(`Error al cambiar el estado: ${err.message}`, 'error');
        }
      }
    );
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
    setSalesLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/usuarios/${user.usuario_id}/ventas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudieron cargar las compras del usuario');
      const data = await response.json();
      setUserSales(data.datos || []);
    } catch (err) {
      console.error(err);
      setUserSales([]);
      showSnackbar(`Error al cargar compras: ${err.message}`, 'error');
    } finally {
      setSalesLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedUser(null);
    setUserSales([]);
  };

  // definición de columnas de la tabla
  const columns = [
    { field: 'usuario_id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', width: 150 },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'rol',
      headerName: 'Rol',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => handleRoleChange(params.row.usuario_id, e.target.value)}
          size="small"
          sx={{ width: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem value="cliente">Cliente</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      )
    },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} onClick={(e) => e.stopPropagation()}>
          <IconButton onClick={() => handleToggleStatus(params.row.usuario_id, params.row.activo)}>
            {params.row.activo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />}
          </IconButton>
          <Typography sx={{ ml: 1 }} color={params.row.activo ? 'green' : 'red'}>
            {params.row.activo ? 'Activo' : 'Inactivo'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'acciones',
      headerName: 'Detalle',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleViewDetails(params.row)}>
          <VisibilityIcon />
        </IconButton>
      )
    }
  ];

  if (loading) return <Typography>Cargando usuarios...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Title>Gestión de Usuarios</Title>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.usuario_id}
      />
      <Dialog open={isDetailModalOpen} onClose={handleCloseDetailModal} fullWidth maxWidth="sm">
        {selectedUser && (
          <>
            <DialogTitle>Detalle de Usuario: {selectedUser.nombre} {selectedUser.apellido}</DialogTitle>
            <DialogContent>
              {/* info personal del usuario */}
              <Typography variant="h6">Información Personal</Typography>
              <Typography><strong>ID:</strong> {selectedUser.usuario_id}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>DNI:</strong> {selectedUser.dni}</Typography>
              <Typography><strong>Dirección:</strong> {selectedUser.direccion}</Typography>
              <Typography><strong>Teléfono:</strong> {selectedUser.telefono}</Typography>
              <Typography><strong>Provincia:</strong> {selectedUser.Provincia}</Typography>
              <Typography><strong>Localidad:</strong> {selectedUser.Localidad}</Typography>
              <Typography><strong>Código postal:</strong> {selectedUser.codigo_postal}</Typography>
              <Typography><strong>Rol:</strong> {selectedUser.rol}</Typography>
              <Typography><strong>Estado:</strong> {selectedUser.activo ? 'Activo' : 'Inactivo'}</Typography>

              {/* historial de compras */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Historial de Compras</Typography>
              {salesLoading ? (
                <CircularProgress sx={{ mt: 2 }} />
              ) : (
                userSales.length > 0 ? (
                  <List dense>
                    {userSales.map(sale => (
                      <ListItem key={sale.venta_id}>
                        <ListItemText
                          primary={<MuiLink component={RouterLink} to={`/admin/ventas/${sale.venta_id}`}>Venta #{sale.venta_id}</MuiLink>}
                          secondary={`Fecha: ${new Date(sale.fecha_venta).toLocaleDateString('es-AR')} - Total: $${Number(sale.total).toLocaleString('es-AR')}`}
                        />
                        <Typography variant="body2" color={sale.estado === 'Completado' ? 'green' : 'orange'}>
                          {sale.estado}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                ) : (<Typography>Este usuario no ha realizado ninguna compra.</Typography>)
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* snackbar para mensajes */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
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
      >
        <DialogTitle id="confirm-dialog-title">Confirmación</DialogTitle>
        <DialogContent>
          <Typography id="confirm-dialog-description">
            {confirmDialogMessage}
          </Typography>
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
