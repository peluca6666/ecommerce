import { useState, useEffect } from 'react';
import { 
    Box, TextField, Select, MenuItem, FormControl, 
    InputLabel, Paper, Typography, Checkbox, FormControlLabel 
} from '@mui/material';
import axios from 'axios';

const ProductFilters = ({ filtros, onFilterChange, onCheckboxChange }) => {
    const [categorias, setCategorias] = useState([]);

    // cargo categorías activas al montar para el filtro
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

    return (
        <Paper elevation={2} sx={{ p: 2, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Filtros</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField 
                    label="Buscar por nombre..."
                    variant="outlined"
                    name="busqueda"
                    value={filtros.busqueda}
                    onChange={onFilterChange}
                />
                <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                        name="categoria"
                        value={filtros.categoria}
                        label="Categoría"
                        onChange={onFilterChange}
                    >
                        <MenuItem value=""><em>Todas</em></MenuItem>
                        {categorias.map(cat => (
                            <MenuItem key={cat.categoria_id} value={cat.categoria_id}>{cat.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField 
                    label="Precio Mín."
                    variant="outlined"
                    name="minPrice"
                    type="number"
                    value={filtros.minPrice}
                    onChange={onFilterChange}
                />
                <TextField 
                    label="Precio Máx."
                    variant="outlined"
                    name="maxPrice"
                    type="number"
                    value={filtros.maxPrice}
                    onChange={onFilterChange}
                />
                <FormControl fullWidth>
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
                            // checkeamos si el filtro de ofertas está activo
                            checked={filtros.es_oferta === 'true'}
                            onChange={onCheckboxChange}
                        />
                    }
                    label="Mostrar solo ofertas"
                />
            </Box>
        </Paper>
    );
};

export default ProductFilters;
