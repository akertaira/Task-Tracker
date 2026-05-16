import React, { useState, createContext, useContext } from 'react';
import TaskCardHeader from './TaskCardHeader';
import { useTasks } from '../../context/TaskContext';
import TaskCardBody from './TaskCardBody';
import TaskCardFooter from './TaskCardFooter';
import TaskModal from './TaskModal';
import '../../styles/TaskCard.css';

const TaskCardContext = createContext();

export function useTaskCard() {
  const context = useContext(TaskCardContext);
  if (!context) {
    throw new Error('useTaskCard must be used within TaskCard');
  }
  return context;
}

function TaskCard({ task, children, isExpanded = false }) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateTask, deleteTask } = useTasks();

  const toggleExpand = () => setExpanded(prev => !prev);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTaskUpdate = (updatedTask) => {
    updateTask(updatedTask);
    closeModal();
  };

  const value = {
    task,
    expanded,
    toggleExpand,
    openModal,
    closeModal,
    updateTask: handleTaskUpdate,
    deleteTask
  };

  return (
    <TaskCardContext.Provider value={value}>
      <div className={`task-card ${expanded ? 'expanded' : ''}`}>
        {children || (
          <>
            <TaskCardHeader />
            <TaskCardBody />
            <TaskCardFooter />
          </>
        )}
      </div>
      
      {isModalOpen && (
        <TaskModal task={task} onSave={handleTaskUpdate} onClose={closeModal} />
      )}
    </TaskCardContext.Provider>
  );
}

// Присоединяем подсборку
TaskCard.Header = TaskCardHeader;
TaskCard.Body = TaskCardBody;
TaskCard.Footer = TaskCardFooter;

export default TaskCard;