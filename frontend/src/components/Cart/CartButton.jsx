import { IconButton, Badge } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

const CartButton = ({ count }) => (
  <IconButton color="inherit" aria-label="Carrito">
    <Badge badgeContent={count} color="primary">
      <ShoppingCart />
    </Badge>
  </IconButton>
);

export default CartButton;