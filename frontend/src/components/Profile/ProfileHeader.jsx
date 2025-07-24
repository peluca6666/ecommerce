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
    <Card style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Avatar 
        size={80} 
        style={{ 
          backgroundColor: '#FF6B35', 
          marginBottom: 20, 
          fontSize: '2rem',
          alignSelf: 'center'
        }}
      >
        {profileData.nombre?.[0]?.toUpperCase() || 'U'}
      </Avatar>
      
      <Title level={3} style={{ marginBottom: 8, fontSize: '1.5rem' }}>
        ¡Hola, {profileData.nombre || 'Usuario'}! 👋
      </Title>
      
      <Text type="secondary" style={{ fontSize: 14, marginBottom: 24 }}>
        Gestioná tu cuenta desde acá
      </Text>
      
      <div style={{ marginTop: 'auto' }}>
        <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
          Tu perfil está {completeness}% completo
        </Text>
        <Progress 
          percent={completeness} 
          strokeColor="#FF6B35"
          size="small"
        />
      </div>
    </Card>
  );
};

export default ProfileHeader;