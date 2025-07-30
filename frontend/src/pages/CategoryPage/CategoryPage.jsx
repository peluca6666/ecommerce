import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import ProductGrid from '../../components/Product/ProductGrid';
import ProductFilters from '../../components/Product/ProductFilters';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const CategoryPage = () => {
  const { id } = useParams(); 
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filtros, setFiltros] = useState({
    busqueda: '',
    minPrice: '',
    maxPrice: '',
    sortBy: '',
    es_oferta: ''
  });

  useEffect(() => {
    const fetchProductosPorCategoria = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categoria/${id}/producto`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        
        const data = await res.json();

        if (data.exito) {
          const productosData = data.datos || [];
          setProductos(productosData);
          setProductosFiltrados(productosData); // Inicialmente sin filtros
          setNombreCategoria(data.categoria || 'Categoría');
        } else {
          throw new Error(data.mensaje || 'Error al cargar los datos');
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar los productos de esta categoría.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductosPorCategoria();
  }, [id]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFiltros(prev => ({ ...prev, [name]: checked ? 'true' : '' }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      {error ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">{error}</Typography>
        </Paper>
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
            {nombreCategoria}
          </Typography>

          {productos.length === 0 ? (
            <Typography variant="body1">
              No hay productos disponibles en esta categoría.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* SIDEBAR DE FILTROS */}
              <Box sx={{ 
                width: { xs: '100%', md: '280px' },
                flexShrink: 0
              }}>
                <ProductFilters 
                  filtros={filtros}
                  onFilterChange={handleFilterChange}
                  onCheckboxChange={handleCheckboxChange}
                  hideCategory={true}
                />
              </Box>
              
              {/* ÁREA DE PRODUCTOS */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <ProductGrid productos={productos} />
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CategoryPage;