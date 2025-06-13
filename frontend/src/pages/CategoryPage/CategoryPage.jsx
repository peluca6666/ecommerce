import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import ProductGrid from '../../components/Product/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CategoryPage = () => {
  const { id } = useParams(); // ID de la categoría
  const [productos, setProductos] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductosPorCategoria = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/categoria/${id}/producto`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();

        setProductos(data.productos || []);
        setNombreCategoria(data.categoria || 'Categoría');
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

  if (error) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 3, my: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        {nombreCategoria}
      </Typography>

      {productos.length === 0 ? (
        <Typography variant="body1">
          No hay productos disponibles en esta categoría.
        </Typography>
      ) : (
        <ProductGrid products={productos} />
      )}
    </Container>
  );
};

export default CategoryPage;
