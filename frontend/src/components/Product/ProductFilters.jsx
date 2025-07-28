import { useState, useEffect } from 'react';
import { 
    Box, TextField, Select, MenuItem, FormControl, 
    InputLabel, Paper, Typography, Checkbox, FormControlLabel, Stack, Divider, Chip
} from '@mui/material';
import { Search, Category, AttachMoney, Sort, LocalOffer, FilterList } from '@mui/icons-material';
import axios from 'axios';

// Estilos reutilizables
const styles = {
    input: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontSize: '0.875rem',
            '& fieldset': { borderColor: '#e5e7eb' },
            '&:hover fieldset': { borderColor: '#6366f1' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' }
        },
        '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            '&.Mui-focused': { color: '#6366f1' }
        }
    },
    offerBox: (isActive) => ({
        p: 2.5,
        borderRadius: 2,
        background: isActive ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f9fafb',
        border: '1px solid',
        borderColor: isActive ? '#f59e0b' : '#e5e7eb',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
            borderColor: '#6366f1',
            background: isActive ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f3f4f6'
        }
    })
};

const FilterSection = ({ icon: Icon, title, children }) => (
    <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#374151' }}>
            <Icon sx={{ fontSize: 18, color: '#6366f1' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.025em' }}>
                {title}
            </Typography>
        </Box>
        {children}
    </Box>
);

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

    const isOfferActive = filtros.es_oferta === 'true';

    return (
        <Paper elevation={0} sx={{ 
            p: 3, borderRadius: 3, background: 'white', 
            border: '1px solid #f3f4f6', 
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' 
        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, pb: 3, borderBottom: '1px solid #f3f4f6' }}>
                <Box sx={{
                    p: 2, borderRadius: 2, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <FilterList sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem', lineHeight: 1.2 }}>
                        Filtros
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', mt: 0.5 }}>
                        Encuentra exactamente lo que buscas
                    </Typography>
                </Box>
            </Box>

            <Stack spacing={4}>
                {/* Búsqueda */}
                <FilterSection icon={Search} title="Buscar producto">
                    <TextField 
                        placeholder="¿Qué estás buscando?"
                        variant="outlined"
                        name="busqueda"
                        value={filtros.busqueda}
                        onChange={onFilterChange}
                        fullWidth
                        size="small"
                        sx={styles.input}
                    />
                </FilterSection>

                <Divider sx={{ borderColor: '#f3f4f6' }} />

                {/* Categoría */}
                <FilterSection icon={Category} title="Categoría">
                    <FormControl fullWidth size="small" sx={styles.input}>
                        <InputLabel>Seleccionar categoría</InputLabel>
                        <Select name="categoria" value={filtros.categoria} label="Seleccionar categoría" onChange={onFilterChange}>
                            <MenuItem value=""><em>Todas las categorías</em></MenuItem>
                            {categorias.map(cat => (
                                <MenuItem key={cat.categoria_id} value={cat.categoria_id}>{cat.nombre}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FilterSection>

                <Divider sx={{ borderColor: '#f3f4f6' }} />

                {/* Rango de precio */}
                <FilterSection icon={AttachMoney} title="Rango de precio">
                    <Stack direction="row" spacing={2}>
                        <TextField 
                            label="Mínimo" variant="outlined" name="minPrice" type="number"
                            value={filtros.minPrice} onChange={onFilterChange} size="small"
                            sx={{ flex: 1, ...styles.input }} inputProps={{ min: 0, step: "any" }}
                        />
                        <TextField 
                            label="Máximo" variant="outlined" name="maxPrice" type="number"
                            value={filtros.maxPrice} onChange={onFilterChange} size="small"
                            sx={{ flex: 1, ...styles.input }} inputProps={{ min: 0, step: "any" }}
                        />
                    </Stack>
                </FilterSection>

                <Divider sx={{ borderColor: '#f3f4f6' }} />

                {/* Ordenar por */}
                <FilterSection icon={Sort} title="Ordenar por">
                    <FormControl fullWidth size="small" sx={styles.input}>
                        <InputLabel>Orden</InputLabel>
                        <Select name="sortBy" value={filtros.sortBy} label="Orden" onChange={onFilterChange}>
                            <MenuItem value="nombre_asc">Nombre (A-Z)</MenuItem>
                            <MenuItem value="nombre_desc">Nombre (Z-A)</MenuItem>
                            <MenuItem value="precio_asc">Precio (Menor a Mayor)</MenuItem>
                            <MenuItem value="precio_desc">Precio (Mayor a Menor)</MenuItem>
                        </Select>
                    </FormControl>
                </FilterSection>

                <Divider sx={{ borderColor: '#f3f4f6' }} />

                {/* Ofertas especiales */}
                <FilterSection icon={LocalOffer} title="Ofertas especiales">
                    <Box sx={styles.offerBox(isOfferActive)}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="es_oferta"
                                    checked={isOfferActive}
                                    onChange={onCheckboxChange}
                                    sx={{ color: '#6366f1', '&.Mui-checked': { color: '#6366f1' } }}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                                        Solo productos en oferta
                                    </Typography>
                                    {isOfferActive && (
                                        <Chip 
                                            label="Activo" size="small"
                                            sx={{
                                                background: '#f59e0b', color: 'white', fontSize: '0.75rem',
                                                height: 20, '& .MuiChip-label': { px: 1 }
                                            }}
                                        />
                                    )}
                                </Box>
                            }
                            sx={{ margin: 0 }}
                        />
                    </Box>
                </FilterSection>
            </Stack>
        </Paper>
    );
};

export default ProductFilters;