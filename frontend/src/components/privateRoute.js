import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const PrivateRoute = ({ rolRequerido }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwt_decode(token);
    if (decoded.rol !== rolRequerido) {
      return <Navigate to="/" />; // redirigir si no tiene permiso
    }
    return <Outlet />; // muestra las rutas hijas autorizadas
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;