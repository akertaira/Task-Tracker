// src/components/Auth/TwoFactorAuth.jsx
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import '../../styles/Auth.css';

function TwoFactorAuth({ onVerify, onSkip, isOpen = true }) {
  const [step, setStep] = useState('setup');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecret(result);
    localStorage.setItem('2fa_secret_test', result);
  };

  const handleVerify = () => {
    // ТЕСТОВЫЙ КОД: 123456 - работает всегда
    if (code === '123456') {
      setError('');
      if (onVerify) onVerify(true);
      return;
    }
    
    // Проверка с секретом
    const savedSecret = localStorage.getItem('2fa_secret_test');
    if (savedSecret && code === savedSecret.slice(0, 6)) {
      setError('');
      if (onVerify) onVerify(true);
    } else if (code.length === 6 && /^\d+$/.test(code)) {
      // Имитация успешной проверки для любого 6-значного кода
      setError('');
      if (onVerify) onVerify(true);
    } else {
      setError('Неверный код! Попробуйте 123456 для теста');
    }
  };

  const handleSkip = () => {
    if (onSkip) onSkip(false);
  };

  if (!isOpen) return null;

  return (
    <div className="two-factor-modal">
      <div className="modal-content">
        <h2>🔐 Двухфакторная аутентификация</h2>
        
        {step === 'setup' && (
          <div className="setup-step">
            <p>1. Установите Google Authenticator</p>
            <p>2. Отсканируйте QR-код:</p>
            
            {!secret && (
              <button onClick={generateSecret} className="generate-btn">
                🔑 Сгенерировать ключ
              </button>
            )}
            
            {secret && (
              <div className="qr-container">
                <QRCodeCanvas 
                  value={`otpauth://totp/TaskTracker?secret=${secret}&issuer=TaskTracker`} 
                  size={200}
                />
                <p className="secret-code">Код: {secret}</p>
                <p className="secret-hint">Или введите этот код вручную</p>
              </div>
            )}
            
            {secret && (
              <button onClick={() => setStep('verify')} className="next-btn">
                Продолжить →
              </button>
            )}
          </div>
        )}
        
        {step === 'verify' && (
          <div className="verify-step">
            <p>Введите код из приложения:</p>
            <p className="test-hint">📱 Тестовый код: <strong>123456</strong></p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength="6"
              className="code-input"
              autoFocus
            />
            {error && <div className="error">{error}</div>}
            <div className="buttons">
              <button onClick={handleSkip} className="skip-btn">
                Пропустить
              </button>
              <button onClick={handleVerify} className="verify-btn">
                Подтвердить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TwoFactorAuth;