import React from 'react';
import { useTaskCard } from './TaskCard';
import '../../styles/TaskCard.css';

function TaskCardFooter() {
  const { task, expanded, deleteTask, updateTask } = useTaskCard();

  if (!expanded) return null;

  const handleToggleStatus = () => {
    updateTask({ ...task, completed: !task.completed });
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
      deleteTask(task.id);
    }
  };

  return (
    <div className="task-card-footer">
      <button 
        className={`status-btn ${task.completed ? 'completed' : 'pending'}`}
        onClick={handleToggleStatus}
      >
        {task.completed ? '✅ Выполнено' : '⏳ Отметить как выполненное'}
      </button>
      
      <button className="delete-btn" onClick={handleDelete}>
        🗑️ Удалить
      </button>
    </div>
  );
}

export default TaskCardFooter;