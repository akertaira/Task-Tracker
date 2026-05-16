import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../components/TaskList/TaskList'; // Проверьте путь!

// Мок для useTasks
const mockTasks = [
  {
    id: 1,
    title: 'Задача 1',
    description: 'Описание 1',
    category: 'Работа',
    priority: 'Высокий',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Задача 2',
    description: 'Описание 2',
    category: 'Личное',
    priority: 'Средний',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: true,
    createdAt: new Date().toISOString()
  }
];

// Мокаем весь контекст
jest.mock('../context/TaskContext', () => ({
  useTasks: () => ({
    filteredTasks: mockTasks,
    deleteTask: jest.fn(),
    toggleTaskStatus: jest.fn(),
    openEditModal: jest.fn(),
    hoveredTask: null,
    setHoveredTask: jest.fn(),
    activeButton: null,
    setActiveButton: jest.fn(),
    isLoading: false
  }),
  TaskProvider: ({ children }) => <>{children}</> // Простой провайдер
}));

// Импортируем TaskProvider из мока (он уже доступен)
import { TaskProvider } from '../context/TaskContext';

describe('TaskList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит список задач', () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    expect(screen.getByText('Задача 1')).toBeInTheDocument();
    expect(screen.getByText('Задача 2')).toBeInTheDocument();
  });

  test('показывает пустое состояние, когда задач нет', () => {
    // Временно переопределяем мок для этого теста
    const mockUseTasks = require('../context/TaskContext').useTasks;
    const originalImpl = mockUseTasks();
    
    mockUseTasks.mockReturnValue({
      filteredTasks: [],
      deleteTask: jest.fn(),
      toggleTaskStatus: jest.fn(),
      openEditModal: jest.fn(),
      hoveredTask: null,
      setHoveredTask: jest.fn(),
      activeButton: null,
      setActiveButton: jest.fn(),
      isLoading: false
    });

    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    expect(screen.getByText(/задачи не найдены/i)).toBeInTheDocument();
    
    // Восстанавливаем оригинальный мок
    mockUseTasks.mockReturnValue(originalImpl);
  });

  test('выполненные задачи имеют класс completed', () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    const completedTask = screen.getByText('Задача 2').closest('.task-item');
    expect(completedTask).toHaveClass('completed');
  });

  test('клик по чекбоксу вызывает toggleTaskStatus', async () => {
    const mockToggleTaskStatus = jest.fn();
    const mockUseTasks = require('../context/TaskContext').useTasks;
    const originalImpl = mockUseTasks();
    
    mockUseTasks.mockReturnValue({
      filteredTasks: mockTasks,
      deleteTask: jest.fn(),
      toggleTaskStatus: mockToggleTaskStatus,
      openEditModal: jest.fn(),
      hoveredTask: null,
      setHoveredTask: jest.fn(),
      activeButton: null,
      setActiveButton: jest.fn(),
      isLoading: false
    });

    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(mockToggleTaskStatus).toHaveBeenCalledWith(1);
    });
    
    mockUseTasks.mockReturnValue(originalImpl);
  });

});