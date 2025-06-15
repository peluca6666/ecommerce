import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';

const CuentaVerificada = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('cargando');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setEstado('error');
      setErrorMsg('Token no provisto');
      return;
    }

    // Llamada al backend para verificar cuenta
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/verify?token=${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al verificar cuenta');
        return res.json();
      })
      .then(data => {
        setEstado('exito');
      })
      .catch(err => {
        setEstado('error');
        setErrorMsg(err.message || 'Error desconocido');
      });
  }, [searchParams]);

  if (estado === 'cargando') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (estado === 'error') {
    return (
      <Box textAlign="center" mt={8}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
          Ir a Login
        </Button>
      </Box>
    );
  }

  return (
    <Box textAlign="center" mt={8}>
      <Typography variant="h4" gutterBottom>
        Cuenta verificada exitosamente
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default CuentaVerificada;
