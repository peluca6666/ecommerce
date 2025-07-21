import { 
    RadioGroup, FormControlLabel, Radio, Box, Typography, Stack, 
    Paper, Alert, Chip, Divider 
} from '@mui/material';
import { 
    CreditCard, 
    AccountBalance, 
    Security, 
    Speed,
    ContentCopy
} from '@mui/icons-material';

const PaymentMethodSelector = ({ value, onChange }) => {
  const handleCopyAlias = () => {
    navigator.clipboard.writeText('golf.eco.mp');
    // Aquí podrías agregar una notificación de "copiado"
  };

  const PaymentOption = ({ value: optionValue, icon: Icon, title, description, children, recommended }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: value === optionValue ? '2px solid #FF6B35' : '1px solid #e9ecef',
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        bgcolor: value === optionValue ? 'rgba(255,107,53,0.02)' : 'white',
        '&:hover': {
          borderColor: value === optionValue ? '#FF6B35' : '#FF8C00',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }
      }}
      onClick={() => onChange({ target: { value: optionValue } })}
    >
      <FormControlLabel
        value={optionValue}
        control={<Radio sx={{ '&.Mui-checked': { color: '#FF6B35' } }} />}
        sx={{ width: '100%', m: 0 }}
        label={
          <Box sx={{ width: '100%', ml: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Icon sx={{ color: '#FF6B35', fontSize: 24 }} />
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {description}
                  </Typography>
                </Box>
              </Stack>
              {recommended && (
                <Chip 
                  label="Recomendado" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#4caf50', 
                    color: 'white',
                    fontSize: '0.7rem',
                    height: 20
                  }} 
                />
              )}
            </Stack>
            {children}
          </Box>
        }
      />
    </Paper>
  );

  return (
    <RadioGroup value={value} onChange={onChange}>
      <Stack spacing={2}>
        
        {/* Mercado Pago */}
        <PaymentOption
          value="mercadopago"
          icon={CreditCard}
          title="Tarjeta de Crédito / Débito"
          description="Pago seguro con Mercado Pago"
          recommended={true}
        >
          {value === 'mercadopago' && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Security sx={{ color: '#4caf50', fontSize: 18 }} />
                <Typography variant="caption" color="text.secondary">
                  Procesamiento seguro con SSL
                </Typography>
                <Speed sx={{ color: '#2196f3', fontSize: 18 }} />
                <Typography variant="caption" color="text.secondary">
                  Aprobación inmediata
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ 
                display: 'block', 
                mt: 1, 
                color: '#7f8c8d',
                fontStyle: 'italic'
              }}>
                Aceptamos Visa, Mastercard, American Express y más
              </Typography>
            </Box>
          )}
        </PaymentOption>

        {/* Transferencia */}
        <PaymentOption
          value="transferencia"
          icon={AccountBalance}
          title="Transferencia Bancaria"
          description="Transferí a nuestra cuenta y confirmá el pago"
        >
          {value === 'transferencia' && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 2,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Datos para transferencia:
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      <strong>Alias:</strong> golf.eco.mp
                    </Typography>
                    <Chip
                      icon={<ContentCopy sx={{ fontSize: 14 }} />}
                      label="Copiar"
                      size="small"
                      onClick={handleCopyAlias}
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#e3f2fd' }
                      }}
                    />
                  </Box>
                  <Typography variant="body2">
                    <strong>Titular:</strong> SaloMarket
                  </Typography>
                  <Typography variant="body2">
                    <strong>CUIT:</strong> 20-12345678-9
                  </Typography>
                </Stack>
              </Alert>
              
              <Alert severity="warning" sx={{ fontSize: '0.85rem' }}>
                <Typography variant="body2">
                  <strong>Importante:</strong> Después de transferir, envianos el comprobante por WhatsApp al 
                  <strong> +54 9 11 1234-5678</strong> para confirmar tu pedido.
                </Typography>
              </Alert>
            </Box>
          )}
        </PaymentOption>

      </Stack>
    </RadioGroup>
  );
};

export default PaymentMethodSelector;