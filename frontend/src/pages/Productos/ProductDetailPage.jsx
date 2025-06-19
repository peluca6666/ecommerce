import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, Divider, Paper, IconButton } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'; // Iconos para selector de cantidad
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductGrid from '../../components/Product/ProductGrid';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useAuth();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(''); // Imagen principal que se muestra
    const [cantidad, setCantidad] = useState(1); // Cantidad seleccionada para agregar al carrito
    const BASE_URL = 'http://localhost:3000';

    const [productosRelacionados, setProductosRelacionados] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setProductosRelacionados([]); // Limpiamos productos relacionados para el nuevo producto
                const response = await axios.get(`http://localhost:3000/api/producto/${id}`);

                if (response.data.exito) {
                    const productData = response.data.datos;

                    // Asegurarnos que 'imagenes' es un array, no string
                    if (typeof productData.imagenes === 'string') {
                        try {
                            productData.imagenes = JSON.parse(productData.imagenes);
                        } catch (e) {
                            productData.imagenes = [];
                        }
                    }
                    setProducto(productData);

                    // Configuramos la imagen principal o fallback si no existe
                    if (productData.imagen) {
                        setSelectedImage(`${BASE_URL}${productData.imagen}`);
                    } else {
                        setSelectedImage('https://via.placeholder.com/500');
                    }

                    // Buscamos productos relacionados de la misma categoría (excepto el actual)
                    if (productData.categoria_id) {
                        try {
                            const relatedResponse = await axios.get(`http://localhost:3000/api/categoria/${productData.categoria_id}/producto`);
                            if (relatedResponse.data.exito) {
                                const related = relatedResponse.data.datos.filter(p => p.producto_id !== productData.producto_id);
                                setProductosRelacionados(related);
                            }
                        } catch (relatedError) {
                            console.error("Error al obtener productos relacionados:", relatedError);
                            // No interrumpimos si falla esta parte
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

    // Controla el incremento/decremento de la cantidad, sin salirse del stock ni bajar de 1
    const handleCantidadChange = (change) => {
        setCantidad(prev => {
            const nuevaCantidad = prev + change;
            if (nuevaCantidad < 1) return 1;
            if (nuevaCantidad > producto.stock_actual) return producto.stock_actual;
            return nuevaCantidad;
        });
    };

    // Llama a la función para agregar al carrito la cantidad seleccionada
    const handleAddToCart = async () => {
        await addToCart(producto.producto_id, cantidad);
    };

    // Agrega al carrito y redirige directo al carrito para comprar
    const handleBuyNow = async () => {
        await addToCart(producto.producto_id, cantidad);
        navigate('/carrito');
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>Error: {error}</Typography>;
    if (!producto) return <Typography align="center" sx={{ mt: 4 }}>Producto no encontrado.</Typography>;

    // Convertimos todas las imágenes (principal + galería) a URLs completas
    const allImages = [producto.imagen, ...producto.imagenes]
        .filter(Boolean)
        .map(imgRelativa => `${BASE_URL}${imgRelativa}`);

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                    <Grid container spacing={4}>
                        {/* Galería de imágenes con thumbnails para seleccionar */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <img
                                    src={selectedImage}
                                    alt={producto.nombre_producto}
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                                {allImages.map((img, index) => (
                                    <Box
                                        key={index}
                                        component="img"
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        onClick={() => setSelectedImage(img)}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            border: selectedImage === img ? '2px solid' : '2px solid transparent',
                                            borderColor: selectedImage === img ? 'primary.main' : 'transparent',
                                            transition: 'border-color 0.2s'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Detalles del producto y acciones */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                                {producto.nombre_producto}
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 2 }}>
                                ${producto.precio}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                                {producto.descripcion}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Stock disponible: {producto.stock_actual} unidades
                            </Typography>

                            {/* Selector de cantidad con botones + y - */}
                            <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="medium">Cantidad:</Typography>
                                <IconButton onClick={() => handleCantidadChange(-1)} disabled={cantidad <= 1}>
                                    <RemoveCircleOutline />
                                </IconButton>
                                <Typography variant="h6" sx={{ minWidth: '40px', textAlign: 'center' }}>
                                    {cantidad}
                                </Typography>
                                <IconButton onClick={() => handleCantidadChange(1)} disabled={cantidad >= producto.stock_actual}>
                                    <AddCircleOutline />
                                </IconButton>
                            </Box>
                            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                <Button variant="outlined" size="large" onClick={handleAddToCart}>
                                    Agregar al Carrito
                                </Button>
                                <Button variant="contained" size="large" onClick={handleBuyNow}>
                                    Comprar Ahora
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Productos relacionados solo si existen */}
                {productosRelacionados.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                            También te podría interesar
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <ProductGrid productos={productosRelacionados} />
                    </Box>
                )}

            </Container>
            <Footer />
        </>
    );
};

export default ProductDetailPage;
