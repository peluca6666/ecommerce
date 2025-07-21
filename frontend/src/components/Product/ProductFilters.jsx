import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
    Box, TextField, Select, MenuItem, FormControl, 
    Paper, Typography, Chip, Stack, Divider, Autocomplete
} from '@mui/material';
import { Search, Category, AttachMoney, Sort, LocalOffer } from '@mui/icons-material';
import axios from 'axios';

const ProductFilters = ({ filtros, onFilterChange, onCheckboxChange }) => {
    const { control, watch, setValue, reset } = useForm({
        defaultValues: {
            busqueda: filtros.busqueda || '',
            categoria: filtros.categoria || '',
            minPrice: filtros.minPrice || '',
            maxPrice: filtros.maxPrice || '',
            sortBy: filtros.sortBy || 'nombre_asc',
            es_oferta: filtros.es_oferta === 'true'
        }
    });

    // Opciones de categorías y ordenamiento
    const [categorias, setCategorias] = useState([]);
    
    const sortOptions = [
        { value: 'nombre_asc', label: 'Nombre (A-Z)' },
        { value: 'nombre_desc', label: 'Nombre (Z-A)' },
        { value: 'precio_asc', label: 'Precio (Menor a Mayor)' },
        { value: 'precio_desc', label: 'Precio (Mayor a Menor)' }
    ];

    // Cargar categorías
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

    // Observar cambios y notificar al padre
    const watchedValues = watch();
    useEffect(() => {
        const { es_oferta, ...otherFilters } = watchedValues;
        
        // Convertir valores para el componente padre
        Object.entries(otherFilters).forEach(([key, value]) => {
            onFilterChange({ target: { name: key, value } });
        });
        
        // Manejar checkbox de ofertas
        onCheckboxChange({ 
            target: { 
                name: 'es_oferta', 
                checked: es_oferta 
            } 
        });
    }, [watchedValues]);

    const FilterField = ({ name, label, icon: Icon, children }) => (
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
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    Filtros
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                    Encuentra exactamente lo que buscas
                </Typography>
            </Box>

            <Stack spacing={3}>
                {/* Búsqueda */}
                <FilterField name="busqueda" label="Buscar producto" icon={Search}>
                    <Controller
                        name="busqueda"
                        control={control}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                placeholder="¿Qué estás buscando?"
                                fullWidth
                                sx={inputStyles}
                            />
                        )}
                    />
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                {/* Categoría con Autocomplete */}
                <FilterField name="categoria" label="Categoría" icon={Category}>
                    <Controller
                        name="categoria"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Autocomplete
                                options={[{ value: '', label: 'Todas las categorías' }, ...categorias]}
                                getOptionLabel={(option) => option.label}
                                value={categorias.find(cat => cat.value === value) || { value: '', label: 'Todas las categorías' }}
                                onChange={(_, newValue) => onChange(newValue?.value || '')}
                                renderInput={(params) => (
                                    <TextField {...params} sx={inputStyles} />
                                )}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                            />
                        )}
                    />
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                {/* Rango de precios */}
                <FilterField name="precio" label="Rango de precio" icon={AttachMoney}>
                    <Stack direction="row" spacing={2}>
                        <Controller
                            name="minPrice"
                            control={control}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    placeholder="Mín."
                                    type="number"
                                    sx={{ flex: 1, ...inputStyles }}
                                />
                            )}
                        />
                        <Controller
                            name="maxPrice"
                            control={control}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    placeholder="Máx."
                                    type="number"
                                    sx={{ flex: 1, ...inputStyles }}
                                />
                            )}
                        />
                    </Stack>
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                {/* Ordenar con Autocomplete */}
                <FilterField name="sortBy" label="Ordenar por" icon={Sort}>
                    <Controller
                        name="sortBy"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Autocomplete
                                options={sortOptions}
                                getOptionLabel={(option) => option.label}
                                value={sortOptions.find(opt => opt.value === value)}
                                onChange={(_, newValue) => onChange(newValue?.value)}
                                renderInput={(params) => (
                                    <TextField {...params} sx={inputStyles} />
                                )}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                            />
                        )}
                    />
                </FilterField>

                <Divider sx={{ borderColor: '#f1f3f4' }} />

                {/* Ofertas */}
                <FilterField name="es_oferta" label="Ofertas especiales" icon={LocalOffer}>
                    <Controller
                        name="es_oferta"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Chip
                                icon={<LocalOffer />}
                                label="Solo ofertas"
                                clickable
                                onClick={() => onChange(!value)}
                                variant={value ? 'filled' : 'outlined'}
                                sx={{
                                    borderRadius: 3,
                                    height: 40,
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    ...(value ? {
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
                        )}
                    />
                </FilterField>
            </Stack>
        </Paper>
    );
};

export default ProductFilters;