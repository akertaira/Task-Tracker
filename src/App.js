// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { SecurityProvider } from './context/SecurityContext';
import NavBar from './components/NavBar';
import LoadingSpinner from './components/LoadingSpinner';
import AIMotivator from './components/AI/AIMotivator';
import './styles/App.css';
import SecurityTestPage from './pages/SecurityTestPage';
import { useScreenSecurity } from './hooks/useScreenSecurity';


// Lazy loading страниц
const HomePage = lazy(() => import('./pages/HomePage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const TimeTrackerPage = lazy(() => import('./pages/TimeTrackerPage'));  // ← ИСПРАВЛЕНО: импортируем страницу, а не компонент
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <SecurityProvider>
      <TaskProvider>
        <BrowserRouter>
          <div className="app">
            <NavBar />
            <div className="app-container">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/tracker" element={<TimeTrackerPage />} />  {/* ← ИСПРАВЛЕНО: используем страницу */}
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/security-test" element={<SecurityTestPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>
            <AIMotivator />
            <footer className="app-footer">
              <p>Task Tracker © {new Date().getFullYear()}</p>
            </footer>
          </div>
        </BrowserRouter>
      </TaskProvider>
    </SecurityProvider>
  );
}

export default App;