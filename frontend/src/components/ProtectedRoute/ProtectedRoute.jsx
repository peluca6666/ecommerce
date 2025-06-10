import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decodifica el JWT 
    const now = Date.now() / 1000;

    if (payload.exp < now) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(payload.rol)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
