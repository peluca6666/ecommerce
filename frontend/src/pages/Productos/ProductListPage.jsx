import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    Container, Grid, Typography, Box, Pagination, 
    IconButton, Drawer, useMediaQuery, useTheme,
    Paper
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import axios from 'axios';

import ProductGrid from '../../components/Product/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductFilters from '../../components/Product/ProductFilters';
import { useDebounce } from '../../hooks/useDebounce';

const ProductListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Inicializamos filtros a partir de los parámetros de la URL para mantener estado sincronizado con URL
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

    // Usamos debounce para evitar hacer demasiadas peticiones mientras el usuario escribe la búsqueda
    const debouncedBusqueda = useDebounce(filtros.busqueda, 500);

    // Se ejecuta al cambiar filtros o página para obtener productos filtrados paginados
    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            
            // Armamos parámetros para la API según filtros y página actual
            const params = new URLSearchParams({ pagina, limite: 10 });
            if (debouncedBusqueda) params.append('busqueda', debouncedBusqueda);
            if (filtros.categoria) params.append('categoria', filtros.categoria);
            if (filtros.minPrice) params.append('minPrice', filtros.minPrice);
            if (filtros.maxPrice) params.append('maxPrice', filtros.maxPrice);
            if (filtros.sortBy) params.append('sortBy', filtros.sortBy);
            if (filtros.es_oferta) params.append('es_oferta', filtros.es_oferta);

            try {
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/producto?${params.toString()}`;
                console.log("Enviando petición a la API:", apiUrl); 

                const response = await axios.get(apiUrl);
                if (response.data.exito) {
                    setProductos(response.data.datos);
                    setTotalPaginas(response.data.paginacion.total_paginas);
                    setError(null); // limpiamos error si todo salió bien
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

    // Sincronizamos filtros y página en el estado con los parámetros de la URL para que se pueda compartir o refrescar manteniendo estado
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

    // Actualizamos filtros al cambiar inputs de texto, reiniciando página a 1
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
        setPagina(1);
    };

    // Actualizamos filtros para checkboxes, usando 'true' o '' para controlar la URL
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setFiltros(prev => ({
            ...prev,
            [name]: checked ? 'true' : ''
        }));
        setPagina(1);
    };

    // Cambia la página en la paginación
    const handlePageChange = (event, value) => {
        setPagina(value);
    };

    // Toggle del drawer en móvil
    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    if (loading && productos.length === 0) return <LoadingSpinner />;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    const FilterComponent = () => (
        <ProductFilters 
            filtros={filtros} 
            onFilterChange={handleFilterChange}
            onCheckboxChange={handleCheckboxChange}
        />
    );

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
                        Nuestro Catálogo
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Descubre todos nuestros productos
                    </Typography>
                </Box>

                {/* Botón de filtros para móvil */}
                {isMobile && (
                    <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            onClick={handleDrawerToggle}
                            sx={{ 
                                backgroundColor: '#FF6B35',
                                color: 'white',
                                '&:hover': { backgroundColor: '#FF4500' }
                            }}
                        >
                            <FilterList />
                        </IconButton>
                        <Typography variant="body1" fontWeight="500">
                            Filtros y búsqueda
                        </Typography>
                    </Paper>
                )}

                {/* Layout principal */}
                <Grid container spacing={3}>
                    {/* Sidebar de filtros - Solo en desktop */}
                    {!isMobile && (
                        <Grid item xs={12} md={3} lg={2.5}>
                            <Box sx={{ position: 'sticky', top: 20 }}>
                                <FilterComponent />
                            </Box>
                        </Grid>
                    )}
                    
                    {/* Área de productos */}
                    <Grid item xs={12} md={isMobile ? 12 : 9} lg={isMobile ? 12 : 9.5}>
                        <Box>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                    <LoadingSpinner />
                                </Box>
                            ) : productos.length === 0 ? (
                                <Paper sx={{ p: 6, textAlign: 'center' }}>
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                        No se encontraron productos
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Intenta ajustar los filtros de búsqueda
                                    </Typography>
                                </Paper>
                            ) : (
                                <ProductGrid productos={productos} />
                            )}
                            
                            {/* Paginación */}
                            {totalPaginas > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                    <Pagination 
                                        count={totalPaginas} 
                                        page={pagina} 
                                        onChange={handlePageChange} 
                                        color="primary"
                                        size="large"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                fontSize: '1rem'
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {/* Drawer de filtros para móvil */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: { xs: '85vw', sm: 400 },
                            maxWidth: 400
                        }
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        {/* Header del drawer */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: '1px solid #e9ecef'
                        }}>
                            <Typography variant="h6" fontWeight="bold">
                                Filtros
                            </Typography>
                            <IconButton onClick={handleDrawerToggle}>
                                <Close />
                            </IconButton>
                        </Box>
                        
                        {/* Filtros */}
                        <FilterComponent />
                    </Box>
                </Drawer>
            </Container>
        </Box>
    );
};

export default ProductListPage;