import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import '../styles/HomePage.css';

function HomePage() {
  const { tasks } = useTasks();
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">Task Tracker</h1>
        <p className="hero-subtitle">Управляйте своими задачами эффективно и просто</p>
        <Link to="/tasks" className="hero-button">Начать работу</Link>
      </div>

      <div className="stats-preview">
        <div className="stat-card">
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-label">Всего задач</div>
          <div className="stat-icon">📊</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>{completedTasks}</div>
          <div className="stat-label">Выполнено</div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>{pendingTasks}</div>
          <div className="stat-label">В процессе</div>
          <div className="stat-icon">⏳</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#3b82f6' }}>{completionRate}%</div>
          <div className="stat-label">Выполнение</div>
          <div className="stat-icon">📈</div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Возможности приложения</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Управление задачами</h3>
            <p>Добавляйте, редактируйте и удаляйте задачи с удобным интерфейсом</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Интерактивный календарь</h3>
            <p>Визуальное отображение задач по дням с цветной индикацией</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Фильтры и сортировка</h3>
            <p>Сортируйте и фильтруйте задачи по категориям, статусу и приоритету</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Статистика</h3>
            <p>Отслеживайте прогресс и анализируйте продуктивность</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Готовы начать?</h2>
        <p>Организуйте свои задачи уже сегодня</p>
        <Link to="/tasks" className="cta-button">Перейти к задачам</Link>
      </div>
    </div>
  );
}

export default HomePage;