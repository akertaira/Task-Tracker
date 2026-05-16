import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// HOC для проверки авторизации
export function withAuth(WrappedComponent, options = {}) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    const { redirectTo = '/login', requiredRole = null } = options;

    useEffect(() => {
      // Проверка авторизации (имитация)
      const checkAuth = async () => {
        try {
          // Получаем токен из localStorage
          const token = localStorage.getItem('authToken');
          
          if (!token) {
            throw new Error('Не авторизован');
          }
          
          // Имитация проверки токена
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          
          // Проверка роли
          if (requiredRole && userData.role !== requiredRole) {
            throw new Error('Недостаточно прав');
          }
          
          setIsAuthenticated(true);
          setUser(userData);
        } catch (error) {
          setIsAuthenticated(false);
          navigate(redirectTo);
        }
      };
      
      checkAuth();
    }, [navigate, redirectTo, requiredRole]);

    // Показываем загрузку
    if (isAuthenticated === null) {
      return <div className="loading-spinner">Проверка авторизации...</div>;
    }

    // Если не авторизован - редирект (уже произошел)
    if (!isAuthenticated) {
      return null;
    }

    // Передаем данные пользователя в обернутый компонент
    return <WrappedComponent {...props} user={user} />;
  };
}

// HOC для отображения загрузки
export function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
}

// Комбинированный HOC
export function compose(...hocs) {
  return (Component) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), Component);
  };
}