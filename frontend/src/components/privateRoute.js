import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const PrivateRoute = ({ rolRequerido }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // No hay token, redirigir al login
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwt_decode(token);
    // Si el rol no coincide, redirigir a la página principal
    if (decoded.rol !== rolRequerido) {
      return <Navigate to="/" />;
    }
    // Rol autorizado, mostrar rutas hijas
    return <Outlet />;
  } catch (error) {
    // Token inválido o corrupto, redirigir al login
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
