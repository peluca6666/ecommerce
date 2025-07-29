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
          <Container component="main" maxWidth="xl" sx={{ py: 0 }}>
            <Outlet />
          </Container>
        )}
      </main>
      <Footer />
      

      <WhatsAppFloat />
    </>
  );
};

export default MainLayout;