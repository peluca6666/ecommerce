import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // Importamos Link

const CategoryCard = ({ categoria }) => {
  return (
    //Envolvemos todo en un componente Link que no tiene decoración de texto
    <Link to={`/categoria/${categoria.categoria_id}/productos`} style={{ textDecoration: 'none' }}>
      <Card sx={{ 
        width: 200, 
        textAlign: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 6,
        }
      }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={categoria.imagen || 'https://via.placeholder.com/200x140'}
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