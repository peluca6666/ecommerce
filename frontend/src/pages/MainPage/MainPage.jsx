import { useState, useEffect } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import Header from "../../components/Header/Header";
import MainBanner from "../../components/Banner/MainBanner";
import CategorySlider from "../../components/Category/CategorySlider";
import ProductGrid from "../../components/Product/ProductGrid";
import Footer from "../../components/Footer/Footer";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MainPage = () => {
  const [state, setState] = useState({
    producto: [],
    categoria: [],
    loading: true,
    error: null,
    cartCount: 0
  });

  // Función para obtener productos de la API
  const fetchProducto = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/producto'); 
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  };

  // Función para obtener categorías de la API
  const fetchCategoria = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categoria'); 
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.exito && data.categoria) {
        return data.categoria; 
      } else if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Cargar productos y categorias en paralelo
        const [productoData, categoriaData] = await Promise.all([
          fetchProducto(),
          fetchCategoria()
        ]);

        
        setState(prev => ({
          ...prev,
          producto: productoData,
          categoria: categoriaData,
          loading: false
        }));
        
      } catch (error) {
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar los datos. Por favor, intenta nuevamente.'
        }));
      }
    };

    loadData();
  }, []);

  const handleAddToCart = () => {
    setState(prev => ({ ...prev, cartCount: prev.cartCount + 1 }));
  };

  // Mostrar spinner mientras carga
  if (state.loading) return <LoadingSpinner />;
  // Mostrar error si hubo problemas
  if (state.error) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 3, my: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {state.error}
          </Typography>
          <Typography variant="body2">
            Verifica tu conexión a internet y que tu API esté funcionando correctamente.
          </Typography>
        </Paper>
      </Container>
    );
  }

return (
  <Box sx={{ background: 'linear-gradient(to bottom, #ffffff, #f0f0f0)', minHeight: '100vh' }}>
    <Header 
      categoria={state.categoria} 
      cartCount={state.cartCount} 
    />
    <Container maxWidth="lg">
      <MainBanner />
      <CategorySlider categoria={state.categoria} />
      <Paper elevation={1} sx={{ p: 3, my: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          PRODUCTOS DESTACADOS
        </Typography>
        <ProductGrid 
          products={state.producto} 
          onAddToCart={handleAddToCart} 
        />
      </Paper>
    </Container>
    <Footer />
  </Box>
);
}

export default MainPage;