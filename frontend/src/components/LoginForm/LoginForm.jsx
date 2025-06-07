import { Button, TextField, Typography, Box } from '@mui/material';

export default function LoginForm({ formulario, errores, isLoading, handleChange, handleSubmit }) {
    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Typography variant="h5" align="center">Iniciar sesión</Typography>

            <TextField
                label="Email"
                name="email"
                type="email"
                value={formulario.email}
                onChange={handleChange}
                error={!!errores.email}
                helperText={errores.email}
                fullWidth
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
            />

            {errores.general && (
                <Typography color="error" variant="body2" align="center">
                    {errores.general}
                </Typography>
            )}

            <Button type="submit" variant="contained" disabled={isLoading} fullWidth>
                {isLoading ? 'Cargando...' : 'Ingresar'}
            </Button>
        </Box>
    );
}
