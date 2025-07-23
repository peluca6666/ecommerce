// ProfilePage.jsx - Página principal del perfil mejorada
import { useState, useEffect, useCallback } from 'react';
import { 
    Container, Box, Typography, Paper, Tabs, Tab, TextField, Button, 
    Grid, Stack, CircularProgress, Avatar, Card, CardContent,
    IconButton, Fade, Chip, alpha, Alert, Skeleton, Tooltip,
    List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { 
    PersonOutline, LockOutlined, ReceiptOutlined, Edit as EditIcon, 
    Email as EmailIcon, Phone, LocationOn, Badge, Save, Cancel,
    Security, Person, Home, Check, Close, Visibility, VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PurchaseHistoryTab from '../../components/Profile/PurchaseHistoryTab';

// ========== COMPONENTES REUTILIZABLES ==========

// Componente para campos de formulario con mejor UX
const FormField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    disabled, 
    type = 'text', 
    required,
    error,
    helperText,
    ...props 
}) => (
    <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        type={type}
        required={required}
        error={error}
        helperText={helperText}
        variant="outlined"
        sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: disabled ? 'action.disabledBackground' : 'background.paper',
                '&:hover fieldset': { 
                    borderColor: disabled ? 'divider' : '#FF8C00' 
                },
                '&.Mui-focused fieldset': { 
                    borderColor: '#FF6B35' 
                }
            }
        }}
        {...props}
    />
);

// Componente mejorado para mostrar información con mejor diseño
const InfoCard = ({ icon: Icon, label, value, color = '#FF6B35', fullWidth = false }) => (
    <Card 
        elevation={0}
        sx={{ 
            height: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            transition: 'all 0.2s',
            backgroundColor: 'background.paper',
            '&:hover': {
                borderColor: color,
                transform: 'translateY(-2px)',
                boxShadow: theme => `0 4px 20px ${alpha(color, 0.15)}`
            }
        }}
    >
        <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar 
                    sx={{ 
                        bgcolor: alpha(color, 0.1), 
                        color,
                        width: 44,
                        height: 44
                    }}
                >
                    <Icon fontSize="small" />
                </Avatar>
                <Box flex={1} sx={{ minWidth: 0 }}>
                    <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontWeight: 500, letterSpacing: 0.5 }}
                    >
                        {label}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        fontWeight={600}
                        sx={{ 
                            wordBreak: 'break-word',
                            mt: 0.5
                        }}
                    >
                        {value || <span style={{ color: '#999' }}>No especificado</span>}
                    </Typography>
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

// Panel de pestañas con animación mejorada
const TabPanel = ({ children, value, index }) => (
    <Fade in={value === index} timeout={300}>
        <Box 
            hidden={value !== index} 
            sx={{ 
                mt: 3,
                animation: value === index ? 'fadeIn 0.3s' : 'none'
            }}
        >
            {value === index && children}
        </Box>
    </Fade>
);

