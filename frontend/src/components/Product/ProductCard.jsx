import { Card, CardMedia, CardContent, CardActions, Button, Typography, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ producto }) => {
    const { addToCart } = useAuth();

    // Construir la URL completa de la imagen
    const BASE_URL = 'http://localhost:3000'; // Es mejor guardar esto en una variable de entorno (.env)
    
    const imageUrl = producto.imagen 
        ? `${BASE_URL}${producto.imagen}` 
        : 'https://via.placeholder.com/200';

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
                // Usa la nueva variable 'imageUrl'
                image={imageUrl}
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

               {/* Lógica de Precio Mejorada */}
{producto.precio_anterior && producto.precio_anterior > producto.precio ? (
    // Si hay un precio anterior válido, mostramos ambos
    <Box>
        <Typography 
            component="span" 
            sx={{ 
                textDecoration: 'line-through', 
                color: 'text.secondary',
                mr: 1 
            }}
        >
            ${producto.precio_anterior}
        </Typography>
        <Typography 
            variant="h5" 
            component="span" 
            sx={{ fontWeight: 'bold', color: 'error.main' }}
        >
            ${producto.precio}
        </Typography>
    </Box>
) : (
    // Si no, mostramos solo el precio normal
    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        ${producto.precio}
    </Typography>
)}

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