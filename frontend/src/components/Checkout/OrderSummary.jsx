import { 
    Paper, Typography, Divider, Box, Stack, Button, CircularProgress,
    Avatar, Chip, Alert
} from '@mui/material';
import { 
    ShoppingBag, 
    LocalShipping, 
    Security,
    ArrowForward
} from '@mui/icons-material';

const OrderSummary = ({ cart, shipping, isProcessing, onPlaceOrder }) => {
  const ProductItem = ({ producto }) => {
    const imageUrl = producto.imagen 
      ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
      : 'https://via.placeholder.com/50x50?text=IMG';
    
    const subtotal = producto.subtotal || (producto.cantidad * producto.precio_actual);

    return (
      <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
        <Avatar
          src={imageUrl}
          variant="rounded"
          sx={{ 
            width: 50, 
            height: 50,
            border: '1px solid #f0f0f0'
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="body2" 
            fontWeight={600} 
            sx={{ 
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {producto.nombre_producto}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip 
              label={`${producto.cantidad}x`} 
              size="small" 
              sx={{ 
                height: 20,
                fontSize: '0.7rem',
                bgcolor: '#f8f9fa',
                color: '#495057'
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              ${producto.precio_actual.toLocaleString('es-AR')} c/u
            </Typography>
          </Stack>
        </Box>
        <Typography variant="body2" fontWeight={700} color="primary.main">
          ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </Typography>
      </Stack>
    );
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        position: 'sticky', 
        top: 20,
        border: '1px solid #e9ecef',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)'
      }}
    >
      {/* Header elegante */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)',
        color: 'white'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <ShoppingBag sx={{ fontSize: 24 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Resumen del Pedido
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {cart.productos.length} {cart.productos.length === 1 ? 'producto' : 'productos'}
            </Typography>
          </Box>
        </Stack>
      </Box>
      
      <Box sx={{ p: 3 }}>
        {/* Lista de productos mejorada */}
        <Box sx={{ 
          maxHeight: 280, 
          overflowY: 'auto',
          mb: 3,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: '#f1f1f1', borderRadius: 3 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#c1c1c1', borderRadius: 3 }
        }}>
          {cart.productos.map((producto, index) => (
            <Box key={producto.producto_id}>
              <ProductItem producto={producto} />
              {index < cart.productos.length - 1 && (
                <Divider sx={{ borderColor: '#f8f9fa' }} />
              )}
            </Box>
          ))}
        </Box>
        
        {/* Cálculos */}
        <Box sx={{ 
          bgcolor: '#f8f9fa', 
          p: 2.5, 
          borderRadius: 2,
          mb: 3
        }}>
          {/* Subtotal */}
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography variant="body1" color="text.secondary">
              Subtotal productos
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              ${cart.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </Stack>
          
          {/* Envío */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalShipping sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                Envío ({shipping.region})
              </Typography>
            </Stack>
            <Typography 
              variant="body1" 
              fontWeight={600}
              sx={{ color: shipping.isLocal ? '#FF8C00' : 'text.primary' }}
            >
              ${shipping.cost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </Stack>
          
          <Divider sx={{ mb: 2, borderColor: '#e9ecef' }} />
          
          {/* Total final destacado */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700} sx={{ color: '#2c3e50' }}>
              Total Final
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={800}
              sx={{ 
                color: '#FF6B35',
                fontSize: '1.5rem'
              }}
            >
              ${shipping.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </Stack>
        </Box>

        {/* Información de envío */}
        {shipping.isLocal && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              fontSize: '0.85rem'
            }}
          >
            🚚 Envío local - ¡Tu pedido llega el mismo día!
          </Alert>
        )}

        {/* Botón de compra mejorado */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          endIcon={isProcessing ? null : <ArrowForward />}
          disabled={cart.productos.length === 0 || isProcessing}
          onClick={onPlaceOrder}
          sx={{
            py: 1.8,
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
            boxShadow: '0 4px 14px rgba(255,107,53,0.25)',
            mb: 2.5,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 18px rgba(255,107,53,0.35)',
              background: 'linear-gradient(135deg, #FF4500, #FF2500)'
            },
            '&:disabled': {
              background: '#e0e0e0',
              transform: 'none',
              boxShadow: 'none'
            }
          }}
        >
          {isProcessing ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircularProgress size={20} color="inherit" />
              <span>Procesando...</span>
            </Stack>
          ) : (
            'Realizar Pedido'
          )}
        </Button>

        {/* Footer de seguridad */}
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="center" 
          spacing={1}
        >
          <Security sx={{ fontSize: 16, color: '#4caf50' }} />
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#4caf50',
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            Compra 100% segura y protegida
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

export default OrderSummary;