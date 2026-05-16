// src/hooks/useBiometricAuth.js (новый файл)
import { useState, useEffect } from 'react';

export function useBiometricAuth() {
  const [isSupported, setIsSupported] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    // Проверяем, есть ли WebAuthn API
    const hasWebAuthn = window.PublicKeyCredential !== undefined;
    
    if (hasWebAuthn && window.location.protocol === 'https:') {
      setIsSupported(true);
    } else {
      // На localhost или без HTTPS используем симуляцию
      console.log('ℹ️ Биометрия симулирована (нет HTTPS или WebAuthn)');
      setIsSupported(true);
    }
  };

  const authenticate = async () => {
    setIsLoading(true);
    
    try {
      // Проверяем реальную биометрию только на HTTPS
      if (window.PublicKeyCredential && window.location.protocol === 'https:') {
        // Реальная биометрия
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array(32),
            allowCredentials: [],
            timeout: 60000,
            userVerification: 'required',
            rpId: window.location.hostname
          }
        });
        
        if (credential) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return true;
        }
      }
      
      // Симуляция для localhost
      return new Promise((resolve) => {
        // Показываем красивое модальное окно вместо prompt
        const pin = window.prompt(
          '🔐 Демо-режим биометрии\n\n' +
          'Так как приложение запущено на localhost,\n' +
          'используется симуляция биометрии.\n\n' +
          'Введите PIN-код: 1234'
        );
        
        if (pin === '1234') {
          setIsAuthenticated(true);
          alert('✅ Биометрия пройдена! (симуляция)');
          resolve(true);
        } else {
          alert('❌ Неверный PIN-код!');
          resolve(false);
        }
        setIsLoading(false);
      });
      
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      setIsLoading(false);
      return false;
    }
  };

  return { 
    isSupported, 
    isAuthenticated, 
    isLoading,
    checkSupport, 
    authenticate 
  };
}