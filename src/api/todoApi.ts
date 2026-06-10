import axios from 'axios';
import { Todo, TodoRequest, Stats } from '../types';

const API_BASE = '/api/todos';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const todoApi = {
  getAll: (completed?: boolean): Promise<Todo[]> => {
    const params = completed !== undefined ? { completed } : {};
    return api.get('', { params }).then(r => r.data);
  },

  getById: (id: number): Promise<Todo> =>
    api.get(`/${id}`).then(r => r.data),

  create: (data: TodoRequest): Promise<Todo> =>
    api.post('', data).then(r => r.data),

  update: (id: number, data: TodoRequest): Promise<Todo> =>
    api.put(`/${id}`, data).then(r => r.data),

  toggle: (id: number): Promise<Todo> =>
    api.patch(`/${id}/toggle`).then(r => r.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/${id}`).then(() => undefined),

  deleteCompleted: (): Promise<void> =>
    api.delete('/completed').then(() => undefined),

  getStats: (): Promise<Stats> =>
    api.get('/stats').then(r => r.data),
};
