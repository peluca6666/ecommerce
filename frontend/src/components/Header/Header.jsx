import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import NavMenu from "./NavMenu";
import CartButton from "../Cart/CartDropdown.jsx";
import UserButton
 from "../common/UserButton.jsx";
const Header = ({ categories, cartCount }) => {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h3" sx={{ flexGrow: 0, mr: 4 }}>
          SaloMarket
        </Typography>
        <SearchBar />
        <CartButton count={cartCount} />
        <UserButton /> {/* Agregado aquí */}
      </Toolbar>
      <NavMenu categories={categories} />
    </AppBar>
  );
};


export default Header;