import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(['Работа', 'Личное', 'Учеба', 'Здоровье', 'Финансы']);
  const [filter, setFilter] = useState({ category: 'Все', status: 'Все' });
  const [sortBy, setSortBy] = useState('date');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [tasks, categories]);

  const filteredAndSortedTasks = useMemo(() => {
    console.log('🔄 Фильтрация, сортировка и поиск задач...');
    
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
    } 
    else {
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

  const highlightText = useCallback((text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? `<mark class="highlight">${part}</mark>` : part
    ).join('');
  }, []);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = tasks.filter(t => 
      new Date(t.dueDate) < new Date() && !t.completed
    ).length;
    
    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
      completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }, [tasks]);

  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [newTask, ...prev]);
    
    if (!categories.includes(task.category)) {
      setCategories(prev => [...prev, task.category]);
    }
  }, [categories]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const updateTask = useCallback((updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    setIsModalOpen(false);
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

  const value = {
    tasks,
    filteredTasks: filteredAndSortedTasks,
    categories,
    filter,
    sortBy,
    selectedDate,
    isDateFilterActive,
    hoveredTask,
    activeButton,
    editingTask,
    isModalOpen,
    stats,
    searchTerm,
    setSearchTerm,
    clearSearch,
    highlightText,
    setFilter,
    setSortBy,
    setHoveredTask,
    setActiveButton,
    addTask,
    deleteTask,
    toggleTaskStatus,
    updateTask,
    openEditModal,
    closeModal,
    handleDateSelect,
    clearDateFilter
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