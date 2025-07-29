import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Button, Paper, Typography, IconButton } from '@mui/material'; 
import { Add, KeyboardBackspace as ArrowBack, Remove, ShoppingCart } from '@mui/icons-material'; 
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ProductImageGallery from '../../components/Product/ProductImageGallery';
import ProductInfo from '../../components/Product/ProductInfo';
import ProductDescription from '../../components/Product/ProductDescription';
import RelatedProducts from '../../components/Product/RelatedProducts';
import axios from 'axios';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productosRelacionados, setProductosRelacionados] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/producto/${id}`);

                if (response.data.exito) {
                    const productData = response.data.datos;

                    // Parsear imágenes si es string
                    if (typeof productData.imagenes === 'string') {
                        try {
                            productData.imagenes = JSON.parse(productData.imagenes);
                        } catch (e) {
                            productData.imagenes = [];
                        }
                    }
                    setProducto(productData);

                    // Cargar productos relacionados
                    if (productData.categoria_id) {
                        try {
                            const relatedResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categoria/${productData.categoria_id}/producto`);
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

    if (loading) return <LoadingSpinner />;
    if (error) return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography color="error" align="center" variant="h6">{error}</Typography>
        </Container>
    );
    if (!producto) return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography align="center" variant="h6">Producto no encontrado.</Typography>
        </Container>
    );

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}> 
            {/* Botón volver */}
            <Box sx={{ mb: 3 }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate(-1)}
                    variant="text"
                    sx={{ 
                        textTransform: 'none',
                        color: '#6c757d',
                        fontWeight: 500,
                        '&:hover': {
                            color: '#FF6B35',
                            background: 'rgba(255,107,53,0.1)'
                        }
                    }}
                >
                    Volver
                </Button>
            </Box>

            {/* Layout principal - Desktop: dos columnas, Mobile: optimizado y compacto */}
            <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                alignItems: 'flex-start', 
                flexDirection: { xs: 'column', lg: 'row' }
            }}>
                {/* Desktop Layout - Columna izquierda */}
                <Box sx={{ 
                    flex: { lg: '1 1 65%' }, 
                    width: { xs: '100%', lg: 'auto' },
                    display: { xs: 'none', lg: 'block' }
                }}>
                    {/* Contenedor de las imágenes */}
                    <Paper 
                        elevation={1}
                        sx={{ 
                            p: { xs: 3, md: 4 },
                            borderRadius: 1,
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            mb: 4
                        }}
                    >
                        <ProductImageGallery producto={producto} />
                    </Paper>

                    {/* Descripción - Desktop */}
                    <Paper 
                        elevation={1}
                        sx={{ 
                            p: { xs: 3, md: 4 },
                            borderRadius: 1,
                            background: 'white',
                            border: '1px solid #e0e0e0'
                        }}
                    >
                        <ProductDescription descripcion={producto.descripcion_larga || producto.descripcion} />
                    </Paper>
                </Box>

                {/* Desktop - Columna derecha */}
                <Box sx={{ 
                    flex: { lg: '1 1 30%' }, 
                    width: { xs: '100%', lg: 'auto' },
                    position: { lg: 'sticky' },
                    top: { lg: 20 },
                    display: { xs: 'none', lg: 'block' }
                }}>
                    <Paper 
                        elevation={1}
                        sx={{ 
                            p: { xs: 3, md: 4 },
                            borderRadius: 1,
                            background: 'white',
                            border: '1px solid #e0e0e0'
                        }}
                    >
                        <ProductInfo producto={producto} />
                    </Paper>
                </Box>

                {/* Mobile Layout - Todo en una columna compacta */}
                <Box sx={{ 
                    display: { xs: 'block', lg: 'none' }, 
                    width: '100%' 
                }}>
                    {/* Mobile: Contenedor único con imágenes + info de compra */}
                    <Paper 
                        elevation={1}
                        sx={{ 
                            borderRadius: 1,
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Imágenes - Sin padding extra */}
                        <Box sx={{ p: { xs: 2, md: 3 }, pb: 0 }}>
                            <ProductImageGallery producto={producto} />
                        </Box>

                        {/* Info de compra compacta */}
                        <Box sx={{ p: { xs: 2, md: 3 } }}>
                            {/* Título compacto */}
                            <Typography 
                                variant="h5" 
                                component="h1" 
                                sx={{ 
                                    fontWeight: 700,
                                    lineHeight: 1.2, 
                                    color: '#2c3e50',
                                    fontSize: '1.4rem',
                                    mb: 2
                                }}
                            >
                                {producto.nombre_producto}
                            </Typography>

                            {/* Precio compacto */}
                            <Box sx={{ mb: 2 }}>
                                <Typography 
                                    variant="h4"
                                    sx={{ 
                                        fontWeight: 800,
                                        color: '#2c3e50',
                                        lineHeight: 1,
                                        fontSize: '1.8rem'
                                    }}
                                >
                                    ${producto.precio?.toLocaleString('es-AR')}
                                </Typography>
                            </Box>

                            {/* Cantidad y botón en una fila */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2, 
                                mb: 2 
                            }}>
                                {/* Selector de cantidad compacto */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    background: 'white'
                                }}>
                                    <IconButton 
                                        size="small"
                                        sx={{ p: 1 }}
                                    >
                                        <Remove fontSize="small" />
                                    </IconButton>
                                    
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            minWidth: 35,
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            px: 1
                                        }}
                                    >
                                        1
                                    </Typography>
                                    
                                    <IconButton 
                                        size="small"
                                        sx={{ p: 1 }}
                                    >
                                        <Add fontSize="small" />
                                    </IconButton>
                                </Box>

                                {/* Botón de compra que ocupa el resto del espacio */}
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    fullWidth
                                    startIcon={<ShoppingCart />}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        borderRadius: 1,
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                                        }
                                    }}
                                >
                                    Comprar Ahora
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Mobile: Descripción separada y colapsable */}
                    <Box sx={{ mt: 3 }}>
                        <Paper 
                            elevation={1}
                            sx={{ 
                                p: { xs: 2, md: 3 },
                                borderRadius: 1,
                                background: 'white',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <ProductDescription descripcion={producto.descripcion_larga || producto.descripcion} />
                        </Paper>
                    </Box>
                </Box>
            </Box>

            {/* Productos relacionados - Ancho completo */}
            <Box sx={{ mt: 6 }}>
                <RelatedProducts productos={productosRelacionados} />
            </Box>
        </Container>
    );
};

export default ProductDetailPage;