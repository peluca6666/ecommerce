import { Card, CardMedia, CardContent, CardActions, Button } from "@mui/material";

const ProductCard = ({ product, onAddToCart }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardMedia sx={{ height: 200, bgcolor: 'grey.200' }} image={product.imagen} />
    <CardContent>
      <Typography variant="h6">{product.nombre}</Typography>
      <Typography variant="body2">{product.descripcion}</Typography>
      <Typography variant="h5">${product.precio}</Typography>
    </CardContent>
    <CardActions>
      <Button fullWidth variant="contained" onClick={() => onAddToCart(product.id)}>
        ✓ AGREGAR AL CARRITO
      </Button>
    </CardActions>
  </Card>
);
export default ProductCard;