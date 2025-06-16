// src/components/Header/SearchBar.jsx

import { useState, useEffect } from 'react';
import { TextField, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useDebounce } from '../../hooks/useDebounce'; // El hook que ya creamos
import { useClickOutside } from '../../hooks/useClickOutside'; // El nuevo hook

const SearchBar = () => {
    // Manejo de estado para el input, resultados, loading y dropdown
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Usamos el Debounce para no hacer una llamada a la api en cada tecla presionada
    const debouncedSearchTerm = useDebounce(inputValue, 300);

    // Logica para buscar productos
    useEffect(() => {
        // Solo buscamos si el término tiene al menos 2 caracteres
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
            setResults([]); // Limpiamos los resultados si el input está vacío
        }
    }, [debouncedSearchTerm]); // Este efecto depende del término "debounced"

    // Logica para cerrar el dropdown al hacer clic fuera del área del buscador
    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };
    const searchRef = useClickOutside(closeDropdown); // Usamos el hook

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        if (!isDropdownOpen) {
            setIsDropdownOpen(true);
        }
    };

    return (
        // El ref es para que el hook useClickOutside sepa cuál es el área del buscador
        <Box ref={searchRef} sx={{ position: 'relative', width: { xs: '100%', md: 300 } }}>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Buscar productos..."
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)} // Abrimos al hacer foco
            />

            {/* Dropdown con los resultados de la busqueda*/}
            {isDropdownOpen && inputValue.length > 1 && (
                <Paper sx={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                    maxHeight: '400px',
                    overflowY: 'auto',
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
                                results.map(producto => (
                                    <ListItem 
                                        key={producto.producto_id}
                                        component={RouterLink}
                                        to={`/producto/${producto.producto_id}`}
                                        onClick={closeDropdown} // Cerramos al hacer clic en un item
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