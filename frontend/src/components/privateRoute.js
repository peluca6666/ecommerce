import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const PrivateRoute = ({ rolRequerido }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // si no hay token, vamos al login
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwt_decode(token);
    // si el rol no es el que pide, vamos a la página principal
    if (decoded.rol !== rolRequerido) {
      return <Navigate to="/" />;
    }
    // rol correcto, mostramos las rutas hijas
    return <Outlet />;
  } catch (error) {
    // si el token está mal o corrupto, vamos al login
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
