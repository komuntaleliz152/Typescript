import type { Todo, Filter } from './types.js';

export function renderTodos(
  todos: Todo[],
  filter: Filter,
  onToggle: (id: number) => void,
  onDelete: (id: number) => void,
  onEdit: (id: number, text: string) => void
): void {
  const list = document.getElementById('todo-list') as HTMLUListElement;
  list.innerHTML = '';

  const filtered = todos.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.classList.toggle('completed', todo.completed);

    const span = document.createElement('span');
    span.textContent = todo.text;
    span.className = 'todo-text';
    span.addEventListener('click', () => onToggle(todo.id));

    const meta = document.createElement('div');
    meta.className = 'todo-meta';
    meta.appendChild(span);

    if (todo.dueDate) {
      const today = new Date().toISOString().split('T')[0] as string;
      const due = document.createElement('span');
      due.className = 'due-date';
      due.textContent = `📅 ${todo.dueDate}`;
      if (!todo.completed && todo.dueDate < today) {
        due.classList.add('overdue');
      }
      meta.appendChild(due);
    }

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newText = prompt('Edit task:', todo.text)?.trim();
      if (newText) onEdit(todo.id, newText);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.title = 'Delete';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onDelete(todo.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(meta);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

export function setActiveFilter(filter: Filter): void {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset['filter'] === filter);
  });
}
