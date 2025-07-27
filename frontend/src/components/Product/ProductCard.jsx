import { Card, CardMedia, CardContent, Button, Typography, Box, Chip } from "@mui/material";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ producto }) => {
    const { addToCart } = useAuth();

    const imageUrl = producto.imagen 
        ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}` 
        : 'https://via.placeholder.com/300x200';

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
                borderRadius: { xs: 1, md: 1.5 }, // Menos redondeado
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'white',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.08)', md: '0 6px 20px rgba(0,0,0,0.1)' },
                    borderColor: '#FF8C00',
                    '& .product-image': {
                        transform: 'scale(1.02)'
                    },
                    '& .action-buttons': {
                        opacity: { xs: 1, md: 1 }, // Siempre visible en mobile
                        transform: 'translateY(0)'
                    }
                }
            }}
        >
            {/* Contenedor de imagen responsive */}
            <Box sx={{ 
                position: 'relative', 
                overflow: 'hidden',
                aspectRatio: { xs: '1', sm: '4/3', md: '3/2' }, // Responsive aspect ratio
                width: '100%'
            }}>
                {hasDiscount && (
                    <Chip
                        label="OFERTA"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: { xs: 4, md: 8 },
                            right: { xs: 4, md: 8 },
                            zIndex: 2,
                            background: '#e53e3e',
                            color: 'white',
                            fontSize: { xs: '0.65rem', md: '0.7rem' },
                            fontWeight: 700,
                            height: { xs: 18, md: 22 },
                            '& .MuiChip-label': {
                                px: { xs: 0.6, md: 0.8 }
                            }
                        }}
                    />
                )}
                
                <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={producto.nombre_producto}
                    className="product-image"
                    sx={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                />
            </Box>

            {/* Contenido responsive */}
            <CardContent sx={{ 
                flexGrow: 1, 
                p: { xs: 1.5, sm: 2, md: 2.5 },
                pb: { xs: 1, md: 1.5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                {/* Título del producto */}
                <Typography 
                    variant="body2" 
                    sx={{
                        fontWeight: 600, // Aumenté de 500 a 600
                        mb: { xs: 1, md: 1.5 },
                        color: '#212121', // Cambié de #424242 a #212121 (más oscuro)
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: { xs: '2em', md: '2.2em' }
                    }}
                >
                    {producto.nombre_producto}
                </Typography>

                {/* Sección de precios */}
                <Box>
                    {hasDiscount && (
                        <Typography 
                            variant="body2"
                            sx={{ 
                                textDecoration: 'line-through', 
                                color: '#9e9e9e',
                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                                mb: 0.2
                            }}
                        >
                            ${producto.precio_anterior?.toLocaleString()}
                        </Typography>
                    )}
                    
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 0.5, md: 0.8 }, 
                        mb: { xs: 1, md: 1.5 }
                    }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700, 
                                color: hasDiscount ? '#e53e3e' : '#424242',
                                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' }
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
                                    fontSize: { xs: '0.6rem', md: '0.65rem' },
                                    fontWeight: 600,
                                    height: { xs: 18, md: 20 },
                                    '& .MuiChip-label': {
                                        px: { xs: 0.4, md: 0.5 }
                                    }
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </CardContent>

            {/* Botones de acción responsive */}
            <Box 
                className="action-buttons"
                sx={{ 
                    p: { xs: 1.5, md: 2 }, 
                    pt: 0,
                    opacity: { xs: 1, md: 0 }, // Siempre visible en mobile, hover en desktop
                    transform: { xs: 'translateY(0)', md: 'translateY(8px)' },
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
                        py: { xs: 1, md: 1.2 },
                        borderRadius: { xs: 1, md: 1.5 },
                        fontWeight: 700,
                        textTransform: 'none',
                        background: '#e53e3e',
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                        boxShadow: 'none',
                        '&:hover': {
                            background: '#d32f2f',
                            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)'
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