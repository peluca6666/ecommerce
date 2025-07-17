import { Button, TextField, Typography, Box, Paper, CircularProgress, Alert, InputAdornment } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const RegistroForm = ({ formulario, errores, isLoading, onChange, onSubmit, mensajeExito }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                width: '100vw',
                background: 'linear-gradient(135deg, #FFF5EE 0%, #FFE4E1 100%)',
                px: 2,
                py: 4,
                ml: -2,
                mr: -2,
                mt: -2
            }}
        >
            <Paper
                component="form"
                onSubmit={onSubmit}
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 480,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
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
                        Crear cuenta
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                    >
                        Únete para disfrutar de ofertas exclusivas
                    </Typography>
                </Box>

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

                {mensajeExito && (
                    <Alert 
                        severity="success" 
                        sx={{ 
                            borderRadius: 2,
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            '& .MuiAlert-icon': { color: '#4CAF50' }
                        }}
                    >
                        {mensajeExito}
                    </Alert>
                )}

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
                            }
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
                            }
                        }}
                    />
                </Box>

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
                                    <MailOutlineIcon sx={{ color: '#FF8C00', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }
                    }}
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
                        }
                    }}
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
                        }
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
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
                    {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Crear cuenta'}
                </Button>

                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 2
                }}>
                    <Typography variant="body2" color="text.secondary">
                        ¿Ya tenés cuenta?
                    </Typography>
                    <Typography
                        component={RouterLink}
                        to="/login"
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
                        Inicia sesión
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegistroForm;