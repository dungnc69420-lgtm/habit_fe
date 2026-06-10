export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface TodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
}

export type FilterType = 'ALL' | 'ACTIVE' | 'COMPLETED';
