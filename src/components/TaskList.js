import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';
import '../styles/TaskForm.css';

function TaskList() {
  const { 
    filteredTasks, 
    deleteTask, 
    toggleTaskStatus, 
    openEditModal,
    hoveredTask,
    setHoveredTask,
    activeButton,
    setActiveButton
  } = useTasks();

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>Задачи не найдены</h3>
        <p>Попробуйте изменить параметры фильтра или добавьте новую задачу</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <h2 className="task-list-title">Список задач ({filteredTasks.length})</h2>
      <div className="task-list">
        {filteredTasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            onDeleteTask={deleteTask}
            onToggleStatus={toggleTaskStatus}
            onEditTask={openEditModal}
            isHovered={hoveredTask === task.id}
            onMouseEnter={() => setHoveredTask(task.id)}
            onMouseLeave={() => setHoveredTask(null)}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;