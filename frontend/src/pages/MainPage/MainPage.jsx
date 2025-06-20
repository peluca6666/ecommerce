import { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import MainBanner from "../../components/Banner/MainBanner";
import CategorySlider from "../../components/Category/CategorySlider";
import ProductGrid from "../../components/Product/ProductGrid";
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

  // trae todos los productos
  const fetchProducto = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/producto');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();

      return data.exito && Array.isArray(data.datos) ? data.datos : [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  };

  // trae las categorías disponibles
  const fetchCategoria = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categoria');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();

      return data.exito && Array.isArray(data.datos) ? data.datos : [];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  };

  // trae productos en oferta
  const fetchOfertas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/producto/ofertas');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();

      return data.exito && Array.isArray(data.datos) ? data.datos : [];
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      throw error;
    }
  };

  // carga los datos cuando se monta el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // carga todo en paralelo para que sea más rápido
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

  if (state.loading || authLoading) return <LoadingSpinner />;

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
      <Container maxWidth="lg">
        <MainBanner />
        <CategorySlider categoria={state.categoria} />
        <Paper elevation={1} sx={{ p: 3, my: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            OFERTAS IMPERDIBLES
          </Typography>
          <ProductGrid productos={state.ofertas} />
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
    </Box>
  );
};

export default MainPage;
