// src/components/TimeTracker/TimeTracker.jsx
import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import WeekView from './WeekView';
import TaskModal from '../Modal';
import '../../styles/TimeTracker.css';

// Добавляем функцию formatWeekRange
function formatWeekRange(weekDates) {
  if (!weekDates || weekDates.length === 0) return '';
  const start = weekDates[0];
  const end = weekDates[6];
  const startStr = `${start.getDate()}.${start.getMonth() + 1}`;
  const endStr = `${end.getDate()}.${end.getMonth() + 1}`;
  return `${startStr} - ${endStr}`;
}

function getWeekDates(date) {
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
}

function TimeTracker() {
  const { tasks, updateTask, addTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(new Date()));

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(getWeekDates(newDate));
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(getWeekDates(newDate));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = (date) => {
    setSelectedTask({ dueDate: date.toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (taskData.id) {
      await updateTask(taskData);
    } else {
      await addTask(taskData);
    }
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="time-tracker">
      <div className="tracker-header">
        <button onClick={handlePrevWeek} className="nav-btn">←</button>
        <h2>{formatWeekRange(currentWeek)}</h2>
        <button onClick={handleNextWeek} className="nav-btn">→</button>
      </div>
      
      <div className="week-view">
        {currentWeek.map((date, index) => (
          <WeekView
            key={index}
            date={date}
            tasks={getTasksForDate(date)}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TimeTracker;