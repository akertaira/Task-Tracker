// src/components/TimeTracker/WeekView.jsx
import React from 'react';
import TaskCard from './TaskCard';

function WeekView({ date, tasks, onTaskClick, onAddTask, dayStatus }) {
  const isToday = date.toDateString() === new Date().toDateString();
  const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  const shortDayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;

  return (
    <div className={`week-day ${isToday ? 'today' : ''} ${dayStatus || ''}`}>
      <div className="day-header">
        <span className="day-name">{shortDayNames[dayIndex]}</span>
        <span className="day-full-name">{dayNames[dayIndex]}</span>
        <span className="day-date">{date.getDate()}</span>
        {isToday && <span className="today-badge">Сегодня</span>}
      </div>
      
      <div className="tasks-container">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task)}
          />
        ))}
        
        <button 
          className="add-task-btn"
          onClick={() => onAddTask(date)}
        >
          + Добавить задачу
        </button>
      </div>
      
      {tasks.length === 0 && (
        <div className="empty-day">
          <span>📭</span>
          <p>Нет задач</p>
        </div>
      )}
    </div>
  );
}

export default WeekView;