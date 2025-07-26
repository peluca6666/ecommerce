import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        <div className="max-w-7xl mx-auto py-8 px-4">
            <p className="text-red-600 text-center text-lg">{error}</p>
        </div>
    );
    
    if (!producto) return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <p className="text-center text-lg">Producto no encontrado.</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-4 md:py-8 px-4">
            {/* Botón volver */}
            <div className="mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>
            </div>

            {/* Contenido principal */}
            <div className="bg-white p-6 md:p-12 rounded-2xl shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Galería de imágenes */}
                    <div>
                        <ProductImageGallery producto={producto} />
                    </div>

                    {/* Información del producto */}
                    <div>
                        <ProductInfo producto={producto} />
                    </div>
                </div>
            </div>

            {/* Descripción completa */}
            <div className="mt-8 md:mt-12">
                <ProductDescription descripcionLarga={producto.descripcion_larga} />
            </div>

            {/* Productos relacionados */}
            <RelatedProducts productos={productosRelacionados} />
        </div>
    );
};

export default ProductDetailPage;