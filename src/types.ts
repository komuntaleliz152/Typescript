export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string; // ISO date string YYYY-MM-DD
}

export type Filter = 'all' | 'pending' | 'completed';
