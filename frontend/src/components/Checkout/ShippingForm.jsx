import { Grid, TextField, Alert, Stack, Box, Typography, Autocomplete, Paper } from '@mui/material';
import { LocalShipping, Person, Home, LocationOn, Phone } from '@mui/icons-material';

// Lista básica de principales ciudades argentinas
const MAIN_CITIES = [
  'Buenos Aires', 'Córdoba', 'Rosario', 'La Plata', 'Mar del Plata',
  'San Miguel de Tucumán', 'Salta', 'Santa Fe', 'Corrientes', 'Resistencia',
  'Posadas', 'Neuquén', 'Formosa', 'San Luis', 'La Rioja',
  'Catamarca', 'Mendoza', 'San Juan', 'Santiago del Estero', 'Jujuy',
  'Río Gallegos', 'Ushuaia', 'Villa General Belgrano', 'Santa Rosa de Calamuchita',
  'La Cumbrecita', 'Villa Berna', 'Los Reartes', 'Villa Alpina'
];

const ShippingForm = ({ data, onChange, shipping }) => {
  const handleAutocompleteChange = (event, newValue) => {
    onChange({
      target: {
        name: 'localidad',
        value: newValue || ''
      }
    });
  };

  return (
    <Stack spacing={3}>
      {/* Datos Personales */}
      <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fafbfc', border: '1px solid #f0f0f0', borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Person sx={{ color: '#FF6B35', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Datos Personales
          </Typography>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': { borderColor: '#FF8C00' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                }
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': { borderColor: '#FF8C00' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="telefono" 
              label="Teléfono" 
              value={data.telefono} 
              onChange={onChange} 
              fullWidth
              placeholder="Ej: 11-1234-5678"
              InputProps={{
                startAdornment: <Phone sx={{ color: '#95a5a6', fontSize: 18, mr: 1 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': { borderColor: '#FF8C00' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Dirección de Envío */}
      <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fffe', border: '1px solid #e8f5f3', borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Home sx={{ color: '#FF6B35', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Dirección de Envío
          </Typography>
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
              placeholder="Ej: Av. Corrientes 1234, Piso 5, Depto B"
              InputProps={{
                startAdornment: <LocationOn sx={{ color: '#95a5a6', fontSize: 18, mr: 1 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': { borderColor: '#FF8C00' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                }
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
                onChange({
                  target: {
                    name: 'localidad',
                    value: newInputValue
                  }
                });
              }}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  name="localidad"
                  label="Localidad / Ciudad" 
                  required
                  placeholder="Escribe o selecciona..."
                  helperText="💡 El costo de envío se calcula según la localidad"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '&:hover fieldset': { borderColor: '#FF8C00' },
                      '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#7f8c8d',
                      fontSize: '0.75rem'
                    }
                  }}
                />
              )}
              sx={{ 
                '& .MuiAutocomplete-listbox': {
                  maxHeight: 200
                }
              }}
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
              placeholder="Ej: 1430"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': { borderColor: '#FF8C00' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                }
              }}
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
              placeholder="Ej: Buenos Aires"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': { borderColor: '#FF8C00' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Información de envío mejorada */}
      {data.localidad && (
        <Alert 
          severity={shipping.isLocal ? 'success' : 'info'} 
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${shipping.isLocal ? '#4caf50' : '#2196f3'}20`,
            '& .MuiAlert-icon': {
              fontSize: '1.2rem'
            }
          }}
        >
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
              <Typography 
                variant="h6" 
                fontWeight={700}
                sx={{ 
                  color: shipping.isLocal ? '#2e7d32' : '#1565c0'
                }}
              >
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