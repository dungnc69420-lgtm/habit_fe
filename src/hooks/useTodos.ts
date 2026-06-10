import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoRequest, Stats, FilterType } from '../types';
import { todoApi } from '../api/todoApi';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0 });
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const completed = filter === 'COMPLETED' ? true : filter === 'ACTIVE' ? false : undefined;
      const [data, statsData] = await Promise.all([
        todoApi.getAll(completed),
        todoApi.getStats(),
      ]);
      setTodos(data);
      setStats(statsData);
    } catch (e) {
      setError('Failed to load todos. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (request: TodoRequest) => {
    const created = await todoApi.create(request);
    setTodos(prev => [created, ...prev]);
    setStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
  };

  const updateTodo = async (id: number, request: TodoRequest) => {
    const updated = await todoApi.update(id, request);
    setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  const toggleTodo = async (id: number) => {
    const updated = await todoApi.toggle(id);
    setTodos(prev => {
      const filtered = filter !== 'ALL'
        ? prev.filter(t => t.id !== id)
        : prev.map(t => (t.id === id ? updated : t));
      return filtered;
    });
    setStats(prev => ({
      ...prev,
      completed: updated.completed ? prev.completed + 1 : prev.completed - 1,
      pending: updated.completed ? prev.pending - 1 : prev.pending + 1,
    }));
  };

  const deleteTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    await todoApi.delete(id);
    setTodos(prev => prev.filter(t => t.id !== id));
    setStats(prev => ({
      total: prev.total - 1,
      completed: todo?.completed ? prev.completed - 1 : prev.completed,
      pending: !todo?.completed ? prev.pending - 1 : prev.pending,
    }));
  };

  const deleteCompleted = async () => {
    await todoApi.deleteCompleted();
    fetchTodos();
  };

  return {
    todos,
    stats,
    filter,
    setFilter,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    deleteCompleted,
    refetch: fetchTodos,
  };
};
