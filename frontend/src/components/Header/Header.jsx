import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import NavMenu from "./NavMenu";
import CartButton from "../Cart/CartButton.jsx";

const Header = ({ categories, cartCount }) => {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 0, mr: 4 }}>
          SoloMarket
        </Typography>
        <SearchBar />
        <CartButton count={cartCount} />
      </Toolbar>
      <NavMenu categories={categories} />
    </AppBar>
  );
};

export default Header;