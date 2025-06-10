import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Home from './pages/Home/Home.jsx';
import Products from './pages/Productos/Productos.jsx';
import Cart from './pages/Carrito/Carrito.jsx';
import Admin from './pages/Admin/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

function App() {
  return (
        <AuthProvider>
    <Router>
        <Routes>
          {/*Rutas  publicas*/}
           <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

             {/*Rutas publicas*/}
           <Route path="/" element={<Register />} />
           <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />

        {/*Ruta del carrito protegida de usuarios no logueados*/}
        <Route path="/cart" element={<Cart />} />
         
       
  {/* Ruta protegida solo para admin */}
  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
    <Route path="/admin" element={<Admin />} />
  </Route>

  {/* Página de acceso denegado (podés crearla luego) */}
  <Route path="/unauthorized" element={<div>No tenés permiso para entrar acá</div>} />
</Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;