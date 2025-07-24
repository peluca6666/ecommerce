import { useState, useEffect } from 'react';
import { Card, Tabs, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Componentes modularizados
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileInfoTab from '../../components/Profile/ProfileInfoTab';
import SecurityTab from '../../components/Profile/SecurityTab';
import PurchaseHistoryTab from '../../components/Profile/PurchaseHistoryTab';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { TabPane } = Tabs;

const ProfilePage = () => {
  const { user, getToken, showNotification } = useAuth();
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        showNotification('Error al cargar el perfil', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchProfile();
  }, [user, getToken, showNotification]);

  // Callback para actualizar el perfil desde el componente hijo
  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ 
      maxWidth: 1400, 
      margin: '0 auto', 
      padding: '24px',
      height: 'calc(100vh - 48px)', // Ajustar según tu header de navegación
      overflow: 'hidden'
    }}>
      <Row gutter={24} style={{ height: '100%' }}>
        {/* Columna izquierda - Header del perfil */}
        <Col xs={24} lg={8} xl={6} style={{ height: '100%' }}>
          <ProfileHeader profileData={profileData} />
        </Col>

        {/* Columna derecha - Tabs principales */}
        <Col xs={24} lg={16} xl={18} style={{ height: '100%' }}>
          <Card style={{ 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Tabs 
              defaultActiveKey="1" 
              size="large"
              style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
              tabBarStyle={{ 
                marginBottom: 24,
                borderBottom: '2px solid #f0f0f0'
              }}
            >
              <TabPane 
                tab={<span style={{ fontSize: 16 }}><UserOutlined /> Mi Perfil</span>} 
                key="1"
                style={{ 
                  flex: 1,
                  overflow: 'auto',
                  paddingRight: '8px'
                }}
              >
                <ProfileInfoTab 
                  profileData={profileData}
                  onProfileUpdate={handleProfileUpdate}
                />
              </TabPane>

              <TabPane 
                tab={<span style={{ fontSize: 16 }}><LockOutlined /> Seguridad</span>} 
                key="2"
                style={{ 
                  flex: 1,
                  overflow: 'auto',
                  paddingRight: '8px'
                }}
              >
                <SecurityTab />
              </TabPane>

              <TabPane 
                tab={<span style={{ fontSize: 16 }}><ShoppingOutlined /> Mis Compras</span>} 
                key="3"
                style={{ 
                  flex: 1,
                  overflow: 'auto',
                  paddingRight: '8px'
                }}
              >
                <PurchaseHistoryTab />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;