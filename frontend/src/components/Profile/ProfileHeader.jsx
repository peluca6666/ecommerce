import { Avatar, Card, Progress, Typography } from 'antd';

const { Title, Text } = Typography;

const ProfileHeader = ({ profileData }) => {
  // Calcular completitud del perfil
  const calculateCompleteness = () => {
    const fields = ['nombre', 'apellido', 'dni', 'telefono', 'direccion', 'localidad', 'provincia', 'codigo_postal'];
    const filledFields = fields.filter(field => profileData[field]);
    const percentage = Math.round((filledFields.length / fields.length) * 100);
    return Math.min(percentage, 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <Avatar 
        size={100} 
        style={{ backgroundColor: '#FF6B35', marginBottom: 24, fontSize: '2.5rem' }}
      >
        {profileData.nombre?.[0]?.toUpperCase() || 'U'}
      </Avatar>
      
      <Title level={2} style={{ marginBottom: 8 }}>
        ¡Hola, {profileData.nombre || 'Usuario'}! 👋
      </Title>
      
      <Text type="secondary" style={{ fontSize: 16 }}>
        Gestioná tu cuenta desde acá
      </Text>
      
      <Card style={{ maxWidth: 500, margin: '32px auto', padding: '8px 16px' }}>
        <Text strong style={{ fontSize: 16 }}>
          Tu perfil está {completeness}% completo
        </Text>
        <Progress 
          percent={completeness} 
          strokeColor="#FF6B35" 
          style={{ marginTop: 8 }} 
        />
      </Card>
    </div>
  );
};

export default ProfileHeader;