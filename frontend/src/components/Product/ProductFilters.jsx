import { useState, useEffect } from 'react';
import {  Box, TextField, Paper, Typography, Chip, Stack, Divider, Autocomplete} from '@mui/material';
import { Search, Category, AttachMoney, Sort, LocalOffer } from '@mui/icons-material';
import axios from 'axios';

const ProductFilters = ({ filtros, onFilterChange, onCheckboxChange }) => {
    const [categorias, setCategorias] = useState([]);
    const [searchInput, setSearchInput] = useState(filtros.busqueda || ''); // Estado local para el input
    
    const sortOptions = [
        { value: 'nombre_asc', label: 'Nombre (A-Z)' },
        { value: 'nombre_desc', label: 'Nombre (Z-A)' },
        { value: 'precio_asc', label: 'Precio (Menor a Mayor)' },
        { value: 'precio_desc', label: 'Precio (Mayor a Menor)' }
    ];

    // Sincronizar el input local cuando cambien los filtros externos
    useEffect(() => {
        setSearchInput(filtros.busqueda || '');
    }, [filtros.busqueda]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categoria?activo=true`);
                if (response.data.exito) {
                    setCategorias(response.data.datos.map(cat => ({
                        value: cat.categoria_id,
                        label: cat.nombre
                    })));
                }
            } catch (error) {
                console.error("error al cargar categorías:", error);
            }
        };
        fetchCategorias();
    }, []);

    const handleOfferToggle = () => {
        const newValue = filtros.es_oferta === 'true' ? 'false' : 'true';
        onCheckboxChange({
            target: {
                name: 'es_oferta',
                checked: newValue === 'true'
            }
        });
    };

    const handleSortChange = (_, newValue) => {
        onFilterChange({
            target: {
                name: 'sortBy',
                value: newValue?.value || 'nombre_asc'
            }
        });
    };

    const handleCategoryChange = (_, newValue) => {
        onFilterChange({
            target: {
                name: 'categoria',
                value: newValue?.value || ''
            }
        });
    };

    // Manejar cambios en el input de búsqueda
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchInput(value); // Actualizar estado local inmediatamente
        
        // Propagar el cambio al componente padre
        onFilterChange({
            target: {
                name: 'busqueda',
                value: value
            }
        });
    };

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
            borderRadius: 3,
            background: 'white',
            '&:hover fieldset': { borderColor: '#FF8C00' },
            '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
        }
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                border: '1px solid #e9ecef',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
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
                        value={searchInput} // Usar estado local
                        onChange={handleSearchChange} // Usar handler personalizado
                        fullWidth
                        sx={inputStyles}
                        autoComplete="off"
                    />
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                <FilterField label="Categoría" icon={Category}>
                    <Autocomplete
                        options={[{ value: '', label: 'Todas las categorías' }, ...categorias]}
                        getOptionLabel={(option) => option.label}
                        value={categorias.find(cat => cat.value === filtros.categoria) || { value: '', label: 'Todas las categorías' }}
                        onChange={handleCategoryChange}
                        renderInput={(params) => (
                            <TextField {...params} sx={inputStyles} />
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        disableClearable
                    />
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                <FilterField label="Rango de precio" icon={AttachMoney}>
                    <Stack direction="row" spacing={2}>
                        <TextField 
                            placeholder="Mín."
                            name="minPrice"
                            type="number"
                            value={filtros.minPrice || ''}
                            onChange={onFilterChange}
                            slotProps={{ input: { min: 0, step: "any" } }}
                            sx={{ flex: 1, ...inputStyles }}
                        />
                        <TextField 
                            placeholder="Máx."
                            name="maxPrice"
                            type="number"
                            value={filtros.maxPrice || ''}
                            onChange={onFilterChange}
                            slotProps={{ input: { min: 0, step: "any" } }}
                            sx={{ flex: 1, ...inputStyles }}
                        />
                    </Stack>
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                <FilterField label="Ordenar por" icon={Sort}>
                    <Autocomplete
                        options={sortOptions}
                        getOptionLabel={(option) => option.label}
                        value={sortOptions.find(opt => opt.value === filtros.sortBy) || sortOptions[0]}
                        onChange={handleSortChange}
                        renderInput={(params) => (
                            <TextField {...params} sx={inputStyles} />
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        disableClearable
                    />
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                <FilterField label="Ofertas especiales" icon={LocalOffer}>
                    <Chip
                        icon={<LocalOffer />}
                        label="Solo ofertas"
                        clickable
                        onClick={handleOfferToggle}
                        variant={filtros.es_oferta === 'true' ? 'filled' : 'outlined'}
                        sx={{
                            borderRadius: 3,
                            height: 40,
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            ...(filtros.es_oferta === 'true' ? {
                                background: 'linear-gradient(135deg, #FF4500, #FF6B35)',
                                color: 'white',
                                '& .MuiChip-icon': { color: 'white' }
                            } : {
                                borderColor: '#e9ecef',
                                color: '#495057',
                                '&:hover': {
                                    borderColor: '#FF8C00',
                                    background: 'rgba(255,140,0,0.05)'
                                }
                            })
                        }}
                    />
                </FilterField>
            </Stack>

            <Box sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,140,0,0.05), rgba(255,107,53,0.05))',
                pointerEvents: 'none'
            }} />
        </Paper>
    );
};

export default ProductFilters;