import React from 'react';
import '../styles/TaskFilter.css';

function TaskFilter({ 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  categories,
  activeButton,
  setActiveButton,
  isDateFilterActive
}) {
  
  const handleFilterChange = (type, value) => {
    setFilter(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="task-filter-container">
      <h2 className="filter-title">
        {isDateFilterActive ? 'Сортировка задач на выбранную дату' : 'Фильтры и сортировка'}
      </h2>
      
      {!isDateFilterActive && (
        <div className="filter-controls">
          <div className="filter-group">
            <h3>Фильтр по категории</h3>
            <div className="category-filters">
              <button
                className={`category-btn ${filter.category === 'Все' ? 'active' : ''} ${activeButton === 'filter-all' ? 'pressed' : ''}`}
                onClick={() => handleFilterChange('category', 'Все')}
                onMouseDown={() => setActiveButton('filter-all')}
                onMouseUp={() => setActiveButton(null)}
                onMouseLeave={() => activeButton === 'filter-all' && setActiveButton(null)}
              >
                Все
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${filter.category === category ? 'active' : ''} ${activeButton === `filter-${category}` ? 'pressed' : ''}`}
                  onClick={() => handleFilterChange('category', category)}
                  onMouseDown={() => setActiveButton(`filter-${category}`)}
                  onMouseUp={() => setActiveButton(null)}
                  onMouseLeave={() => activeButton === `filter-${category}` && setActiveButton(null)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Фильтр по статусу</h3>
            <div className="status-filters">
              {['Все', 'Выполненные', 'Невыполненные'].map(status => (
                <button
                  key={status}
                  className={`status-btn ${filter.status === status ? 'active' : ''} ${activeButton === `status-${status}` ? 'pressed' : ''}`}
                  onClick={() => handleFilterChange('status', status)}
                  onMouseDown={() => setActiveButton(`status-${status}`)}
                  onMouseUp={() => setActiveButton(null)}
                  onMouseLeave={() => activeButton === `status-${status}` && setActiveButton(null)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="filter-group">
        <h3>{isDateFilterActive ? 'Сортировка задач' : 'Сортировка'}</h3>
        <div className="sort-options">
          {[
            { value: 'date', label: 'По дате создания' },
            { value: 'alphabet', label: 'По алфавиту' },
            { value: 'priority', label: 'По приоритету' }
          ].map(option => (
            <button
              key={option.value}
              className={`sort-btn ${sortBy === option.value ? 'active' : ''} ${activeButton === `sort-${option.value}` ? 'pressed' : ''}`}
              onClick={() => setSortBy(option.value)}
              onMouseDown={() => setActiveButton(`sort-${option.value}`)}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => activeButton === `sort-${option.value}` && setActiveButton(null)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskFilter;