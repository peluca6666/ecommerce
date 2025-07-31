import { Button, TextField, Typography, Box, Paper, CircularProgress, Alert, InputAdornment } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; 
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 

// Estilos reutilizables
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #FFF5EE 0%, #FFE4E1 100%)',
        px: 2,
        py: 4
    },
    paper: {
        width: '100%',
        maxWidth: 400,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
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
    { 
        name: 'email', 
        label: 'Email', 
        type: 'email', 
        icon: PersonOutlineIcon 
    },
    { 
        name: 'contrasenia', 
        label: 'Contraseña', 
        type: 'password', 
        icon: LockOutlinedIcon 
    }
];

// Componente de campo reutilizable
const FormField = ({ field, formulario, errores, onChange }) => {
    const IconComponent = field.icon;
    
    return (
        <TextField
            label={field.label}
            name={field.name}
            type={field.type}
            value={formulario[field.name]}
            onChange={onChange}
            error={!!errores[field.name]}
            helperText={errores[field.name]}
            fullWidth
            variant="outlined"
            sx={styles.textField}
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

// Componente de alertas
const AlertMessage = ({ type, message, icon }) => {
    const isSuccess = type === 'success';
    
    return (
        <Alert 
            severity={type}
            icon={icon}
            sx={{ 
                borderRadius: 2,
                bgcolor: isSuccess 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(244, 67, 54, 0.1)',
                '& .MuiAlert-icon': { 
                    color: isSuccess ? '#4CAF50' : '#F44336' 
                }
            }}
        >
            {message}
        </Alert>
    );
};

// Componente principal
export default function LoginForm({ formulario, errores, isLoading, handleChange, handleSubmit }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { registrationSuccess } = location.state || {};

    const handleGoToRegister = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => navigate('/register'), 300);
    };

    return (
        <Box sx={styles.container}>
            <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={styles.paper}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#FF6B35', mb: 0.5 }}>
                        Iniciar Sesión
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Accede a tu cuenta para continuar comprando
                    </Typography>
                </Box>

                {/* Alertas */}
                {registrationSuccess && (
                    <AlertMessage 
                        type="success" 
                        message="¡Registro exitoso! Por favor, inicia sesión."
                        icon={<CheckCircleOutlineIcon />}
                    />
                )}

                {errores.general && (
                    <AlertMessage 
                        type="error" 
                        message={errores.general}
                    />
                )}

                {/* Campos del formulario */}
                {fieldConfig.map(field => (
                    <FormField 
                        key={field.name}
                        field={field}
                        formulario={formulario}
                        errores={errores}
                        onChange={handleChange}
                    />
                ))}

                {/* Botón de submit */}
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isLoading} 
                    fullWidth
                    size="large"
                    sx={styles.button}
                >
                    {isLoading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : 'Iniciar Sesión'}
                </Button>

                {/* Link al registro */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        ¿No tenés cuenta?
                    </Typography>
                    <Typography
                        component="a"
                        href="/register"
                        onClick={handleGoToRegister}
                        variant="body2"
                        sx={styles.link}
                    >
                        Regístrate acá
                    </Typography>
                </Box>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
  <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
</div>
            </Paper>
        </Box>
    );
}