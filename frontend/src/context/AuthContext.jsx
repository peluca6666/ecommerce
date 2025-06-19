import React, { createContext, useState, useEffect, useContext } from 'react';
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

  // Decodifica el payload del JWT
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  };

  // Verifica si el token expiró
  const isTokenExpired = (payload) => {
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  };

  // Actualiza el carrito desde la API
  const refreshCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCart({ productos: [], count: 0, total: 0 });
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/api/carrito', {
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
      console.error("Error al obtener el carrito:", error);
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

  // Loguea guardando el token si es válido y actualiza usuario y carrito
  const login = (token) => {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      console.error('Token inválido recibido');
      return false;
    }
    const payload = decodeToken(token);
    if (payload && !isTokenExpired(payload)) {
      localStorage.setItem('token', token);
      setUser({ id: payload.usuario_id, rol: payload.rol, email: payload.email });
      refreshCart();
      return true;
    } else {
      console.error('Token inválido o expirado');
      return false;
    }
  };

  // Limpia el usuario y carrito al desloguear
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart({ productos: [], count: 0, total: 0 });
  };

  const getToken = () => localStorage.getItem('token');

  // Muestra notificaciones en pantalla
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // Agrega un producto al carrito
  const addToCart = async (productoId, cantidad = 1) => {
    const token = getToken();
    if (!token) {
      showNotification('Debes estar logueado para agregar productos', 'warning');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/carrito',
        { producto_id: productoId, cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshCart();
      showNotification('Producto agregado al carrito', 'success');
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      showNotification(error.response?.data?.mensaje || 'Error al agregar producto', 'error');
    }
  };

  // Elimina un producto del carrito
  const removeFromCart = async (productoId) => {
    const token = getToken();
    if (!token) {
      showNotification('Se requiere autenticación', 'error');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/carrito/${productoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshCart();
      showNotification('Producto eliminado del carrito', 'info');
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      showNotification(error.response?.data?.mensaje || 'Error al eliminar producto', 'error');
    }
  };

  // Actualiza la cantidad de un producto en el carrito
  const updateCartItemQuantity = async (productoId, cantidad) => {
    const token = getToken();
    if (!token) {
      showNotification('Se requiere autenticación', 'error');
      return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
      // Si la cantidad es 0 o inválida, elimina el producto
      return removeFromCart(productoId);
    }
    try {
      await axios.put(`http://localhost:3000/api/carrito/${productoId}`,
        { cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshCart();
      showNotification('Cantidad actualizada', 'success');
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
      showNotification(error.response?.data?.mensaje || 'Error al actualizar producto', 'error');
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
