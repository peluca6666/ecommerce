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
          width: { xs: 100, sm: 120, md: 140 },
          mx: 'auto',                    // Centrar horizontalmente
          mt: { xs: 2, md: 3 },          // Margen superior para separar del banner
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
          '&:hover .category-image': {
            transform: 'scale(1.05)',
            boxShadow: theme.shadows[8],
          },
          '&:hover .category-name': {
            color: theme.palette.primary.main,
          }
        }}
      >
        {/* Contenedor circular para la imagen */}
        <Box
          className="category-image"
          sx={{
            width: { xs: 80, sm: 100, md: 120 },
            height: { xs: 80, sm: 100, md: 120 },
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: theme.shadows[3],
            transition: 'all 0.2s ease-in-out',
            mb: 1.5,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Nombre de la categoría */}
        <Typography
          className="category-name"
          variant="body2"
          sx={{
            fontWeight: '500',
            textAlign: 'center',
            color: 'text.primary',
            transition: 'color 0.2s ease-in-out',
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
            lineHeight: 1.2,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {categoria.nombre}
        </Typography>
      </Box>
    </Link>
  );
};

export default CategoryCard;