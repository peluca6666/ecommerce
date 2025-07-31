import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

const LoginForm = ({ formulario, errores, isLoading, handleChange, handleSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationSuccess } = location.state || {};
  const isMobile = window.innerWidth < 768;

  const handleGoToRegister = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate('/register'), 300);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/forgot-password');
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
            Iniciar Sesión
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
            Accedé a tu cuenta para continuar comprando
          </Text>
        </div>

        {/* Alerts consistentes */}
        {registrationSuccess && (
          <Alert
            message="¡Registro exitoso!"
            description="Por favor, iniciá sesión para continuar"
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
            style={{ 
              marginBottom: isMobile ? 16 : 24, 
              borderRadius: '6px',
              fontSize: isMobile ? 12 : 14
            }}
          />
        )}

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

        {/* Form consistente */}
        <Form 
          layout="vertical" 
          onFinish={handleSubmit}
          style={{ marginTop: isMobile ? 20 : 32 }}
          size={isMobile ? "middle" : "large"}
        >
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
              prefix={<UserOutlined />}
              value={formulario.email}
              onChange={(e) => handleChange({ target: { name: 'email', value: e.target.value } })}
              size={isMobile ? "middle" : "large"}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item 
            name="password" 
            label={
              <span style={{ fontSize: isMobile ? 14 : 16 }}>
                Contraseña
              </span>
            }
            rules={[
              { required: true, message: 'Por favor ingresá tu contraseña' }
            ]}
          >
            <Input.Password 
              placeholder="Tu contraseña"
              prefix={<LockOutlined />}
              value={formulario.contrasenia}
              onChange={(e) => handleChange({ target: { name: 'contrasenia', value: e.target.value } })}
              size={isMobile ? "middle" : "large"}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

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
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </Form>

        {/* Links consistentes */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 12 }}>
            <Button 
              type="link" 
              onClick={handleForgotPassword}
              style={{ color: '#FF6B35', fontSize: isMobile ? 14 : 16 }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
              ¿No tenés cuenta?
            </Text>
            <Button 
              type="link" 
              onClick={handleGoToRegister}
              style={{ color: '#FF6B35', fontSize: isMobile ? 14 : 16, padding: 0 }}
            >
              Regístrate acá
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;