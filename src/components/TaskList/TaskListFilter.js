import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';

// Компонент с Render Props для фильтрации задач
function TaskListFilter({ children, initialFilter = {} }) {
  const { tasks } = useTasks();
  const [filters, setFilters] = useState({
    category: initialFilter.category || 'Все',
    status: initialFilter.status || 'Все',
    search: initialFilter.search || '',
    ...initialFilter
  });

  // Фильтрация задач
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Фильтр по категории
    if (filters.category && filters.category !== 'Все') {
      result = result.filter(task => task.category === filters.category);
    }

    // Фильтр по статусу
    if (filters.status === 'Выполненные') {
      result = result.filter(task => task.completed);
    } else if (filters.status === 'Невыполненные') {
      result = result.filter(task => !task.completed);
    }

    // Поиск
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    return result;
  }, [tasks, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'Все',
      status: 'Все',
      search: ''
    });
  };

  // Render Props - передаем данные в children как функцию
  return children({
    tasks: filteredTasks,
    filters,
    updateFilter,
    resetFilters,
    totalCount: tasks.length,
    filteredCount: filteredTasks.length
  });
}

export default TaskListFilter;