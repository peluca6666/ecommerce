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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/producto`);
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categoria`);
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/producto/ofertas`);
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
    <Box>
      {/* Banner con container limitado */}
      <Container maxWidth="lg">
        <MainBanner />
      </Container>

      {/* CategorySlider sin restricción de ancho */}
      <CategorySlider categoria={state.categoria} />

      {/* Ofertas con container más amplio */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Paper elevation={1} sx={{ 
          p: { xs: 2, md: 3 }, 
          my: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          border: '1px solid #f1f3f4'
        }}>
          <Typography variant="h4" sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 4,
            color: '#2c3e50',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 3,
              background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
              borderRadius: 2,
            }
          }}>
            OFERTAS IMPERDIBLES
          </Typography>
          
          <ProductGrid productos={state.ofertas} />
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/productos?es_oferta=true"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
                color: 'white',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255,107,53,0.4)'
                }
              } }onClick={() => window.scrollTo(0, 0)}
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