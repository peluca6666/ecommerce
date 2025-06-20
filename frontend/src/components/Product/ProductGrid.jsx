import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductGrid = ({ productos = [] }) => (
  // muestra productos en un grid responsive con 1, 2 o 4 columnas según tamaño
  <Grid container spacing={3}>
    {productos.map(productoIndividual => (
      <Grid xs={12} sm={6} md={3} key={productoIndividual.producto_id}>
        <ProductCard 
          producto={productoIndividual} 
        />
      </Grid>
    ))}
  </Grid>
);

export default ProductGrid;