// Loading skeleton mejorado
const ProfileSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3} alignItems="center">
            <Skeleton variant="circular" width={100} height={100} />
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '30%' }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%' }} />
            <Skeleton variant="rectangular" height={60} width="100%" sx={{ borderRadius: 2 }} />
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {[1, 2, 3, 4].map(i => (
                    <Grid item xs={12} sm={6} key={i}>
                        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    </Container>
);

// ========== COMPONENTES DE FORMULARIO ==========

// Formulario de perfil modularizado
const ProfileForm = ({ profileData, onChange, onSubmit, onCancel, isSubmitting }) => {
    const [errors, setErrors] = useState({});

    // Validación básica
    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                return !value.includes('@') ? 'Email inválido' : '';
            case 'telefono':
                return value && !/^\d{10}$/.test(value.replace(/\D/g, '')) 
                    ? 'Teléfono debe tener 10 dígitos' : '';
            case 'codigo_postal':
                return value && !/^\d{4}$/.test(value) 
                    ? 'Código postal debe tener 4 dígitos' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(e);
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    return (
        <form onSubmit={onSubmit}>
            <Grid container spacing={3}>
                {/* Información Personal */}
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                        Información Personal
                    </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormField 
                        label="Nombre" 
                        name="nombre" 
                        value={profileData.nombre} 
                        onChange={handleChange}
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormField 
                        label="Apellido" 
                        name="apellido" 
                        value={profileData.apellido} 
                        onChange={handleChange}
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormField 
                        label="Email" 
                        name="email" 
                        value={profileData.email} 
                        disabled
                        InputProps={{
                            endAdornment: (
                                <Tooltip title="El email no se puede cambiar">
                                    <Chip label="Fijo" size="small" />
                                </Tooltip>
                            )
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormField 
                        label="DNI" 
                        name="dni" 
                        value={profileData.dni} 
                        onChange={handleChange}
                        inputProps={{ maxLength: 8 }}
                        placeholder="12345678"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormField 
                        label="Teléfono" 
                        name="telefono" 
                        value={profileData.telefono} 
                        onChange={handleChange}
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                        placeholder="1123456789"
                    />
                </Grid>

                {/* Información de Envío */}
                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                        Información de Envío
                    </Typography>
                </Grid>
                
                <Grid item xs={12}>
                    <FormField 
                        label="Dirección" 
                        name="direccion" 
                        value={profileData.direccion} 
                        onChange={handleChange}
                        placeholder="Calle 123, Piso 4B"
                        inputProps={{ maxLength: 100 }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                    <FormField 
                        label="Localidad" 
                        name="localidad" 
                        value={profileData.localidad} 
                        onChange={handleChange}
                        placeholder="San Telmo"
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                    <FormField 
                        label="Provincia" 
                        name="provincia" 
                        value={profileData.provincia} 
                        onChange={handleChange}
                        placeholder="Buenos Aires"
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                    <FormField 
                        label="Código Postal" 
                        name="codigo_postal" 
                        value={profileData.codigo_postal} 
                        onChange={handleChange}
                        error={!!errors.codigo_postal}
                        helperText={errors.codigo_postal}
                        placeholder="1234"
                        inputProps={{ maxLength: 4 }}
                    />
                </Grid>
                
                {/* Botones de acción */}
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                            sx={{
                                bgcolor: '#FF6B35',
                                px: 4,
                                '&:hover': { 
                                    bgcolor: '#FF4500',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 3
                                }
                            }}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={onCancel}
                            startIcon={<Cancel />}
                            sx={{ px: 3 }}
                        >
                            Cancelar
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

// Vista del perfil en modo lectura
const ProfileView = ({ profileData, onEdit }) => {
    // Función helper para formatear la dirección
    const formatAddress = () => {
        const parts = [
            profileData.direccion,
            profileData.localidad,
            profileData.provincia,
            profileData.codigo_postal && `CP: ${profileData.codigo_postal}`
        ].filter(Boolean);
        
        return parts.length > 0 ? parts.join(', ') : null;
    };

    return (
        <>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Información Personal
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Mantené tus datos actualizados para mejorar tu experiencia
                    </Typography>
                </Box>
                <Button 
                    variant="contained"
                    startIcon={<EditIcon />} 
                    onClick={onEdit}
                    sx={{
                        bgcolor: '#FF6B35',
                        px: 3,
                        '&:hover': { 
                            bgcolor: '#FF4500',
                            transform: 'translateY(-2px)',
                            boxShadow: 3
                        }
                    }}
                >
                    Editar Perfil
                </Button>
            </Box>
            
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <InfoCard 
                        icon={Person} 
                        label="Nombre Completo" 
                        value={`${profileData.nombre} ${profileData.apellido}`.trim()}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <InfoCard 
                        icon={EmailIcon} 
                        label="Email" 
                        value={profileData.email}
                        color="#2196F3"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <InfoCard 
                        icon={Badge} 
                        label="DNI" 
                        value={profileData.dni}
                        color="#9C27B0"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <InfoCard 
                        icon={Phone} 
                        label="Teléfono" 
                        value={profileData.telefono}
                        color="#4CAF50"
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                    <InfoCard 
                        icon={Home} 
                        label="Dirección de Envío" 
                        value={formatAddress()}
                        color="#FF9800"
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Sección de completitud del perfil */}
            <ProfileCompleteness profileData={profileData} />
        </>
    );
};

// Componente para mostrar qué tan completo está el perfil
const ProfileCompleteness = ({ profileData }) => {
    const calculateCompleteness = () => {
        const fields = ['nombre', 'apellido', 'dni', 'telefono', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
        const filledFields = fields.filter(field => profileData[field]);
        return Math.round((filledFields.length / fields.length) * 100);
    };

    const completeness = calculateCompleteness();
    const isComplete = completeness === 100;

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                mt: 4, 
                p: 3, 
                border: '1px solid',
                borderColor: isComplete ? 'success.main' : 'warning.main',
                borderRadius: 2,
                bgcolor: isComplete ? alpha('#4CAF50', 0.05) : alpha('#FF9800', 0.05)
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                    bgcolor: isComplete ? 'success.main' : 'warning.main',
                    width: 48,
                    height: 48
                }}>
                    {isComplete ? <Check /> : `${completeness}%`}
                </Avatar>
                <Box flex={1}>
                    <Typography variant="h6" fontWeight={600}>
                        {isComplete ? '¡Perfil Completo!' : `Tu perfil está ${completeness}% completo`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {isComplete 
                            ? 'Genial, tenés todos tus datos actualizados. Esto nos ayuda a brindarte un mejor servicio.'
                            : 'Completá todos los campos para mejorar tu experiencia de compra y envío.'}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

// Formulario de cambio de contraseña mejorado
const PasswordForm = ({ passwordData, onChange, onSubmit, isSubmitting }) => {
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const passwordRequirements = [
        { label: 'Al menos 8 caracteres', check: passwordData.nuevaContrasenia.length >= 8 },
        { label: 'Una letra mayúscula', check: /[A-Z]/.test(passwordData.nuevaContrasenia) },
        { label: 'Una letra minúscula', check: /[a-z]/.test(passwordData.nuevaContrasenia) },
        { label: 'Un número', check: /\d/.test(passwordData.nuevaContrasenia) },
    ];

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Cambiar Contraseña
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Te recomendamos cambiar tu contraseña cada 3 meses para mantener tu cuenta segura
                    </Typography>
                </Box>
                
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 4, 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 2 
                    }}
                >
                    <form onSubmit={onSubmit}>
                        <Stack spacing={3}>
                            <FormField
                                type={showPasswords.current ? 'text' : 'password'}
                                label="Contraseña Actual"
                                name="contraseniaActual"
                                value={passwordData.contraseniaActual}
                                onChange={onChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('current')}
                                            edge="end"
                                        >
                                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )
                                }}
                            />
                            
                            <FormField
                                type={showPasswords.new ? 'text' : 'password'}
                                label="Nueva Contraseña"
                                name="nuevaContrasenia"
                                value={passwordData.nuevaContrasenia}
                                onChange={onChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('new')}
                                            edge="end"
                                        >
                                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )
                                }}
                            />

                            {/* Requisitos de contraseña */}
                            {passwordData.nuevaContrasenia && (
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 2, 
                                        bgcolor: 'background.default',
                                        borderRadius: 1
                                    }}
                                >
                                    <Typography variant="caption" fontWeight={600} gutterBottom>
                                        Requisitos de la contraseña:
                                    </Typography>
                                    <List dense>
                                        {passwordRequirements.map((req, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    {req.check ? (
                                                        <Check fontSize="small" color="success" />
                                                    ) : (
                                                        <Close fontSize="small" color="error" />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={req.label}
                                                    primaryTypographyProps={{
                                                        variant: 'caption',
                                                        color: req.check ? 'success.main' : 'text.secondary'
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                            
                            <FormField
                                type={showPasswords.confirm ? 'text' : 'password'}
                                label="Confirmar Nueva Contraseña"
                                name="confirmarContrasenia"
                                value={passwordData.confirmarContrasenia}
                                onChange={onChange}
                                required
                                error={passwordData.confirmarContrasenia && 
                                       passwordData.nuevaContrasenia !== passwordData.confirmarContrasenia}
                                helperText={
                                    passwordData.confirmarContrasenia && 
                                    passwordData.nuevaContrasenia !== passwordData.confirmarContrasenia
                                        ? 'Las contraseñas no coinciden'
                                        : ''
                                }
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            edge="end"
                                        >
                                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )
                                }}
                            />
                            
                            <Button 
                                variant="contained" 
                                type="submit" 
                                disabled={isSubmitting || 
                                         !passwordRequirements.every(req => req.check) ||
                                         passwordData.nuevaContrasenia !== passwordData.confirmarContrasenia}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Security />}
                                sx={{
                                    py: 1.5,
                                    bgcolor: '#FF6B35',
                                    '&:hover': { 
                                        bgcolor: '#FF4500',
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </Button>
                        </Stack>
                    </form>
                </Paper>

                <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="caption">
                        <strong>Tip de seguridad:</strong> Usá una contraseña única que no uses en otros sitios. 
                        Podés usar un gestor de contraseñas para recordarlas fácilmente.
                    </Typography>
                </Alert>
            </Stack>
        </Box>
    );
};

// ========== COMPONENTE PRINCIPAL ==========
const ProfilePage = () => {
    const { user, getToken, showNotification } = useAuth();
    const location = useLocation();

    // Estados
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(location.state?.activeTab || 0);
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState({
        nombre: '', apellido: '', email: '', dni: '', telefono: '',
        direccion: '', provincia: '', localidad: '', codigo_postal: ''
    });

    const [passwordData, setPasswordData] = useState({
        contraseniaActual: '', nuevaContrasenia: '', confirmarContrasenia: ''
    });

    // Cargar datos del perfil
    const fetchProfile = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const token = getToken();
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data) {
                setProfileData({
                    nombre: response.data.nombre || '',
                    apellido: response.data.apellido || '',
                    email: response.data.email || '',
                    dni: response.data.dni || '',
                    telefono: response.data.telefono || '',
                    direccion: response.data.direccion || '',
                    provincia: response.data.provincia || '',
                    localidad: response.data.localidad || '',
                    codigo_postal: response.data.codigo_postal || ''
                });
            }
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            showNotification(
                'No pudimos cargar tu perfil. Por favor, recargá la página.', 
                'error'
            );
        } finally {
            setLoading(false);
        }
    }, [user, getToken, showNotification]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (location.state?.activeTab !== undefined) {
            setTabIndex(location.state.activeTab);
        }
    }, [location.state?.activeTab]);

    // Handlers
    const handleTabChange = (event, newValue) => setTabIndex(newValue);
    
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCancelEdit = () => {
        setIsEditing(false);
        fetchProfile(); // Recargar datos originales
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingProfile(true);
        
        try {
            const token = getToken();
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/profile`, 
                profileData, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            showNotification('¡Genial! Tu perfil fue actualizado exitosamente 🎉', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            showNotification(
                error.response?.data?.mensaje || 
                'Ups, algo salió mal. Intentá de nuevo en unos segundos.', 
                'error'
            );
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        if (passwordData.nuevaContrasenia !== passwordData.confirmarContrasenia) {
            showNotification('Las contraseñas no coinciden. Revisalas e intentá de nuevo.', 'error');
            return;
        }
        
        if (passwordData.nuevaContrasenia.length < 8) {
            showNotification('La contraseña debe tener al menos 8 caracteres.', 'error');
            return;
        }
        
        setIsSubmittingPassword(true);
        
        try {
            const token = getToken();
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/profile/change-password`,
                {
                    contraseniaActual: passwordData.contraseniaActual,
                    nuevaContrasenia: passwordData.nuevaContrasenia
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            showNotification('¡Excelente! Tu contraseña fue actualizada correctamente 🔒', 'success');
            setPasswordData({ 
                contraseniaActual: '', 
                nuevaContrasenia: '', 
                confirmarContrasenia: '' 
            });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            showNotification(
                error.response?.data?.mensaje || 
                'No pudimos cambiar tu contraseña. Verificá que la contraseña actual sea correcta.', 
                'error'
            );
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    // Renderizado condicional para loading
    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header del perfil con animación */}
                <Fade in timeout={600}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: '#FF6B35',
                                fontSize: '2.5rem',
                                mx: 'auto',
                                mb: 2,
                                boxShadow: theme => `0 8px 32px ${alpha('#FF6B35', 0.3)}`,
                                border: '4px solid white'
                            }}
                        >
                            {profileData.nombre?.[0]?.toUpperCase() || 
                             user?.email?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            ¡Hola, {profileData.nombre || 'Usuario'}! 👋
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Acá podés gestionar toda la información de tu cuenta
                        </Typography>
                    </Box>
                </Fade>

                {/* Card principal con tabs */}
                <Fade in timeout={800}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            borderRadius: 3, 
                            overflow: 'hidden',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        {/* Tabs estilizados */}
                        <Tabs 
                            value={tabIndex} 
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                bgcolor: '#FF6B35',
                                '& .MuiTab-root': {
                                    color: 'white',
                                    opacity: 0.8,
                                    fontWeight: 500,
                                    py: 2.5,
                                    transition: 'all 0.3s',
                                    '&.Mui-selected': {
                                        opacity: 1,
                                        fontWeight: 600
                                    },
                                    '&:hover': {
                                        opacity: 1,
                                        backgroundColor: alpha('#000', 0.1)
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    bgcolor: 'white',
                                    height: 4,
                                    borderRadius: '4px 4px 0 0'
                                }
                            }}
                        >
                            <Tab 
                                icon={<Person />} 
                                iconPosition="start" 
                                label="Mi Perfil" 
                            />
                            <Tab 
                                icon={<Security />} 
                                iconPosition="start" 
                                label="Seguridad" 
                            />
                            <Tab 
                                icon={<ReceiptOutlined />} 
                                iconPosition="start" 
                                label="Mis Compras" 
                            />
                        </Tabs>

                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            {/* Tab de Perfil */}
                            <TabPanel value={tabIndex} index={0}>
                                {isEditing ? (
                                    <ProfileForm
                                        profileData={profileData}
                                        onChange={handleProfileChange}
                                        onSubmit={handleProfileSubmit}
                                        onCancel={handleCancelEdit}
                                        isSubmitting={isSubmittingProfile}
                                    />
                                ) : (
                                    <ProfileView
                                        profileData={profileData}
                                        onEdit={() => setIsEditing(true)}
                                    />
                                )}
                            </TabPanel>

                            {/* Tab de Seguridad */}
                            <TabPanel value={tabIndex} index={1}>
                                <PasswordForm
                                    passwordData={passwordData}
                                    onChange={handlePasswordChange}
                                    onSubmit={handlePasswordSubmit}
                                    isSubmitting={isSubmittingPassword}
                                />
                            </TabPanel>

                            {/* Tab de Compras */}
                            <TabPanel value={tabIndex} index={2}>
                                <PurchaseHistoryTab />
                            </TabPanel>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default ProfilePage;