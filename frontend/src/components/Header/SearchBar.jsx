import { useState, useEffect } from 'react';
import { TextField, Box, List, ListItem, ListItemText, CircularProgress, Paper, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useDebounce } from '../../hooks/useDebounce'; 
import { useClickOutside } from '../../hooks/useClickOutside'; 

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(inputValue, 300);

    useEffect(() => {
        if (debouncedSearchTerm.length > 1) {
            setLoading(true);
            const fetchResults = async () => {
                try {
                     const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/producto?busqueda=${debouncedSearchTerm}&limite=5`);
                    if (response.data.exito) {
                        setResults(response.data.datos);
                    }
                } catch (error) {
                    console.error("error en la búsqueda:", error);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        } else {
            setResults([]);
        }
    }, [debouncedSearchTerm]);

    const closeDropdown = () => setIsDropdownOpen(false);
    const searchRef = useClickOutside(closeDropdown);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        if (!isDropdownOpen) setIsDropdownOpen(true);
    };

    return (
        <Box
            ref={searchRef}
            sx={{ 
                position: 'relative', 
                width: { xs: '100%', md: '600px' }, 
                mx: 2 
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Buscar productos..."        
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)}
    slotProps={{
        input: {
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6d6c6cff' }} />
                </InputAdornment>
            ),
        }
    }}
    sx={{
        '& .MuiOutlinedInput-root': {
            borderRadius: '7px',
            backgroundColor: '#e6e5e5ff', 
            '& fieldset': {
                borderColor: 'transparent', 
            },           
            '&.Mui-focused fieldset': {
                borderColor: 'black',
                borderWidth: '1.5px',
            },
        },
        '& .MuiInputBase-input::placeholder': {
            color: '#6e6e6eff',
            opacity: 1,
        },
    }}
/>

            {isDropdownOpen && inputValue.length > 1 && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        right: 0,
                        zIndex: 1200,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        width: '100%',
                    }}
                    elevation={6}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <List>
                            {results.length > 0 ? (
                                results.map(producto => {
                                    const imageUrl = producto.imagen 
                                        ? `${import.meta.env.VITE_API_BASE_URL}${producto.imagen}`
                                        : 'https://via.placeholder.com/60';

                                    return (
                                        <ListItem 
                                            key={producto.producto_id}
                                            component={RouterLink}
                                            to={`/producto/${producto.producto_id}`}
                                            onClick={closeDropdown} 
                                            sx={{ 
                                                textDecoration: 'none', 
                                                color: 'inherit', 
                                                '&:hover': { bgcolor: 'action.hover' },
                                                py: 2,
                                                px: 3,
                                                gap: 2
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    minWidth: 60,
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                    bgcolor: 'background.default',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <img 
                                                    src={imageUrl}
                                                    alt={producto.nombre_producto}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/60';
                                                    }}
                                                />
                                            </Box>
                                            
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {producto.nombre_producto}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ${producto.precio}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    );
                                })
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No se encontraron resultados." />
                                </ListItem>
                            )}
                        </List>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default SearchBar;
