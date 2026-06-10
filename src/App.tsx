import React from 'react';
import { useTodos } from './hooks/useTodos';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import StatsBar from './components/StatsBar';
import { FilterType } from './types';
import './App.css';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
];

const App: React.FC = () => {
  const {
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
  } = useTodos();

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-accent" />
          <h1 className="app-title">
            <span className="title-todo">todo</span>
            <span className="title-dot">.</span>
          </h1>
          <p className="app-subtitle">Stay focused. Get things done.</p>
        </header>

        <StatsBar stats={stats} onClearCompleted={deleteCompleted} />

        <TodoForm onAdd={addTodo} />

        <div className="filters">
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-btn ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {f.value === 'ACTIVE' && stats.pending > 0 && (
                <span className="badge">{stats.pending}</span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <span>Loading...</span>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {filter === 'COMPLETED' ? '🎉' : filter === 'ACTIVE' ? '✨' : '📝'}
            </div>
            <p>
              {filter === 'COMPLETED'
                ? 'No completed tasks yet'
                : filter === 'ACTIVE'
                ? 'All tasks done!'
                : 'Start by adding a task above'}
            </p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
