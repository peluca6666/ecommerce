import { Box } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductGrid = ({ productos = [] }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, 1fr)',     
      sm: 'repeat(2, 1fr)',      
      md: 'repeat(3, 1fr)',    
      lg: 'repeat(4, 1fr)'      
    },
    gap: { 
      xs: 2,   
      sm: 3,   
      md: 4   
    },
    gridAutoRows: '1fr',
    '& > *': {
      minHeight: { xs: '280px', md: '320px' }
    }
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