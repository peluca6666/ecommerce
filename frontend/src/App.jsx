import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import Products from './pages/Productos/ProductListPage.jsx';
import Cart from './pages/Carrito/Carrito.jsx';
import Admin from './pages/Admin/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import CategoryPage from './pages/CategoryPage/CategoryPage.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CuentaVerificada from './pages/Verificacion/CuentaVerificada';
import ProductDetailPage from './pages/Productos/ProductDetailPage';

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
          <Route path="/products" element={<Products />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/cuenta-verificada" element={<CuentaVerificada />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />

          {/*Rutas protegidas de usuarios no logueados*/}
          <Route element={<ProtectedRoute requireAuth={true} />}>
            <Route path="/cart" element={<Cart />} />
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