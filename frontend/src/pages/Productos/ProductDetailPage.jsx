import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, Divider, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import Header from '../../components/Header/Header'; // Asumiendo que quieres el Header en esta página
import Footer from '../../components/Footer/Footer';   // Y el Footer

const ProductDetailPage = () => {
    const { id } = useParams(); // Obtiene el ID del producto de la URL
    const navigate = useNavigate(); // Hook para redirigir al usuario
    const { addToCart } = useAuth(); // Usamos la función del contexto que ya creamos

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/producto/${id}`);
                if (response.data.exito) {
                    // La propiedad 'imagenes' viene como un string JSON, la convertimos a un array
                    const productData = response.data.datos;
                    if (typeof productData.imagenes === 'string') {
                        try {
                            productData.imagenes = JSON.parse(productData.imagenes);
                        } catch (e) {
                            productData.imagenes = []; // Si falla el parseo, dejamos un array vacío
                        }
                    }
                    setProducto(productData);
                } else {
                    setError(response.data.mensaje);
                }
            } catch (err) {
                setError('No se pudo cargar el producto. Inténtalo de nuevo más tarde.');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]); // El efecto se ejecuta cada vez que el ID de la URL cambia

    const handleBuyNow = async () => {
        // Como no hay pagos, la lógica de "Comprar Ahora" será:
        // 1. Agregar el producto al carrito.
        // 2. Redirigir al usuario a la página del carrito.
        await addToCart(producto.producto_id);
        navigate('/carrito'); // Asumiendo que tienes una ruta '/carrito'
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>Error: {error}</Typography>;
    if (!producto) return <Typography align="center" sx={{ mt: 4 }}>Producto no encontrado.</Typography>;

    return (
        <>
            <Header /> {/* Puedes o no incluir el Header/Footer según tu diseño */}
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            {/* Visor de Imágenes */}
                            <Box>
                                <img 
                                    src={producto.imagen || 'https://via.placeholder.com/500'} 
                                    alt={producto.nombre_producto} 
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                                />
                                {/* Aquí podrías agregar una galería con las otras imágenes si existen */}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/* Detalles del Producto */}
                            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                                {producto.nombre_producto}
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 2 }}>
                                ${producto.precio}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" paragraph>
                                {producto.descripcion}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Stock disponible: {producto.stock_actual} unidades
                            </Typography>
                            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                <Button 
                                    variant="outlined" 
                                    size="large"
                                    onClick={() => addToCart(producto.producto_id)}
                                >
                                    Agregar al Carrito
                                </Button>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={handleBuyNow}
                                >
                                    Comprar Ahora
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Footer />
        </>
    );
};

export default ProductDetailPage;