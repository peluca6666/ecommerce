import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductGrid = ({ productos = [] }) => (
  <Grid container spacing={{ xs: 2, md: 3 }} sx={{
    // Para que todas las cards tengan la misma altura usamos:
    '& .MuiGrid-item': {
      display: 'flex',
      '& > *': {
        width: '100%'
      }
    }
  }}>
    {productos.map(productoIndividual => (
      <Grid 
        item 
        xs={6}    // Celular: 2 productos por fila
        sm={4}    // Tablet: 3 productos por fila 
        md={3}    // Desktop: 4 productos por fila
        lg={2.4}  // Desktop grande: 5 productos por fila
        key={productoIndividual.producto_id}
      >
        <ProductCard producto={productoIndividual} />
      </Grid>
    ))}
  </Grid>
);

export default ProductGrid;