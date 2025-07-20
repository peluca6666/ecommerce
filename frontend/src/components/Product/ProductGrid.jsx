import { Box } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductGrid = ({ productos = [] }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, 1fr)',     // Móvil: 2 columnas
      sm: 'repeat(3, 1fr)',     // Tablet: 3 columnas
      md: 'repeat(4, 1fr)',     // Desktop: 4 columnas
      lg: 'repeat(5, 1fr)'      // Large: 5 columnas
    },
    gap: { xs: 2, md: 3 },
    gridAutoRows: '1fr'
  }}>
    {productos.map(producto => (
      <ProductCard 
        key={producto.producto_id}
        producto={producto} 
      />
    ))}
  </Box>
);

export default ProductGrid;