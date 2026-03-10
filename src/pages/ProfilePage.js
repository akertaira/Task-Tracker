import React from 'react';
import { useTasks } from '../context/TaskContext';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const { tasks } = useTasks();
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && !t.completed).length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const categoriesStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const priorityStats = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">👤 Профиль пользователя</h1>
        <p className="page-description">Ваша статистика и достижения</p>
      </div>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-initials">JD</span>
            </div>
            <button className="edit-profile-btn">Редактировать профиль</button>
          </div>
          
          <div className="profile-info">
            <h2 className="profile-name">John Doe</h2>
            <p className="profile-email">john.doe@example.com</p>
            <p className="profile-joined">Присоединился: Январь 2024</p>
          </div>
        </div>

        <div className="stats-section">
          <h3 className="section-title">📊 Общая статистика</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{tasks.length}</div>
              <div className="stat-label">Всего задач</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#10b981' }}>{completedTasks}</div>
              <div className="stat-label">Выполнено</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#f59e0b' }}>{pendingTasks}</div>
              <div className="stat-label">В процессе</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#ef4444' }}>{overdueTasks}</div>
              <div className="stat-label">Просрочено</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#3b82f6' }}>{completionRate}%</div>
              <div className="stat-label">Выполнение</div>
            </div>
          </div>
        </div>

        <div className="categories-section">
          <h3 className="section-title">📁 Задачи по категориям</h3>
          <div className="categories-grid">
            {Object.entries(categoriesStats).map(([category, count]) => (
              <div key={category} className="category-card">
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
            {Object.keys(categoriesStats).length === 0 && (
              <p className="no-data">Нет задач для отображения</p>
            )}
          </div>
        </div>

        <div className="priority-section">
          <h3 className="section-title">🎯 Задачи по приоритету</h3>
          <div className="priority-grid">
            <div className="priority-card high">
              <span className="priority-label">Высокий</span>
              <span className="priority-count">{priorityStats['Высокий'] || 0}</span>
            </div>
            <div className="priority-card medium">
              <span className="priority-label">Средний</span>
              <span className="priority-count">{priorityStats['Средний'] || 0}</span>
            </div>
            <div className="priority-card low">
              <span className="priority-label">Низкий</span>
              <span className="priority-count">{priorityStats['Низкий'] || 0}</span>
            </div>
          </div>
        </div>

        <div className="achievements-section">
          <h3 className="section-title">🏆 Достижения</h3>
          <div className="achievements-grid">
            {tasks.length >= 10 && (
              <div className="achievement-card">
                <span className="achievement-icon">🎯</span>
                <div className="achievement-info">
                  <h4>10+ задач</h4>
                  <p>Создано более 10 задач</p>
                </div>
              </div>
            )}
            {completedTasks >= 5 && (
              <div className="achievement-card">
                <span className="achievement-icon">✅</span>
                <div className="achievement-info">
                  <h4>5 выполненных</h4>
                  <p>Отмечено 5 задач как выполненные</p>
                </div>
              </div>
            )}
            {completionRate === 100 && tasks.length > 0 && (
              <div className="achievement-card">
                <span className="achievement-icon">🏅</span>
                <div className="achievement-info">
                  <h4>Все выполнено</h4>
                  <p>Все задачи отмечены как выполненные</p>
                </div>
              </div>
            )}
            {overdueTasks === 0 && tasks.length > 0 && (
              <div className="achievement-card">
                <span className="achievement-icon">⏰</span>
                <div className="achievement-info">
                  <h4>Без просрочек</h4>
                  <p>Нет просроченных задач</p>
                </div>
              </div>
            )}
            {Object.keys(categoriesStats).length >= 3 && (
              <div className="achievement-card">
                <span className="achievement-icon">📚</span>
                <div className="achievement-info">
                  <h4>Мастер категорий</h4>
                  <p>Задачи в 3+ категориях</p>
                </div>
              </div>
            )}
          </div>
          {tasks.length === 0 && (
            <p className="no-data">Создайте задачи, чтобы получить достижения</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;