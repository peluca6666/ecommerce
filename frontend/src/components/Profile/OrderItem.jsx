import { Card, Typography, Button, Tag, Row, Col } from 'antd';
import { Link as RouterLink } from 'react-router-dom';

const { Text } = Typography;

const OrderItem = ({ orden }) => {
    // devuelve un color para el tag según el estado de la orden
    const getStatusTagColor = (estado) => {
        if (estado === 'Completado') return 'success';
        if (estado === 'Pendiente') return 'warning';
        if (estado === 'Cancelado') return 'error';
        return 'default';
    };

    return (
        <Card 
            size="small"
            style={{ 
                marginBottom: 16,
                width: '100%'
            }}
        >
            <Row justify="space-between" align="middle" wrap={false}>
                <Col flex="auto">
                    <Text strong style={{ fontSize: 16 }}>
                        Orden #{orden.venta_id}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 14 }}>
                        Fecha: {new Date(orden.fecha_venta).toLocaleDateString()}
                    </Text>
                    <br />
                    <Tag 
                        color={getStatusTagColor(orden.estado)}
                        style={{ marginTop: 8 }}
                    >
                        {orden.estado || 'Desconocido'}
                    </Tag>
                </Col>
                
                <Col flex="none" style={{ textAlign: 'right', paddingLeft: 16 }}>
                    <Text strong style={{ fontSize: 18 }}>
                        ${orden.total.toFixed(2)}
                    </Text>
                    <br />
                    <Button
                        component={RouterLink}
                        to={`/orden-confirmada/${orden.venta_id}`}
                        type="link"
                        size="small"
                        style={{ marginTop: 8, padding: 0 }}
                    >
                        Ver Detalles
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default OrderItem;