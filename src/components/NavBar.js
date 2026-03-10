import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">✓</span>
        <span className="brand-name">Task Tracker</span>
      </div>
      
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Главная
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/tasks" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Задачи
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/profile" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Профиль
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;