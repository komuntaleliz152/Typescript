import type { Todo } from './types.js';

const KEY = 'todos';

export function loadTodos(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Todo[];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(KEY, JSON.stringify(todos));
}
