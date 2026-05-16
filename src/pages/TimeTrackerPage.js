// src/pages/TimeTrackerPage.jsx
import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAIEstimator } from '../hooks/useAIEstimator';
import '../styles/TimeTrackerPage.css';

function TimeTrackerPage() {
  const { tasks, updateTask, addTask } = useTasks();
  const { estimateTask, isAnalyzing, estimatedTime } = useAIEstimator();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  // Временные слоты для каждого дня (9:00 - 21:00 с интервалом 1 час)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  // Получение дат недели
  const getWeekDates = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      week.push(dayDate);
    }
    return week;
  };

  useEffect(() => {
    setCurrentWeek(getWeekDates(selectedDate));
  }, [selectedDate]);

  // Получение задач для конкретного дня и временного слота
  const getTasksForTimeSlot = (date, timeSlot) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate === dateStr && task.timeSlot === timeSlot
    );
  };

  // Получение всех задач для дня
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  // Поиск первого пустого слота для ИИ
  const findFirstEmptySlot = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    for (const timeSlot of timeSlots) {
      const existingTask = tasks.find(t => t.dueDate === dateStr && t.timeSlot === timeSlot);
      if (!existingTask) return timeSlot;
    }
    return null;
  };

  // ИИ-планирование задачи
  const handleAIPlanTask = async (taskData) => {
    setShowAIPanel(true);
    
    // Получаем оценку времени от ИИ
    const estimate = await estimateTask(taskData);
    
    // Находим первый свободный слот
    const targetDate = new Date();
    const freeSlot = findFirstEmptySlot(targetDate);
    
    if (freeSlot) {
      const suggestedTask = {
        ...taskData,
        timeSlot: freeSlot,
        estimatedHours: estimate.hours,
        dueDate: targetDate.toISOString().split('T')[0],
        aiConfidence: estimate.confidence
      };
      
      setAiSuggestions([{
        ...suggestedTask,
        suggestion: estimate.suggestion,
        estimatedTime: estimate.hours
      }]);
    }
  };

  // Принять ИИ-предложение
  const acceptAISuggestion = async (suggestion) => {
    await addTask(suggestion);
    setAiSuggestions([]);
    setShowAIPanel(false);
  };

  // Перемещение задачи (Drag & Drop)
  const handleDragStart = (e, task, date, timeSlot) => {
    setDraggedTask({ ...task, sourceDate: date, sourceTimeSlot: timeSlot });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetDate, targetTimeSlot) => {
    e.preventDefault();
    if (!draggedTask) return;
    
    const targetDateStr = targetDate.toISOString().split('T')[0];
    
    // Обновляем задачу с новым временем и датой
    await updateTask({
      ...draggedTask,
      dueDate: targetDateStr,
      timeSlot: targetTimeSlot
    });
    
    setDraggedTask(null);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleToggleTask = async (task) => {
    await updateTask({ ...task, completed: !task.completed });
  };

  const dayNames = ["Н", 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const fullDayNames = ["Неделя", 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="time-tracker-page">
      {/* Шапка */}
      <div className="tt-header">
        <h1>Недельный TimeTracker</h1>
        <div className="tt-stats">
          <div className="tt-stat">
            <span className="tt-stat-value">{totalTasks}</span>
            <span className="tt-stat-label">всего</span>
          </div>
          <div className="tt-stat">
            <span className="tt-stat-value">{completedTasks}</span>
            <span className="tt-stat-label">выполнено</span>
          </div>
          <div className="tt-stat">
            <span className="tt-stat-value">{completionRate}%</span>
            <span className="tt-stat-label">прогресс</span>
          </div>
        </div>
      </div>

      {/* ИИ-панель */}
      <div className="ai-planner-panel">
        <button 
          className="ai-planner-btn"
          onClick={() => setShowAIPanel(!showAIPanel)}
        >
          🤖 ИИ-планировщик - планирование станет намного удобнее
        </button>
        
        {showAIPanel && (
          <div className="ai-suggestions">
            <h4>✨ Предложения ИИ</h4>
            {aiSuggestions.map((suggestion, idx) => (
              <div key={idx} className="ai-suggestion-card">
                <div className="ai-suggestion-header">
                  <span className="ai-icon">🧠</span>
                  <span className="ai-title">ИИ рекомендует</span>
                  <span className="ai-confidence">уверенность: {suggestion.aiConfidence}%</span>
                </div>
                <div className="ai-suggestion-content">
                  <p><strong>{suggestion.title}</strong></p>
                  <p>⏱️ Оценка времени: {suggestion.estimatedTime} часов</p>
                  <p>📅 Предлагаемое время: {suggestion.timeSlot}</p>
                  <p>💡 {suggestion.suggestion}</p>
                </div>
                <div className="ai-suggestion-actions">
                  <button onClick={() => acceptAISuggestion(suggestion)} className="accept-btn">
                    ✅ Принять
                  </button>
                  <button onClick={() => setAiSuggestions([])} className="reject-btn">
                    ✕ Отклонить
                  </button>
                </div>
              </div>
            ))}
            {aiSuggestions.length === 0 && (
              <div className="ai-placeholder">
                <p>📝 Добавьте задачу в форму, и ИИ предложит оптимальное время</p>
                <p className="ai-example">Пример: "Сделать сложный отчет по проекту" → ИИ определит ~4 часа</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Навигация */}
      <div className="tt-nav">
        <button onClick={handlePrevWeek} className="tt-nav-btn">←</button>
        <button onClick={handleToday} className="tt-today-btn">Сегодня</button>
        <button onClick={handleNextWeek} className="tt-nav-btn">→</button>
      </div>

      {/* Заголовки дней */}
      <div className="tt-week-header">
        {dayNames.map((day, idx) => (
          <div key={day} className="tt-week-day-name">
            <span className="day-short">{day}</span>
            <span className="day-full">{fullDayNames[idx]}</span>
          </div>
        ))}
      </div>

      {/* Временные слоты */}
      <div className="tt-time-slots">
        <div className="time-labels">
          <div className="time-label-header">Время</div>
          {timeSlots.map(slot => (
            <div key={slot} className="time-label">{slot}</div>
          ))}
        </div>
        
        {/* Календарь с временными слотами */}
        <div className="tt-week-schedule">
          {currentWeek.map((date, dayIdx) => (
            <div key={dayIdx} className="tt-day-schedule">
              <div className="tt-day-date">
                {date.getDate()} {['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'][date.getMonth()]}
              </div>
              {timeSlots.map(timeSlot => {
                const tasksInSlot = getTasksForTimeSlot(date, timeSlot);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={timeSlot}
                    className={`tt-slot-cell ${isToday ? 'today' : ''} ${draggedTask ? 'drag-enabled' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, date, timeSlot)}
                  >
                    {tasksInSlot.map(task => (
                      <div
                        key={task.id}
                        className={`tt-slot-task ${task.completed ? 'completed' : ''} ${task.priority === 'Высокий' ? 'high' : task.priority === 'Средний' ? 'medium' : 'low'}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task, date, timeSlot)}
                        onClick={() => handleToggleTask(task)}
                        title={`${task.title} (${task.priority} приоритет) - ${task.estimatedHours ? `~${task.estimatedHours}ч` : ''}`}
                      >
                        <span className="task-title-short">
                          {task.title.length > 20 ? task.title.slice(0, 18) + '..' : task.title}
                        </span>
                        <span className="task-status">{task.completed ? '✓' : '○'}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Легенда */}
      <div className="tt-legend">
        <div className="legend-item">
          <div className="legend-color high"></div>
          <span>Высокий приоритет</span>
        </div>
        <div className="legend-item">
          <div className="legend-color medium"></div>
          <span>Средний приоритет</span>
        </div>
        <div className="legend-item">
          <div className="legend-color low"></div>
          <span>Низкий приоритет</span>
        </div>
        <div className="legend-item">
          <div className="legend-drag">↕️</div>
          <span>Перетащите для переноса</span>
        </div>
      </div>
    </div>
  );
}

export default TimeTrackerPage;