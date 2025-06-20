import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 

/**
 * Este componente es una plantilla. Dibuja el Header y el Footer,
 * y en el medio renderiza la página que corresponda
 * a través del componente <Outlet />.
 */
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
