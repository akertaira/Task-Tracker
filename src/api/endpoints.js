export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  mockDelay: {
    min: 200,
    max: 800
  }
};

export const endpoints = {
  tasks: {
    list: '/tasks',
    detail: (id) => `/tasks/${id}`,
    create: '/tasks',
    update: (id) => `/tasks/${id}`,
    delete: (id) => `/tasks/${id}`,
    toggle: (id) => `/tasks/${id}/toggle`,
  },
  categories: {
    list: '/categories',
  }
};