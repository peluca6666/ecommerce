import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Pagination } from '@mui/material';
import axios from 'axios';
import { useDebounce } from '../../hooks/useDebounce';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductGrid from '../../components/Product/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductFilters from '../../components/Product/ProductFilters'; // Un nuevo componente que crearemos

const ProductListPage = () => {
  // Estado para los datos y la ui
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para la paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  // ESTADO CLAVE PARA LOS FILTROS, un solo objeto para manejar todos los filtros juntos
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categoria: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'nombre_asc' // Valor por defecto para ordenar
  });

  // Logica para buscar productos
  const debouncedBusqueda = useDebounce(filtros.busqueda, 500);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
      // Construimos los parámetros de la URL solo con los filtros que tienen valor
        const params = new URLSearchParams({
          pagina: pagina,
          limite: 10
        });
        if (debouncedBusqueda) params.append('busqueda', debouncedBusqueda);
        if (filtros.categoria) params.append('categoria', filtros.categoria);
        if (filtros.minPrice) params.append('minPrice', filtros.minPrice);
        if (filtros.maxPrice) params.append('maxPrice', filtros.maxPrice);
        if (filtros.sortBy) params.append('sortBy', filtros.sortBy);

        // Llamada a la API con los parámetros de búsqueda
        const response = await axios.get(`http://localhost:3000/api/producto?${params.toString()}`);

        if (response.data.exito) {
          setProductos(response.data.datos);
          setTotalPaginas(response.data.paginacion.total_paginas);
        } else {
          setError('No se pudieron cargar los productos.');
        }
      } catch (err) {
        setError('Error de conexión. Inténtalo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [pagina, debouncedBusqueda, filtros.categoria, filtros.minPrice, filtros.maxPrice, filtros.sortBy]);

  //Manejamos los eventos de los filtros, esta función se llama cada vez que un filtro cambia
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setPagina(1); // Reseteamos a la página 1 cada vez que se cambia un filtro
  };

  const handlePageChange = (event, value) => {
    setPagina(value);
  };

  if (loading && productos.length === 0) return <LoadingSpinner />;
    if (error) return <Typography color="error">Error: {error}</Typography>;
    
    return (
        <Box>
            <Header />
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Nuestro Catálogo
                </Typography>
                <Grid container spacing={4}>
                    {/* Columna de Filtros */}
                    <Grid item xs={12} md={3}>
                        <ProductFilters filtros={filtros} onFilterChange={handleFilterChange} />
                    </Grid>

                    {/* Columna de Productos */}
                    <Grid item xs={12} md={9}>
                        {loading && <LoadingSpinner />}
                        {!loading && productos.length === 0 ? (
                            <Typography>No se encontraron productos que coincidan con tu búsqueda.</Typography>
                        ) : (
                            <ProductGrid productos={productos} />
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination 
                                count={totalPaginas} 
                                page={pagina} 
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
  }
  export default ProductListPage;