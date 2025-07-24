import { useState, useEffect } from 'react';
import { Card, Tabs, Row, Col, Drawer, Button } from 'antd';
import { UserOutlined, LockOutlined, ShoppingOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileInfoTab from '../../components/Profile/ProfileInfoTab';
import SecurityTab from '../../components/Profile/SecurityTab';
import PurchaseHistoryTab from '../../components/Profile/PurchaseHistoryTab';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, getToken, showNotification } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [activeTab, setActiveTab] = useState('1');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar cambios de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setDrawerVisible(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manejar tab activo desde navegación externa
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab.toString());
    }
  }, [location.state]);

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

  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (isMobile) setDrawerVisible(false);
  };

  if (loading) return <LoadingSpinner />;

  const tabItems = [
    {
      key: '1',
      label: <><UserOutlined /> {isMobile ? 'Perfil' : 'Mi Perfil'}</>,
      children: <ProfileInfoTab profileData={profileData} onProfileUpdate={handleProfileUpdate} />
    },
    {
      key: '2', 
      label: <><LockOutlined /> Seguridad</>,
      children: <SecurityTab />
    },
    {
      key: '3',
      label: <><ShoppingOutlined /> {isMobile ? 'Compras' : 'Mis Compras'}</>,
      children: <PurchaseHistoryTab />
    }
  ];

  // Layout móvil
  if (isMobile) {
    return (
      <div style={{ padding: '16px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Header móvil */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          padding: '0 4px'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Mi Cuenta</h2>
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            size="large"
          >
            Perfil
          </Button>
        </div>

        {/* Drawer con ProfileHeader */}
        <Drawer
          title="Mi Perfil"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width="85%"
          styles={{ body: { padding: '16px' } }}
        >
          <ProfileHeader profileData={profileData} />
        </Drawer>

        {/* Tabs principales */}
        <Card style={{ borderRadius: '12px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            size="large"
            tabPosition="top"
            tabBarStyle={{ marginBottom: '20px' }}
          />
        </Card>
      </div>
    );
  }

  // Layout desktop
  return (
    <div style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: '24px',
      minHeight: '100vh',
    }}>
      <Row gutter={[24, 24]} style={{ minHeight: 'calc(100vh - 48px)' }}>
        {/* Sidebar izquierdo */}
        <Col xs={0} sm={0} md={8} lg={8} xl={6}>
          <div style={{ position: 'sticky', top: '24px' }}>
            <ProfileHeader profileData={profileData} />
          </div>
        </Col>

        {/* Contenido principal */}
        <Col xs={24} sm={24} md={16} lg={16} xl={18}>
          <Card style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            minHeight: '600px'
          }}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
              size="large"
              tabBarStyle={{
                marginBottom: 24,
                borderBottom: '2px solid #f0f0f0'
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;