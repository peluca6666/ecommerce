import { Card, CardMedia, CardContent, Button, Typography, Box, Chip } from "@mui/material";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ producto }) => {
    const { addToCart } = useAuth();

    const imageUrl = producto.imagen 
        ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
        : 'https://via.placeholder.com/200';

    const hasDiscount = producto.precio_anterior && producto.precio_anterior > producto.precio;
    const discountPercentage = hasDiscount 
        ? Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100)
        : 0;

    return (
        <Card 
            component={Link}
            to={`/producto/${producto.producto_id}`}
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textDecoration: 'none',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    borderColor: '#FF8C00',
                    '& .product-image': {
                        transform: 'scale(1.03)'
                    },
                    '& .action-buttons': {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }
                }
            }}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                {hasDiscount && (
                    <Chip
                        label="OFERTA"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 2,
                            background: '#e53e3e',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            height: 24,
                            '& .MuiChip-label': {
                                px: 1
                            }
                        }}
                    />
                )}
                
                <CardMedia
                    component="img"
                    height="180"
                    image={imageUrl}
                    alt={producto.nombre_producto}
                    className="product-image"
                    sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
                <Typography 
                    variant="body2" 
                    sx={{
                        fontWeight: 400,
                        mb: 1,
                        color: '#424242',
                        fontSize: '0.9rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.4em'
                    }}
                >
                    {producto.nombre_producto}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    {hasDiscount ? (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography 
                                    variant="body2"
                                    sx={{ 
                                        textDecoration: 'line-through', 
                                        color: '#9e9e9e',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    ${producto.precio_anterior?.toLocaleString()}
                                </Typography>
                                <Chip
                                    label={`-${discountPercentage}%`}
                                    size="small"
                                    sx={{
                                        background: '#e53e3e',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        height: 18,
                                        '& .MuiChip-label': {
                                            px: 0.5
                                        }
                                    }}
                                />
                            </Box>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 700, 
                                    color: '#e53e3e',
                                    fontSize: '1.25rem'
                                }}
                            >
                                ${producto.precio?.toLocaleString()}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700,
                                color: '#424242',
                                fontSize: '1.25rem'
                            }}
                        >
                            ${producto.precio?.toLocaleString()}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            <Box 
                className="action-buttons"
                sx={{ 
                    p: 2, 
                    pt: 0,
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s ease'
                }}
            >
                <Button 
                    fullWidth 
                    variant="contained"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(producto.producto_id);
                    }}
                    sx={{
                        py: 1.2,
                        borderRadius: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
                        fontSize: '0.9rem',
                        mb: 1,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                        }
                    }}
                >
                    Agregar al Carrito
                </Button>
                
                <Button 
                    fullWidth 
                    variant="text"
                    onClick={(e) => {
                        e.stopPropagation(); 
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    component={Link}
                    to={`/producto/${producto.producto_id}`}
                    sx={{
                        py: 0.8,
                        fontWeight: 500,
                        textTransform: 'none',
                        color: '#1976d2',
                        fontSize: '0.85rem',
                        '&:hover': {
                            background: 'rgba(25,118,210,0.08)'
                        }
                    }}
                >
                    Ver más detalles
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;