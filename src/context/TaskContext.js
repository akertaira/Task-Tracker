import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { taskApi } from '../api/mockApi';
import { useFetch } from '../hooks/useFetch';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(['Работа', 'Личное', 'Учеба', 'Здоровье', 'Финансы']);
  const [filter, setFilter] = useState({ category: 'Все', status: 'Все' });
  const [sortBy, setSortBy] = useState('date');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredTask, setHoveredTask] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 🔥 ДОБАВЛЯЕМ: состояние для ИИ-предложений
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAIPlanning, setIsAIPlanning] = useState(false);

  const { 
    data: initialTasks, 
    loading: isLoading, 
    error: loadError,
    refetch: refetchTasks
  } = useFetch(taskApi.getAllTasks, {
    onSuccess: (data) => {
      // 🔥 Миграция: добавляем timeSlot к старым задачам
      const migratedTasks = data.map(task => ({
        ...task,
        timeSlot: task.timeSlot || getDefaultTimeSlot(task.priority)
      }));
      setTasks(migratedTasks);
    },
    onError: (err) => console.error('Ошибка загрузки:', err),
    immediate: true
  });

  // 🔥 Функция для определения времени по приоритету
  const getDefaultTimeSlot = (priority) => {
    switch (priority) {
      case 'Высокий': return '09:00';
      case 'Средний': return '14:00';
      case 'Низкий': return '16:00';
      default: return '12:00';
    }
  };

  // 🔥 Функция для поиска первого свободного слота
  const findFirstFreeSlot = useCallback((date, priority) => {
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const dateStr = date.toISOString().split('T')[0];
    
    // Приоритетные слоты для высокого приоритета
    if (priority === 'Высокий') {
      const prioritySlots = ['09:00', '10:00', '11:00'];
      for (const slot of prioritySlots) {
        const existing = tasks.find(t => t.dueDate === dateStr && t.timeSlot === slot);
        if (!existing) return slot;
      }
    }
    
    // Обычный поиск
    for (const slot of timeSlots) {
      const existing = tasks.find(t => t.dueDate === dateStr && t.timeSlot === slot);
      if (!existing) return slot;
    }
    
    return '12:00'; // fallback
  }, [tasks]);

  // 🔥 ИИ-оценка времени выполнения задачи
  const estimateTaskTime = useCallback(async (taskData) => {
    const { title, description, priority } = taskData;
    const text = `${title} ${description || ''}`.toLowerCase();
    
    // Имитация ИИ-анализа
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let hours = 0;
    let confidence = 85;
    
    // Анализ ключевых слов
    const complexKeywords = ['сложн', 'трудно', 'много', 'большой', 'проект', 'отчет', 'презентац'];
    const easyKeywords = ['легк', 'быстро', 'просто', 'маленьк', 'мелк'];
    
    for (const word of complexKeywords) {
      if (text.includes(word)) hours += 3;
    }
    for (const word of easyKeywords) {
      if (text.includes(word)) hours -= 1;
    }
    
    // Корректировка по приоритету
    if (priority === 'Высокий') hours += 2;
    if (priority === 'Низкий') hours -= 1;
    
    // Корректировка по длине описания
    if (description && description.length > 200) hours += 2;
    
    hours = Math.max(0.5, Math.min(8, hours + 2));
    hours = Math.ceil(hours * 2) / 2;
    
    // Расчет уверенности
    if (!description || description.length < 20) confidence -= 15;
    if (hours > 6) confidence -= 10;
    confidence = Math.max(50, Math.min(95, confidence));
    
    return { hours, confidence };
  }, []);

  // 🔥 ИИ-планирование задачи (сам определяет дату и время)
  const planTaskWithAI = useCallback(async (taskData, targetDate = new Date()) => {
    setIsAIPlanning(true);
    
    // 1. Оцениваем время выполнения
    const { hours, confidence } = await estimateTaskTime(taskData);
    
    // 2. Определяем приоритет
    const priority = taskData.priority || 'Средний';
    
    // 3. Находим свободный слот
    const freeSlot = findFirstFreeSlot(targetDate, priority);
    
    // 4. Определяем, сколько слотов нужно (по часам)
    const slotsNeeded = Math.ceil(hours);
    
    // 5. Проверяем, хватает ли свободных слотов подряд
    let selectedSlot = freeSlot;
    let selectedDateObj = targetDate;
    
    // 6. Генерируем рекомендацию
    let suggestion = '';
    if (priority === 'Высокий') {
      suggestion = `⚠️ Высокоприоритетная задача. Рекомендуем начать в ${freeSlot}, чтобы завершить до обеда.`;
    } else if (hours > 4) {
      suggestion = `📊 Объемная задача (~${hours} ч). Лучше запланировать на первую половину дня.`;
    } else if (hours < 1.5) {
      suggestion = `⚡ Быстрая задача. Можно выполнить между основными делами.`;
    } else {
      suggestion = `✅ Оптимальное время: ${freeSlot}. Уверенность ИИ: ${confidence}%`;
    }
    
    const plannedTask = {
      ...taskData,
      timeSlot: selectedSlot,
      dueDate: selectedDateObj.toISOString().split('T')[0],
      estimatedHours: hours,
      aiConfidence: confidence,
      aiSuggestion: suggestion
    };
    
    setIsAIPlanning(false);
    
    return {
      task: plannedTask,
      suggestion,
      confidence,
      estimatedHours: hours
    };
  }, [estimateTaskTime, findFirstFreeSlot]);

  // 🔥 Добавление задачи с ИИ-планированием
  const addTaskWithAI = useCallback(async (taskData, useAI = true) => {
    try {
      let taskToAdd = { ...taskData };
      
      if (useAI) {
        // ИИ сам определяет время и дату
        const { task: plannedTask } = await planTaskWithAI(taskData);
        taskToAdd = plannedTask;
      } else {
        // Обычное добавление без ИИ
        taskToAdd = {
          ...taskData,
          timeSlot: taskData.timeSlot || getDefaultTimeSlot(taskData.priority),
          dueDate: taskData.dueDate || new Date().toISOString().split('T')[0]
        };
      }
      
      const newTask = await taskApi.createTask(taskToAdd);
      setTasks(prev => [newTask, ...prev]);
      
      if (taskData.category && !categories.includes(taskData.category)) {
        setCategories(prev => [...prev, taskData.category]);
      }
      
      return { success: true, task: newTask };
    } catch (error) {
      console.error('Ошибка добавления:', error);
      throw error;
    }
  }, [categories, planTaskWithAI]);

  // 🔥 Перемещение задачи в другой слот
  const moveTaskToSlot = useCallback(async (taskId, targetDate, targetTimeSlot) => {
    try {
      const taskToMove = tasks.find(t => t.id === taskId);
      if (!taskToMove) return;
      
      const updatedTask = {
        ...taskToMove,
        dueDate: targetDate.toISOString().split('T')[0],
        timeSlot: targetTimeSlot
      };
      
      const result = await taskApi.updateTask(taskId, updatedTask);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? result : task
      ));
      
      return result;
    } catch (error) {
      console.error('Ошибка перемещения:', error);
      throw error;
    }
  }, [tasks]);

  // 🔥 Получение рекомендаций от ИИ для всех задач
  const getAIRecommendations = useCallback(async () => {
    const pendingTasks = tasks.filter(t => !t.completed);
    const recommendations = [];
    
    for (const task of pendingTasks) {
      const { suggestion, estimatedHours } = await estimateTaskTime(task);
      recommendations.push({
        taskId: task.id,
        title: task.title,
        currentSlot: task.timeSlot,
        suggestedSlot: findFirstFreeSlot(new Date(), task.priority),
        estimatedHours,
        suggestion
      });
    }
    
    setAiSuggestions(recommendations);
    return recommendations;
  }, [tasks, estimateTaskTime, findFirstFreeSlot]);

  // 🔥 Применить все рекомендации ИИ
  const applyAIRecommendations = useCallback(async () => {
    const results = [];
    for (const rec of aiSuggestions) {
      const task = tasks.find(t => t.id === rec.taskId);
      if (task && rec.suggestedSlot !== task.timeSlot) {
        const targetDate = new Date();
        const result = await moveTaskToSlot(rec.taskId, targetDate, rec.suggestedSlot);
        results.push(result);
      }
    }
    setAiSuggestions([]);
    return results;
  }, [aiSuggestions, tasks, moveTaskToSlot]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      } catch (e) {
        console.error('Ошибка загрузки категорий:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = useCallback(async (taskData) => {
    try {
      const newTask = await taskApi.createTask({
        ...taskData,
        timeSlot: taskData.timeSlot || getDefaultTimeSlot(taskData.priority)
      });
      setTasks(prev => [newTask, ...prev]);
      
      if (taskData.category && !categories.includes(taskData.category)) {
        setCategories(prev => [...prev, taskData.category]);
      }
      
      return newTask;
    } catch (error) {
      console.error('Ошибка добавления:', error);
      throw error;
    }
  }, [categories]);

  const updateTask = useCallback(async (updatedTask) => {
    try {
      const result = await taskApi.updateTask(updatedTask.id, updatedTask);
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? result : task
      ));
      setEditingTask(null);
      setIsModalOpen(false);
      return result;
    } catch (error) {
      console.error('Ошибка обновления:', error);
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
      throw error;
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id) => {
    try {
      const updatedTask = await taskApi.toggleTaskStatus(id);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      throw error;
    }
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(false);
  }, []);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setIsDateFilterActive(true);
    setFilter({ category: 'Все', status: 'Все' });
  }, []);

  const clearDateFilter = useCallback(() => {
    setSelectedDate(null);
    setIsDateFilterActive(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const highlightText = useCallback((text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? `<mark class="highlight">${part}</mark>` : part
    ).join('');
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    }
    
    if (selectedDate) {
      const selectedDateStr = new Date(selectedDate).toISOString().split('T')[0];
      result = result.filter(task => {
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDate === selectedDateStr;
      });
    } else {
      if (filter.category !== 'Все') {
        result = result.filter(task => task.category === filter.category);
      }
      if (filter.status === 'Выполненные') {
        result = result.filter(task => task.completed);
      } else if (filter.status === 'Невыполненные') {
        result = result.filter(task => !task.completed);
      }
    }
    
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'alphabet') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'priority') {
      const priorityOrder = { 'Высокий': 3, 'Средний': 2, 'Низкий': 1 };
      result.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    }
    
    return result;
  }, [tasks, filter, sortBy, selectedDate, searchTerm]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && !t.completed).length,
    completionRate: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  }), [tasks]);

  const value = {
    tasks,
    filteredTasks: filteredAndSortedTasks,
    categories: categories || [],
    filter,
    sortBy,
    selectedDate,
    isDateFilterActive,
    searchTerm,
    hoveredTask,
    activeButton,
    editingTask,
    isModalOpen,
    stats,
    isLoading,
    loadError,
    aiSuggestions,
    isAIPlanning,
    
    setFilter,
    setSortBy,
    setSearchTerm,
    setHoveredTask,
    setActiveButton,
    setSelectedDate,
    setIsDateFilterActive,
    
    addTask,
    addTaskWithAI,        // 🔥 НОВОЕ: добавление с ИИ
    updateTask,
    deleteTask,
    toggleTaskStatus,
    moveTaskToSlot,       // 🔥 НОВОЕ: перемещение задачи
    refetchTasks,
    
    openEditModal,
    closeModal,
    
    handleDateSelect,    
    clearDateFilter,      
    clearSearch,          
    highlightText,
    
    // 🔥 НОВЫЕ ИИ-функции
    planTaskWithAI,
    getAIRecommendations,
    applyAIRecommendations,
    estimateTaskTime
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks должен использоваться внутри TaskProvider');
  }
  return context;
}