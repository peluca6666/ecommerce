import { Avatar, Card, Progress, Typography } from 'antd';

const { Title, Text } = Typography;

const ProfileHeader = ({ profileData }) => {
  const isMobile = window.innerWidth < 768;

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
      height: isMobile ? 'auto' : '100%',
      minHeight: isMobile ? '200px' : '400px',
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: isMobile ? 'flex-start' : 'center',
      textAlign: 'center',
      padding: isMobile ? '16px' : '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: isMobile ? '8px' : '12px'
    }}>
      <Avatar 
        size={isMobile ? 60 : 80} 
        style={{ 
          backgroundColor: '#FF6B35', 
          marginBottom: isMobile ? 12 : 20, 
          fontSize: isMobile ? '1.5rem' : '2rem',
          alignSelf: 'center'
        }}
      >
        {profileData.nombre?.[0]?.toUpperCase() || 'U'}
      </Avatar>
      
      <Title 
        level={isMobile ? 4 : 3} 
        style={{ 
          marginBottom: isMobile ? 4 : 8, 
          fontSize: isMobile ? '18px' : '24px',
          lineHeight: isMobile ? '24px' : '32px'
        }}
      >
        ¡Hola, {profileData.nombre || 'Usuario'}! 👋
      </Title>
      
      <Text 
        type="secondary" 
        style={{ 
          fontSize: isMobile ? 12 : 14, 
          marginBottom: isMobile ? 16 : 24,
          display: 'block'
        }}
      >
        Gestioná tu cuenta desde acá
      </Text>
      
      <div style={{ 
        marginTop: isMobile ? 'auto' : 'auto',
        width: '100%'
      }}>
        <Text 
          strong 
          style={{ 
            fontSize: isMobile ? 12 : 14, 
            display: 'block', 
            marginBottom: isMobile ? 6 : 8 
          }}
        >
          Tu perfil está {completeness}% completo
        </Text>
        <Progress 
          percent={completeness} 
          strokeColor="#FF6B35"
          size={isMobile ? "small" : "small"}
          strokeWidth={isMobile ? 6 : 8}
        />
      </div>
    </Card>
  );
};

export default ProfileHeader;