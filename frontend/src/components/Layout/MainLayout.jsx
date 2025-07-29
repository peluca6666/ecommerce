import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import { Container, Box } from '@mui/material';
import WhatsAppFloat from '../Common/WhatsAppFloat';

const MainLayout = () => {
  const location = useLocation();
  const isLoginOrRegister = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Header />
      <main>
        {isLoginOrRegister ? (
          <Box sx={{ width: '100%' }}>
            <Outlet />
          </Box>
        ) : (
         <Box component="main" sx={{ width: '100%', py: 0 }}>
  <Outlet />
</Box>
        )}
      </main>
      <Footer />
      

      <WhatsAppFloat />
    </>
  );
};

export default MainLayout;