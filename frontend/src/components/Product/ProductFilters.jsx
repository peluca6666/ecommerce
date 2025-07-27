import { useState, useEffect } from 'react';
import { 
    Box, TextField, Select, MenuItem, FormControl, 
    InputLabel, Paper, Typography, Checkbox, FormControlLabel, Stack, Divider 
} from '@mui/material';
import { Search, Category, AttachMoney, Sort, LocalOffer } from '@mui/icons-material';
import axios from 'axios';

const ProductFilters = ({ filtros, onFilterChange, onCheckboxChange }) => {
    const [categorias, setCategorias] = useState([]);
    
    // Cargo categorías activas al montar para el filtro
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

    const FilterField = ({ label, icon: Icon, children }) => (
        <Box>
            <Typography variant="subtitle2" sx={{ 
                color: '#495057', 
                fontWeight: 600, 
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <Icon sx={{ fontSize: 18, color: '#FF6B35' }} />
                {label}
            </Typography>
            {children}
        </Box>
    );

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            background: 'white',
            '&:hover fieldset': { borderColor: '#FF8C00' },
            '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
        }
    };

    return (
        <Paper 
            elevation={1}
            sx={{ 
                p: 3,
                borderRadius: 2,
                background: 'white',
                border: '1px solid #e9ecef'
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    Filtros
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                    Encuentra exactamente lo que buscas
                </Typography>
            </Box>

            <Stack spacing={3}>
                <FilterField label="Buscar producto" icon={Search}>
                    <TextField 
                        placeholder="¿Qué estás buscando?"
                        variant="outlined"
                        name="busqueda"
                        value={filtros.busqueda || ''}
                        onChange={onFilterChange}
                        fullWidth
                        sx={inputStyles}
                        autoComplete="off"
                    />
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                <FilterField label="Categoría" icon={Category}>
                    <FormControl fullWidth sx={inputStyles}>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            name="categoria"
                            value={filtros.categoria || ''}
                            label="Categoría"
                            onChange={onFilterChange}
                        >
                            <MenuItem value=""><em>Todas las categorías</em></MenuItem>
                            {categorias.map(cat => (
                                <MenuItem key={cat.categoria_id} value={cat.categoria_id}>
                                    {cat.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                <FilterField label="Rango de precio" icon={AttachMoney}>
                    <Stack direction="row" spacing={2}>
                        <TextField 
                            label="Precio Mín."
                            variant="outlined"
                            name="minPrice"
                            type="number"
                            value={filtros.minPrice || ''}
                            onChange={onFilterChange}
                            sx={{ flex: 1, ...inputStyles }}
                            inputProps={{ min: 0, step: "any" }}
                        />
                        <TextField 
                            label="Precio Máx."
                            variant="outlined"
                            name="maxPrice"
                            type="number"
                            value={filtros.maxPrice || ''}
                            onChange={onFilterChange}
                            sx={{ flex: 1, ...inputStyles }}
                            inputProps={{ min: 0, step: "any" }}
                        />
                    </Stack>
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                <FilterField label="Ordenar por" icon={Sort}>
                    <FormControl fullWidth sx={inputStyles}>
                        <InputLabel>Ordenar por</InputLabel>
                        <Select
                            name="sortBy"
                            value={filtros.sortBy || 'nombre_asc'}
                            label="Ordenar por"
                            onChange={onFilterChange}
                        >
                            <MenuItem value="nombre_asc">Nombre (A-Z)</MenuItem>
                            <MenuItem value="nombre_desc">Nombre (Z-A)</MenuItem>
                            <MenuItem value="precio_asc">Precio (Menor a Mayor)</MenuItem>
                            <MenuItem value="precio_desc">Precio (Mayor a Menor)</MenuItem>
                        </Select>
                    </FormControl>
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                <FilterField label="Ofertas especiales" icon={LocalOffer}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="es_oferta"
                                checked={filtros.es_oferta === 'true'}
                                onChange={onCheckboxChange}
                                sx={{
                                    color: '#FF6B35',
                                    '&.Mui-checked': {
                                        color: '#FF6B35',
                                    }
                                }}
                            />
                        }
                        label="Mostrar solo ofertas"
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                color: '#495057',
                                fontWeight: 500
                            }
                        }}
                    />
                </FilterField>
            </Stack>
        </Paper>
    );
};

export default ProductFilters;