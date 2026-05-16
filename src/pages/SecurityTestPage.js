// src/pages/SecurityTestPage.jsx
import React, { useState } from 'react';
import TwoFactorAuth from '../components/Auth/TwoFactorAuth';
import { useBiometricAuth } from '../hooks/useAIEstimator';
import { encryptData, decryptData } from '../utils/encryption';
import '../styles/SecurityTestPage.css';

function SecurityTestPage() {
  const [testResult, setTestResult] = useState('');
  const [encryptionResult, setEncryptionResult] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  const { authenticate, isAuthenticated } = useBiometricAuth();

  // Тест шифрования
  const testEncryption = () => {
    const original = { test: "Секретные данные", value: 123, userId: "user123" };
    const encrypted = encryptData(original);
    const decrypted = decryptData(encrypted);
    
    if (JSON.stringify(original) === JSON.stringify(decrypted)) {
      setEncryptionResult('✅ Шифрование работает! Данные успешно зашифрованы и расшифрованы.');
      setTestResult('success');
    } else {
      setEncryptionResult('❌ Ошибка шифрования! Данные не совпадают.');
      setTestResult('error');
    }
    
    console.log('📝 Оригинал:', original);
    console.log('🔒 Зашифровано:', encrypted);
    console.log('🔓 Расшифровано:', decrypted);
  };

  // Тест 2FA
  const handle2FASuccess = (success) => {
    if (success) {
      setIs2FAVerified(true);
      setTestResult('success');
    }
  };

  const handle2FASkip = () => {
    setShow2FA(false);
    setTestResult('warning');
  };

  const open2FA = () => {
    setShow2FA(true);
    setIs2FAVerified(false);
  };

  // Тест биометрии
  const testBiometric = async () => {
    const result = await authenticate();
    if (result) {
      setTestResult('success');
    } else {
      setTestResult('error');
    }
  };

  // Тест защиты от скриншотов
  const testScreenProtection = () => {
    setTestResult('info');
    alert('📸 Нажмите Print Screen на клавиатуре. Должно появиться предупреждение!');
  };

  return (
    <div className="security-test">
      <h1>🔐 Тестирование безопасности</h1>
      
      {/* Статус 2FA */}
      {is2FAVerified && (
        <div className="security-success">
          <span className="success-icon">✅</span>
          <span>2FA успешно пройдена! Вы можете пользоваться приложением.</span>
        </div>
      )}
      
      {/* Тест 2FA */}
      <div className="test-section">
        <h2>1. Двухфакторная аутентификация (2FA)</h2>
        <button onClick={open2FA} className="test-btn">
          🔐 Настроить 2FA
        </button>
        {is2FAVerified && (
          <p className="success-message">✅ 2FA пройдена! Вы защищены.</p>
        )}
        <p className="hint">
          💡 Тестовый код: <strong>123456</strong> (если нет Google Authenticator)
        </p>
      </div>
      
      {/* Тест шифрования */}
      <div className="test-section">
        <h2>2. Шифрование данных</h2>
        <button onClick={testEncryption} className="test-btn">
          🔒 Проверить шифрование
        </button>
        {encryptionResult && (
          <p className={`result-message ${testResult === 'success' ? 'success' : 'error'}`}>
            {encryptionResult}
          </p>
        )}
      </div>
      
      <div className="test-section">
        <h2>3. Биометрическая аутентификация</h2>
        <button onClick={testBiometric} className="test-btn">
          👆 Проверить биометрию
        </button>
        {isAuthenticated && (
          <p className="success-message">✅ Биометрия пройдена!</p>
        )}
        <p className="hint">
          💡 PIN-код для теста: <strong>1234</strong>
        </p>
      </div>
      
      {/* Тест защиты от скриншотов */}
      <div className="test-section">
        <h2>4. Защита от скриншотов</h2>
        <button onClick={testScreenProtection} className="test-btn">
          📸 Проверить защиту
        </button>
        <p className="hint">
          💡 Нажмите <strong>Print Screen (PrtScn)</strong> - должно появиться предупреждение
        </p>
      </div>
      
      {/* Тест Session Timeout */}
      <div className="test-section">
        <h2>5. Session Timeout</h2>
        <p>Бездействие 15 минут → автоматический выход</p>
        <p className="hint">
          💡 Подождите 15 секунд (в тестовом режиме) для проверки
        </p>
      </div>
      
      {/* Чек-лист безопасности */}
      <div className="checklist">
        <h3>📋 Чек-лист безопасности</h3>
        <div className="checklist-item">
          <div className={`checklist-checkbox ${is2FAVerified ? 'checked' : ''}`}></div>
          <span className="checklist-label">Двухфакторная аутентификация настроена</span>
        </div>
        <div className="checklist-item">
          <div className={`checklist-checkbox ${testResult === 'success' ? 'checked' : ''}`}></div>
          <span className="checklist-label">Шифрование данных работает</span>
        </div>
        <div className="checklist-item">
          <div className={`checklist-checkbox ${isAuthenticated ? 'checked' : ''}`}></div>
          <span className="checklist-label">Биометрическая аутентификация настроена</span>
        </div>
      </div>
      
      {/* Модальное окно 2FA */}
      {show2FA && (
        <TwoFactorAuth 
          onVerify={(success) => {
            handle2FASuccess(success);
            setShow2FA(false);
          }}
          onSkip={() => {
            handle2FASkip();
            setShow2FA(false);
          }}
          isOpen={show2FA}
        />
      )}
    </div>
  );
}

export default SecurityTestPage;