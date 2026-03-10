import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">404</div>
        <h1 className="not-found-title">Страница не найдена</h1>
        <p className="not-found-text">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <Link to="/" className="not-found-button">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;