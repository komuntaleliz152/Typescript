import type { Todo, Filter } from './types.js';
export declare function renderTodos(todos: Todo[], filter: Filter, onToggle: (id: number) => void, onDelete: (id: number) => void, onEdit: (id: number, text: string) => void): void;
export declare function setActiveFilter(filter: Filter): void;
//# sourceMappingURL=ui.d.ts.map