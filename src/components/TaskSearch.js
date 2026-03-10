import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import '../styles/TaskSearch.css';

function TaskSearch() {
  const { searchTerm, setSearchTerm, clearSearch } = useTasks();
  const [localValue, setLocalValue] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalValue(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    clearSearch();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
      <div className="search-container">
        <div className="search-icon">
          🔍
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Поиск по задачам..."
          value={localValue}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />
        
        {localValue && (
          <button 
            className="search-clear"
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>
      
      {localValue && (
        <div className="search-stats">
          <SearchStats />
        </div>
      )}
    </div>
  );
}

function SearchStats() {
  const { filteredTasks, tasks, searchTerm } = useTasks();
  
  if (!searchTerm) return null;
  
  const foundCount = filteredTasks.length;
  const totalCount = tasks.length;
  
  return (
    <div className="search-stats-info">
      Найдено {foundCount} из {totalCount} задач
      {foundCount === 0 && (
        <span className="no-results"> - попробуйте изменить запрос</span>
      )}
    </div>
  );
}

export default TaskSearch;