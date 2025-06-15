import { TextField, IconButton, InputAdornment, Box,styled } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { useState } from "react";

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `${theme.palette.primary.main} 0 0 0 1px`,
    },
  },
}));

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 500, mr: 2 }}>
      <SearchTextField
        placeholder="Buscar producto..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyPress}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={handleClear}
                  sx={{ p: 0 }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              pr: 1, 
            }
          }
        }}
      />
    </Box>
  );
};

export default SearchBar;