import { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import OrderItem from './OrderItem';

const { Title, Text } = Typography;

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
    if (error) return <Text type="danger">{error}</Text>;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
            <Title level={4} style={{ marginBottom: 24 }}>Mi Historial de Compras</Title>
            <div style={{ flex: 1, overflow: 'auto', paddingRight: '8px' }}>
                {ordenes.length > 0 ? (
                    ordenes.map(orden => <OrderItem key={orden.venta_id} orden={orden} />)
                ) : (
                    <Text>Aún no has realizado ninguna compra.</Text>
                )}
            </div>
        </div>
    );
};

export default PurchaseHistoryTab;