// src/hooks/useSessionTimeout.js
import { useEffect, useRef } from 'react';

export function useSessionTimeout(timeoutSeconds = 15, onTimeout) {
  const timerRef = useRef(null);

  useEffect(() => {
    // Сброс таймера при любом действии пользователя
    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        console.log('⏰ Session timeout!');
        
        // Показываем предупреждение
        alert('⏰ Сессия истекла! Вы будете перенаправлены на страницу входа.');
        
        // Очищаем данные
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('2fa_verified');
        
        // Вызываем колбэк если передан
        if (onTimeout) {
          onTimeout();
        }
        
        // Перенаправляем на главную
        window.location.href = '/';
      }, timeoutSeconds * 1000);
    };

    // События которые сбрасывают таймер
    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'click',
      'touchstart',
      'touchmove'
    ];
    
    // Регистрируем события
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Запускаем таймер
    resetTimer();
    
    // Очистка
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeoutSeconds, onTimeout]);
}