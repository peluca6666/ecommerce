import { Grid, TextField, Alert, Stack, Box, Typography } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

const ShippingForm = ({ data, onChange, shipping }) => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField 
            name="nombre" 
            label="Nombre" 
            value={data.nombre} 
            onChange={onChange} 
            fullWidth 
            required 
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
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            name="direccion" 
            label="Dirección (Calle y Nro)" 
            value={data.direccion} 
            onChange={onChange} 
            fullWidth 
            required 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            name="localidad" 
            label="Localidad" 
            value={data.localidad} 
            onChange={onChange} 
            fullWidth 
            required 
            helperText="El costo de envío se calcula según la localidad"
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            name="telefono" 
            label="Teléfono (Opcional)" 
            value={data.telefono} 
            onChange={onChange} 
            fullWidth 
          />
        </Grid>
      </Grid>

      {/* Información de envío en tiempo real */}
      {data.localidad && (
        <Alert 
          severity={shipping.isLocal ? 'success' : 'info'} 
          sx={{ mt: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocalShipping />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Envío a {data.localidad}: {shipping.description}
              </Typography>
              <Typography variant="caption">
                {shipping.deliveryTime}
              </Typography>
            </Box>
          </Stack>
        </Alert>
      )}
    </div>
  );
};

export default ShippingForm;