const KEY = 'todos';
export function loadTodos() {
    try {
        return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    }
    catch {
        return [];
    }
}
export function saveTodos(todos) {
    localStorage.setItem(KEY, JSON.stringify(todos));
}
//# sourceMappingURL=storage.js.map