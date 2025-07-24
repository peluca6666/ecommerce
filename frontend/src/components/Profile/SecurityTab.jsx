import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const { Title } = Typography;

const SecurityTab = () => {
  const { getToken, showNotification } = useAuth();
  const [passwordForm] = Form.useForm();

  // Cambiar contraseña
  const handleChangePassword = async (values) => {
    console.log('Iniciando cambio de contraseña...');
    
    try {
      const token = getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile/change-password`,
        {
          contraseniaActual: values.contraseniaActual,
          nuevaContrasenia: values.nuevaContrasenia
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Respuesta del servidor:', response);
      
      // Resetear el formulario
      passwordForm.resetFields();
      
      // Mostrar notificación de éxito
      showNotification(
        '¡Contraseña actualizada exitosamente! 🔒 Usá tu nueva contraseña la próxima vez que inicies sesión.', 
        'success'
      );
      
    } catch (error) {
      console.error('Error completo:', error);
      
      const errorMessage = error.response?.data?.mensaje || 
                          'Error al cambiar la contraseña. Verificá tu contraseña actual.';
      
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start',
      height: '100%',
      padding: '20px 0'
    }}>
      <Card style={{ 
        width: '100%',
        maxWidth: 600,
        padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Title level={3} style={{ marginBottom: 8, textAlign: 'center' }}>
          Cambiá tu contraseña
        </Title>
        
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
    </div>
  );
};

export default SecurityTab;