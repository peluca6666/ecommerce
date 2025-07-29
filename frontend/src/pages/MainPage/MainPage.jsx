import { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import MainBanner from "../../components/Banner/MainBanner";
import CategorySlider from "../../components/Category/CategorySlider";
import ProductGrid from "../../components/Product/ProductGrid";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

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
    <Box sx={{ 
      width: '100%',
      overflowX: 'hidden'
    }}>
      {/* Banner Section - Sin Container para ancho completo */}
      <Box sx={{ width: '100%' }}>
        <MainBanner />
      </Box>

      {/* Category Slider */}
      <Box sx={{ 
        py: 0,
        width: '100%',
        overflowX: 'hidden'
      }}>
        <CategorySlider categoria={state.categoria} />
      </Box>

      {/* Offers Section */}
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3, lg: 4 } }}>
        <Paper elevation={2} sx={{ 
          p: { xs: 1, md: 2 },
          mt: 0,
          mb: { xs: 1, md: 3 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          border: '1px solid #f1f3f4'
        }}>
          {/* Título destacado - más compacto en móvil */}
          <Box sx={{
            background: 'linear-gradient(135deg, #FF4500 0%, #FF6B35 50%, #FF8C00 100%)',
            borderRadius: 3,
            py: { xs: 1.2, md: 2.5 },
            mb: { xs: 1.5, md: 3 },
            boxShadow: '0 4px 20px rgba(255, 69, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shine 3s infinite',
            },
            '@keyframes shine': {
              '0%': { left: '-100%' },
              '100%': { left: '100%' }
            }
          }}>
            <Typography variant="h4" sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '2rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: { xs: '0.3px', md: '1px' },
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              px: { xs: 0.5, sm: 1, md: 2 }
            }}>
              OFERTAS IMPERDIBLES
            </Typography>
          </Box>
          
          <ProductGrid productos={state.ofertas} />
          
          <Box sx={{ 
            mt: { xs: 1, md: 2.5 }, 
            textAlign: 'center'
          }}>
            <Button
              component={Link}
              to="/productos"
              variant="contained"
              size="large"
              sx={{
                px: { xs: 2.5, md: 4 },
                py: { xs: 1, md: 1.5 },
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
                color: 'white',
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255,107,53,0.4)'
                }
              }}
              onClick={() => window.scrollTo(0, 0)}
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