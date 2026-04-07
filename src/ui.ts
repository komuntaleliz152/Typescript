import type { Todo, Filter, SortBy } from './types.js';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function renderTodos(
  todos: Todo[],
  filter: Filter,
  sortBy: SortBy,
  onToggle: (id: number) => void,
  onDelete: (id: number) => void,
  onEdit: (id: number, text: string) => void,
  onReorder: (orderedIds: number[]) => void
): void {
  const list = document.getElementById('todo-list') as HTMLUListElement;
  list.innerHTML = '';

  let filtered = todos.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'dueDate') return a.dueDate.localeCompare(b.dueDate);
    if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    return a.order - b.order;
  });

  filtered.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item priority-${todo.priority}`;
      li.classList.toggle('completed', todo.completed);
      li.dataset['id'] = String(todo.id);
      li.draggable = true;

      const today = new Date().toISOString().split('T')[0] as string;
      const isOverdue = !todo.completed && todo.dueDate < today;

      li.innerHTML = `
        <div class="todo-meta">
          <span class="todo-text">${todo.text}</span>
          <div class="todo-info">
            <span class="priority-badge ${todo.priority}">${todo.priority}</span>
            <span class="due-date ${isOverdue ? 'overdue' : ''}">📅 ${todo.dueDate}</span>
          </div>
        </div>
        <div class="actions">
          <button class="edit-btn" title="Edit">✏️</button>
          <button class="del-btn" title="Delete">✕</button>
        </div>
      `;

      li.querySelector('.todo-text')!.addEventListener('click', () => onToggle(todo.id));
      li.querySelector('.edit-btn')!.addEventListener('click', (e) => {
        e.stopPropagation();
        const newText = prompt('Edit task:', todo.text)?.trim();
        if (newText) onEdit(todo.id, newText);
      });
      li.querySelector('.del-btn')!.addEventListener('click', (e) => {
        e.stopPropagation();
        onDelete(todo.id);
      });

      list.appendChild(li);
  });

  setupDragAndDrop(list, onReorder);
}

function setupDragAndDrop(list: HTMLUListElement, onReorder: (ids: number[]) => void): void {
  let draggedId: number | null = null;

  list.querySelectorAll<HTMLLIElement>('.todo-item').forEach(item => {
    item.addEventListener('dragstart', () => { draggedId = Number(item.dataset['id']); item.classList.add('dragging'); });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); draggedId = null; });
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (draggedId === null || draggedId === Number(item.dataset['id'])) return;
      const items = [...list.querySelectorAll<HTMLLIElement>('.todo-item')];
      const ids = items.map(i => Number(i.dataset['id']));
      const fromIdx = ids.indexOf(draggedId);
      const toIdx = ids.indexOf(Number(item.dataset['id']));
      if (fromIdx === -1 || toIdx === -1) return;
      ids.splice(fromIdx, 1);
      ids.splice(toIdx, 0, draggedId);
      onReorder(ids);
    });
  });
}

export function setActiveFilter(filter: Filter): void {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset['filter'] === filter);
  });
}

export function updateProgress(todos: Todo[]): void {
  const bar = document.getElementById('progress-bar') as HTMLDivElement;
  const label = document.getElementById('progress-label') as HTMLSpanElement;
  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  bar.style.width = `${pct}%`;
  label.textContent = `${done}/${total} completed`;
}
