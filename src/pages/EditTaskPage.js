import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { withAuth, withLoading } from '../components/HOC/withAuth';  
import TaskForm from '../components/TaskForm/TaskForm';
import '../styles/EditTaskPage.css';

function EditTaskPage({ user, isLoading: propLoading }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask, isLoading: tasksLoading } = useTasks();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === parseInt(id));
    if (foundTask) {
      setTask(foundTask);
    }
    setLoading(false);
  }, [id, tasks]);

  const handleSave = async (updatedTask) => {
    await updateTask({ ...updatedTask, id: parseInt(id) });
    navigate('/tasks');
  };

  const isLoading = propLoading || tasksLoading || loading;

  if (!task && !loading) {
    return (
      <div className="error-page">
        <h2>Задача не найдена</h2>
        <button onClick={() => navigate('/tasks')}>Вернуться к списку</button>
      </div>
    );
  }

  return (
    <div className="edit-task-page">
      <div className="page-header">
        <h1>Редактирование задачи</h1>
        <p>Пользователь: {user?.name || 'Гость'}</p>
      </div>
      
      <TaskForm
        initialValues={task}
        onSubmit={handleSave}
        submitButtonText="Сохранить изменения"
      />
    </div>
  );
}

// Применяем HOC
export default withAuth(withLoading(EditTaskPage), {
  redirectTo: '/login',
  requiredRole: 'admin'
});