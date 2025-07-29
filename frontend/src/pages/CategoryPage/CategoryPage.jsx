import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';
import ProductGrid from '../../components/Product/ProductGrid';
import ProductFilters from '../../components/Product/ProductFilters';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const CategoryPage = () => {
  const { id } = useParams(); 
  const [productos, setProductos] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductosPorCategoria = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categoria/${id}/producto`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        
        const data = await res.json();

        if (data.exito) {
          setProductos(data.datos || []);
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
            <Grid container spacing={3}>
              {/* Filtros */}
              <Grid item xs={12} md={3}>
                <ProductFilters 
                  productos={productos}
                  hideCategory={true}
                  renderProducts={(productosFiltrados) => (
                    <div style={{ display: 'none' }} /> // Los filtros solo filtran
                  )}
                  onProductsFiltered={(productosFiltrados) => {
                    // Aquí recibirías los productos filtrados
                    // Por ahora solo Grid simple
                  }}
                />
              </Grid>
              
              {/* Productos */}
              <Grid item xs={12} md={9}>
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