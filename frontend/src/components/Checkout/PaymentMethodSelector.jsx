
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

const PaymentMethodSelector = ({ value, onChange }) => {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <FormControlLabel 
        value="mercadopago" 
        control={<Radio />} 
        label="Tarjeta de Crédito / Débito (Mercado Pago)" 
      />
      <FormControlLabel 
        value="transferencia" 
        control={<Radio />} 
        label="Transferencia Bancaria" 
      />
    </RadioGroup>
  );
};

export default PaymentMethodSelector;