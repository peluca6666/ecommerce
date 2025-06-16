import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import Admin from './pages/Admin/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import CategoryPage from './pages/CategoryPage/CategoryPage.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CuentaVerificada from './pages/Verificacion/CuentaVerificada';
import ProductDetailPage from './pages/Productos/ProductDetailPage';
import SobreNosotrosPage from './pages/SobreNosotros/SobreNosotrosPage.jsx';
import ContactoPage from './pages/Contacto/ContactoPage';
import ProductListPage from './pages/Productos/ProductListPage.jsx';
import CartPage from './pages/Carrito/CartPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import CheckoutPage from './pages/Checkout/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmation/OrderConfirmationPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/*Rutas  publicas*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/productos" element={<ProductListPage />} />
          <Route path="/categoria/:id/productos" element={<CategoryPage />} />
          <Route path="/cuenta-verificada" element={<CuentaVerificada />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
           <Route path="/sobre-nosotros" element={<SobreNosotrosPage />} />
            <Route path="/contacto" element={<ContactoPage />} />

          {/*Rutas protegidas de usuarios no logueados*/}
            <Route element={<ProtectedRoute requireAuth={true} />}>
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                 <Route path="/profile" element={<ProfilePage />} />
                 <Route path="/orden-confirmada/:id" element={<OrderConfirmationPage />} />
           </Route>

          {/* Ruta protegida solo para admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Página de acceso denegado */}
          <Route path="/unauthorized" element={<div>No tenés permiso para entrar acá</div>} />

          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;