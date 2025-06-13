import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductGrid = ({ producto = [], onAddToCart }) => (
  <Grid container spacing={3}>
    {producto.map(productoIndividual => (
      <Grid item xs={12} sm={6} md={3} key={productoIndividual.id}>
        <ProductCard producto={productoIndividual} onAddToCart={onAddToCart} />
      </Grid>
    ))}
  </Grid>
);

export default ProductGrid;
