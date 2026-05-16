import React from 'react';
import { useTaskCard } from './TaskCard';
import '../../styles/TaskCard.css';

function TaskCardBody() {
  const { task, expanded } = useTaskCard();

  if (!expanded) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className="task-card-body">
      {task.description && (
        <div className="task-description">
          <strong>Описание:</strong>
          <p>{task.description}</p>
        </div>
      )}
      
      <div className="task-details">
        <div className="detail-item">
          <span className="detail-label">📁 Категория:</span>
          <span className="detail-value">{task.category}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">📅 Дата выполнения:</span>
          <span className={`detail-value ${isOverdue ? 'overdue' : ''}`}>
            {formatDate(task.dueDate)}
            {isOverdue && ' ⚠️ Просрочено'}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">🕐 Создано:</span>
          <span className="detail-value">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskCardBody;