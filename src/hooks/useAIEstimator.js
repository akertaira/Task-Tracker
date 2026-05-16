// src/hooks/useAIEstimator.js
import { useState } from 'react';

export function useAIEstimator() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);

  // ИИ-анализ задачи для определения времени
  const estimateTask = async (taskData) => {
    setIsAnalyzing(true);
    
    // Имитация API запроса к ИИ
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { title, description, priority } = taskData;
    const text = `${title} ${description || ''}`.toLowerCase();
    
    // Умный алгоритм оценки на основе ключевых слов
    let hours = 0;
    let confidence = 85;
    
    // Анализ сложности
    const complexKeywords = ['сложн', 'трудно', 'много', 'большой', 'серьезн', 'важный', 'проект', 'отчет', 'презентац'];
    const mediumKeywords = ['обычн', 'средн', 'нормальн', 'стандарт'];
    const easyKeywords = ['легк', 'быстро', 'просто', 'маленьк', 'мелк', 'прост'];
    
    // Анализ продолжительности
    const longKeywords = ['часов', 'дней', 'недел', 'месяц'];
    const shortKeywords = ['минут', 'час'];
    
    for (const word of complexKeywords) {
      if (text.includes(word)) hours += 3;
    }
    for (const word of mediumKeywords) {
      if (text.includes(word)) hours += 1.5;
    }
    for (const word of easyKeywords) {
      if (text.includes(word)) hours -= 1;
    }
    for (const word of longKeywords) {
      if (text.includes(word)) hours += 4;
    }
    for (const word of shortKeywords) {
      if (text.includes(word)) hours -= 0.5;
    }
    
    // Корректировка по приоритету
    if (priority === 'Высокий') hours += 2;
    if (priority === 'Низкий') hours -= 1;
    
    // Корректировка по длине описания
    if (description && description.length > 200) hours += 2;
    if (description && description.length > 500) hours += 3;
    
    // Корректировка по наличию специфических слов
    if (text.includes('срочн') || text.includes('дедлайн')) {
      hours += 1;
      confidence += 5;
    }
    if (text.includes('команд') || text.includes('совещан')) {
      hours += 2;
    }
    
    // Базовая минимальная оценка
    hours = Math.max(0.5, Math.min(12, hours + 2));
    
    // Округление до 0.5
    hours = Math.ceil(hours * 2) / 2;
    
    // Расчет уверенности ИИ
    if (hours > 8) confidence -= 10;
    if (hours < 1) confidence -= 5;
    if (description && description.length < 20) confidence -= 15;
    
    confidence = Math.max(50, Math.min(95, confidence));
    
    const result = {
      hours: hours,
      minutes: hours * 60,
      confidence: confidence,
      suggestion: getSmartSuggestion(hours, priority, title),
      estimatedTimeSlot: getRecommendedTimeSlot(hours)
    };
    
    setEstimatedTime(result);
    setIsAnalyzing(false);
    return result;
  };
  
  const getSmartSuggestion = (hours, priority, title) => {
    if (hours > 6 && priority === 'Высокий') {
      return '⚠️ Сложная задача. Рекомендуем разбить на подзадачи и начать с утра.';
    }
    if (hours > 6) {
      return '📊 Объемная задача. Запланируйте на первую половину дня.';
    }
    if (hours > 3) {
      return '📝 Задача среднего объема. Идеально для работы после обеда.';
    }
    if (hours < 1) {
      return '⚡ Быстрая задача. Можно выполнить между основными делами.';
    }
    return '✅ Оптимальное время для этой задачи - утро, когда продуктивность максимальна.';
  };
  
  const getRecommendedTimeSlot = (hours) => {
    if (hours > 4) return '09:00';
    if (hours > 2) return '11:00';
    if (hours > 1) return '14:00';
    return '16:00';
  };
  
  return { estimateTask, isAnalyzing, estimatedTime };
}

export function useBiometricAuth() {
  const [isSupported, setIsSupported] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkSupport = async () => {
    if (window.PublicKeyCredential) {
      setIsSupported(true);
      return true;
    }
    return false;
  };

  const authenticate = async () => {
    try {
      if (window.PublicKeyCredential) {
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array(32),
            allowCredentials: [],
            timeout: 60000,
            userVerification: 'required',
          }
        });
        
        if (credential) {
          setIsAuthenticated(true);
          return true;
        }
      }
      
      const pin = prompt('Введите PIN-код:');
      if (pin === '1234') {
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      return false;
    }
  };

  return { isSupported, isAuthenticated, checkSupport, authenticate };
}