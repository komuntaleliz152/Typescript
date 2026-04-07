import { loadTodos, saveTodos } from './storage.js';
import { renderTodos, setActiveFilter, updateProgress, updateFilterCounts } from './ui.js';
import { toast, confirm } from './feedback.js';
let todos = loadTodos();
let nextId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
let filter = 'all';
let sortBy = 'order';
let search = '';
function refresh() {
    saveTodos(todos);
    renderTodos(todos, filter, sortBy, search, toggleTodo, deleteTodo, editTodo, reorderTodos);
    setActiveFilter(filter);
    updateProgress(todos);
    updateFilterCounts(todos);
}
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo)
        return;
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    toast(todo.completed ? `"${todo.text}" marked as pending.` : `"${todo.text}" completed! 🎉`, 'success');
    refresh();
}
async function deleteTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo)
        return;
    const yes = await confirm(`Delete "${todo.text}"? This can't be undone.`);
    if (!yes)
        return;
    todos = todos.filter(t => t.id !== id);
    toast(`"${todo.text}" deleted.`, 'error');
    refresh();
}
function editTodo(id, text) {
    todos = todos.map(t => t.id === id ? { ...t, text } : t);
    toast('Task updated.', 'info');
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
const searchInput = document.getElementById('search-input');
const clearCompletedBtn = document.getElementById('clear-completed');
// Prevent past dates
dateInput.min = new Date().toISOString().split('T')[0];
// Add todo
addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text)
        return;
    if (!dateInput.value) {
        toast('Please pick a due date.', 'error');
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
    toast(`"${text}" added to your list.`, 'success');
    input.value = '';
    dateInput.value = '';
    priorityInput.value = 'medium';
    refresh();
});
input.addEventListener('keydown', (e) => { if (e.key === 'Enter')
    addBtn.click(); });
// Search
searchInput.addEventListener('input', () => {
    search = searchInput.value.trim().toLowerCase();
    refresh();
});
// Clear completed
clearCompletedBtn.addEventListener('click', async () => {
    const count = todos.filter(t => t.completed).length;
    if (!count) {
        toast('No completed tasks to clear.', 'info');
        return;
    }
    const yes = await confirm(`Clear all ${count} completed task${count > 1 ? 's' : ''}?`);
    if (!yes)
        return;
    todos = todos.filter(t => !t.completed);
    toast(`${count} completed task${count > 1 ? 's' : ''} cleared.`, 'success');
    refresh();
});
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