// src/components/TaskForm/TaskForm.jsx (с ИИ)
import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import '../../styles/TaskForm.css'; 

function TaskForm({ onSubmit }) {
  const { planTaskWithAI, isAIPlanning } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Работа');
  const [priority, setPriority] = useState('Средний');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [showAIPopup, setShowAIPopup] = useState(false);

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
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    if (name === 'description') setDescription(value);
    if (name === 'category') setCategory(value);
    if (name === 'priority') setPriority(value);
    if (name === 'dueDate') setDueDate(value);
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, e.target.value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const titleError = validateField('title', title);
    const dueDateError = validateField('dueDate', dueDate);
    
    if (titleError || dueDateError) {
      setErrors({ title: titleError, dueDate: dueDateError });
      setTouched({ title: true, dueDate: true });
      return;
    }
    
    onSubmit({ title, description, category, priority, dueDate });
    
    setTitle('');
    setDescription('');
    setCategory('Работа');
    setPriority('Средний');
    setDueDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    setTouched({});
  };

  // ИИ-планирование
  const handleAIPlan = async () => {
    if (!title.trim()) {
      alert('Сначала введите заголовок задачи');
      return;
    }

    setShowAIPopup(true);
    const result = await planTaskWithAI({ title, description, category, priority, dueDate });
    
    if (result) {
      setAiSuggestion(result);
      if (result.task.dueDate) setDueDate(result.task.dueDate);
    }
  };

  const acceptAISuggestion = () => {
    if (aiSuggestion) {
      onSubmit(aiSuggestion.task);
      setAiSuggestion(null);
      setShowAIPopup(false);
      setTitle('');
      setDescription('');
      setCategory('Работа');
      setPriority('Средний');
      setDueDate(new Date().toISOString().split('T')[0]);
    }
  };

  const rejectAISuggestion = () => {
    setAiSuggestion(null);
    setShowAIPopup(false);
  };

  return (
    <div className="task-form-container">
      <h2 className="form-title">Добавить новую задачу</h2>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label>Заголовок <span className="required">*</span></label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Введите заголовок задачи"
            className={`form-input ${touched.title && errors.title ? 'error' : ''}`}
          />
          {touched.title && errors.title && <div className="error-message">{errors.title}</div>}
          <div className="char-counter">{title.length}/50</div>
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Введите описание задачи"
            className="form-textarea"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Категория</label>
            <select name="category" value={category} onChange={handleChange} className="form-select">
              <option value="Работа">📁 Работа</option>
              <option value="Личное">👤 Личное</option>
              <option value="Учеба">📚 Учеба</option>
              <option value="Здоровье">💪 Здоровье</option>
              <option value="Финансы">💰 Финансы</option>
            </select>
          </div>

          <div className="form-group">
            <label>Приоритет</label>
            <div className="radio-options">
              <label className="radio-option">
                <input type="radio" name="priority" value="Низкий" checked={priority === 'Низкий'} onChange={handleChange} />
                <span>🟢 Низкий</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="priority" value="Средний" checked={priority === 'Средний'} onChange={handleChange} />
                <span>🟡 Средний</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="priority" value="Высокий" checked={priority === 'Высокий'} onChange={handleChange} />
                <span>🔴 Высокий</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Дата выполнения <span className="required">*</span></label>
          <input
            type="date"
            name="dueDate"
            value={dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched.dueDate && errors.dueDate ? 'error' : ''}`}
            min={new Date().toISOString().split('T')[0]}
          />
          {touched.dueDate && errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
        </div>

        <div className="form-buttons">
          <button type="button" className="ai-plan-btn" onClick={handleAIPlan} disabled={isAIPlanning}>
            {isAIPlanning ? '🤔 Анализирую...' : 'ИИ-планирование'}
          </button>
          <button type="submit" className="submit-btn">Добавить задачу</button>
        </div>
      </form>

      {showAIPopup && aiSuggestion && (
        <div className="ai-popup-overlay">
          <div className="ai-popup">
            <div className="ai-popup-header">
              <span className="ai-icon">🤖</span>
              <h3>ИИ рекомендует</h3>
              <button className="close-popup" onClick={rejectAISuggestion}>✕</button>
            </div>
            <div className="ai-popup-content">
              <p><strong>Задача:</strong> {aiSuggestion.task.title}</p>
              <p><strong>⏱️ Оценка времени:</strong> {aiSuggestion.estimatedHours} часов</p>
              <p><strong>📅 Рекомендуемая дата:</strong> {aiSuggestion.task.dueDate}</p>
              <p><strong>⏰ Рекомендуемое время:</strong> {aiSuggestion.task.timeSlot}</p>
              <p><strong>🎯 Уверенность ИИ:</strong> {aiSuggestion.confidence}%</p>
              <div className="ai-suggestion-text"><strong>💡 Совет:</strong> {aiSuggestion.suggestion}</div>
            </div>
            <div className="ai-popup-actions">
              <button className="reject-btn" onClick={rejectAISuggestion}>✕ Отклонить</button>
              <button className="accept-btn" onClick={acceptAISuggestion}>✅ Принять и добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskForm;