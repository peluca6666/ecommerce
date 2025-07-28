import { Button, TextField, Typography, Box, Paper, CircularProgress, Alert, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';  
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Estilos reutilizables
const styles = {
    container: {
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
    },
    paper: {
        width: '100%',
        maxWidth: 480,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'rgba(255, 140, 0, 0.1)',
        bgcolor: 'white'
    },
    textField: {
        '& .MuiOutlinedInput-root': { 
            borderRadius: 2,
            '&:hover fieldset': { borderColor: '#FF8C00' },
            '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
    },
    button: {
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
            boxShadow: '0 6px 16px rgba(255, 140, 0, 0.4)'
        },
        '&:disabled': { background: 'rgba(255, 140, 0, 0.3)' }
    },
    link: {
        color: '#FF6B35',
        textDecoration: 'none',
        fontWeight: 500,
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' }
    }
};

// Configuración de campos
const fieldConfig = [
    { name: 'nombre', label: 'Nombre', type: 'text', icon: PersonOutlineIcon, halfWidth: true },
    { name: 'apellido', label: 'Apellido', type: 'text', icon: PersonOutlineIcon, halfWidth: true },
    { name: 'email', label: 'Email', type: 'email', icon: MailOutlineIcon },
    { name: 'contrasenia', label: 'Contraseña', type: 'password', icon: LockOutlinedIcon },
    { name: 'confirmarContrasenia', label: 'Confirmar contraseña', type: 'password', icon: LockOutlinedIcon }
];

// Componente de campo reutilizable
const FormField = ({ field, formulario, errores, onChange, sx = {} }) => {
    const IconComponent = field.icon;
    
    return (
        <TextField
            fullWidth
            label={field.label}
            name={field.name}
            type={field.type}
            value={formulario[field.name]}
            onChange={onChange}
            error={!!errores[field.name]}
            helperText={errores[field.name]}
            variant="outlined"
            sx={{ ...styles.textField, ...sx }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconComponent sx={{ color: '#FF8C00', fontSize: 20 }} />
                        </InputAdornment>
                    )
                }
            }}
        />
    );
};

// Componente principal
const RegistroForm = ({ formulario, errores, isLoading, onChange, onSubmit, mensajeExito }) => {
    const navigate = useNavigate();

    const handleGoToLogin = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => navigate('/login'), 300);
    };

    // Separar campos en dos grupos
    const nameFields = fieldConfig.filter(field => field.halfWidth);
    const fullWidthFields = fieldConfig.filter(field => !field.halfWidth);

    return (
        <Box sx={styles.container}>
            <Paper component="form" onSubmit={onSubmit} elevation={0} sx={styles.paper}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#FF6B35', mb: 0.5 }}>
                        Crear cuenta
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Únete para disfrutar de ofertas exclusivas
                    </Typography>
                </Box>

                {/* Alertas */}
                {errores.general && (
                    <Alert severity="error" sx={{ borderRadius: 2, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
                        {errores.general}
                    </Alert>
                )}
                
                {mensajeExito && (
                    <Alert severity="success" sx={{ borderRadius: 2, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                        {mensajeExito}
                    </Alert>
                )}

                {/* Campos Nombre y Apellido */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {nameFields.map(field => (
                        <FormField 
                            key={field.name}
                            field={field}
                            formulario={formulario}
                            errores={errores}
                            onChange={onChange}
                        />
                    ))}
                </Box>

                {/* Campos de ancho completo */}
                {fullWidthFields.map(field => (
                    <FormField 
                        key={field.name}
                        field={field}
                        formulario={formulario}
                        errores={errores}
                        onChange={onChange}
                    />
                ))}

                {/* Botón de submit */}
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                    size="large"
                    sx={styles.button}
                >
                    {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Crear cuenta'}
                </Button>

                {/* Link al login */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        ¿Ya tenés cuenta?
                    </Typography>
                    <Typography component="a" href="/login" onClick={handleGoToLogin} variant="body2" sx={styles.link}>
                        Inicia sesión
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegistroForm;