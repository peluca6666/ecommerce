import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  // Si no hay token, redirigimos al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decodificamos el payload del JWT para verificar expiración y rol
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;

    // Si el token está expirado, redirigimos al login
    if (payload.exp < now) {
      return <Navigate to="/login" replace />;
    }

    // Verificamos si el rol del usuario está dentro de los permitidos
    if (allowedRoles && !allowedRoles.includes(payload.rol)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Si pasa todas las validaciones, renderizamos la ruta protegida
    return <Outlet />;
  } catch (error) {
    // Si el token es inválido o hay un error, redirigimos al login
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
