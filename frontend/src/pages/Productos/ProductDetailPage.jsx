import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Button, Paper, Typography } from '@mui/material'; 
import { KeyboardBackspace as ArrowBack } from '@mui/icons-material'; 
import LoadingSpinner from '../../components/common/LoadingSpinner';
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

            {/* Layout principal con dos columnas */}
            <Grid container spacing={4}>
                {/* Columna izquierda - Producto e imágenes */}
                <Grid item xs={12} lg={8}>
                    {/* Contenedor del producto con imágenes */}
                    <Paper 
                        elevation={2}
                        sx={{ 
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            background: 'white',
                            border: '1px solid #f0f0f0',
                            mb: 4
                        }}
                    >
                        <ProductImageGallery producto={producto} />
                    </Paper>

                    {/* Descripción completa */}
                    <Paper 
                        elevation={2}
                        sx={{ 
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            background: 'white',
                            border: '1px solid #f0f0f0'
                        }}
                    >
                        <ProductDescription descripcionLarga={producto.descripcion_larga} />
                    </Paper>
                </Grid>

                {/* Columna derecha - Información, precios y botones */}
                <Grid item xs={12} lg={4}>
                    <Box sx={{ position: 'sticky', top: 20 }}>
                        <Paper 
                            elevation={2}
                            sx={{ 
                                p: { xs: 3, md: 4 },
                                borderRadius: 3,
                                background: 'white',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <ProductInfo producto={producto} />
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            {/* Productos relacionados - Ancho completo */}
            <Box sx={{ mt: 6 }}>
                <RelatedProducts productos={productosRelacionados} />
            </Box>
        </Container>
    );
};

export default ProductDetailPage;