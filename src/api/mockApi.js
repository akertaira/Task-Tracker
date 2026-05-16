import { API_CONFIG, endpoints } from './endpoints';

const delay = (ms = null) => {
  const delayTime = ms || Math.random() * (API_CONFIG.mockDelay.max - API_CONFIG.mockDelay.min) + API_CONFIG.mockDelay.min;
  return new Promise(resolve => setTimeout(resolve, delayTime));
};

let tasks = [];

const loadInitialData = () => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
    console.log('📦 Загружено из localStorage:', tasks.length, 'задач');
  } else {
    tasks = [
      {
        id: 1,
        title: 'Изучить React',
        description: 'Изучить хуки, контекст и оптимизацию',
        category: 'Учеба',
        priority: 'Высокий',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Сделать домашнее задание',
        description: 'Выполнить все задания по React',
        category: 'Учеба',
        priority: 'Средний',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Сходить в спортзал',
        description: 'Тренировка спины и бицепса',
        category: 'Здоровье',
        priority: 'Низкий',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: true,
        createdAt: new Date().toISOString()
      }
    ];
    console.log('📦 Созданы тестовые данные:', tasks.length, 'задач');
  }
};

loadInitialData();

const saveToLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  console.log('💾 Сохранено в localStorage:', tasks.length, 'задач');
};

const logRequest = (method, endpoint, data = null) => {
  console.log(`📡 [${method}] ${API_CONFIG.baseURL}${endpoint}`, data ? data : '');
};

export const taskApi = {
  getAllTasks: async () => {
    logRequest('GET', endpoints.tasks.list);
    await delay();
    return [...tasks];
  },

  getTaskById: async (id) => {
    logRequest('GET', endpoints.tasks.detail(id));
    await delay();
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Задача не найдена');
    return { ...task };
  },

  createTask: async (taskData) => {
    logRequest('POST', endpoints.tasks.create, taskData);
    await delay();
    const newTask = {
      ...taskData,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks = [newTask, ...tasks];
    saveToLocalStorage();
    return { ...newTask };
  },

  updateTask: async (id, updatedData) => {
    logRequest('PUT', endpoints.tasks.update(id), updatedData);
    await delay();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Задача не найдена');
    
    tasks[index] = { ...tasks[index], ...updatedData };
    saveToLocalStorage();
    return { ...tasks[index] };
  },

  deleteTask: async (id) => {
    logRequest('DELETE', endpoints.tasks.delete(id));
    await delay();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Задача не найдена');
    
    tasks.splice(index, 1);
    saveToLocalStorage();
    return { success: true };
  },

  toggleTaskStatus: async (id) => {
    logRequest('PATCH', endpoints.tasks.toggle(id));
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Задача не найдена');
    
    tasks[index].completed = !tasks[index].completed;
    saveToLocalStorage();
    return { ...tasks[index] };
  },
  
  getTasksByCategory: async (category) => {
    logRequest('GET', `${endpoints.tasks.list}?category=${category}`);
    await delay();
    const filtered = tasks.filter(task => task.category === category);
    return filtered;
  },

  getTasksByStatus: async (completed) => {
    logRequest('GET', `${endpoints.tasks.list}?completed=${completed}`);
    await delay();
    const filtered = tasks.filter(task => task.completed === completed);
    return filtered;
  },

  getTasksByDate: async (date) => {
    logRequest('GET', `${endpoints.tasks.list}?dueDate=${date}`);
    await delay();
    const filtered = tasks.filter(task => task.dueDate === date);
    return filtered;
  },

  deleteCompletedTasks: async () => {
    logRequest('DELETE', `${endpoints.tasks.list}/completed`);
    await delay();
    const newTasks = tasks.filter(task => !task.completed);
    tasks = newTasks;
    saveToLocalStorage();
    return { success: true, deletedCount: tasks.length - newTasks.length };
  },

  getStats: async () => {
    logRequest('GET', `${endpoints.tasks.list}/stats`);
    await delay();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && !t.completed).length,
      categories: tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
      }, {}),
      priorities: tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {})
    };
  },

  resetData: async () => {
    logRequest('POST', `${endpoints.tasks.list}/reset`);
    await delay();
    tasks = [];
    loadInitialData();
    saveToLocalStorage();
    return { success: true };
  }
};