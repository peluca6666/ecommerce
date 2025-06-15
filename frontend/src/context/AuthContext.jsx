import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado del usuario - inicializamos como null
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga inicial

  // Función para decodificar token JWT de forma segura
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  };

  // Función para validar si el token expiró
  const isTokenExpired = (payload) => {
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  };

  // Cargamos el token guardado en localStorage al inicio
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const payload = decodeToken(token);
      
      if (payload && !isTokenExpired(payload)) {
        setUser({ 
          id: payload.usuario_id, 
          rol: payload.rol,
          email: payload.email 
        });
      } else {
        // Si el token es inválido o expiró, lo eliminamos
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    
    setLoading(false);
  }, []);

  // Función para loguear guardar el token y establecer el usuario
 const login = (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    console.error('Token inválido recibido');
    return false;
  }

  const payload = decodeToken(token);

  if (payload && !isTokenExpired(payload)) {
    localStorage.setItem('token', token);
    setUser({ 
      id: payload.usuario_id, 
      rol: payload.rol,
      email: payload.email
    });
    return true;
  } else {
    console.error('Token inválido o expirado');
    return false;
  }
};


  // Función para desloguear , borramos el token y limpiamos el usuario
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Función para obtener el token actual
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Estado y funciones que queremos compartir
  const value = {
    user,
    login,
    logout,
    getToken,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};