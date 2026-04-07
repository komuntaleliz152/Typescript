import { loadTodos, saveTodos } from './storage.js';
import { renderTodos, setActiveFilter, updateProgress } from './ui.js';
let todos = loadTodos();
let nextId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
let filter = 'all';
let sortBy = 'order';
function refresh() {
    saveTodos(todos);
    renderTodos(todos, filter, sortBy, toggleTodo, deleteTodo, editTodo, reorderTodos);
    setActiveFilter(filter);
    updateProgress(todos);
}
function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    refresh();
}
function deleteTodo(id) {
    if (!confirm('Delete this task?'))
        return;
    todos = todos.filter(t => t.id !== id);
    refresh();
}
function editTodo(id, text) {
    todos = todos.map(t => t.id === id ? { ...t, text } : t);
    refresh();
}
function reorderTodos(orderedIds) {
    orderedIds.forEach((id, index) => {
        const todo = todos.find(t => t.id === id);
        if (todo)
            todo.order = index;
    });
    refresh();
}
// DOM refs
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const sortSelect = document.getElementById('sort-by');
const darkToggle = document.getElementById('dark-toggle');
// Prevent past dates
dateInput.min = new Date().toISOString().split('T')[0];
// Add todo
addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text)
        return;
    if (!dateInput.value) {
        alert('Please pick a due date.');
        return;
    }
    const todo = {
        id: nextId++,
        text,
        completed: false,
        dueDate: dateInput.value,
        priority: priorityInput.value,
        order: todos.length,
    };
    todos.push(todo);
    input.value = '';
    dateInput.value = '';
    priorityInput.value = 'medium';
    refresh();
});
input.addEventListener('keydown', (e) => { if (e.key === 'Enter')
    addBtn.click(); });
// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filter = btn.dataset['filter'];
        refresh();
    });
});
// Sort
sortSelect.addEventListener('change', () => {
    sortBy = sortSelect.value;
    refresh();
});
// Dark mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark')
    document.body.classList.add('dark');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
refresh();
//# sourceMappingURL=index.js.map