import { useEffect, useState} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Container, useTheme } from '@mui/material'; 
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; 
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; 
import axios from 'axios';

const CuentaVerificada = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme(); 

  const [estado, setEstado] = useState('cargando');
  const [mensajePrincipal, setMensajePrincipal] = useState(''); 
  const [detalleMensaje, setDetalleMensaje] = useState(''); 

  useEffect(() => {
    const token = searchParams.get('token');
    
    setEstado('cargando');
    setMensajePrincipal('');
    setDetalleMensaje('');

    if (!token) {
      setEstado('error');
      setMensajePrincipal('Enlace inválido');
      setDetalleMensaje('El enlace de verificación no contiene un token válido. Por favor, revisa el correo.');
      return;
    }

    console.log('Iniciando verificación con token:', token);

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/verify?token=${token}`)
      .then(response => {
        console.log('Respuesta de la API:', response.data);
        console.log('Status de la respuesta:', response.status);
        
        const isSuccess = 
          response.status === 200 && (
            response.data?.exito === true ||
            response.data?.success === true ||
            response.data?.verificado === true ||
            response.data?.verified === true ||
            (response.data?.message && response.data.message.toLowerCase().includes('verificad')) ||
            (response.data?.mensaje && response.data.mensaje.toLowerCase().includes('verificad')) ||
            (!response.data?.error && !response.data?.mensaje?.toLowerCase().includes('error'))
          );

        if (isSuccess) {
          setEstado('exito');
          setMensajePrincipal('¡Cuenta verificada con éxito!');
          setDetalleMensaje('Ya puedes iniciar sesión y disfrutar de SaloMarket.');
        } else {
          setEstado('error');
          setMensajePrincipal('Verificación fallida');
          setDetalleMensaje(
            response.data?.mensaje || 
            response.data?.message || 
            response.data?.error ||
            'Hubo un problema al verificar tu cuenta. El token podría haber expirado o ser inválido.'
          );
        }
      })
      .catch(err => {
        console.error('Error en la verificación:', err);
        console.error('Respuesta del error:', err.response?.data);
        
        if (err.response?.status === 404) {
          setEstado('error');
          setMensajePrincipal('Token no encontrado');
          setDetalleMensaje('El enlace de verificación ha expirado o no es válido. Solicita un nuevo correo de verificación.');
        } else if (err.response?.status === 400) {
          setEstado('error');
          setMensajePrincipal('Token inválido');
          setDetalleMensaje(err.response?.data?.mensaje || 'El token de verificación no es válido.');
        } else if (err.response?.status >= 500) {
          setEstado('error');
          setMensajePrincipal('Error del servidor');
          setDetalleMensaje('Hay un problema temporal con el servidor. Inténtalo más tarde.');
        } else {
          setEstado('error');
          setMensajePrincipal('Error de conexión');
          setDetalleMensaje(
            err.response?.data?.mensaje || 
            err.response?.data?.message ||
            err.message ||
            'No se pudo conectar con el servidor para verificar tu cuenta. Verifica tu conexión a internet.'
          );
        }
      });
  }, [searchParams]);

  const handleReintento = () => {
    window.location.reload();
  };

  const renderContent = () => {
    switch (estado) {
      case 'cargando':
        return (
          <Paper 
            elevation={3} 
            sx={{ 
                p: { xs: 3, md: 5 }, 
                textAlign: 'center', 
                borderRadius: theme.shape.borderRadius * 2, 
                boxShadow: theme.shadows[4], 
                bgcolor: 'background.paper',
                maxWidth: 400, 
                mx: 'auto'
            }}
          >
            <HourglassEmptyIcon sx={{ fontSize: 60, color: '#FF9800', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.primary" fontWeight="medium">
              Verificando tu cuenta...
            </Typography>
            <CircularProgress size={40} sx={{ color: '#FF9800', mt: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Esto puede tomar unos segundos
            </Typography>
          </Paper>
        );
      case 'error':
        return (
          <Paper 
            elevation={3} 
            sx={{ 
                p: { xs: 3, md: 5 }, 
                textAlign: 'center', 
                borderRadius: theme.shape.borderRadius * 2, 
                boxShadow: theme.shadows[4], 
                bgcolor: 'background.paper',
                maxWidth: 400, 
                mx: 'auto'
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="error.main" fontWeight="bold">
              {mensajePrincipal}
            </Typography>
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', fontSize: '1rem' }}>
              {detalleMensaje}
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button 
                  variant="outlined" 
                  onClick={handleReintento}
                  size="large"
                  sx={{ 
                    borderRadius: '8px', 
                    py: 1.5, 
                    fontWeight: 'bold',
                    borderColor: '#FF9800',
                    color: '#FF9800',
                    '&:hover': { borderColor: '#F57C00', backgroundColor: 'rgba(255, 152, 0, 0.1)' }
                  }}
              >
                Reintentar
              </Button>
              <Button 
                  variant="contained" 
                  onClick={() => navigate('/login')}
                  size="large"
                  sx={{ 
                    borderRadius: '8px', 
                    py: 1.5, 
                    fontWeight: 'bold',
                    bgcolor: '#FF9800',
                    '&:hover': { bgcolor: '#F57C00' }
                  }}
              >
                Ir a Iniciar Sesión
              </Button>
            </Box>
          </Paper>
        );
      case 'exito':
        return (
          <Paper 
            elevation={3} 
            sx={{ 
                p: { xs: 3, md: 5 }, 
                textAlign: 'center', 
                borderRadius: theme.shape.borderRadius * 2, 
                boxShadow: theme.shadows[4], 
                bgcolor: 'background.paper',
                maxWidth: 400, 
                mx: 'auto'
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="success.main" fontWeight="bold">
              {mensajePrincipal}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {detalleMensaje}
            </Typography>
            <Button 
                variant="contained" 
                onClick={() => navigate('/login')}
                size="large"
                sx={{ 
                  borderRadius: '8px', 
                  py: 1.5, 
                  fontWeight: 'bold',
                  bgcolor: '#FF9800',
                  '&:hover': { bgcolor: '#F57C00' }
                }}
            >
                Iniciar sesión
            </Button>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Box 
        sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            background: `linear-gradient(135deg, #FFF3E0 30%, #FFFFFF 90%)`,
            [theme.breakpoints.down('sm')]: { 
                background: '#FFFFFF', 
            },
            p: 2 
        }}
    >
        <Container maxWidth="md"> 
            {renderContent()}
        </Container>
    </Box>
  );
};

export default CuentaVerificada;