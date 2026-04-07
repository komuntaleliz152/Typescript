export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    order: number;
}
export type Filter = 'all' | 'pending' | 'completed';
export type SortBy = 'order' | 'dueDate' | 'priority';
//# sourceMappingURL=types.d.ts.map