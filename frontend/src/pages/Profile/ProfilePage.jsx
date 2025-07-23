import { useState, useEffect } from 'react';
import { 
  Card, Tabs, Form, Input, Button, Row, Col, Avatar, 
  Progress, Alert, Space, Typography, Divider, message, Modal 
} from 'antd';
import { 
  UserOutlined, LockOutlined, ShoppingOutlined, EditOutlined, 
  SaveOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import PurchaseHistoryTab from '../../components/Profile/PurchaseHistoryTab';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const { user, getToken } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});

  // Cargar perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfileData(data);
        form.setFieldsValue(data);
      } catch (error) {
        message.error('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  // Guardar perfil
  const handleSaveProfile = async (values) => {
    try {
      const token = getToken();
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('¡Perfil actualizado! 🎉');
      setProfileData(values);
      setIsEditing(false);
    } catch (error) {
      message.error('Error al guardar');
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (values) => {
    try {
      const token = getToken();
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile/change-password`,
        {
          contraseniaActual: values.contraseniaActual,
          nuevaContrasenia: values.nuevaContrasenia
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Mostrar modal de éxito
      Modal.success({
        title: '¡Contraseña actualizada exitosamente!',
        content: (
          <div>
            <p>Tu contraseña ha sido cambiada correctamente.</p>
            <p style={{ marginTop: 10 }}>
              <strong>Recordá:</strong> Usá tu nueva contraseña la próxima vez que inicies sesión.
            </p>
          </div>
        ),
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        okText: 'Entendido',
        okButtonProps: {
          size: 'large',
        },
        centered: true,
      });
      
      passwordForm.resetFields();
    } catch (error) {
      message.error('Verificá tu contraseña actual');
    }
  };

  // Calcular completitud
  const calculateCompleteness = () => {
    const fields = ['nombre', 'apellido', 'dni', 'telefono', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
    const filledFields = fields.filter(field => profileData[field]);
    const percentage = Math.round((filledFields.length / fields.length) * 100);
    return Math.min(percentage, 100); // Nunca más de 100%
  };
  const completeness = calculateCompleteness();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 48px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Avatar size={100} style={{ backgroundColor: '#FF6B35', marginBottom: 24, fontSize: '2.5rem' }}>
          {profileData.nombre?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Title level={2} style={{ marginBottom: 8 }}>¡Hola, {profileData.nombre || 'Usuario'}! 👋</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>Gestioná tu cuenta desde acá</Text>
        
        <Card style={{ maxWidth: 500, margin: '32px auto', padding: '8px 16px' }}>
          <Text strong style={{ fontSize: 16 }}>Tu perfil está {completeness}% completo</Text>
          <Progress percent={completeness} strokeColor="#FF6B35" style={{ marginTop: 8 }} />
        </Card>
      </div>

      {/* Tabs */}
      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab={<span style={{ fontSize: 16 }}><UserOutlined /> Mi Perfil</span>} key="1">
            {isEditing ? (
              <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleSaveProfile}
                size="large"
                style={{ padding: '20px 0' }}
              >
                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingresá tu nombre' }]}>
                      <Input placeholder="Juan" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="apellido" label="Apellido" rules={[{ required: true, message: 'Por favor ingresá tu apellido' }]}>
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
                    <Divider style={{ fontSize: 18, margin: '32px 0' }}>Dirección de envío</Divider>
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
            ) : (
              <div style={{ padding: '20px 0' }}>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={() => setIsEditing(true)}
                  size="large"
                  style={{ marginBottom: 32 }}
                >
                  Editar perfil
                </Button>
                
                <Row gutter={[24, 24]}>
                  {[
                    { label: 'Nombre completo', value: `${profileData.nombre} ${profileData.apellido}`.trim(), icon: <UserOutlined /> },
                    { label: 'Email', value: profileData.email, icon: <UserOutlined /> },
                    { label: 'DNI', value: profileData.dni, icon: <UserOutlined /> },
                    { label: 'Teléfono', value: profileData.telefono, icon: <UserOutlined /> },
                    { 
                      label: 'Dirección de envío', 
                      value: [profileData.direccion, profileData.localidad, profileData.provincia, profileData.codigo_postal && `CP ${profileData.codigo_postal}`]
                        .filter(Boolean).join(', '),
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
                          <Text type="secondary" style={{ fontSize: 14 }}>{item.label}</Text>
                          <Text strong style={{ fontSize: 16 }}>{item.value || 'No especificado'}</Text>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </TabPane>

          <TabPane tab={<span style={{ fontSize: 16 }}><LockOutlined /> Seguridad</span>} key="2">
            <Card style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
              <Title level={3} style={{ marginBottom: 8 }}>Cambiá tu contraseña</Title>
              
              <Form 
                form={passwordForm} 
                layout="vertical" 
                onFinish={handleChangePassword} 
                style={{ marginTop: 32 }}
                size="large"
              >
                <Form.Item 
                  name="contraseniaActual" 
                  label={<span style={{ fontSize: 16 }}>Contraseña actual</span>} 
                  rules={[{ required: true, message: 'Por favor ingresá tu contraseña actual' }]}
                >
                  <Input.Password placeholder="••••••••" size="large" />
                </Form.Item>
                <Form.Item 
                  name="nuevaContrasenia" 
                  label={<span style={{ fontSize: 16 }}>Nueva contraseña</span>}
                  rules={[
                    { required: true, message: 'Por favor ingresá una nueva contraseña' },
                    { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
                  ]}
                >
                  <Input.Password placeholder="••••••••" size="large" />
                </Form.Item>
                <Form.Item 
                  name="confirmarContrasenia" 
                  label={<span style={{ fontSize: 16 }}>Confirmar nueva contraseña</span>}
                  dependencies={['nuevaContrasenia']}
                  rules={[
                    { required: true, message: 'Por favor confirmá tu nueva contraseña' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('nuevaContrasenia') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Las contraseñas no coinciden');
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="••••••••" size="large" />
                </Form.Item>
                
                <Alert 
                  message="Requisitos de la contraseña"
                  description="La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial" 
                  type="info" 
                  showIcon 
                  style={{ marginBottom: 24 }}
                />
                
                <Button type="primary" htmlType="submit" block size="large">
                  Actualizar contraseña
                </Button>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab={<span style={{ fontSize: 16 }}><ShoppingOutlined /> Mis Compras</span>} key="3">
            <PurchaseHistoryTab />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage;