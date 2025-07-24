import { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { UserOutlined, LockOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 48px' }}>
      {/* Header del perfil */}
      <ProfileHeader profileData={profileData} />

      {/* Tabs principales */}
      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Tabs defaultActiveKey="1" size="large">
          <TabPane 
            tab={<span style={{ fontSize: 16 }}><UserOutlined /> Mi Perfil</span>} 
            key="1"
          >
            <ProfileInfoTab 
              profileData={profileData}
              onProfileUpdate={handleProfileUpdate}
            />
          </TabPane>

          <TabPane 
            tab={<span style={{ fontSize: 16 }}><LockOutlined /> Seguridad</span>} 
            key="2"
          >
            <SecurityTab />
          </TabPane>

          <TabPane 
            tab={<span style={{ fontSize: 16 }}><ShoppingOutlined /> Mis Compras</span>} 
            key="3"
          >
            <PurchaseHistoryTab />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage;