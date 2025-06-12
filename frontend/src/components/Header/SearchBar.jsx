import { TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchBar = ({ value, onChange }) => (
  <TextField
    placeholder="Buscar producto..."
    variant="outlined"
    size="small"
    slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }}
    sx={{ flexGrow: 1, maxWidth: 400, mr: 2 }}
  />
);

export default SearchBar;