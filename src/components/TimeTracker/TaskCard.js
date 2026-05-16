// src/components/TimeTracker/TaskCard.jsx
import React from 'react';

function TaskCard({ task, onClick }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Высокий': return 'priority-high';
      case 'Средний': return 'priority-medium';
      case 'Низкий': return 'priority-low';
      default: return '';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Высокий': return '🔴';
      case 'Средний': return '🟡';
      case 'Низкий': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div 
      className={`task-card ${task.completed ? 'completed' : ''}`}
      onClick={onClick}
    >
      <div className="task-card-header">
        <span className="task-priority-icon">{getPriorityIcon(task.priority)}</span>
        <span className={`task-priority ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      <div className="task-title">{task.title}</div>
      {task.description && (
        <div className="task-description-preview">
          {task.description.length > 50 ? task.description.slice(0, 50) + '...' : task.description}
        </div>
      )}
      <div className="task-category">
        <span>📁 {task.category}</span>
      </div>
    </div>
  );
}

export default TaskCard;