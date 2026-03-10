import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

function Modal({ task, onSave, onCancel, categories }) {
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Редактировать задачу</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="editTitle">Заголовок</label>
            <input
              type="text"
              id="editTitle"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editDescription">Описание</label>
            <textarea
              id="editDescription"
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="editCategory">Категория</label>
              <select
                id="editCategory"
                name="category"
                value={editedTask.category}
                onChange={handleChange}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="editPriority">Приоритет</label>
              <select
                id="editPriority"
                name="priority"
                value={editedTask.priority}
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
            <label htmlFor="editDueDate">Дата выполнения</label>
            <input
              type="date"
              id="editDueDate"
              name="dueDate"
              value={editedTask.dueDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="completed"
                checked={editedTask.completed}
                onChange={(e) => setEditedTask(prev => ({ 
                  ...prev, 
                  completed: e.target.checked 
                }))}
                className="checkbox-input"
              />
              <span className="custom-checkbox"></span>
              Задача выполнена
            </label>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onCancel}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn-save"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;