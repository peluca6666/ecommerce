import { Outlet } from 'react-router-dom';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import { Container } from '@mui/material';

// componente plantilla que muestra header y footer
// y en medio carga la página correspondiente con <Outlet />
const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
         <Container 
                component="main" 
                maxWidth="xl" // Podés cambiar a "md" o "xl" según prefieras
                sx={{ py: 3 }} // 'py' agrega un padding vertical (arriba y abajo)
            >
                <Outlet />
            </Container>
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
