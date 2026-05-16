import React from 'react';
import { useTaskCard } from './TaskCard';
import '../../styles/TaskCard.css';

function TaskCardHeader() {
  const { task, expanded, toggleExpand, openModal } = useTaskCard();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Высокий': return '#ef4444';
      case 'Средний': return '#f59e0b';
      case 'Низкий': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div className="task-card-header" onClick={toggleExpand}>
      <div className="task-title-section">
        <div className={`task-status ${task.completed ? 'completed' : 'pending'}`} />
        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </h3>
      </div>
      
      <div className="task-meta">
        <span 
          className="task-priority"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {task.priority}
        </span>
        
        <button 
          className="edit-btn-small"
          onClick={(e) => {
            e.stopPropagation();
            openModal();
          }}
        >
          ✏️
        </button>
        
        <button className="expand-btn">
          {expanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
}

export default TaskCardHeader;