import React from 'react';
import { Button, TextField, Typography, Box, Link, Paper, Divider,CircularProgress, useTheme, Alert, InputAdornment } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const RegistroForm = ({ formulario, errores, isLoading, onChange, onSubmit, mensajeExito }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
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
                    color="primary" 
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 3 }}
                >
                    Crear cuenta
                </Typography>

                {/* mostrar error general */}
                {errores.general && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 1, borderRadius: theme.shape.borderRadius * 1.5 }}
                    >
                        {errores.general}
                    </Alert>
                )}

                {/* mostrar mensaje de éxito */}
                {mensajeExito && (
                    <Alert 
                        severity="success" 
                        sx={{ mb: 1, borderRadius: theme.shape.borderRadius * 1.5 }}
                    >
                        {mensajeExito}
                    </Alert>
                )}

                {/* campos nombre y apellido lado a lado */}
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
                        size="medium"
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
                        size="medium"
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

                {/* email */}
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

                {/* contraseña */}
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

                {/* confirmar contraseña */}
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

                {/* botón enviar */}
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

                {/* link para ir al login */}
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
