import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isMobile = window.innerWidth < 768;

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          nuevaContrasenia: values.nuevaContrasenia 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || 'Error al resetear la contraseña');
      }
    } catch (error) {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito (misma estructura)
  if (success) {
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
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderRadius: isMobile ? '8px' : '12px'
        }}>
          <CheckCircleOutlined style={{ 
            fontSize: isMobile ? '48px' : '64px', 
            color: '#52c41a', 
            marginBottom: 16 
          }} />
          <Title 
            level={isMobile ? 4 : 3}
            style={{ 
              color: '#52c41a', 
              marginBottom: 16,
              fontSize: isMobile ? '18px' : '24px'
            }}
          >
            ¡Contraseña reseteada exitosamente!
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
            Redirigiendo al login...
          </Text>
        </Card>
      </div>
    );
  }

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
        {/* Header consistente con ForgotPasswordPage */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 32 }}>
          <LockOutlined style={{ 
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
            Nueva Contraseña
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
            Ingresá tu nueva contraseña
          </Text>
        </div>

        {/* Alert consistente */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ 
              marginBottom: isMobile ? 16 : 24, 
              borderRadius: '6px',
              fontSize: isMobile ? 12 : 14
            }}
          />
        )}

        {/* Form idéntico al SecurityTab */}
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          style={{ marginTop: isMobile ? 20 : 32 }}
          size={isMobile ? "middle" : "large"}
        >
          <Form.Item 
            name="nuevaContrasenia" 
            label={
              <span style={{ fontSize: isMobile ? 14 : 16 }}>
                Nueva contraseña
              </span>
            }
            rules={[
              { required: true, message: 'Por favor ingresá una nueva contraseña' },
              { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
            ]}
          >
            <Input.Password 
              placeholder="••••••••" 
              size={isMobile ? "middle" : "large"}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>
          
          <Form.Item 
            name="confirmarContrasenia" 
            label={
              <span style={{ fontSize: isMobile ? 14 : 16 }}>
                Confirmar nueva contraseña
              </span>
            }
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
            <Input.Password 
              placeholder="••••••••" 
              size={isMobile ? "middle" : "large"}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          {/* Alert info idéntico al SecurityTab */}
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
            loading={loading}
            block 
            size={isMobile ? "middle" : "large"}
            style={{ 
              borderRadius: '6px',
              fontWeight: '500',
              height: isMobile ? '40px' : '48px'
            }}
          >
            {loading ? 'Reseteando...' : 'Actualizar contraseña'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;