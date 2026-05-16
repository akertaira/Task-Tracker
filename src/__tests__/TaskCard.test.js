import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/TaskCard/TaskCard';
import { TaskProvider } from '../context/TaskContext';

const mockTask = {
  id: 1,
  title: 'Тестовая задача',
  description: 'Тестовое описание',
  category: 'Работа',
  priority: 'Высокий',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  completed: false,
  createdAt: new Date().toISOString()
};

describe('TaskCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит заголовок задачи', () => {
    render(
      <TaskProvider>
        <TaskCard task={mockTask} />
      </TaskProvider>
    );
    
    expect(screen.getByText('Тестовая задача')).toBeInTheDocument();
  });

  test('разворачивает карточку при клике', () => {
    render(
      <TaskProvider>
        <TaskCard task={mockTask} />
      </TaskProvider>
    );
    
    const header = screen.getByText('Тестовая задача').closest('.task-card-header');
    fireEvent.click(header);
    
    expect(screen.getByText('Тестовое описание')).toBeInTheDocument();
  });

  test('открывает модальное окно при клике на редактирование', () => {
    render(
      <TaskProvider>
        <TaskCard task={mockTask} />
      </TaskProvider>
    );
    
    const editBtn = screen.getByText('✏️');
    fireEvent.click(editBtn);
    
    expect(screen.getByText(/Редактирование задачи/i)).toBeInTheDocument();
  });
});