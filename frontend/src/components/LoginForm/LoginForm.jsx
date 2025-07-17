import { Button, TextField, Typography, Box, Paper, CircularProgress, Alert, InputAdornment } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; 
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 

export default function LoginForm({ formulario, errores, isLoading, handleChange, handleSubmit }) {
    const location = useLocation();
    const { registrationSuccess } = location.state || {};

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                width: '100%',
                background: 'linear-gradient(135deg, #FFF5EE 0%, #FFE4E1 100%)',
                px: 2,
                py: 4
            }}
        >
            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'rgba(255, 140, 0, 0.1)',
                    bgcolor: 'white',
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 600,
                            color: '#FF6B35',
                            mb: 0.5
                        }}
                    >
                        Iniciar Sesión
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                    >
                        Accede a tu cuenta para continuar comprando
                    </Typography>
                </Box>

                {registrationSuccess && (
                    <Alert 
                        severity="success" 
                        sx={{ 
                            borderRadius: 2,
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            '& .MuiAlert-icon': { color: '#4CAF50' }
                        }}
                        icon={<CheckCircleOutlineIcon />}
                    >
                        ¡Registro exitoso! Por favor, inicia sesión.
                    </Alert>
                )}

                {errores.general && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            borderRadius: 2,
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            '& .MuiAlert-icon': { color: '#F44336' }
                        }}
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
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            '&:hover fieldset': {
                                borderColor: '#FF8C00',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#FF6B35',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#FF6B35',
                        }
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon sx={{ color: '#FF8C00', fontSize: 20 }} />
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
                    sx={{ 
                        '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            '&:hover fieldset': {
                                borderColor: '#FF8C00',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#FF6B35',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#FF6B35',
                        }
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon sx={{ color: '#FF8C00', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isLoading} 
                    fullWidth
                    size="large"
                    sx={{ 
                        mt: 2,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B35 100%)',
                        boxShadow: '0 4px 12px rgba(255, 140, 0, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
                            boxShadow: '0 6px 16px rgba(255, 140, 0, 0.4)',
                        },
                        '&:disabled': {
                            background: 'rgba(255, 140, 0, 0.3)',
                        }
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : 'Iniciar Sesión'}
                </Button>

                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 2
                }}>
                    <Typography variant="body2" color="text.secondary">
                        ¿No tenés cuenta?
                    </Typography>
                    <Typography
                        component={RouterLink}
                        to="/register"
                        variant="body2"
                        sx={{
                            color: '#FF6B35',
                            textDecoration: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        Regístrate acá
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}