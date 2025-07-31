import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RegistroForm = ({ formulario, errores, isLoading, onChange, onSubmit, mensajeExito }) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const handleGoToLogin = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate('/login'), 300);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      padding: isMobile ? '16px' : '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <Card style={{ 
        width: '100%',
        maxWidth: isMobile ? '100%' : 600,
        padding: isMobile ? 12 : 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: isMobile ? '8px' : '12px'
      }}>
        {/* Header consistente */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 32 }}>
          <UserOutlined style={{ 
            fontSize: isMobile ? '32px' : '40px', 
            color: '#FF6B35', 
            marginBottom: 16 
          }} />
          <Title 
            level={isMobile ? 4 : 3} 
            style={{ 
              marginBottom: isMobile ? 16 : 8,
              fontSize: isMobile ? '18px' : '24px'
            }}
          >
            Crear cuenta
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
            Unite para disfrutar de ofertas exclusivas
          </Text>
        </div>

        {/* Alerts consistentes */}
        {errores.general && (
          <Alert
            message="Error"
            description={errores.general}
            type="error"
            showIcon
            style={{ 
              marginBottom: isMobile ? 16 : 24, 
              borderRadius: '6px',
              fontSize: isMobile ? 12 : 14
            }}
          />
        )}
        
        {mensajeExito && (
          <Alert
            message="¡Registro exitoso!"
            description={mensajeExito}
            type="success"
            showIcon
            style={{ 
              marginBottom: isMobile ? 16 : 24, 
              borderRadius: '6px',
              fontSize: isMobile ? 12 : 14
            }}
          />
        )}

        {/* Form consistente */}
        <Form 
          layout="vertical" 
          onFinish={onSubmit}
          style={{ marginTop: isMobile ? 20 : 32 }}
          size={isMobile ? "middle" : "large"}
        >
          {/* Campos Nombre y Apellido en fila */}
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? 8 : 16,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Form.Item 
              name="nombre" 
              label={
                <span style={{ fontSize: isMobile ? 14 : 16 }}>
                  Nombre
                </span>
              }
              style={{ flex: 1, marginBottom: isMobile ? 16 : 24 }}
              rules={[
                { required: true, message: 'Por favor ingresá tu nombre' }
              ]}
            >
              <Input 
                placeholder="Juan"
                prefix={<UserOutlined />}
                value={formulario.nombre}
                onChange={(e) => onChange({ target: { name: 'nombre', value: e.target.value } })}
                size={isMobile ? "middle" : "large"}
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>

            <Form.Item 
              name="apellido" 
              label={
                <span style={{ fontSize: isMobile ? 14 : 16 }}>
                  Apellido
                </span>
              }
              style={{ flex: 1, marginBottom: isMobile ? 16 : 24 }}
              rules={[
                { required: true, message: 'Por favor ingresá tu apellido' }
              ]}
            >
              <Input 
                placeholder="Pérez"
                prefix={<UserOutlined />}
                value={formulario.apellido}
                onChange={(e) => onChange({ target: { name: 'apellido', value: e.target.value } })}
                size={isMobile ? "middle" : "large"}
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>
          </div>

          {/* Email */}
          <Form.Item 
            name="email" 
            label={
              <span style={{ fontSize: isMobile ? 14 : 16 }}>
                Email
              </span>
            }
            rules={[
              { required: true, message: 'Por favor ingresá tu email' },
              { type: 'email', message: 'Ingresá un email válido' }
            ]}
          >
            <Input 
              placeholder="tu-email@ejemplo.com"
              prefix={<MailOutlined />}
              value={formulario.email}
              onChange={(e) => onChange({ target: { name: 'email', value: e.target.value } })}
              size={isMobile ? "middle" : "large"}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          {/* Contraseña */}
          <Form.Item 
            name="contrasenia" 
            label={
              <span style={{ fontSize: isMobile ? 14 : 16 }}>
                Contraseña
              </span>
            }
            rules={[
              { required: true, message: 'Por favor ingresá una contraseña' },
              { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
            ]}
          >
            <Input.Password 
              placeholder="••••••••"
              prefix={<LockOutlined />}
              value={formulario.contrasenia}
              onChange={(e) => onChange({ target: { name: 'contrasenia', value: e.target.value } })}
              size={isMobile ? "middle" : "large"}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          {/* Confirmar Contraseña */}
          <Form.Item 
            name="confirmarContrasenia" 
            label={
              <span style={{ fontSize: isMobile ? 14 : 16 }}>
                Confirmar contraseña
              </span>
            }
            dependencies={['contrasenia']}
            rules={[
              { required: true, message: 'Por favor confirmá tu contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || formulario.contrasenia === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Las contraseñas no coinciden');
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="••••••••"
              prefix={<LockOutlined />}
              value={formulario.confirmarContrasenia}
              onChange={(e) => onChange({ target: { name: 'confirmarContrasenia', value: e.target.value } })}
              size={isMobile ? "middle" : "large"}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          {/* Info de requisitos */}
          <Alert 
            message="Requisitos de la contraseña"
            description="La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial" 
            type="info" 
            showIcon 
            style={{ 
              marginBottom: isMobile ? 16 : 24,
              fontSize: isMobile ? 12 : 14,
              borderRadius: '6px'
            }}
          />

          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            block 
            size={isMobile ? "middle" : "large"}
            style={{ 
              borderRadius: '6px',
              fontWeight: '500',
              height: isMobile ? '40px' : '48px',
              backgroundColor: '#FF6B35',
              borderColor: '#FF6B35',
              marginBottom: 16
            }}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </Form>

        {/* Link al login consistente */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
              ¿Ya tenés cuenta?
            </Text>
            <Button 
              type="link" 
              onClick={() => handleGoToLogin()}
              style={{ color: '#FF6B35', fontSize: isMobile ? 14 : 16, padding: 0 }}
            >
              Iniciá sesión
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistroForm;