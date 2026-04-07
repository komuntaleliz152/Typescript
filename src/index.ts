import type { Todo, Filter, SortBy } from './types.js';
import { loadTodos, saveTodos } from './storage.js';
import { renderTodos, setActiveFilter, updateProgress, updateFilterCounts } from './ui.js';
import { toast, confirm } from './feedback.js';

let todos: Todo[] = loadTodos();
let nextId: number = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
let filter: Filter = 'all';
let sortBy: SortBy = 'order';
let search = '';

function refresh(): void {
  saveTodos(todos);
  renderTodos(todos, filter, sortBy, search, toggleTodo, deleteTodo, editTodo, reorderTodos);
  setActiveFilter(filter);
  updateProgress(todos);
  updateFilterCounts(todos);
}

function toggleTodo(id: number): void {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  toast(todo.completed ? `"${todo.text}" marked as pending.` : `"${todo.text}" completed! 🎉`, 'success');
  refresh();
}

async function deleteTodo(id: number): Promise<void> {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  const yes = await confirm(`Delete "${todo.text}"? This can't be undone.`);
  if (!yes) return;
  todos = todos.filter(t => t.id !== id);
  toast(`"${todo.text}" deleted.`, 'error');
  refresh();
}

function editTodo(id: number, text: string): void {
  todos = todos.map(t => t.id === id ? { ...t, text } : t);
  toast('Task updated.', 'info');
  refresh();
}

function reorderTodos(orderedIds: number[]): void {
  orderedIds.forEach((id, index) => {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.order = index;
  });
  refresh();
}

// DOM refs
const input = document.getElementById('todo-input') as HTMLInputElement;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
const dateInput = document.getElementById('todo-date') as HTMLInputElement;
const priorityInput = document.getElementById('todo-priority') as HTMLSelectElement;
const sortSelect = document.getElementById('sort-by') as HTMLSelectElement;
const darkToggle = document.getElementById('dark-toggle') as HTMLButtonElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const clearCompletedBtn = document.getElementById('clear-completed') as HTMLButtonElement;

// Prevent past dates
dateInput.min = new Date().toISOString().split('T')[0] as string;

// Add todo
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;
  if (!dateInput.value) { toast('Please pick a due date.', 'error'); return; }
  const todo: Todo = {
    id: nextId++,
    text,
    completed: false,
    dueDate: dateInput.value,
    priority: priorityInput.value as Todo['priority'],
    order: todos.length,
  };
  todos.push(todo);
  toast(`"${text}" added to your list.`, 'success');
  input.value = '';
  dateInput.value = '';
  priorityInput.value = 'medium';
  refresh();
});

input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addBtn.click(); });

// Search
searchInput.addEventListener('input', () => {
  search = searchInput.value.trim().toLowerCase();
  refresh();
});

// Clear completed
clearCompletedBtn.addEventListener('click', async () => {
  const count = todos.filter(t => t.completed).length;
  if (!count) { toast('No completed tasks to clear.', 'info'); return; }
  const yes = await confirm(`Clear all ${count} completed task${count > 1 ? 's' : ''}?`);
  if (!yes) return;
  todos = todos.filter(t => !t.completed);
  toast(`${count} completed task${count > 1 ? 's' : ''} cleared.`, 'success');
  refresh();
});

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filter = (btn as HTMLElement).dataset['filter'] as Filter;
    refresh();
  });
});

// Sort
sortSelect.addEventListener('change', () => {
  sortBy = sortSelect.value as SortBy;
  refresh();
});

// Dark mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.body.classList.add('dark');

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

refresh();
