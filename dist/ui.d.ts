import type { Todo, Filter, SortBy } from './types.js';
export declare function renderTodos(todos: Todo[], filter: Filter, sortBy: SortBy, search: string, onToggle: (id: number) => void, onDelete: (id: number) => void, onEdit: (id: number, text: string) => void, onReorder: (orderedIds: number[]) => void): void;
export declare function setActiveFilter(filter: Filter): void;
export declare function updateFilterCounts(todos: Todo[]): void;
export declare function updateProgress(todos: Todo[]): void;
//# sourceMappingURL=ui.d.ts.map