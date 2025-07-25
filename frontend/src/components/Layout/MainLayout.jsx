import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import { Box } from '@mui/material';

const MainLayout = () => {
  const location = useLocation();
  const isLoginOrRegister = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <Box sx={{ width: '100%' }}>
          <Outlet />
        </Box>
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;