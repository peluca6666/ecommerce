import { Card, CardActionArea, CardMedia, CardContent, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryCard = ({ categoria }) => {
  const theme = useTheme();

  // construyo url de imagen o uso placeholder si no tiene
  const BASE_URL = 'http://localhost:3000';
  const imageUrl = categoria.imagen
    ? `${BASE_URL}${categoria.imagen}`
    : 'https://via.placeholder.com/240x160';

  return (
    <Link to={`/categoria/${categoria.categoria_id}/productos`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          width: { xs: 180, sm: 200, md: 240 },
          minWidth: { xs: 180, sm: 200, md: 240 },
          height: { xs: 220, sm: 240, md: 300 },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardActionArea sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardMedia
            component="img"
            height={200}
            image={imageUrl}
            alt={categoria.nombre}
            sx={{
              objectFit: 'cover',
              width: '100%',
            }}
          />
          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'medium',
                lineHeight: 1.2,
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {categoria.nombre}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default CategoryCard;
