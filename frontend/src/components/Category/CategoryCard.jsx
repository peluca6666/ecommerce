import { Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryCard = ({ categoria }) => {
  const theme = useTheme();

  // construyo url de imagen o uso placeholder si no tiene
  const imageUrl = categoria.imagen
    ? `${import.meta.env.VITE_API_BASE_URL}${categoria.imagen}` 
    : 'https://via.placeholder.com/120x120';

  return (
    <Link to={`/categoria/${categoria.categoria_id}/productos`} style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: { xs: 120, sm: 140, md: 160 }, // Más ancho para formato cuadrado
          mx: 'auto',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
          },
          '&:hover .category-image': {
            transform: 'scale(1.03)',
            boxShadow: '0 12px 40px rgba(255, 107, 53, 0.25)',
            borderColor: '#FF6B35'
          },
          '&:hover .category-name': {
            color: '#FF6B35',
          }
        }}
      >
        {/* Contenedor cuadrado redondeado para la imagen */}
        <Box
          className="category-image"
          sx={{
            width: { xs: 90, sm: 110, md: 130 },
            height: { xs: 90, sm: 110, md: 130 },
            borderRadius: 3, // Cuadrado redondeado en lugar de círculo
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            mb: 2,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid transparent',
            position: 'relative',
            // Efecto de overlay sutil
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, transparent 50%, rgba(255,140,0,0.05) 100%)',
            }
          }}
        />

        {/* Nombre de la categoría */}
        <Typography
          className="category-name"
          variant="body2"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            color: '#2c3e50',
            transition: 'color 0.3s ease',
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            lineHeight: 1.3,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.6em', // Altura mínima para 2 líneas
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {categoria.nombre}
        </Typography>
      </Box>
    </Link>
  );
};

export default CategoryCard;