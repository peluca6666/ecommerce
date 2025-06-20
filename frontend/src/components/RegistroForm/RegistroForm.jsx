import React from 'react';
import { 
    Button, 
    TextField, 
    Typography, 
    Box, 
    Link, 
    Paper, 
    Divider,
    CircularProgress,
    useTheme, // Importamos useTheme para acceder a los colores del tema
    Alert, // Para mensajes de éxito/error más estilizados
    InputAdornment // Para iconos dentro de TextField
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // Icono para nombre/apellido
import MailOutlineIcon from '@mui/icons-material/MailOutline'; // Icono para email
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Icono para contraseña

const RegistroForm = ({ formulario, errores, isLoading, onChange, onSubmit, mensajeExito }) => {
    const theme = useTheme(); // Inicializamos useTheme

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                // Fondo atractivo: Gradiente suave o color del tema, consistente con Login
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 30%, ${theme.palette.background.default} 90%)`,
                [theme.breakpoints.down('sm')]: { // Ajuste para pantallas muy pequeñas
                    alignItems: 'flex-start', // Empieza el formulario más arriba
                    pt: 4, // Padding top para no pegar al borde
                    background: theme.palette.background.default, // Fondo simple en móvil
                },
            }}
        >
            <Paper
                component="form"
                onSubmit={onSubmit}
                elevation={6} 
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    p: { xs: 3, md: 5 }, 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, md: 2.5 }, 
                    borderRadius: theme.shape.borderRadius * 3,
                    boxShadow: theme.shadows[10],
                    bgcolor: 'background.paper', 
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[15],
                    },
                    position: 'relative', 
                }}
            >
                <Typography 
                    variant="h4" 
                    align="center" 
                    color="primary" // Color primario para el título
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 3 }} // Mayor margen inferior
                >
                    Crear cuenta
                </Typography>

                {/* Mensajes de error general y éxito */}
                {errores.general && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 1, borderRadius: theme.shape.borderRadius * 1.5 }}
                    >
                        {errores.general}
                    </Alert>
                )}

                {mensajeExito && (
                    <Alert 
                        severity="success" 
                        sx={{ mb: 1, borderRadius: theme.shape.borderRadius * 1.5 }}
                    >
                        {mensajeExito}
                    </Alert>
                )}

                {/* Campos de nombre y apellido juntos */}
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
                        size="medium" // Tamaño un poco más grande
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
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
                        size="medium" // Tamaño un poco más grande
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Email */}
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formulario.email}
                    onChange={onChange}
                    error={!!errores.email}
                    helperText={errores.email}
                    variant="outlined"
                    size="medium"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MailOutlineIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Contraseña */}
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
                    size="medium"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlinedIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Confirmar contraseña */}
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
                    size="medium"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlinedIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Botón de envío */}
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                    size="large"
                    sx={{ 
                        mt: 1.5, 
                        py: 1.5, 
                        borderRadius: '10px', 
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.shadows[8],
                        }
                    }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Crear cuenta'}
                </Button>

                <Divider sx={{ my: 3 }}> 
                    <Typography variant="body2" color="text.secondary">o</Typography>
                </Divider>

                {/* Link para ir al login */}
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