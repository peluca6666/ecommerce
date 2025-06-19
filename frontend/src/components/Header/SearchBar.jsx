import { useState, useEffect } from 'react';
import { TextField, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useDebounce } from '../../hooks/useDebounce'; 
import { useClickOutside } from '../../hooks/useClickOutside'; 

const SearchBar = () => {
    // Estado del input, resultados, loading y si dropdown está abierto
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Evitar llamar a la API en cada tecla con debounce
    const debouncedSearchTerm = useDebounce(inputValue, 300);

    useEffect(() => {
        // Buscar solo si hay al menos 2 caracteres
        if (debouncedSearchTerm.length > 1) {
            setLoading(true);
            const fetchResults = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/producto?busqueda=${debouncedSearchTerm}&limite=5`);
                    if (response.data.exito) {
                        setResults(response.data.datos);
                    }
                } catch (error) {
                    console.error("Error en la búsqueda:", error);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        } else {
            setResults([]); // Limpiar resultados si input queda vacío
        }
    }, [debouncedSearchTerm]);

    // Hook para cerrar dropdown si se clickea afuera del buscador
    const closeDropdown = () => setIsDropdownOpen(false);
    const searchRef = useClickOutside(closeDropdown);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        if (!isDropdownOpen) setIsDropdownOpen(true);
    };

    return (
        // Ref para detectar clicks fuera
        <Box ref={searchRef} sx={{ position: 'relative', width: { xs: '100%', md: 300 } }}>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Buscar productos..."
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)} 
            />

            {/* Dropdown con resultados */}
            {isDropdownOpen && inputValue.length > 1 && (
                <Paper sx={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                    maxHeight: '400px',
                    overflowY: 'auto',
                }} elevation={6}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <List>
                            {results.length > 0 ? (
                                results.map(producto => (
                                    <ListItem 
                                        key={producto.producto_id}
                                        component={RouterLink}
                                        to={`/producto/${producto.producto_id}`}
                                        onClick={closeDropdown} 
                                        sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { bgcolor: 'action.hover' } }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar variant="rounded" src={producto.imagen} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={producto.nombre_producto}
                                            secondary={`$${producto.precio}`}
                                        />
                                    </ListItem>
                                ))
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
