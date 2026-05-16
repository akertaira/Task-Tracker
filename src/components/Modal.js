import React, { useEffect } from 'react';
import { useForm } from '../hooks/useForm';
import '../styles/Modal.css';

const validateField = (name, value) => {
  switch (name) {
    case 'title':
      if (!value.trim()) return 'Заголовок обязателен';
      if (value.length < 3) return 'Заголовок должен быть не менее 3 символов';
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

function Modal({ task, onSave, onCancel, categories }) {
  const { 
    values, 
    errors, 
    touched, 
    isSubmitting,
    handleChange, 
    handleBlur, 
    handleSubmit,
    setFormValues
  } = useForm(task, validateField, async (formData) => {
    await onSave(formData);
  });

  useEffect(() => {
    if (task) {
      setFormValues(task);
    }
  }, [task, setFormValues]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

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
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.title && errors.title ? 'error' : ''}`}
              disabled={isSubmitting}
            />
            {touched.title && errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="editDescription">Описание</label>
            <textarea
              id="editDescription"
              name="description"
              value={values.description}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="editCategory">Категория</label>
              <select
                id="editCategory"
                name="category"
                value={values.category}
                onChange={handleChange}
                className="form-select"
                disabled={isSubmitting}
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
                value={values.priority}
                onChange={handleChange}
                className="form-select"
                disabled={isSubmitting}
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
              value={values.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.dueDate && errors.dueDate ? 'error' : ''}`}
              disabled={isSubmitting}
            />
            {touched.dueDate && errors.dueDate && (
              <span className="error-message">{errors.dueDate}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="completed"
                checked={values.completed}
                onChange={(e) => setFormValues({ completed: e.target.checked })}
                className="checkbox-input"
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;