import { Grid, Box, Typography, IconButton, Avatar } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, DeleteOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CartItem = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useAuth();

  // base url para imagenes locales
  const BASE_URL = 'http://localhost:3000';
  // construyo url de la imagen o uso placeholder si no tiene
  const imageUrl = item.imagen ? `${BASE_URL}${item.imagen}` : 'https://via.placeholder.com/200';

  return (
    <Grid
      container
      alignItems="center"
      spacing={2}
      sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}
    >
      {/* imagen y nombre con link al producto */}
      <Grid
        item
        xs={12}
        sm={5}
        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <Avatar
          variant="rounded"
          src={imageUrl}
          alt={item.nombre_producto}
          sx={{
            width: 64,
            height: 64,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        />
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            component={RouterLink}
            to={`/producto/${item.producto_id}`}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main',
              },
            }}
          >
            {item.nombre_producto}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${item.precio_actual.toLocaleString('es-AR', { minimumFractionDigits: 2 })} c/u
          </Typography>
        </Box>
      </Grid>

      {/* controles para modificar la cantidad */}
      <Grid item xs={6} sm={4}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <IconButton
            aria-label="reducir cantidad"
            onClick={() =>
              updateCartItemQuantity(item.producto_id, item.cantidad - 1)
            }
            disabled={item.cantidad <= 1}
            sx={{
              color: item.cantidad <= 1 ? 'action.disabled' : 'primary.main',
              '&:hover': { bgcolor: 'primary.50' },
            }}
          >
            <RemoveCircleOutline />
          </IconButton>

          <Typography
            variant="body1"
            sx={{ mx: 1, fontWeight: 'bold', userSelect: 'none' }}
          >
            {item.cantidad}
          </Typography>

          <IconButton
            aria-label="aumentar cantidad"
            onClick={() =>
              updateCartItemQuantity(item.producto_id, item.cantidad + 1)
            }
            sx={{
              color: 'primary.main',
              '&:hover': { bgcolor: 'primary.50' },
            }}
          >
            <AddCircleOutline />
          </IconButton>
        </Box>
      </Grid>

      {/* subtotal y boton para eliminar producto */}
      <Grid
        item
        xs={6}
        sm={3}
        sx={{
          textAlign: 'right',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
          $
          {(item.subtotal || item.cantidad * item.precio_actual).toLocaleString(
            'es-AR',
            { minimumFractionDigits: 2 }
          )}
        </Typography>
        <IconButton
          aria-label="eliminar producto"
          sx={{
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.50',
              color: 'error.dark',
            },
          }}
          onClick={() => removeFromCart(item.producto_id)}
        >
          <DeleteOutline />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default CartItem;
