import { useState, useEffect } from 'react';
import { Typography, Empty } from 'antd';
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
    const isMobile = window.innerWidth < 768;

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
    
    if (error) {
        return (
            <div style={{ 
                padding: isMobile ? '16px 0' : '24px 0',
                textAlign: 'center' 
            }}>
                <Text type="danger" style={{ fontSize: isMobile ? 14 : 16 }}>
                    {error}
                </Text>
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: isMobile ? '12px 0' : '24px 0',
            minHeight: isMobile ? 'auto' : '500px'
        }}>
            <Title 
                level={isMobile ? 5 : 4} 
                style={{ 
                    marginBottom: isMobile ? 16 : 24,
                    fontSize: isMobile ? '16px' : '20px',
                    fontWeight: '600'
                }}
            >
                Mi Historial de Compras
            </Title>
            
            <div style={{
                flex: 1,
                maxHeight: isMobile ? 'none' : '600px',
                overflowY: isMobile ? 'visible' : 'auto',
                paddingRight: isMobile ? 0 : '8px'
            }}>
                {ordenes.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isMobile ? '8px' : '12px'
                    }}>
                        {ordenes.map(orden => (
                            <OrderItem key={orden.venta_id} orden={orden} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: isMobile ? '200px' : '300px'
                    }}>
                        <Empty
                            description={
                                <Text style={{ 
                                    fontSize: isMobile ? 14 : 16,
                                    color: '#999'
                                }}>
                                    Aún no has realizado ninguna compra
                                </Text>
                            }
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseHistoryTab;