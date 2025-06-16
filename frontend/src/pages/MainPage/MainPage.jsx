import { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button,} from "@mui/material";
import Header from "../../components/Header/Header";
import MainBanner from "../../components/Banner/MainBanner";
import CategorySlider from "../../components/Category/CategorySlider";
import ProductGrid from "../../components/Product/ProductGrid";
import Footer from "../../components/Footer/Footer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [state, setState] = useState({
    producto: [],
    categoria: [],
    ofertas: [],
    loading: true,
    error: null,
  });

  const { cart = { count: 0 }, loading: authLoading = true } = useAuth() || {};

  // Función para obtener productos de la API
  const fetchProducto = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/producto');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      // Devolvemos solo el arreglo de productos, igual que en las otras funciones
      return data.exito && Array.isArray(data.datos) ? data.datos : [];
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

      // Verificamos que la respuesta sea exitosa y que contenga la propiedad 'datos'
      if (data.exito && Array.isArray(data.datos)) {
        return data.datos; // Devolvemos el arreglo que está en 'datos'
      } else {
        // Si la respuesta no tiene el formato esperado, devolvemos un arreglo vacío
        console.warn("La respuesta de la API de categorías no tiene el formato esperado:", data);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error; // El error será manejado por la función loadData
    }
  };

  // Función para obtener ofertas de la API
  const fetchOfertas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/producto/ofertas');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json(
      );

      return data.exito && Array.isArray(data.datos) ? data.datos : [];
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      throw error;
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        // Cargar productos y categorias en paralelo
        const [productoData, categoriaData, ofertasData] = await Promise.all([
          fetchProducto(),
          fetchCategoria(),
          fetchOfertas()
        ]);

        setState(prev => ({
          ...prev,
          producto: productoData,
          categoria: categoriaData,
          ofertas: ofertasData,
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

  // Mostrar spinner mientras carga
  if (state.loading || authLoading) return <LoadingSpinner />;

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
      />
      <Container maxWidth="lg">
        <MainBanner />
        <CategorySlider categoria={state.categoria} />
        <Paper elevation={1} sx={{ p: 3, my: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            OFERTAS IMPERDIBLES
          </Typography>
  <ProductGrid
    productos={state.ofertas}
  />
  <Box sx={{ mt: 4, textAlign: 'center' }}>
    <Button 
      component={Link} 
      to="/productos?es_oferta=true" 
      variant="contained"
      color="primary"
    >
      Ver Todas las Ofertas
    </Button>
  </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default MainPage;