import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Si usas react-router

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navegar a la página de la categoría (opcional)
    navigate(`/category/${category.id}`);
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4, // Efecto de sombra al hover
          transform: 'scale(1.02)',
          transition: 'all 0.3s ease'
        }
      }}
      onClick={handleClick}
    >
      {/* Imagen de la categoría */}
      <CardMedia
        component="img"
        height="160"
        image={category.imagen || 'https://via.placeholder.com/200'} // Imagen por defecto
        alt={category.nombre}
      />
      
      {/* Nombre de la categoría */}
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="h3">
          {category.nombre}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard; // Exportación por defecto