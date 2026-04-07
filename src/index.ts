import type { Todo, Filter } from './types.js';
import { loadTodos, saveTodos } from './storage.js';
import { renderTodos, setActiveFilter } from './ui.js';

let todos: Todo[] = loadTodos();
let nextId: number = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
let filter: Filter = 'all';

function refresh(): void {
  saveTodos(todos);
  renderTodos(todos, filter, toggleTodo, deleteTodo, editTodo);
  setActiveFilter(filter);
}

function toggleTodo(id: number): void {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  refresh();
}

function deleteTodo(id: number): void {
  todos = todos.filter(t => t.id !== id);
  refresh();
}

function editTodo(id: number, text: string): void {
  todos = todos.map(t => t.id === id ? { ...t, text } : t);
  refresh();
}

// Add
const input = document.getElementById('todo-input') as HTMLInputElement;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
const dateInput = document.getElementById('todo-date') as HTMLInputElement;

addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: nextId++, text, completed: false, dueDate: dateInput.value || undefined });
  input.value = '';
  dateInput.value = '';
  refresh();
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filter = (btn as HTMLElement).dataset['filter'] as Filter;
    refresh();
  });
});

refresh();
