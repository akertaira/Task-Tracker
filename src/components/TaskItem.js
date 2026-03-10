import React from 'react';
import { useTasks } from '../context/TaskContext';
import '../styles/TaskItem.css';

const TaskItem = React.memo(({ 
  task, 
  index, 
  onDeleteTask, 
  onToggleStatus, 
  onEditTask,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  activeButton,
  setActiveButton
}) => {
  const { searchTerm, highlightText } = useTasks();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Высокий': return '#ef4444';
      case 'Средний': return '#f59e0b';
      case 'Низкий': return '#10b981';
      default: return '#64748b';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  const renderTitle = () => {
    if (searchTerm && task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return (
        <span 
          dangerouslySetInnerHTML={{ 
            __html: highlightText(task.title, searchTerm)
          }} 
        />
      );
    }
    return task.title;
  };

  const renderDescription = () => {
    if (searchTerm && task.description && 
        task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return (
        <p 
          className="task-description"
          dangerouslySetInnerHTML={{ 
            __html: highlightText(task.description, searchTerm)
          }}
        />
      );
    }
    return task.description && <p className="task-description">{task.description}</p>;
  };

  return (
    <div 
      className={`task-item ${isHovered ? 'hovered' : ''} ${task.completed ? 'completed' : ''} 
                  ${searchTerm && task.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 'search-match' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="task-item-content">
        <div className="task-checkbox" onClick={() => onToggleStatus(task.id)}>
          <div className={`checkbox ${task.completed ? 'checked' : ''}`}>
            {task.completed && '✓'}
          </div>
        </div>
        
        <div className="task-info">
          <div className="task-header">
            <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
              {renderTitle()}
            </h3>
            <div className="task-meta">
              <span 
                className="task-priority"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
              <span className={`task-date ${isOverdue ? 'overdue' : ''}`}>
                {formatDate(task.dueDate)}
                {isOverdue && ' ⚠️'}
              </span>
            </div>
          </div>
          
          {renderDescription()}
          
          <div className="task-footer">
            <span className="task-category">{task.category}</span>
            <div className="task-actions">
              <button
                className={`btn-edit ${activeButton === `edit-${task.id}` ? 'active' : ''}`}
                onClick={() => onEditTask(task)}
                onMouseEnter={() => setActiveButton(`edit-${task.id}`)}
                onMouseLeave={() => activeButton === `edit-${task.id}` && setActiveButton(null)}
              >
                ✏️ Редактировать
              </button>
              <button
                className={`btn-delete ${activeButton === `delete-${task.id}` ? 'active' : ''}`}
                onClick={() => onDeleteTask(task.id)}
                onMouseEnter={() => setActiveButton(`delete-${task.id}`)}
                onMouseLeave={() => activeButton === `delete-${task.id}` && setActiveButton(null)}
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="task-status-indicator">
        <div className={`status-dot ${task.completed ? 'completed' : 'pending'}`} />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.category === nextProps.task.category &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.dueDate === nextProps.task.dueDate &&
    prevProps.task.completed === nextProps.task.completed &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.activeButton === nextProps.activeButton
  );
});

export default TaskItem;