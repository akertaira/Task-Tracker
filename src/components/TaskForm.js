import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import '../styles/TaskForm.css';

function TaskForm() {
  const { addTask, categories, activeButton, setActiveButton } = useTasks();
  
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: categories[0] || 'Работа',
    priority: 'Средний',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Заголовок обязателен';
        if (value.length < 3) return 'Заголовок должен быть не менее 3 символов';
        if (value.length > 50) return 'Заголовок должен быть не более 50 символов';
        return '';
      case 'dueDate':
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Дата не может быть в прошлом';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.title = validateField('title', task.title);
    newErrors.dueDate = validateField('dueDate', task.dueDate);
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allTouched = Object.keys(task).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    if (validateForm() && task.title.trim()) {
      addTask(task);
      setTask({
        title: '',
        description: '',
        category: categories[0] || 'Работа',
        priority: 'Средний',
        dueDate: new Date().toISOString().split('T')[0]
      });
      setErrors({});
      setTouched({});
      setActiveButton('add');
      setTimeout(() => setActiveButton(null), 300);
    }
  };

  return (
    <div className="task-form-container">
      <h2 className="form-title">Добавить новую задачу</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Заголовок *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Введите заголовок задачи"
            className={`form-input ${touched.title && errors.title ? 'error' : ''}`}
          />
          {touched.title && errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Добавьте описание задачи"
            rows="3"
            className="form-textarea"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={task.category}
              onChange={handleChange}
              className="form-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Приоритет</label>
            <select
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Низкий">Низкий</option>
              <option value="Средний">Средний</option>
              <option value="Высокий">Высокий</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Дата выполнения</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched.dueDate && errors.dueDate ? 'error' : ''}`}
          />
          {touched.dueDate && errors.dueDate && (
            <span className="error-message">{errors.dueDate}</span>
          )}
        </div>

        <button
          type="submit"
          className={`add-task-btn ${activeButton === 'add' ? 'active' : ''}`}
          onMouseEnter={() => setActiveButton('add')}
          onMouseLeave={() => activeButton === 'add' && setActiveButton(null)}
        >
          <span className="btn-icon">+</span>
          Добавить задачу
        </button>
      </form>
    </div>
  );
}

export default TaskForm;