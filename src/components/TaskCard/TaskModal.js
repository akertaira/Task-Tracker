// src/components/TaskCard/TaskModal.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/TaskModal.css';

function TaskModal({ task, onSave, onClose }) {
  const [formData, setFormData] = useState(task);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(task);
  }, [task]);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value?.trim()) return 'Заголовок обязателен';
        if (value.length < 3) return 'Заголовок должен быть не менее 3 символов';
        if (value.length > 50) return 'Заголовок должен быть не более 50 символов';
        return '';
      case 'dueDate':
        if (!value) return 'Дата обязательна';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Дата не может быть в прошлом';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Валидация при изменении
    const error = validateField(name, newValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация всех полей
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
    onClose();
  };

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Редактирование задачи</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Заголовок <span className="required">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="Введите заголовок задачи"
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Введите описание задачи"
              rows="4"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Категория</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Работа">📁 Работа</option>
                <option value="Личное">👤 Личное</option>
                <option value="Учеба">📚 Учеба</option>
                <option value="Здоровье">💪 Здоровье</option>
                <option value="Финансы">💰 Финансы</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Приоритет</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Низкий">🟢 Низкий</option>
                <option value="Средний">🟡 Средний</option>
                <option value="Высокий">🔴 Высокий</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Дата выполнения <span className="required">*</span></label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate || ''}
              onChange={handleChange}
              className={errors.dueDate ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
          </div>
          
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="completed"
                checked={formData.completed || false}
                onChange={handleChange}
              />
              Задача выполнена
            </label>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Отмена
            </button>
            <button type="submit" className="save-btn">
              💾 Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;