import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  Link, 
  Paper, 
  Divider,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const RegistroForm = ({ formulario, errores, isLoading, onChange, onSubmit, mensajeExito }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        p: 2
      }}
    >
      <Paper
        component="form"
        onSubmit={onSubmit}
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          Crear cuenta
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={onChange}
            error={!!errores.nombre}
            helperText={errores.nombre}
            variant="outlined"
            size="small"
          />

          <TextField
            fullWidth
            label="Apellido"
            name="apellido"
            value={formulario.apellido}
            onChange={onChange}
            error={!!errores.apellido}
            helperText={errores.apellido}
            variant="outlined"
            size="small"
          />
        </Box>

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formulario.email}
          onChange={onChange}
          error={!!errores.email}
          helperText={errores.email}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          name="contrasenia"
          value={formulario.contrasenia}
          onChange={onChange}
          error={!!errores.contrasenia}
          helperText={errores.contrasenia}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          label="Confirmar contraseña"
          type="password"
          name="confirmarContrasenia"
          value={formulario.confirmarContrasenia}
          onChange={onChange}
          error={!!errores.confirmarContrasenia}
          helperText={errores.confirmarContrasenia}
          variant="outlined"
          size="small"
        />

        {errores.general && (
          <Typography color="error" variant="body2" align="center">
            {errores.general}
          </Typography>
        )}

        {mensajeExito && (
          <Typography color="primary" variant="body2" align="center">
            {mensajeExito}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={isLoading}
          size="large"
          sx={{ mt: 1 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
        </Button>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" align="center">
          ¿Ya tenés una cuenta?{' '}
          <Link 
            component={RouterLink} 
            to="/login" 
            color="primary"
            underline="hover"
            fontWeight="medium"
          >
            Iniciar sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegistroForm;