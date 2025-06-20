import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, Grid, Box, Typography, Button, Divider, Paper, 
    IconButton, useTheme, Chip, Stack, Link as MuiLink // Importo Link de MUI para Breadcrumbs
} from '@mui/material'; 
import { 
    AddCircleOutline, RemoveCircleOutline, ShoppingCart, 
    LocalShippingOutlined, KeyboardBackspace as ArrowBack // Renombrado para usarlo en el botón Volver
} from '@mui/icons-material'; 
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import ProductGrid from '../../components/Product/ProductGrid';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useAuth();
    const theme = useTheme();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const BASE_URL = 'http://localhost:3000';

    const [productosRelacionados, setProductosRelacionados] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setProductosRelacionados([]); 
                const response = await axios.get(`${BASE_URL}/api/producto/${id}`);

                if (response.data.exito) {
                    const productData = response.data.datos;

                    if (typeof productData.imagenes === 'string') {
                        try {
                            productData.imagenes = JSON.parse(productData.imagenes);
                        } catch (e) {
                            productData.imagenes = [];
                        }
                    }
                    setProducto(productData);

                    const defaultImageUrl = productData.imagen ? `${BASE_URL}${productData.imagen}` : 'https://via.placeholder.com/500x500?text=Imagen+no+disponible';
                    setSelectedImage(defaultImageUrl); 

                    if (productData.categoria_id) {
                        try {
                            const relatedResponse = await axios.get(`${BASE_URL}/api/categoria/${productData.categoria_id}/producto`);
                            if (relatedResponse.data.exito) {
                                const related = relatedResponse.data.datos.filter(p => p.producto_id !== productData.producto_id);
                                setProductosRelacionados(related);
                            }
                        } catch (relatedError) {
                            console.error("Error al obtener productos relacionados:", relatedError);
                        }
                    }

                } else {
                    setError(response.data.mensaje);
                }
            } catch (err) {
                setError('No se pudo cargar el producto.');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    const handleCantidadChange = (change) => {
        setCantidad(prev => {
            const nuevaCantidad = prev + change;
            if (nuevaCantidad < 1) return 1;
            if (producto && nuevaCantidad > producto.stock_actual) return producto.stock_actual; 
            return nuevaCantidad;
        });
    };

    const handleAddToCart = async () => {
        if (producto) { 
            await addToCart(producto.producto_id, cantidad);
        }
    };

    const handleBuyNow = async () => {
        if (producto) { 
            await addToCart(producto.producto_id, cantidad);
            navigate('/carrito');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>Error: {error}</Typography>;
    if (!producto) return <Typography align="center" sx={{ mt: 4 }}>Producto no encontrado.</Typography>;

    const allImages = [producto.imagen, ...(Array.isArray(producto.imagenes) ? producto.imagenes : [])] 
        .filter(Boolean)
        .map(imgRelativa => `${BASE_URL}${imgRelativa}`);

    
    const hasDiscount = producto.precio_original && producto.precio_original > producto.precio;
    const discountPercentage = hasDiscount 
        ? Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100) 
        : 0;
    
    const garantiaInfo = producto.garantia || "Garantía de fábrica"; 

    return (
        <Container maxWidth="lg" sx={{ my: { xs: 2, md: 4 } }}> 
            {/* botón volver */}
            <Box sx={{ mb: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate(-1)}
                    variant="text"
                    size="small"
                    sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 'medium' }}>
                    Volver
                </Button>
            </Box>
            <Paper 
                elevation={6} 
                sx={{ 
                    p: { xs: 2.5, sm: 4, md: 6 }, 
                    borderRadius: theme.shape.borderRadius * 2.5, 
                    bgcolor: 'background.paper', 
                    boxShadow: theme.shadows[6], 
                }}>
                <Grid container spacing={{ xs: 4, md: 8 }}> 
                    
                    {/* imagen principal y thumbnails*/}
                    <Grid item xs={12} md={6} 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            ...(window.innerWidth >= theme.breakpoints.values.md && {
                              flexBasis: '50%', 
                              maxWidth: '50%', 
                            }),
                          }}>
                        {/* contenedor de la imagen principal */}
                        <Box 
                            sx={{ 
                                mb: { xs: 2, md: 3 }, 
                                width: '100%', 
                                position: 'relative',
                                height: { xs: 350, sm: 450, md: 550 }, 
                                overflow: 'hidden', 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `1px solid ${theme.palette.grey[300]}`, 
                                borderRadius: theme.shape.borderRadius * 2, 
                                bgcolor: theme.palette.grey[100], 
                                boxShadow: theme.shadows[2], 
                            }}
                        >
                            <img
                                src={selectedImage}
                                alt={producto.nombre_producto}
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '100%', 
                                    objectFit: 'contain', 
                                }}
                            />
                        </Box>
                        
                        {/* galería de thumbnails */}
                        {allImages.length > 1 && ( 
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'row', 
                                gap: { xs: 1, md: 2 },
                                overflowX: 'auto', 
                                py: 0.5, 
                                flexShrink: 0, 
                                justifyContent: 'center', 
                                maxWidth: '100%', 
                                '&::-webkit-scrollbar': { height: '8px' },
                                '&::-webkit-scrollbar-thumb': { 
                                    backgroundColor: theme.palette.grey[500], 
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: theme.palette.grey[200], 
                                    borderRadius: '4px',
                                }
                            }}>
                                {allImages.map((img, index) => (
                                    <Box
                                        key={index}
                                        component="img"
                                        src={img}
                                        alt={`Miniatura ${index + 1}`}
                                        onClick={() => setSelectedImage(img)}
                                        sx={{
                                            width: { xs: 60, sm: 80, md: 90 }, 
                                            height: { xs: 60, sm: 80, md: 90 }, 
                                            objectFit: 'cover', 
                                            borderRadius: '8px', 
                                            cursor: 'pointer',
                                            border: selectedImage === img ? `3px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.grey[300]}`, 
                                            boxShadow: selectedImage === img ? theme.shadows[3] : 'none',
                                            transition: 'all 0.3s ease-in-out', 
                                            flexShrink: 0, 
                                            '&:hover': {
                                                transform: 'scale(1.02)', 
                                                boxShadow: theme.shadows[4], 
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid>

                    {/* detalles del producto */}
                    <Grid item xs={12} md={6}> 
                        <Stack spacing={{ xs: 2.5, md: 4 }}>                  
                            <Typography variant="h4" component="h1" fontWeight="bold" 
                                        sx={{ lineHeight: 1.2, color: 'text.primary' }}>
                                {producto.nombre_producto}
                            </Typography>

                            {/* precios y descuento */}
                            <Box>
                                {hasDiscount && (
                                    <Typography 
                                        variant="body1" 
                                        color="text.secondary" 
                                        sx={{ textDecoration: 'line-through', mb: 0.5 }}
                                    >
                                        ${producto.precio_original.toLocaleString('es-AR')}
                                    </Typography>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                                    <Typography 
                                        variant="h3"
                                        color="primary.main" 
                                        sx={{ fontWeight: 'bold', lineHeight: 1 }}
                                    >
                                        ${producto.precio.toLocaleString('es-AR')}
                                    </Typography>
                                    {hasDiscount && (
                                        <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                                            {discountPercentage}% OFF
                                        </Typography>
                                    )}
                                </Box>                               
                            </Box>
                            
                            <Divider sx={{ my: 0 }} /> {/* divider con margen manejado por Stack */}

                            {/* descripción */}
                            <Typography variant="body1" component="p"
                                        sx={{ 
                                            whiteSpace: 'pre-wrap', 
                                            color: 'text.secondary', 
                                            lineHeight: 1.6,
                                        }}>
                                {producto.descripcion}
                            </Typography>
                            
                            {/* stock y envío */}
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2" color="text.primary" fontWeight="medium">
                                        Disponibilidad: 
                                    </Typography>
                                    <Chip 
                                        label={producto.stock_actual > 0 ? `En Stock (${producto.stock_actual})` : 'Sin Stock'} 
                                        color={producto.stock_actual > 0 ? 'success' : 'error'} 
                                        size="medium" 
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>                    
                            </Box>
                            
                            <Divider sx={{ my: 0 }} />

                            {/* selector de cantidad */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}> 
                                <Typography variant="subtitle1" fontWeight="medium" color="text.primary">Cantidad:</Typography>
                                <IconButton 
                                    onClick={() => handleCantidadChange(-1)} 
                                    disabled={cantidad <= 1}
                                    color="primary" 
                                    size="small"
                                    sx={{ 
                                        border: `1px solid ${theme.palette.divider}`, 
                                        borderRadius: '8px', 
                                        '&:hover': { bgcolor: 'action.hover' } 
                                    }}
                                >
                                    <RemoveCircleOutline />
                                </IconButton>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        minWidth: '40px', 
                                        textAlign: 'center', 
                                        fontWeight: 'bold',
                                        color: 'text.primary'
                                    }}
                                >
                                    {cantidad}
                                </Typography>
                                <IconButton 
                                    onClick={() => handleCantidadChange(1)} 
                                    disabled={cantidad >= producto.stock_actual}
                                    color="primary" 
                                    size="small"
                                    sx={{ 
                                        border: `1px solid ${theme.palette.divider}`, 
                                        borderRadius: '8px', 
                                        '&:hover': { bgcolor: 'action.hover' } 
                                    }}
                                >
                                    <AddCircleOutline />
                                </IconButton>
                            </Box>

                            {/* botones de acción */}
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 } }}>
                                <Button 
                                    variant="contained" 
                                    size="large" 
                                    onClick={handleAddToCart} 
                                    startIcon={<ShoppingCart />} 
                                    fullWidth 
                                    sx={{
                                        py: { xs: 1.2, md: 1.5 },
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        boxShadow: theme.shadows[3],
                                        bgcolor: theme.palette.primary.main,
                                        '&:hover': {
                                            boxShadow: theme.shadows[6],
                                            transform: 'translateY(-2px)',
                                            bgcolor: theme.palette.primary.dark
                                        },
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                >
                                    Agregar al Carrito
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    size="large" 
                                    onClick={handleBuyNow} 
                                    fullWidth 
                                    sx={{
                                        py: { xs: 1.2, md: 1.5 },
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        borderColor: theme.palette.primary.main, 
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.light, 
                                            borderColor: theme.palette.primary.dark,
                                            color: theme.palette.primary.dark
                                        },
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                >
                                    Comprar Ahora
                                </Button>
                            </Box>                   
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* descripcion producto */}
            {producto.descripcion_larga && ( 
                <Paper elevation={3} sx={{ mt: { xs: 4, md: 6 }, p: { xs: 2, sm: 3, md: 4 }, borderRadius: theme.shape.borderRadius * 2, boxShadow: theme.shadows[3] }}>
                    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                        Descripción completa
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.secondary' }}>
                        {producto.descripcion_larga}
                    </Typography>
                </Paper>
            )}

            {/* productos relacionados solo si existen */}
            {productosRelacionados.length > 0 && (
                <Box sx={{ mt: { xs: 4, md: 8 } }}> 
                    <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ textAlign: 'center', mb: 3 }}>
                        Productos similares
                    </Typography>
                    <Divider sx={{ mb: { xs: 2, md: 4 }, width: '50px', mx: 'auto', borderBottomWidth: '3px', borderColor: 'primary.main' }} />
                    <ProductGrid productos={productosRelacionados} />
                </Box>
            )}
        </Container>
    );
};

export default ProductDetailPage;