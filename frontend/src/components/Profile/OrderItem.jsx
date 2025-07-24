import { Card, Typography, Button, Tag, Row, Col, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
 
const { Text } = Typography;

const OrderItem = ({ orden }) => {
    const isMobile = window.innerWidth < 768;

    // devuelve un color para el tag según el estado de la orden
    const getStatusTagColor = (estado) => {
        if (estado === 'Completado') return 'success';
        if (estado === 'Pendiente') return 'warning';
        if (estado === 'Cancelado') return 'error';
        return 'default';
    };

    // Layout móvil
    if (isMobile) {
        return (
            <Card 
                size="small"
                style={{ 
                    marginBottom: 12,
                    borderRadius: '8px'
                }}
            >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {/* Header con número de orden */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <Text strong style={{ fontSize: 14 }}>
                            Orden #{orden.venta_id}
                        </Text>
                        <Tag 
                            color={getStatusTagColor(orden.estado)}
                            size="small"
                        >
                            {orden.estado || 'Desconocido'}
                        </Tag>
                    </div>

                    {/* Fecha */}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(orden.fecha_venta).toLocaleDateString('es-AR')}
                    </Text>

                    {/* Footer con precio y botón */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginTop: '12px',
                        paddingTop: '8px',
                        borderTop: '1px solid #f0f0f0'
                    }}>
                        <Text strong style={{ fontSize: 16, color: '#FF6B35' }}>
                            ${orden.total.toFixed(2)}
                        </Text>
                        <Button
                            type="primary"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => window.location.href = `/orden-confirmada/${orden.venta_id}`}
                        >
                            Ver
                        </Button>
                    </div>
                </Space>
            </Card>
        );
    }

    // Layout desktop (original mejorado)
    return (
        <Card 
            size="small"
            style={{ 
                marginBottom: 16,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
            }}
            hoverable
            onClick={() => window.location.href = `/orden-confirmada/${orden.venta_id}`}
        >
            <Row justify="space-between" align="middle">
                <Col flex="auto">
                    <Space direction="vertical" size="small">
                        <Text strong style={{ fontSize: 16 }}>
                            Orden #{orden.venta_id}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 14 }}>
                            Fecha: {new Date(orden.fecha_venta).toLocaleDateString('es-AR')}
                        </Text>
                        <Tag 
                            color={getStatusTagColor(orden.estado)}
                            style={{ marginTop: 4 }}
                        >
                            {orden.estado || 'Desconocido'}
                        </Tag>
                    </Space>
                </Col>
                
                <Col flex="none" style={{ textAlign: 'right', paddingLeft: 24 }}>
                    <Space direction="vertical" size="small" align="end">
                        <Text strong style={{ fontSize: 18, color: '#FF6B35' }}>
                            ${orden.total.toFixed(2)}
                        </Text>
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            style={{ padding: 0 }}
                        >
                            Ver Detalles
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default OrderItem;