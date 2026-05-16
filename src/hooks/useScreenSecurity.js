// src/hooks/useScreenSecurity.js
import { useEffect } from 'react';

export function useScreenSecurity() {
  useEffect(() => {
    // 1. БЛОКИРОВКА ПЕЧАТИ (Ctrl+P)
    const handlePrint = (e) => {
      e.preventDefault();
      alert('🛡️ Печать запрещена!');
      return false;
    };

    // 2. БЛОКИРОВКА F12 И CTRL+SHIFT+I
    const handleDevTools = (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        alert('🛡️ Инструменты разработчика отключены!');
        return false;
      }
    };

    // 3. РАЗМЫТИЕ ПРИ ПОТЕРЕ ФОКУСА
    const handleBlur = () => {
      document.body.style.filter = 'blur(5px)';
      document.body.style.transition = 'filter 0.3s';
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 500);
    };

    // 4. ПРЕДУПРЕЖДЕНИЕ О СКРИНШОТЕ
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        alert('📸 Скриншоты запрещены!');
      }
    };

    // Регистрируем события
    window.addEventListener('keydown', handleDevTools);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('beforeprint', handlePrint);
    window.addEventListener('blur', handleBlur);

    // Очистка
    return () => {
      window.removeEventListener('keydown', handleDevTools);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('beforeprint', handlePrint);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
}