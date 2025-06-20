import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import ProductGrid from '../../components/Product/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
        
        const res = await fetch(`http://localhost:3000/api/categoria/${id}/producto`);
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
  }, [id]); // vuelve a buscar si cambia la categoría

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {error ? (
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="error">{error}</Typography>
          </Paper>
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              {nombreCategoria}
            </Typography>

            {productos.length === 0 ? (
              <Typography variant="body1">
                No hay productos disponibles en esta categoría.
              </Typography>
            ) : (
              <ProductGrid productos={productos} />
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default CategoryPage;
