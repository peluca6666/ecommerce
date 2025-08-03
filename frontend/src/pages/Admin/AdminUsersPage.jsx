import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Typography, IconButton, Select, MenuItem, Dialog, DialogTitle, DialogContent, 
  List, ListItem, ListItemText, Divider, CircularProgress, Link as MuiLink, Button, 
  DialogActions, Snackbar, Alert, Chip, Card, CardContent, useMediaQuery, useTheme,
  FormControl, InputLabel
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Title from './Title';
import { ToggleOn, ToggleOff, Visibility } from '@mui/icons-material';

export default function AdminUsersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSales, setUserSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirm, setConfirm] = useState({ open: false, message: '', action: null });

 const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/usuarios${endpoint}`, {
      ...options,
      headers: { 
        ...options.headers, 
        Authorization: `Bearer ${token}` 
      }
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return response.json();
  };

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const closeSnackbar = (_, reason) => reason !== 'clickaway' && setSnackbar(prev => ({ ...prev, open: false }));

  const fetchUsers = async () => {
    try {
      // SOLUCIÓN AL PROBLEMA: incluir usuarios inactivos
      const data = await apiCall('?incluir_inactivos=true');
      setUsers(data.datos || []);
    } catch (err) {
      setError(err.message);
      showSnackbar(`Error al cargar usuarios: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action, successMsg) => {
    try {
      await action();
      showSnackbar(successMsg);
      fetchUsers();
    } catch (err) {
      showSnackbar(`Error: ${err.message}`, 'error');
    }
  };

  const handleRoleChange = (id, nuevoRol) => {
    setConfirm({
      open: true,
      message: `¿Cambiar rol a "${nuevoRol}"?`,
      action: () => executeAction(
        () => apiCall(`/${id}/rol`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rol: nuevoRol }) }),
        'Rol cambiado exitosamente'
      )
    });
  };

  const handleToggleStatus = (id, estadoActual) => {
    setConfirm({
      open: true,
      message: `¿${estadoActual ? 'Desactivar' : 'Activar'} usuario?`,
      action: () => executeAction(
        () => apiCall(`/${id}/toggle-activo`, { method: 'PUT' }),
        `Usuario ${estadoActual ? 'desactivado' : 'activado'} exitosamente`
      )
    });
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setSalesLoading(true);
    try {
      const data = await apiCall(`/${user.usuario_id}/ventas`);
      setUserSales(data.datos || []);
    } catch (err) {
      setUserSales([]);
      showSnackbar(`Error al cargar compras: ${err.message}`, 'error');
    } finally {
      setSalesLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Paginación móvil
  const totalPages = Math.ceil(users.length / pageSize);
  const currentUsers = users.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const MobileCard = ({ user }) => (
    <Card sx={{ mb: 2, opacity: user.activo ? 1 : 0.6 }} onClick={() => handleViewDetails(user)}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              {user.nombre} {user.apellido}
            </Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip label={user.rol === 'admin' ? 'Admin' : 'Cliente'} color={user.rol === 'admin' ? 'primary' : 'default'} size="small" />
            <Chip label={user.activo ? 'Activo' : 'Inactivo'} color={user.activo ? 'success' : 'error'} size="small" sx={{ ml: 1 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <IconButton onClick={(e) => { e.stopPropagation(); handleToggleStatus(user.usuario_id, user.activo); }} size="small">
              {user.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); handleViewDetails(user); }} color="primary" size="small">
              <Visibility />
            </IconButton>
          </Box>
          <FormControl size="small" sx={{ minWidth: 100 }} onClick={e => e.stopPropagation()}>
            <Select value={user.rol} onChange={(e) => handleRoleChange(user.usuario_id, e.target.value)}>
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );

  const columns = [
    { field: 'usuario_id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', width: 150 },
    { field: 'apellido', headerName: 'Apellido', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'rol', headerName: 'Rol', width: 150,
      renderCell: ({ row }) => (
        <Select value={row.rol} onChange={(e) => handleRoleChange(row.usuario_id, e.target.value)}
          size="small" sx={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
          <MenuItem value="cliente">Cliente</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      )
    },
    {
      field: 'activo', headerName: 'Estado', width: 130,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); handleToggleStatus(row.usuario_id, row.activo); }}>
            {row.activo ? <ToggleOn color="success" /> : <ToggleOff color="error" />}
          </IconButton>
          <Chip label={row.activo ? 'Activo' : 'Inactivo'} color={row.activo ? 'success' : 'error'} size="small" />
        </Box>
      )
    },
    {
      field: 'acciones', headerName: 'Acciones', width: 120, sortable: false,
      renderCell: ({ row }) => (
        <IconButton onClick={(e) => { e.stopPropagation(); handleViewDetails(row); }} color="primary">
          <Visibility />
        </IconButton>
      )
    }
  ];

  if (loading) return <Typography>Cargando usuarios...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ width: '100%', minHeight: '80vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Title>Gestión de Usuarios</Title>
        <Typography variant="body2" color="text.secondary">
          {users.filter(u => u.activo).length}/{users.length} activos
        </Typography>
      </Box>

      {isMobile ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Por página</InputLabel>
              <Select value={pageSize} label="Por página" onChange={(e) => { setPageSize(e.target.value); setCurrentPage(0); }}>
                {[5, 10, 15, 20].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, users.length)} de {users.length}
            </Typography>
          </Box>

          <Box sx={{ px: 1 }}>
            {users.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>No hay usuarios</Typography>
            ) : (
              currentUsers.map(user => <MobileCard key={user.usuario_id} user={user} />)
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
        <DataGrid rows={users} columns={columns} getRowId={(row) => row.usuario_id}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25, 50]} disableSelectionOnClick autoHeight
          getRowClassName={(params) => params.row.activo ? '' : 'user-inactive'}
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 } },
            '& .MuiDataGrid-footerContainer': { backgroundColor: '#f8fafc' },
            '& .user-inactive': { opacity: 0.6, backgroundColor: '#fafafa' }
          }}
        />
      )}

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} fullWidth maxWidth="sm" fullScreen={isMobile}>
        {selectedUser && (
          <>
            <DialogTitle>
              {selectedUser.nombre} {selectedUser.apellido}
              <Chip label={selectedUser.activo ? 'Activo' : 'Inactivo'} color={selectedUser.activo ? 'success' : 'error'} size="small" sx={{ ml: 2 }} />
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>Información Personal</Typography>
              <Box sx={{ '& > *': { mb: 0.5 } }}>
                <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                <Typography><strong>DNI:</strong> {selectedUser.dni || 'No especificado'}</Typography>
                <Typography><strong>Teléfono:</strong> {selectedUser.telefono || 'No especificado'}</Typography>
                <Typography><strong>Dirección:</strong> {selectedUser.direccion || 'No especificada'}</Typography>
                <Typography><strong>Rol:</strong> {selectedUser.rol}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Historial de Compras</Typography>
              {salesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>
              ) : userSales.length > 0 ? (
                <List dense>
                  {userSales.map(sale => (
                    <ListItem key={sale.venta_id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={<MuiLink component={RouterLink} to={`/admin/ventas/${sale.venta_id}`} color="primary">Venta #{sale.venta_id}</MuiLink>}
                        secondary={`${new Date(sale.fecha_venta).toLocaleDateString('es-AR')} - $${Number(sale.total).toLocaleString('es-AR')}`}
                      />
                      <Chip label={sale.estado} color={sale.estado === 'Completado' ? 'success' : 'warning'} size="small" />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">Sin compras realizadas</Typography>
              )}
            </DialogContent>
            <DialogActions><Button onClick={() => setSelectedUser(null)}>Cerrar</Button></DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>{snackbar.message}</Alert>
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