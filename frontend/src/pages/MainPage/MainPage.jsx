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
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      {/* Banner Section - Revertido al original */}
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <MainBanner />
      </Container>

      {/* Category Slider - Con control estricto de overflow */}
      <Box sx={{ 
        py: 0,
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        position: 'relative'
      }}>
        <CategorySlider categoria={state.categoria} />
      </Box>

      {/* Offers Section */}
      <Box sx={{ 
        width: '100%',
        maxWidth: '100vw',
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        py: { xs: 2, md: 3 },
        boxSizing: 'border-box'
      }}>
        <Paper elevation={2} sx={{ 
          p: { xs: 1.5, md: 2 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          border: '1px solid #f1f3f4',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          {/* Título destacado con rectángulo de color */}
          <Box sx={{
            background: 'linear-gradient(135deg, #FF4500 0%, #FF6B35 50%, #FF8C00 100%)',
            borderRadius: 3,
            py: { xs: 2, md: 2.5 },
            mb: { xs: 2, md: 3 },
            boxShadow: '0 4px 20px rgba(255, 69, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
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
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: { xs: '0.5px', md: '1px' },
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              px: { xs: 1, sm: 2 }
            }}>
              OFERTAS IMPERDIBLES
            </Typography>
          </Box>
          
          {/* ProductGrid con control de overflow */}
          <Box sx={{ 
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <ProductGrid productos={state.ofertas} />
          </Box>
          
          <Box sx={{ 
            mt: { xs: 2, md: 2.5 }, 
            textAlign: 'center',
            px: { xs: 1, sm: 2 }
          }}>
            <Button
              component={Link}
              to="/productos"
              variant="contained"
              size="large"
              sx={{
                px: { xs: 3, md: 4 },
                py: { xs: 1.2, md: 1.5 },
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
                color: 'white',
                fontSize: { xs: '1rem', md: '1.1rem' },
                transition: 'all 0.3s ease',
                maxWidth: '100%',
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
      </Box>
    </Box>
  );
};

export default MainPage;