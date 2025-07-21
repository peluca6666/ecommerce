import { Paper, Typography, Divider, Box, Stack, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';

const OrderSummary = ({ cart, shipping, isProcessing, onPlaceOrder }) => {
  return (
    <Paper 
      sx={{ 
        p: 3, 
        position: 'sticky', 
        top: '80px', 
        borderRadius: '16px', 
        border: '1px solid #e0e0e0' 
      }} 
      elevation={0}
    >
      <Typography variant="h6" gutterBottom>Resumen del Pedido</Typography>
      <Divider sx={{ my: 2 }} />
      
      {/* Lista de productos */}
      <Stack spacing={1.5} sx={{ maxHeight: '250px', overflowY: 'auto', pr: 1 }}>
        {cart.productos.map(p => (
          <ListItem key={p.producto_id} disableGutters sx={{p:0}}>
            <ListItemText 
              primary={p.nombre_producto} 
              secondary={`Cantidad: ${p.cantidad}`} 
            />
            <Typography variant="body1" fontWeight="500">
              ${(p.subtotal || p.cantidad * p.precio_actual).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </ListItem>
        ))}
      </Stack>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Subtotal */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body1">Subtotal</Typography>
        <Typography variant="body1" fontWeight="500">
          ${cart.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </Typography>
      </Box>
      
      {/* Envío */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body1">Envío ({shipping.region})</Typography>
        <Typography variant="body1" fontWeight="500" color={shipping.isLocal ? 'warning.main' : 'text.primary'}>
          ${shipping.cost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Total final */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Total Final</Typography>
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          ${shipping.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </Typography>
      </Box>
      
      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{ py: 1.5, borderRadius: '12px', fontWeight: 'bold' }}
        disabled={cart.productos.length === 0 || isProcessing}
        onClick={onPlaceOrder}
      >
        {isProcessing ? <CircularProgress size={26} color="inherit"/> : 'Realizar Pedido'}
      </Button>
    </Paper>
  );
};

export default OrderSummary;