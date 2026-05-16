// src/components/TimeTracker/TaskModal.jsx
import React, { useState, useEffect } from 'react';

function TaskModal({ task, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Работа',
    priority: 'Средний',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'Работа',
        priority: task.priority || 'Средний',
        dueDate: task.dueDate || new Date().toISOString().split('T')[0],
        completed: task.completed || false,
        id: task.id
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="tracker-modal-overlay" onClick={onClose}>
      <div className="tracker-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task?.id ? '✏️ Редактировать задачу' : '➕ Новая задача'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Заголовок *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите заголовок"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание"
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
            <label>Дата выполнения</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
              />
              Задача выполнена
            </label>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="save-btn">
              💾 Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;