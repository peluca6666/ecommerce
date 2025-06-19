import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryCard = ({ categoria }) => {
   const BASE_URL = 'http://localhost:3000';

   // Si la categoría tiene imagen, la usamos con la base URL, sino ponemos un placeholder
    const imageUrl = categoria.imagen 
      ? `${BASE_URL}${categoria.imagen}`
      : 'https://via.placeholder.com/200x140';

   return (
    <Link to={`/categoria/${categoria.categoria_id}/productos`} style={{ textDecoration: 'none' }}>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={imageUrl}
            alt={categoria.nombre}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {categoria.nombre}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default CategoryCard;
