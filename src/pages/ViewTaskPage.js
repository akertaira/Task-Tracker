import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { withAuth } from '../components/HOC/withAuth';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard/TaskCard';
import '../styles/ViewTaskPage.css';

function ViewTaskPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === parseInt(id));
    if (foundTask) {
      setTask(foundTask);
    }
  }, [id, tasks]);

  if (!task) {
    return (
      <div className="error-page">
        <h2>Задача не найдена</h2>
        <button onClick={() => navigate('/tasks')}>Вернуться к списку</button>
      </div>
    );
  }

  return (
    <div className="view-task-page">
      <div className="page-header">
        <h1>Просмотр задачи</h1>
        <p>Пользователь: {user?.name || 'Гость'}</p>
      </div>
      
      <TaskCard task={task} isExpanded />
      
      <div className="action-buttons">
        <button onClick={() => navigate(`/tasks/edit/${id}`)} className="edit-btn">
          ✏️ Редактировать
        </button>
        <button onClick={() => navigate('/tasks')} className="back-btn">
          ← Вернуться к списку
        </button>
      </div>
    </div>
  );
}

export default withAuth(ViewTaskPage, {
  redirectTo: '/login'
});