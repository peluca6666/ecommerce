import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Si usas react-router

const CategoryCard = ({ categoria }) => { // Cambié "category" por "categoria"
  const navigate = useNavigate();

  const handleClick = () => {
    // Navegar a la página de la categoría (opcional)
    navigate(`/category/${categoria.categoria_id}`); // Usar categoria_id
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
        image={categoria.imagen || 'https://via.placeholder.com/200?text=' + encodeURIComponent(categoria.nombre)} // Imagen por defecto con el nombre
        alt={categoria.nombre}
      />
      
      {/* Nombre de la categoría */}
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="h3">
          {categoria.nombre} {/* Cambié "category" por "categoria" */}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;