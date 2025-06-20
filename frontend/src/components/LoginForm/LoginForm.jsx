import React from 'react'; // asegurate de importar react
import { Button, TextField, Typography, Box, Paper, Divider,CircularProgress,useTheme, Alert, InputAdornment } from '@mui/material';
import { Link as RouterLink,useLocation } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; 
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 

export default function LoginForm({ formulario, errores, isLoading, handleChange, handleSubmit }) {
    const theme = useTheme(); 
    const location = useLocation(); // hook para obtener estado de la ruta
    const { registrationSuccess } = location.state || {}; // lee estado si existe

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                // fondo atractivo con gradiente suave o color del tema
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 30%, ${theme.palette.background.default} 90%)`,
                [theme.breakpoints.down('sm')]: { 
                    alignItems: 'flex-start', 
                    pt: 4, 
                    background: theme.palette.background.default, 
                },
            }}
        >
            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={6} 
                sx={{
                    width: '100%',
                    maxWidth: 440, 
                    p: { xs: 3, md: 5 }, 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2.5, md: 3 }, 
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
                    color="primary" 
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 3 }} 
                >
                    Bienvenido de nuevo
                </Typography>

                {/* mensaje de registro exitoso */}
                {registrationSuccess && (
                    <Alert 
                        severity="success" 
                        sx={{ mb: 2, borderRadius: theme.shape.borderRadius * 1.5 }}
                        icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                    >
                        ¡Registro exitoso! Por favor, inicia sesión.
                    </Alert>
                )}

                {/* mensaje de error general */}
                {errores.general && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 1, borderRadius: theme.shape.borderRadius * 1.5 }}
                    >
                        {errores.general}
                    </Alert>
                )}

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
                    size="medium" 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} 
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
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
                    size="medium"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                {/* botón enviar con spinner mientras carga */}
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isLoading} 
                    fullWidth
                    size="large"
                    sx={{ 
                        mt: 1,
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
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : 'Ingresar'}
                </Button>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">o</Typography>
                </Divider>

                <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large"
                    component={RouterLink}
                    to="/register"
                    sx={{ 
                        py: 1.5, 
                        borderRadius: '10px', 
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.shadows[4],
                        }
                    }}
                >
                    Registrarse
                </Button>
            </Paper>
        </Box>
    );
}
