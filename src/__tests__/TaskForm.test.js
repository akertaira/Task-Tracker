import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../components/TaskForm/TaskForm';

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит все поля формы', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    // Проверяем наличие полей
    expect(screen.getByPlaceholderText('Введите заголовок задачи')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите описание задачи')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // select категории
    expect(screen.getByLabelText('🟢 Низкий')).toBeInTheDocument();
    expect(screen.getByLabelText('🟡 Средний')).toBeInTheDocument();
    expect(screen.getByLabelText('🔴 Высокий')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /добавить задачу/i })).toBeInTheDocument();
  });

  test('показывает ошибку при пустом заголовке', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const submitBtn = screen.getByRole('button', { name: /добавить задачу/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Заголовок обязателен/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('успешная отправка формы с валидными данными', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    // Заполняем заголовок
    const titleInput = screen.getByPlaceholderText('Введите заголовок задачи');
    await userEvent.type(titleInput, 'Тестовая задача');
    
    // Заполняем описание
    const descriptionInput = screen.getByPlaceholderText('Введите описание задачи');
    await userEvent.type(descriptionInput, 'Тестовое описание');
    
    // Выбираем категорию
    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'Работа' } });
    
    // Выбираем приоритет
    const priorityHigh = screen.getByLabelText('🔴 Высокий');
    fireEvent.click(priorityHigh);
    
    // Устанавливаем будущую дату (сегодня + 7 дней)
    const dateInput = screen.getByDisplayValue(/2026-04-0[0-9]/);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const futureDateString = futureDate.toISOString().split('T')[0];
    fireEvent.change(dateInput, { target: { value: futureDateString } });
    
    // Отправляем форму
    const submitBtn = screen.getByRole('button', { name: /добавить задачу/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Тестовая задача',
        description: 'Тестовое описание',
        category: 'Работа',
        priority: 'Высокий',
        dueDate: futureDateString
      });
    });
  });

  test('очищает ошибки при вводе данных', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    // Сначала вызываем ошибку
    const submitBtn = screen.getByRole('button', { name: /добавить задачу/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Заголовок обязателен/i)).toBeInTheDocument();
    });
    
    // Начинаем вводить текст
    const titleInput = screen.getByPlaceholderText('Введите заголовок задачи');
    await userEvent.type(titleInput, 'Т');
    
    // Ошибка должна исчезнуть
    await waitFor(() => {
      expect(screen.queryByText(/Заголовок обязателен/i)).not.toBeInTheDocument();
    });
  });
});