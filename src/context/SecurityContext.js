// src/context/SecurityContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const SecurityContext = createContext();

export function SecurityProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  const [user, setUser] = useState(null);
  const [show2FA, setShow2FA] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    const twoFAVerified = localStorage.getItem('2fa_verified') === 'true';
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setIs2FAVerified(twoFAVerified);
      // Если 2FA не пройдена - показываем окно
      if (!twoFAVerified) {
        setShow2FA(true);
      }
    }
  }, []);

  const login = (email, password) => {
    // Имитация входа
    const userData = { email, name: email.split('@')[0] };
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('2fa_verified', 'false');
    setIsAuthenticated(true);
    setUser(userData);
    setIs2FAVerified(false);
    setShow2FA(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('2fa_verified');
    localStorage.removeItem('2fa_secret');
    setIsAuthenticated(false);
    setUser(null);
    setIs2FAVerified(false);
    setShow2FA(false);
  };

  const verify2FA = (success) => {
    if (success) {
      localStorage.setItem('2fa_verified', 'true');
      setIs2FAVerified(true);
      setShow2FA(false);
    }
  };

  const skip2FA = () => {
    setShow2FA(false);
  };

  const value = {
    isAuthenticated,
    is2FAVerified,
    user,
    show2FA,
    login,
    logout,
    verify2FA,
    skip2FA
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
}