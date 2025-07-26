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

    const handleProductClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
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
            <Box 
                component={Link}
                to={`/producto/${producto.producto_id}`}
                onClick={handleProductClick}
                sx={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    textDecoration: 'none',
                    display: 'block'
                }}
            >
                {hasDiscount && (
                    <Chip
                        label="OFERTA"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
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
                    height="200"
                    image={imageUrl}
                    alt={producto.nombre_producto}
                    className="product-image"
                    sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography 
                    variant="body2" 
                    sx={{
                        fontWeight: 400,
                        mb: 2,
                        color: '#424242',
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.8em'
                    }}
                >
                    {producto.nombre_producto}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    {hasDiscount && (
                        <Typography 
                            variant="body2"
                            sx={{ 
                                textDecoration: 'line-through', 
                                color: '#9e9e9e',
                                fontSize: '0.85rem',
                                mb: 0.5
                            }}
                        >
                            ${producto.precio_anterior?.toLocaleString()}
                        </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700, 
                                color: hasDiscount ? '#e53e3e' : '#424242',
                                fontSize: '1.4rem'
                            }}
                        >
                            ${producto.precio?.toLocaleString()}
                        </Typography>
                        
                        {hasDiscount && (
                            <Chip
                                label={`-${discountPercentage}%`}
                                size="small"
                                sx={{
                                    background: '#e53e3e',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    height: 20,
                                    '& .MuiChip-label': {
                                        px: 0.5
                                    }
                                }}
                            />
                        )}
                    </Box>
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
                        py: 1.5,
                        borderRadius: 1.5,
                        fontWeight: 700,
                        textTransform: 'none',
                        background: '#e53e3e',
                        fontSize: '0.9rem',
                        mb: 1,
                        '&:hover': {
                            background: '#d32f2f',
                        }
                    }}
                >
                    COMPRAR
                </Button>
                
                <Button 
                    fullWidth 
                    variant="text"
                    component={Link}
                    to={`/producto/${producto.producto_id}`}
                    onClick={(e) => {
                        e.stopPropagation(); 
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
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