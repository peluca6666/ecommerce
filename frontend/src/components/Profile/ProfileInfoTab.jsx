import { useState } from 'react';
import { Form, Input, Button, Row, Col, Card, Space, Typography, Divider } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const { Text } = Typography;

const ProfileInfoTab = ({ profileData, onProfileUpdate }) => {
  const { getToken, showNotification } = useAuth();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  // Inicializar formulario cuando cambia profileData o isEditing
  useState(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      form.setFieldsValue(profileData);
    }
  }, [profileData, isEditing]);

  // Guardar perfil
  const handleSaveProfile = async (values) => {
    try {
      const token = getToken();
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showNotification('¡Perfil actualizado exitosamente! 🎉', 'success');
      onProfileUpdate(values);
      setIsEditing(false);
    } catch (error) {
      showNotification('Error al guardar el perfil', 'error');
    }
  };

  const handleEdit = () => {
    form.setFieldsValue(profileData);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSaveProfile}
        size="large"
        style={{ padding: '20px 0' }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item 
              name="nombre" 
              label="Nombre" 
              rules={[{ required: true, message: 'Por favor ingresá tu nombre' }]}
            >
              <Input placeholder="Juan" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item 
              name="apellido" 
              label="Apellido" 
              rules={[{ required: true, message: 'Por favor ingresá tu apellido' }]}
            >
              <Input placeholder="Pérez" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="email" label="Email">
              <Input disabled size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="dni" label="DNI">
              <Input placeholder="12345678" maxLength={8} size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="telefono" label="Teléfono">
              <Input placeholder="1123456789" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Divider style={{ fontSize: 18, margin: '32px 0' }}>
              Dirección de envío
            </Divider>
          </Col>
          <Col xs={24}>
            <Form.Item name="direccion" label="Dirección">
              <Input placeholder="Av. Corrientes 1234, 5° B" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="localidad" label="Localidad">
              <Input placeholder="CABA" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="provincia" label="Provincia">
              <Input placeholder="Buenos Aires" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="codigo_postal" label="Código Postal">
              <Input placeholder="1234" maxLength={4} size="large" />
            </Form.Item>
          </Col>
        </Row>
        
        <Space size="middle" style={{ marginTop: 24 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            size="large"
            style={{ minWidth: 150 }}
          >
            Guardar cambios
          </Button>
          <Button onClick={() => setIsEditing(false)} size="large">
            Cancelar
          </Button>
        </Space>
      </Form>
    );
  }

  // Vista de solo lectura
  return (
    <div style={{ padding: '20px 0' }}>
      <Button 
        type="primary" 
        icon={<EditOutlined />} 
        onClick={handleEdit}
        size="large"
        style={{ marginBottom: 32 }}
      >
        Editar perfil
      </Button>
      
      <Row gutter={[24, 24]}>
        {[
          { 
            label: 'Nombre completo', 
            value: `${profileData.nombre} ${profileData.apellido}`.trim(), 
            icon: <UserOutlined /> 
          },
          { 
            label: 'Email', 
            value: profileData.email, 
            icon: <UserOutlined /> 
          },
          { 
            label: 'DNI', 
            value: profileData.dni, 
            icon: <UserOutlined /> 
          },
          { 
            label: 'Teléfono', 
            value: profileData.telefono, 
            icon: <UserOutlined /> 
          },
          { 
            label: 'Dirección de envío', 
            value: [
              profileData.direccion, 
              profileData.localidad, 
              profileData.provincia, 
              profileData.codigo_postal && `CP ${profileData.codigo_postal}`
            ].filter(Boolean).join(', '),
            icon: <UserOutlined />
          }
        ].map((item, i) => (
          <Col xs={24} sm={i === 4 ? 24 : 12} key={i}>
            <Card 
              size="default" 
              style={{ height: '100%', cursor: 'default' }}
              hoverable
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  {item.label}
                </Text>
                <Text strong style={{ fontSize: 16 }}>
                  {item.value || 'No especificado'}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProfileInfoTab;