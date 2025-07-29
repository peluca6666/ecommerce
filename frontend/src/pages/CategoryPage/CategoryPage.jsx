import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';
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
            <Grid container spacing={3} sx={{ flexDirection: { xs: 'row', sm: 'row' } }}>
              {/* Filtros - Forzado a la izquierda */}
              <Grid item xs={4} sm={4} md={3}>
                <ProductFilters 
                  filtros={filtros}
                  onFilterChange={handleFilterChange}
                  onCheckboxChange={handleCheckboxChange}
                  hideCategory={true}
                />
              </Grid>
              
              {/* Productos */}
              <Grid item xs={8} sm={8} md={9}>
                <ProductGrid productos={productos} />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default CategoryPage;