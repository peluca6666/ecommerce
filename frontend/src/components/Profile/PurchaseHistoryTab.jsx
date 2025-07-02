import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import OrderItem from './OrderItem';

const PurchaseHistoryTab = () => {
    const { getToken } = useAuth();
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // traemos el historial de compras cuando se monta el componente
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ventas/historial`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && response.data.exito) {
                    setOrdenes(response.data.datos || []);
                } else {
                    // la api devolvió error o no hubo éxito
                    setError("Hubo un problema al cargar tu historial.");
                }

            } catch (err) {
                console.error("error al cargar el historial:", err);
                setError("No se pudo cargar tu historial de compras.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [getToken]);

    if (loading) return <LoadingSpinner />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Mi Historial de Compras</Typography>
            {ordenes.length > 0 ? (
                ordenes.map(orden => <OrderItem key={orden.venta_id} orden={orden} />)
            ) : (
                <Typography>Aún no has realizado ninguna compra.</Typography>
            )}
        </Box>
    );
};

export default PurchaseHistoryTab;
