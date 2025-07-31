import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isMobile = window.innerWidth < 768;

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.mensaje);
        form.resetFields();
      } else {
        setError(data.error || 'Error al enviar el correo');
      }
    } catch (error) {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
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
          <MailOutlined style={{ 
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
            ¿Olvidaste tu contraseña?
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
            Ingresá tu email y te enviaremos un enlace para resetear tu contraseña
          </Text>
        </div>

        {/* Alerts consistentes */}
        {message && (
          <Alert
            message="¡Email enviado!"
            description={message}
            type="success"
            showIcon
            style={{ 
              marginBottom: isMobile ? 16 : 24, 
              borderRadius: '6px',
              fontSize: isMobile ? 12 : 14
            }}
          />
        )}

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

        {/* Form consistente */}
        <Form 
          form={form} 
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
              prefix={<MailOutlined />}
              size={isMobile ? "middle" : "large"}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
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
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Button>
        </Form>

        {/* Footer consistente */}
        <div style={{ textAlign: 'center' }}>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />}
            style={{ color: '#666' }}
          >
            <RouterLink to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
              Volver al login
            </RouterLink>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;