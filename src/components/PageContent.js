import React from 'react';
import '../styles/PageContent.css';

function PageContent({ items, renderItem }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">Нет элементов для отображения</h3>
        <p className="empty-state-text">Добавьте новый элемент, чтобы увидеть его здесь</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="content-grid">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="content-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PageContent;