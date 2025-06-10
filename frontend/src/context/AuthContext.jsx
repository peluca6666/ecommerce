import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado del usuario (puede incluir id, rol, email, etc.)
  const [user, setUser] = useState(usuario_id, rol);

  // cargamos el token guardado en localStorage al inicio
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.usuario_id, rol: payload.rol });
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Función para loguear (guardar token y actualizar user)
  const login = (token) => {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser({ id: payload.usuario_id, rol: payload.rol });
  };

  // Función para desloguear (borrar token y limpiar user)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Estado y funciones que queremos compartir
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
