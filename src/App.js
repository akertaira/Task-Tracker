import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import NavBar from './components/NavBar';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <div className="app">
          <NavBar />
          <div className="app-container">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
          <footer className="app-footer">
            <p>Task Tracker © {new Date().getFullYear()}</p>
          </footer>
        </div>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;