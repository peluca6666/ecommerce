import { Paper, Typography, Box, Button, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const OrderItem = ({ orden }) => {
    // devuelve un color para el chip según el estado de la orden
    const getStatusChipColor = (estado) => {
        if (estado === 'Completado') return 'success';
        if (estado === 'Pendiente') return 'warning';
        if (estado === 'Cancelado') return 'error';
        return 'default';
    };

    return (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mb: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 2 
          }}
        >
            <Box>
                <Typography variant="subtitle1" fontWeight="bold">Orden #{orden.venta_id}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Fecha: {new Date(orden.fecha_venta).toLocaleDateString()}
                </Typography>
                <Chip 
                    label={orden.estado || 'Desconocido'}
                    color={getStatusChipColor(orden.estado)}
                    size="small"
                    sx={{ mt: 1 }}
                />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" fontWeight="bold">${orden.total.toFixed(2)}</Typography>
                <Button
                    component={RouterLink}
                    to={`/orden-confirmada/${orden.venta_id}`}
                    variant="text"
                    size="small"
                    sx={{ mt: 1 }}
                >
                    Ver Detalles
                </Button>
            </Box>
        </Paper>
    );
};

export default OrderItem;
