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
            component={Link}
            to={`/producto/${producto.producto_id}`}
            onClick={handleProductClick}
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
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    borderColor: '#FF8C00',
                    '& .product-image': {
                        transform: 'scale(1.02)'
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
                            top: 6,
                            right: 6,
                            zIndex: 2,
                            background: '#e53e3e',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            height: 20,
                            '& .MuiChip-label': {
                                px: 0.8
                            }
                        }}
                    />
                )}
                
                <CardMedia
                    component="img"
                    height="160"
                    image={imageUrl}
                    alt={producto.nombre_producto}
                    className="product-image"
                    sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                />
            </Box>

            <CardContent sx={{ 
                flexGrow: 1, 
                p: 1.5,
                pb: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Typography 
                    variant="body2" 
                    sx={{
                        fontWeight: 400,
                        mb: 1.5,
                        color: '#424242',
                        fontSize: '0.85rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.2em'
                    }}
                >
                    {producto.nombre_producto}
                </Typography>

                <Box>
                    {hasDiscount && (
                        <Typography 
                            variant="body2"
                            sx={{ 
                                textDecoration: 'line-through', 
                                color: '#9e9e9e',
                                fontSize: '0.75rem',
                                mb: 0.2
                            }}
                        >
                            ${producto.precio_anterior?.toLocaleString()}
                        </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700, 
                                color: hasDiscount ? '#e53e3e' : '#424242',
                                fontSize: '1.1rem'
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
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                    height: 18,
                                    '& .MuiChip-label': {
                                        px: 0.4
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
                    p: 1.5, 
                    pt: 0,
                    opacity: 0,
                    transform: 'translateY(8px)',
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
                        py: 1,
                        borderRadius: 1.5,
                        fontWeight: 700,
                        textTransform: 'none',
                        background: '#e53e3e',
                        fontSize: '0.8rem',
                        '&:hover': {
                            background: '#d32f2f',
                        }
                    }}
                >
                    COMPRAR
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;