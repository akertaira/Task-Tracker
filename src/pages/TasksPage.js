import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/TaskForm/TaskForm';
import TaskFilter from '../components/TaskFilter';
import TaskStats from '../components/TaskStats';
import Calendar from '../components/Calendar';
import Modal from '../components/Modal';
import PageContent from '../components/PageContent';
import TaskItem from '../components/TaskItem';
import TaskSearch from '../components/TaskSearch';
import '../styles/TasksPage.css';

function TasksPage() {
  const { 
    tasks,
    filteredTasks, 
    filter,
    setFilter,
    sortBy,
    setSortBy,
    categories,
    selectedDate,
    isDateFilterActive,
    hoveredTask,
    activeButton,
    searchTerm,
    setHoveredTask,
    setActiveButton,
    handleDateSelect,      
    clearDateFilter,
    deleteTask,
    toggleTaskStatus,
    openEditModal,
    addTask,
    isModalOpen,
    editingTask,
    closeModal,
    updateTask
  } = useTasks();

  // Функция для добавления задачи
  const handleAddTask = async (taskData) => {
    console.log('📝 Добавление задачи:', taskData);
    try {
      await addTask(taskData);
      console.log('✅ Задача добавлена успешно');
    } catch (error) {
      console.error('❌ Ошибка добавления:', error);
    }
  };

  // Функция для обновления задачи
  const handleUpdateTask = async (taskData) => {
    console.log('📝 Обновление задачи:', taskData);
    try {
      await updateTask(taskData);
      console.log('✅ Задача обновлена успешно');
    } catch (error) {
      console.error('❌ Ошибка обновления:', error);
    }
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="page-title">📋 Управление задачами</h1>
        <p className="page-description">
          {isDateFilterActive 
            ? `Задачи на ${new Date(selectedDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}` 
            : 'Все ваши задачи в одном месте'}
        </p>
      </div>

      <div className="tasks-container">
        <div className="sidebar">
          <TaskForm 
            onSubmit={handleAddTask}
            submitButtonText="➕ Добавить задачу"
          />
          
          <Calendar 
            tasks={tasks}
            onDateSelect={handleDateSelect}  
            selectedDate={selectedDate}
          />
          
          <TaskStats />
        </div>

        <div className="main-content">
          {isDateFilterActive && (
            <div className="date-filter-indicator">
              <span>📅 Показаны задачи на выбранную дату</span>
              <button 
                className="clear-date-filter"
                onClick={clearDateFilter}
              >
                ✕ Сбросить фильтр
              </button>
            </div>
          )}
          
          <TaskSearch />
          
          <TaskFilter 
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            isDateFilterActive={isDateFilterActive}
          />
          
          {searchTerm && (
            <div className="search-results-info">
              Найдено задач: {filteredTasks.length}
            </div>
          )}
          
          <PageContent 
            items={filteredTasks}
            renderItem={(task) => (
              <TaskItem
                key={task.id}
                task={task}
                index={filteredTasks.indexOf(task)}
                onDeleteTask={deleteTask}
                onToggleStatus={toggleTaskStatus}
                onEditTask={openEditModal}
                isHovered={hoveredTask === task.id}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
              />
            )}
          />
        </div>
      </div>

      {isModalOpen && editingTask && (
        <Modal 
          task={editingTask}
          onSave={handleUpdateTask}
          onCancel={closeModal}
          categories={categories}
        />
      )}
    </div>
  );
}

export default TasksPage;