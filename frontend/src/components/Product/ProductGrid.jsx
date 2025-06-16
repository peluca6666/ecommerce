import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductGrid = ({ productos = [],  }) => (
  <Grid container spacing={3}>
    {productos.map(productoIndividual => (
      <Grid item xs={12} sm={6} md={3} key={productoIndividual.producto_id}>
        <ProductCard 
          producto={productoIndividual} 
        />
      </Grid>
    ))}
  </Grid>
);

export default ProductGrid;