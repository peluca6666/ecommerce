import { useState, useEffect } from 'react';
import { 
  Card, Tabs, Form, Input, Button, Row, Col, Avatar, 
  Progress, Alert, Space, Typography, Divider, message 
} from 'antd';
import { 
  UserOutlined, LockOutlined, ShoppingOutlined, EditOutlined, 
  SaveOutlined, EyeInvisibleOutlined, EyeTwoTone 
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
      message.success('¡Contraseña actualizada! 🔒');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Verificá tu contraseña actual');
    }
  };

  // Calcular completitud
  const completeness = Math.round(
    (Object.values(profileData).filter(v => v).length / 9) * 100
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Avatar size={80} style={{ backgroundColor: '#FF6B35', marginBottom: 16 }}>
          {profileData.nombre?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Title level={2}>¡Hola, {profileData.nombre || 'Usuario'}! 👋</Title>
        <Text type="secondary">Gestioná tu cuenta desde acá</Text>
        
        <Card style={{ maxWidth: 400, margin: '24px auto' }}>
          <Text strong>Tu perfil está {completeness}% completo</Text>
          <Progress percent={completeness} strokeColor="#FF6B35" />
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><UserOutlined /> Mi Perfil</span>} key="1">
            {isEditing ? (
              <Form form={form} layout="vertical" onFinish={handleSaveProfile}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
                      <Input placeholder="Juan" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="apellido" label="Apellido" rules={[{ required: true }]}>
                      <Input placeholder="Pérez" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="email" label="Email">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="dni" label="DNI">
                      <Input placeholder="12345678" maxLength={8} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="telefono" label="Teléfono">
                      <Input placeholder="1123456789" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Divider>Dirección de envío</Divider>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="direccion" label="Dirección">
                      <Input placeholder="Av. Corrientes 1234" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item name="localidad" label="Localidad">
                      <Input placeholder="CABA" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item name="provincia" label="Provincia">
                      <Input placeholder="Buenos Aires" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item name="codigo_postal" label="CP">
                      <Input placeholder="1234" maxLength={4} />
                    </Form.Item>
                  </Col>
                </Row>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Guardar cambios
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
                </Space>
              </Form>
            ) : (
              <>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={() => setIsEditing(true)}
                  style={{ marginBottom: 24 }}
                >
                  Editar perfil
                </Button>
                
                <Row gutter={[16, 16]}>
                  {[
                    { label: 'Nombre completo', value: `${profileData.nombre} ${profileData.apellido}`.trim() },
                    { label: 'Email', value: profileData.email },
                    { label: 'DNI', value: profileData.dni },
                    { label: 'Teléfono', value: profileData.telefono },
                    { 
                      label: 'Dirección', 
                      value: [profileData.direccion, profileData.localidad, profileData.provincia, profileData.codigo_postal]
                        .filter(Boolean).join(', ') 
                    }
                  ].map((item, i) => (
                    <Col xs={24} sm={i === 4 ? 24 : 12} key={i}>
                      <Card size="small">
                        <Text type="secondary">{item.label}</Text>
                        <br />
                        <Text strong>{item.value || 'No especificado'}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </TabPane>

          <TabPane tab={<span><LockOutlined /> Seguridad</span>} key="2">
            <Card style={{ maxWidth: 500, margin: '0 auto' }}>
              <Title level={4}>Cambiá tu contraseña</Title>
              <Text type="secondary">Te recomendamos cambiarla cada 3 meses</Text>
              
              <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: 24 }}>
                <Form.Item name="contraseniaActual" label="Contraseña actual" rules={[{ required: true }]}>
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
                <Form.Item 
                  name="nuevaContrasenia" 
                  label="Nueva contraseña" 
                  rules={[
                    { required: true },
                    { min: 8, message: 'Mínimo 8 caracteres' }
                  ]}
                >
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
                <Form.Item 
                  name="confirmarContrasenia" 
                  label="Confirmar contraseña"
                  dependencies={['nuevaContrasenia']}
                  rules={[
                    { required: true },
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
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
                
                <Alert 
                  message="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número" 
                  type="info" 
                  showIcon 
                  style={{ marginBottom: 16 }}
                />
                
                <Button type="primary" htmlType="submit" block>
                  Actualizar contraseña
                </Button>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab={<span><ShoppingOutlined /> Mis Compras</span>} key="3">
            <PurchaseHistoryTab />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage;