import React from 'react';
import { useTasks } from '../context/TaskContext';
import '../styles/TaskStats.css';

function TaskStats() {
  const { tasks, selectedDate, stats } = useTasks();
  
  const filteredStats = React.useMemo(() => {
    if (!selectedDate) return stats;
    
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      const selectedDateStr = new Date(selectedDate).toISOString().split('T')[0];
      return taskDate === selectedDateStr;
    });
    
    const completed = filteredTasks.filter(t => t.completed).length;
    
    return {
      total: filteredTasks.length,
      completed: completed,
      pending: filteredTasks.length - completed,
      overdue: filteredTasks.filter(t => 
        new Date(t.dueDate) < new Date() && !t.completed
      ).length,
      completionRate: filteredTasks.length ? Math.round((completed / filteredTasks.length) * 100) : 0
    };
  }, [tasks, selectedDate, stats]);

  const displayStats = selectedDate ? filteredStats : stats;

  return (
    <div className="task-stats-container">
      <h2 className="stats-title">
        {selectedDate ? 'Статистика за день' : 'Общая статистика'}
      </h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{displayStats.total}</div>
          <div className="stat-label">Всего задач</div>
          <div className="stat-icon">📊</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {displayStats.completed}
          </div>
          <div className="stat-label">Выполнено</div>
          <div className="stat-icon">✅</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {displayStats.pending}
          </div>
          <div className="stat-label">В процессе</div>
          <div className="stat-icon">⏳</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {displayStats.overdue}
          </div>
          <div className="stat-label">Просрочено</div>
          <div className="stat-icon">⚠️</div>
        </div>
      </div>
      
      {!selectedDate && (
        <div className="completion-rate">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${displayStats.completionRate}%` }}
            ></div>
          </div>
          <p className="rate-text">Выполнено: {displayStats.completionRate}%</p>
        </div>
      )}
    </div>
  );
}

export default TaskStats;