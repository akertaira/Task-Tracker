import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// afterEach - это глобальная функция Jest, не нужно её импортировать!
afterEach(() => {
  cleanup();
});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

global.fetch = jest.fn();

global.console.error = jest.fn();