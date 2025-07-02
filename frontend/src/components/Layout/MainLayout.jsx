import { Outlet } from 'react-router-dom';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 

// componente plantilla que muestra header y footer
// y en medio carga la página correspondiente con <Outlet />
const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
