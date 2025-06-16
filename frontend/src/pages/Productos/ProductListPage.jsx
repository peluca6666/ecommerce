import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Box, Pagination } from '@mui/material';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductGrid from '../../components/Product/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductFilters from '../../components/Product/ProductFilters';
import { useDebounce } from '../../hooks/useDebounce';

const ProductListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Función para leer los filtros de la URL y crear un objeto de estado inicial.
    // Esto asegura que se capturen todos los parámetros cada vez que se carga la página.
    const getInitialFilters = () => ({
        busqueda: searchParams.get('busqueda') || '',
        categoria: searchParams.get('categoria') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sortBy: searchParams.get('sortBy') || 'nombre_asc',
        es_oferta: searchParams.get('es_oferta') || ''
    });

    const [filtros, setFiltros] = useState(getInitialFilters);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagina, setPagina] = useState(parseInt(searchParams.get('pagina')) || 1);
    const [totalPaginas, setTotalPaginas] = useState(0);

    const debouncedBusqueda = useDebounce(filtros.busqueda, 500);

    // Este useEffect busca los productos cada vez que un filtro o la página cambian
    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            
            const params = new URLSearchParams({ pagina, limite: 10 });
            if (debouncedBusqueda) params.append('busqueda', debouncedBusqueda);
            if (filtros.categoria) params.append('categoria', filtros.categoria);
            if (filtros.minPrice) params.append('minPrice', filtros.minPrice);
            if (filtros.maxPrice) params.append('maxPrice', filtros.maxPrice);
            if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
            if (filtros.es_oferta) params.append('es_oferta', filtros.es_oferta);

            try {
                const apiUrl = `http://localhost:3000/api/producto?${params.toString()}`;
                console.log("Enviando petición a la API:", apiUrl); 

                const response = await axios.get(apiUrl);
                if (response.data.exito) {
                    setProductos(response.data.datos);
                    setTotalPaginas(response.data.paginacion.total_paginas);
                } else {
                    setError('No se pudieron cargar los productos.');
                }
            } catch (err) {
                setError('Error de conexión. Inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, [pagina, debouncedBusqueda, filtros.categoria, filtros.minPrice, filtros.maxPrice, filtros.sortBy, filtros.es_oferta]);
    
    // Este useEffect actualiza la URL cuando cambias un filtro en la página
    useEffect(() => {
        const params = {};
        if (filtros.busqueda) params.busqueda = filtros.busqueda;
        if (filtros.categoria) params.categoria = filtros.categoria;
        if (filtros.minPrice) params.minPrice = filtros.minPrice;
        if (filtros.maxPrice) params.maxPrice = filtros.maxPrice;
        if (filtros.sortBy) params.sortBy = filtros.sortBy;
        if (filtros.es_oferta) params.es_oferta = filtros.es_oferta;
        if (pagina > 1) params.pagina = pagina;
        
        setSearchParams(params, { replace: true });
    }, [filtros, pagina, setSearchParams]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
        setPagina(1);
    };
    
     const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setFiltros(prev => ({
            ...prev,
            // Si el checkbox está marcado ponemos el valor 'true'.
            // Si no, lo ponemos como un string vacío para que el filtro se elimine de la URL
            [name]: checked ? 'true' : ''
        }));
        setPagina(1);
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
                    <Grid item xs={12} md={3}>

                         <ProductFilters 
                            filtros={filtros} 
                            onFilterChange={handleFilterChange}
                            onCheckboxChange={handleCheckboxChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        {loading ? <LoadingSpinner /> : (
                            productos.length === 0 ? (
                                <Typography>No se encontraron productos que coincidan con tu búsqueda.</Typography>
                            ) : (
                                <ProductGrid productos={productos} />
                            )
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            {totalPaginas > 1 && (
                                <Pagination count={totalPaginas} page={pagina} onChange={handlePageChange} color="primary" />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default ProductListPage;