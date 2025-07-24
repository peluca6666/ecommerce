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
  const isMobile = window.innerWidth < 768;

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
      <div style={{ 
        height: isMobile ? 'auto' : '100%', 
        overflow: isMobile ? 'visible' : 'auto',
        padding: isMobile ? '12px 0' : '20px 0'
      }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSaveProfile}
          size={isMobile ? "middle" : "large"}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="nombre" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>Nombre</span>}
                rules={[{ required: true, message: 'Por favor ingresá tu nombre' }]}
              >
                <Input 
                  placeholder="Juan" 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="apellido" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>Apellido</span>}
                rules={[{ required: true, message: 'Por favor ingresá tu apellido' }]}
              >
                <Input 
                  placeholder="Pérez" 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="email" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>Email</span>}
              >
                <Input 
                  disabled 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="dni" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>DNI</span>}
              >
                <Input 
                  placeholder="12345678" 
                  maxLength={8} 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="telefono" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>Teléfono</span>}
              >
                <Input 
                  placeholder="1123456789" 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Divider style={{ 
                fontSize: isMobile ? 14 : 16, 
                margin: isMobile ? '16px 0' : '24px 0',
                fontWeight: '500'
              }}>
                Dirección de envío
              </Divider>
            </Col>
            <Col xs={24}>
              <Form.Item 
                name="direccion" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>Dirección</span>}
              >
                <Input 
                  placeholder="Av. Corrientes 1234, 5° B" 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item 
                name="localidad" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>Localidad</span>}
              >
                <Input 
                  placeholder="CABA" 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item 
                name="provincia" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>Provincia</span>}
              >
                <Input 
                  placeholder="Buenos Aires" 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item 
                name="codigo_postal" 
                label={<span style={{ fontSize: isMobile ? 14 : 16 }}>Código Postal</span>}
              >
                <Input 
                  placeholder="1234" 
                  maxLength={4} 
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Space 
            direction={isMobile ? "vertical" : "horizontal"}
            size={isMobile ? "small" : "middle"}
            style={{ 
              marginTop: isMobile ? 16 : 24,
              width: isMobile ? '100%' : 'auto'
            }}
          >
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              size={isMobile ? "middle" : "large"}
              style={{ 
                minWidth: isMobile ? '100%' : 150,
                borderRadius: '6px'
              }}
            >
              Guardar cambios
            </Button>
            <Button 
              onClick={() => setIsEditing(false)}
              size={isMobile ? "middle" : "large"}
              style={{ 
                minWidth: isMobile ? '100%' : 'auto',
                borderRadius: '6px'
              }}
            >
              Cancelar
            </Button>
          </Space>
        </Form>
      </div>
    );
  }

  // Vista de solo lectura responsiva
  return (
    <div style={{ 
      padding: isMobile ? '12px 0' : '20px 0', 
      height: isMobile ? 'auto' : '100%' 
    }}>
      <Button 
        type="primary" 
        icon={<EditOutlined />} 
        onClick={handleEdit}
        size={isMobile ? "middle" : "large"}
        style={{ 
          marginBottom: isMobile ? 20 : 32,
          borderRadius: '6px',
          width: isMobile ? '100%' : 'auto'
        }}
      >
        Editar perfil
      </Button>
      
      <Row gutter={[12, 12]}>
        {[
          { 
            label: 'Nombre completo', 
            value: `${profileData.nombre || ''} ${profileData.apellido || ''}`.trim(), 
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
            icon: <UserOutlined />,
            fullWidth: true
          }
        ].map((item, i) => (
          <Col 
            xs={24} 
            sm={item.fullWidth ? 24 : 12} 
            key={i}
          >
            <Card 
              size="small" 
              style={{ 
                height: isMobile ? 'auto' : '100%',
                minHeight: isMobile ? '70px' : '80px',
                cursor: 'default',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              hoverable
              bodyStyle={{ 
                padding: isMobile ? '12px' : '16px',
                display: 'flex',
                alignItems: 'center',
                minHeight: isMobile ? '58px' : '68px'
              }}
            >
              <Space 
                direction="vertical" 
                size={isMobile ? 2 : 4} 
                style={{ width: '100%' }}
              >
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: isMobile ? 12 : 13,
                    lineHeight: 1.2
                  }}
                >
                  {item.label}
                </Text>
                <Text 
                  strong 
                  style={{ 
                    fontSize: isMobile ? 14 : 15,
                    lineHeight: 1.3,
                    wordBreak: 'break-word'
                  }}
                >
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