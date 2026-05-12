import React, { createContext, useContext, useState } from 'react';
import { userService } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => userService.get());

  const login = (displayName) => {
    const userData = { displayName: displayName.trim() };
    userService.set(userData);
    setUser(userData);
  };

  const logout = () => {
    userService.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
