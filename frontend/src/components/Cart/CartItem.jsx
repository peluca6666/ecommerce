import { Grid, Box, Typography, IconButton, Avatar } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, DeleteOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CartItem = ({ item }) => {
    // Obtenemos las funciones para modificar el carrito desde el contexto global
    const { updateCartItemQuantity, removeFromCart } = useAuth();

    return (
        <Grid container alignItems="center" spacing={2} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
            
            {/*  Imagen y Nombre del Producto */}
            <Grid item xs={12} sm={5} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                    variant="rounded" 
                    src={item.imagen} 
                    sx={{ width: 64, height: 64 }}
                />
                <Box>
                    <Typography 
                        variant="subtitle1" 
                        fontWeight="bold"
                        component={RouterLink}
                        to={`/producto/${item.producto_id}`}
                        sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                        {item.nombre_producto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ${item.precio_actual.toFixed(2)} c/u
                    </Typography>
                </Box>
            </Grid>

            {/* Selector de Cantidad */}
            <Grid item xs={6} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton 
                        aria-label="reducir cantidad"
                        onClick={() => updateCartItemQuantity(item.producto_id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1} // Deshabilitamos si la cantidad es 1
                    >
                        <RemoveCircleOutline />
                    </IconButton>
                    <Typography variant="body1" sx={{ mx: 1, fontWeight: 'bold' }}>
                        {item.cantidad}
                    </Typography>
                    <IconButton 
                        aria-label="aumentar cantidad"
                        onClick={() => updateCartItemQuantity(item.producto_id, item.cantidad + 1)}
                    >
                        <AddCircleOutline />
                    </IconButton>
                </Box>
            </Grid>
            
            {/*Subtotal y Botón de Eliminar */}
            <Grid item xs={6} sm={3} sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                 <Typography variant="subtitle1" fontWeight="bold">
                    ${(item.subtotal || item.cantidad * item.precio_actual).toFixed(2)}
                </Typography>
                <IconButton 
                    aria-label="eliminar producto" 
                    color="error" 
                    onClick={() => removeFromCart(item.producto_id)}
                >
                    <DeleteOutline />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default CartItem;