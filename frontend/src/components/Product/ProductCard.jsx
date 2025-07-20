import { Card, CardMedia, CardContent, Button, Typography, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ producto }) => {
    const { addToCart } = useAuth();

    // armo url completa o uso placeholder si no tiene imagen
    const imageUrl = producto.imagen 
        ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
        : 'https://via.placeholder.com/200';

    return (
        <Card 
            component={Link}
            to={`/producto/${producto.producto_id}`}
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textDecoration: 'none',
                borderRadius: 3,
                border: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    borderColor: '#FF8C00',
                    '& .product-image': {
                        transform: 'scale(1.05)'
                    },
                    '& .product-price': {
                        color: '#FF6B35'
                    }
                }
            }}
        >
            {/* Imagen del producto */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height="220"
                    image={imageUrl}
                    alt={producto.nombre_producto}
                    className="product-image"
                    sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                />
                {/* Badge de oferta */}
                {producto.precio_anterior && producto.precio_anterior > producto.precio && (
                    <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'linear-gradient(135deg, #FF4500, #FF6B35)',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(255,69,0,0.4)'
                    }}>
                        OFERTA
                    </Box>
                )}
            </Box>

            {/* Contenido */}
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                    variant="h6" 
                    sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: '#2c3e50',
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6em'
                    }}
                >
                    {producto.nombre_producto}
                </Typography>
                
                <Typography 
                    variant="body2" 
                    sx={{
                        color: '#6c757d',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4,
                        minHeight: '2.8em'
                    }}
                >
                    {producto.descripcion}
                </Typography>

                {/* Precio */}
                <Box sx={{ mb: 2 }}>
                    {producto.precio_anterior && producto.precio_anterior > producto.precio ? (
                        <Box>
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    textDecoration: 'line-through', 
                                    color: '#999',
                                    fontSize: '0.9rem'
                                }}
                            >
                                ${producto.precio_anterior}
                            </Typography>
                            <Typography 
                                variant="h5" 
                                className="product-price"
                                sx={{ 
                                    fontWeight: 700, 
                                    color: '#FF4500',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                ${producto.precio}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography 
                            variant="h5" 
                            className="product-price"
                            sx={{ 
                                fontWeight: 700,
                                color: '#2c3e50',
                                transition: 'color 0.3s ease'
                            }}
                        >
                            ${producto.precio}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            {/* Botones de acción */}
            <Box sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button 
                    fullWidth 
                    variant="contained"
                    onClick={(e) => {
                        e.preventDefault(); // Evita que navegue
                        e.stopPropagation(); // Evita que se propague al card
                        addToCart(producto.producto_id);
                    }}
                    sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
                        boxShadow: '0 4px 15px rgba(255,140,0,0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(255,107,53,0.4)'
                        }
                    }}
                >
                    Agregar al Carrito
                </Button>
                
                <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={(e) => {
                        e.stopPropagation(); 
                    }}
                    component={Link}
                    to={`/producto/${producto.producto_id}`}
                    sx={{
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 500,
                        textTransform: 'none',
                        borderColor: '#e9ecef',
                        color: '#6c757d',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            borderColor: '#FF8C00',
                            color: '#FF6B35',
                            background: 'rgba(255,140,0,0.05)'
                        }
                    }}
                >
                    Ver Detalles
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;