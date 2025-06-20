import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  // si no hay token, redirigimos al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // decodificamos el payload del jwt para chequear expiración y rol
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;

    // si el token está expirado, redirigimos al login
    if (payload.exp < now) {
      return <Navigate to="/login" replace />;
    }

    // verificamos si el rol está dentro de los permitidos
    if (allowedRoles && !allowedRoles.includes(payload.rol)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // si pasa todas las validaciones, renderizamos la ruta protegida
    return <Outlet />;
  } catch (error) {
    // si el token es inválido o hay error, redirigimos al login
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
