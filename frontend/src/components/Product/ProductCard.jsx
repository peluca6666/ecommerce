import { Card, CardMedia, CardContent, CardActions, Button, Typography, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ producto }) => {
    const { addToCart } = useAuth();

    return (
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
            }
        }}>
            <CardMedia
                component="img"
                height="200"
                image={producto.imagen || 'https://via.placeholder.com/200'}
                alt={producto.nombre_producto}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap title={producto.nombre_producto}>
                    {producto.nombre_producto}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                    height: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {producto.descripcion}
                </Typography>
                <Typography variant="h5" component="p" sx={{ mt: 2, fontWeight: 'bold' }}>
                    ${producto.precio}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 1 }}>
                <Button 
                    fullWidth 
                    variant="contained"                
                    onClick={() => addToCart(producto.producto_id)}
                >
                    Agregar al Carrito
                </Button>
                <Button 
                    fullWidth 
                    variant="outlined"
                    component={Link}
                    to={`/producto/${producto.producto_id}`}
                >
                    Ver Detalles
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;