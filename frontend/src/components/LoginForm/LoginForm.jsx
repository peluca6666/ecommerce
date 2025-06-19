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

export default function LoginForm({ formulario, errores, isLoading, handleChange, handleSubmit }) {
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
            {/* Formulario de login */}
            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
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
                    Iniciar sesión
                </Typography>

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formulario.email}
                    onChange={handleChange}
                    error={!!errores.email}
                    helperText={errores.email}
                    fullWidth
                    variant="outlined"
                    size="small"
                />

                <TextField
                    label="Contraseña"
                    name="contrasenia"
                    type="password"
                    value={formulario.contrasenia}
                    onChange={handleChange}
                    error={!!errores.contrasenia}
                    helperText={errores.contrasenia}
                    fullWidth
                    variant="outlined"
                    size="small"
                />

                {/* Mensaje de error general */}
                {errores.general && (
                    <Typography color="error" variant="body2" align="center">
                        {errores.general}
                    </Typography>
                )}

                {/* Botón de enviar con spinner mientras carga */}
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isLoading} 
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : 'Ingresar'}
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" align="center">
                    ¿No tenés una cuenta?{' '}
                    <Link 
                        component={RouterLink} 
                        to="/register" 
                        color="primary"
                        underline="hover"
                        fontWeight="medium"
                    >
                        Registrate
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
