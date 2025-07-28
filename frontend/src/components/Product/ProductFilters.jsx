import { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Paper, Typography, Checkbox, FormControlLabel, Stack} from '@mui/material';
import axios from 'axios';

const ProductFilters = ({ filtros, onFilterChange, onCheckboxChange }) => {
    const [categorias, setCategorias] = useState([]);
    
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categoria?activo=true`);
                if (response.data.exito) {
                    setCategorias(response.data.datos);
                }
            } catch (error) {
                console.error("error al cargar categorías para filtros:", error);
            }
        };
        fetchCategorias();
    }, []);

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': { borderColor: '#FF6B35' },
            '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#374151' }}>
                Filtros
            </Typography>
            
            <Stack spacing={3}>
                <TextField 
                    label="Buscar productos"
                    name="busqueda"
                    value={filtros.busqueda}
                    onChange={onFilterChange}
                    size="small"
                    fullWidth
                    sx={inputStyles}
                />

                <FormControl fullWidth size="small" sx={inputStyles}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                        name="categoria"
                        value={filtros.categoria}
                        label="Categoría"
                        onChange={onFilterChange}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {categorias.map(cat => (
                            <MenuItem key={cat.categoria_id} value={cat.categoria_id}>
                                {cat.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box>
                    <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: '#6b7280' }}>
                        Rango de precio
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <TextField 
                            label="Mínimo"
                            name="minPrice"
                            type="number"
                            value={filtros.minPrice}
                            onChange={onFilterChange}
                            size="small"
                            sx={inputStyles}
                            slotProps={{ input: { min: 0 } }}
                        />
                        <TextField 
                            label="Máximo"
                            name="maxPrice"
                            type="number"
                            value={filtros.maxPrice}
                            onChange={onFilterChange}
                            size="small"
                            sx={inputStyles}
                            slotProps={{ input: { min: 0 } }}
                        />
                    </Stack>
                </Box>

                <FormControl fullWidth size="small" sx={inputStyles}>
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                        name="sortBy"
                        value={filtros.sortBy}
                        label="Ordenar por"
                        onChange={onFilterChange}
                    >
                        <MenuItem value="nombre_asc">Nombre (A-Z)</MenuItem>
                        <MenuItem value="nombre_desc">Nombre (Z-A)</MenuItem>
                        <MenuItem value="precio_asc">Precio (Menor a Mayor)</MenuItem>
                        <MenuItem value="precio_desc">Precio (Mayor a Menor)</MenuItem>
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            name="es_oferta"
                            checked={filtros.es_oferta === 'true'}
                            onChange={onCheckboxChange}
                            sx={{
                                color: '#FF6B35',
                                '&.Mui-checked': { color: '#FF6B35' }
                            }}
                        />
                    }
                    label={
                        <Typography sx={{ fontSize: '0.9rem', color: '#374151' }}>
                            Solo ofertas
                        </Typography>
                    }
                />
            </Stack>
        </Paper>
    );
};

export default ProductFilters;