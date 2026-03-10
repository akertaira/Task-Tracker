import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

function Calendar({ tasks, onDateSelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthTasks, setMonthTasks] = useState({});

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  useEffect(() => {
    generateCalendar();
    countTasksPerDay();
  }, [currentDate, tasks]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const firstDayIndex = (firstDay.getDay() + 6) % 7;
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayIndex; i > 0; i--) {
      const day = prevMonthDays - i + 1;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: false,
        fullDate: date
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateForComparison = new Date(year, month, i);
      dateForComparison.setHours(0, 0, 0, 0);
      
      days.push({
        date,
        day: i,
        isCurrentMonth: true,
        isToday: dateForComparison.getTime() === today.getTime(),
        fullDate: dateForComparison
      });
    }

    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        day: i,
        isCurrentMonth: false,
        isToday: false,
        fullDate: date
      });
    }

    setCalendarDays(days);
  };

  const countTasksPerDay = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const tasksCount = {};

    tasks.forEach(task => {
      const taskDate = new Date(task.dueDate);
      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth();
      const taskDay = taskDate.getDate();
      
      if (taskYear === year && taskMonth === month) {
        const dateKey = `${taskYear}-${taskMonth}-${taskDay}`;
        
        if (!tasksCount[dateKey]) {
          tasksCount[dateKey] = {
            total: 0,
            completed: 0,
            overdue: false
          };
        }
        
        tasksCount[dateKey].total++;
        if (task.completed) {
          tasksCount[dateKey].completed++;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
        if (taskDate < today && !task.completed) {
          tasksCount[dateKey].overdue = true;
        }
      }
    });

    setMonthTasks(tasksCount);
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
  if (day.isCurrentMonth) {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day.day
    );
    
    selected.setHours(0, 0, 0, 0);
    
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const dayNum = String(selected.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dayNum}`;
    
    onDateSelect(dateString);
  }
};

  const isDateSelected = (day) => {
    if (!day.isCurrentMonth || !selectedDate || !day.fullDate) return false;
    
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    
    return day.fullDate.getTime() === selected.getTime();
  };

  const getTaskIndicatorColor = (dateKey) => {
    if (!monthTasks[dateKey]) return null;
    
    const { total, completed, overdue } = monthTasks[dateKey];
    
    if (overdue) return '#ef4444';
    if (completed === total) return '#10b981';
    if (completed > 0) return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={prevMonth} title="Предыдущий месяц">
            ◀
          </button>
          <h3 className="calendar-title">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button className="nav-btn" onClick={nextMonth} title="Следующий месяц">
            ▶
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="week-days">
          {weekDays.map(day => (
            <div key={day} className="week-day">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {calendarDays.slice(0, 42).map((day, index) => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const dateKey = `${year}-${month}-${day.day}`;
            
            const hasTasks = monthTasks[dateKey];
            const indicatorColor = getTaskIndicatorColor(dateKey);
            const isSelected = isDateSelected(day);

            return (
              <div
                key={index}
                className={`calendar-day 
                  ${day.isCurrentMonth ? 'current-month' : 'other-month'}
                  ${day.isToday ? 'today' : ''}
                  ${isSelected ? 'selected' : ''}
                  ${day.isCurrentMonth ? 'clickable' : ''}`}
                onClick={() => handleDayClick(day)}
                title={
                  hasTasks 
                    ? `Задач: ${monthTasks[dateKey]?.total || 0}\nВыполнено: ${monthTasks[dateKey]?.completed || 0}`
                    : 'Нет задач'
                }
              >
                <div className="day-number">{day.day}</div>
                {hasTasks && (
                  <div 
                    className="task-indicator"
                    style={{ backgroundColor: indicatorColor }}
                  >
                    <span className="task-count">{monthTasks[dateKey].total}</span>
                  </div>
                )}
                {monthTasks[dateKey]?.overdue && (
                  <div className="overdue-indicator">!</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
          <span>Все задачи выполнены</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
          <span>Часть задач выполнена</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Есть невыполненные задачи</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Есть просроченные задачи</span>
        </div>
      </div> */}
    </div>
  );
}

export default Calendar;