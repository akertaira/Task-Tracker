// hooks/useAuditLog.js
import { useState } from 'react';

export function useAuditLog() {
  const [logs, setLogs] = useState([]);

  const addLog = (action, details) => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: JSON.parse(localStorage.getItem('user') || '{}').email || 'anonymous',
      action,
      details,
      ip: 'client-side' // В реальном приложении получать с сервера
    };
    
    setLogs(prev => [logEntry, ...prev]);
    
    // Сохранить в localStorage
    const savedLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    localStorage.setItem('auditLogs', JSON.stringify([logEntry, ...savedLogs].slice(0, 100)));
  };

  const getLogs = () => {
    return JSON.parse(localStorage.getItem('auditLogs') || '[]');
  };

  return { addLog, getLogs, logs };
}