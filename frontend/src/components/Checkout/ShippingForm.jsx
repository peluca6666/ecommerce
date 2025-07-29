import { Grid, TextField, Alert, Stack, Box, Typography, Autocomplete, Paper } from '@mui/material';
import { LocalShipping, Person, Home, LocationOn, Phone, Badge } from '@mui/icons-material';

const MAIN_CITIES = [
  'Buenos Aires', 'Córdoba', 'Rosario', 'La Plata', 'Mar del Plata',
  'San Miguel de Tucumán', 'Salta', 'Santa Fe', 'Corrientes', 'Resistencia',
  'Posadas', 'Neuquén', 'Formosa', 'San Luis', 'La Rioja',
  'Catamarca', 'Mendoza', 'San Juan', 'Santiago del Estero', 'Jujuy',
  'Río Gallegos', 'Ushuaia', 'Villa General Belgrano', 'Santa Rosa de Calamuchita',
  'La Cumbrecita', 'Villa Berna', 'Los Reartes', 'Villa Alpina'
];

const ShippingForm = ({ data, onChange, shipping, errors = {} }) => {
  const handleAutocompleteChange = (event, newValue) => {
    onChange({
      target: { name: 'localidad', value: newValue || '' }
    });
  };

  // Helper para DNI - solo números, max 8
  const handleDNIChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 8);
    onChange({ target: { name: 'dni', value } });
  };

  return (
    <Stack spacing={3}>
      {/* Datos Personales */}
      <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fafbfc', border: '1px solid #f0f0f0', borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Person sx={{ color: '#FF6B35', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600}>Datos Personales</Typography>
        </Stack>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="nombre" 
              label="Nombre" 
              value={data.nombre} 
              onChange={onChange} 
              fullWidth 
              required
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="apellido" 
              label="Apellido" 
              value={data.apellido} 
              onChange={onChange} 
              fullWidth 
              required
              error={!!errors.apellido}
              helperText={errors.apellido}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField 
              name="dni" 
              label="DNI" 
              value={data.dni} 
              onChange={handleDNIChange}
              fullWidth 
              required
              error={!!errors.dni}
              helperText={errors.dni || '8 dígitos (ej: 43231922)'}
              placeholder="43231922"
              InputProps={{
                startAdornment: <Badge sx={{ color: '#95a5a6', fontSize: 18, mr: 1 }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField 
              name="telefono" 
              label="Teléfono (opcional)" 
              value={data.telefono} 
              onChange={onChange}
              fullWidth
              error={!!errors.telefono}
              helperText={errors.telefono || 'Ej: 3456 417985'}
              placeholder="3456 417985"
              InputProps={{
                startAdornment: <Phone sx={{ color: '#95a5a6', fontSize: 18, mr: 1 }} />
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Dirección de Envío */}
      <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fffe', border: '1px solid #e8f5f3', borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Home sx={{ color: '#FF6B35', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600}>Dirección de Envío</Typography>
        </Stack>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              name="direccion" 
              label="Dirección completa" 
              value={data.direccion} 
              onChange={onChange} 
              fullWidth 
              required
              error={!!errors.direccion}
              helperText={errors.direccion}
              placeholder="Ej: Av. Corrientes 1234, Piso 5, Depto B"
              InputProps={{
                startAdornment: <LocationOn sx={{ color: '#95a5a6', fontSize: 18, mr: 1 }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={MAIN_CITIES}
              value={data.localidad}
              onChange={handleAutocompleteChange}
              onInputChange={(event, newInputValue) => {
                onChange({ target: { name: 'localidad', value: newInputValue } });
              }}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  name="localidad"
                  label="Localidad / Ciudad" 
                  required
                  error={!!errors.localidad}
                  helperText={errors.localidad || '💡 El costo de envío se calcula según la localidad'}
                  placeholder="Escribe o selecciona..."
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField 
              name="codigo_postal" 
              label="Código Postal" 
              value={data.codigo_postal} 
              onChange={onChange} 
              fullWidth 
              required
              error={!!errors.codigo_postal}
              helperText={errors.codigo_postal}
              placeholder="Ej: 1430"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField 
              name="provincia" 
              label="Provincia" 
              value={data.provincia} 
              onChange={onChange} 
              fullWidth 
              required
              error={!!errors.provincia}
              helperText={errors.provincia}
              placeholder="Ej: Buenos Aires"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Información de envío */}
      {data.localidad && (
        <Alert severity={shipping.isLocal ? 'success' : 'info'} sx={{ borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                📍 Envío a {data.localidad}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>{shipping.description}</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {shipping.deliveryTime}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: shipping.isLocal ? '#2e7d32' : '#1565c0' }}>
                ${shipping.cost.toLocaleString('es-AR')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Costo de envío
              </Typography>
            </Box>
          </Stack>
        </Alert>
      )}
    </Stack>
  );
};

export default ShippingForm;