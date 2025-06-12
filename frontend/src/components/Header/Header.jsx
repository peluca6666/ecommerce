import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import NavMenu from "./NavMenu";
import CartButton from "../Cart/CartDropdown.jsx";
import UserButton from "../common/UserButton.jsx";

const Header = ({ cartCount }) => {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo */}
        <Typography variant="h3" sx={{ flexGrow: 0, mr: 4 }}>
          SaloMarket
        </Typography>

        {/* Buscador */}
        <SearchBar onSearch={(term) => console.log('Buscar:', term)} initialValue="" />

        {/* NavMenu con botones de navegación */}
        <Box sx={{ display: 'flex', ml: 4, gap: 2 }}>
          <NavMenu />
        </Box>

        {/* Carrito y usuario alineados a la derecha */}
        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <CartButton count={cartCount} />
          <UserButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
