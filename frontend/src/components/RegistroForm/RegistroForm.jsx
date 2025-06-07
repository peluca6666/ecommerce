import React from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const RegistroForm = ({ formulario, errores, isLoading, onChange, onSubmit, mensajeExito }) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Registro</Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Nombre"
        name="nombre"
        value={formulario.nombre}
        onChange={onChange}
        error={!!errores.nombre}
        helperText={errores.nombre}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Apellido"
        name="apellido"
        value={formulario.apellido}
        onChange={onChange}
        error={!!errores.apellido}
        helperText={errores.apellido}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        value={formulario.email}
        onChange={onChange}
        error={!!errores.email}
        helperText={errores.email}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Contraseña"
        type="password"
        name="contrasenia"
        value={formulario.contrasenia}
        onChange={onChange}
        error={!!errores.contrasenia}
        helperText={errores.contrasenia}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Confirmar contraseña"
        type="password"
        name="confirmarContrasenia"
        value={formulario.confirmarContrasenia}
        onChange={onChange}
        error={!!errores.confirmarContrasenia}
        helperText={errores.confirmarContrasenia}
      />

      {errores.general && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>{errores.general}</Typography>
      )}

      {mensajeExito && (
        <Typography color="primary" variant="body2" sx={{ mt: 1 }}>{mensajeExito}</Typography>
      )}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </Button>
    </Box>
  );
};

export default RegistroForm;
