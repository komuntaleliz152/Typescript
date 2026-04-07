import { loadTodos, saveTodos } from './storage.js';
import { renderTodos, setActiveFilter } from './ui.js';
let todos = loadTodos();
let nextId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
let filter = 'all';
function refresh() {
    saveTodos(todos);
    renderTodos(todos, filter, toggleTodo, deleteTodo, editTodo);
    setActiveFilter(filter);
}
function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    refresh();
}
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    refresh();
}
function editTodo(id, text) {
    todos = todos.map(t => t.id === id ? { ...t, text } : t);
    refresh();
}
// Add
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const dateInput = document.getElementById('todo-date');
// Prevent picking past dates
dateInput.min = new Date().toISOString().split('T')[0];
addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text)
        return;
    if (!dateInput.value) {
        alert('Please pick a due date.');
        return;
    }
    const dueDate = dateInput.value || undefined;
    const todo = dueDate
        ? { id: nextId++, text, completed: false, dueDate }
        : { id: nextId++, text, completed: false };
    todos.push(todo);
    input.value = '';
    dateInput.value = '';
    refresh();
});
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
        addBtn.click();
});
// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filter = btn.dataset['filter'];
        refresh();
    });
});
refresh();
//# sourceMappingURL=index.js.map