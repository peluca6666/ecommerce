import { createContext, useState, useEffect, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [cart, setCart] = useState({ productos: [], count: 0, total: 0 });

  // decodifica el payload del token jwt
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('error al decodificar token:', error);
      return null;
    }
  };

  // chequea si el token expiró
  const isTokenExpired = (payload) => {
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  };

  // actualiza el carrito llamando la API
  const refreshCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCart({ productos: [], count: 0, total: 0 });
      return;
    }
    try {
       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/carrito`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.exito) {
        const itemCount = response.data.productos.reduce((acc, item) => acc + item.cantidad, 0);
        setCart({
          productos: response.data.productos,
          count: itemCount,
          total: response.data.total
        });
      }
    } catch (error) {
      console.error("error al obtener el carrito:", error);
      setCart({ productos: [], count: 0, total: 0 });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeToken(token);
      if (payload && !isTokenExpired(payload)) {
        setUser({ id: payload.usuario_id, rol: payload.rol, email: payload.email });
        refreshCart();
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // loguea guardando el token y actualizando usuario y carrito
  const login = (token) => {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      console.error('token inválido recibido');
      return false;
    }
    const payload = decodeToken(token);
    if (payload && !isTokenExpired(payload)) {
      localStorage.setItem('token', token);
      setUser({ id: payload.usuario_id, rol: payload.rol, email: payload.email });
      refreshCart();
      return true;
    } else {
      console.error('token inválido o expirado');
      return false;
    }
  };

  // desloguea limpiando usuario y carrito
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart({ productos: [], count: 0, total: 0 });
  };

  const getToken = () => localStorage.getItem('token');

  // muestra notificaciones en pantalla
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // agrega producto al carrito
  const addToCart = async (productoId, cantidad = 1) => {
    const token = getToken();
    if (!token) {
      showNotification('debes estar logueado para agregar productos', 'warning');
      return;
    }
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/carrito`,
        { producto_id: productoId, cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshCart();
      showNotification('producto agregado al carrito', 'success');
    } catch (error) {
      console.error("error al agregar al carrito:", error);
      showNotification(error.response?.data?.mensaje || 'error al agregar producto', 'error');
    }
  };

  // elimina producto del carrito
  const removeFromCart = async (productoId) => {
    const token = getToken();
    if (!token) {
      showNotification('se requiere autenticación', 'error');
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/carrito/${productoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshCart();
      showNotification('producto eliminado del carrito', 'info');
    } catch (error) {
      console.error("error al eliminar del carrito:", error);
      showNotification(error.response?.data?.mensaje || 'error al eliminar producto', 'error');
    }
  };

  // actualiza cantidad de producto en carrito
  const updateCartItemQuantity = async (productoId, cantidad) => {
    const token = getToken();
    if (!token) {
      showNotification('se requiere autenticación', 'error');
      return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
      // si cantidad es 0 o inválida, elimina el producto
      return removeFromCart(productoId);
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/carrito/${productoId}`,
        { cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshCart();
      showNotification('cantidad actualizada', 'success');
    } catch (error) {
      console.error("error al actualizar la cantidad:", error);
      showNotification(error.response?.data?.mensaje || 'error al actualizar producto', 'error');
    }
  };

  const value = {
    user, login, logout, getToken, isAuthenticated: !!user, loading,
    showNotification,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    refreshCart,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};
