import React, { useState } from 'react';
import { Todo, TodoRequest, Priority } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, req: TodoRequest) => void;
}

const PRIORITY_ICONS: Record<Priority, string> = {
  HIGH: '🔴',
  MEDIUM: '🟡',
  LOW: '🟢',
};

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDesc.trim() || undefined,
      completed: todo.completed,
      priority: editPriority,
    });
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditing(false);
  };

  if (editing) {
    return (
      <li className="todo-item editing">
        <input
          className="edit-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <textarea
          className="edit-textarea"
          value={editDesc}
          onChange={e => setEditDesc(e.target.value)}
          placeholder="Description..."
          rows={2}
        />
        <div className="edit-footer">
          <div className="priority-select">
            {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                className={`priority-btn priority-${p.toLowerCase()} ${editPriority === p ? 'active' : ''}`}
                onClick={() => setEditPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} priority-border-${todo.priority.toLowerCase()}`}>
      <button
        className={`checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && <span>✓</span>}
      </button>
      <div className="todo-content" onClick={() => !todo.completed && setEditing(true)}>
        <div className="todo-title">
          <span className="priority-icon">{PRIORITY_ICONS[todo.priority]}</span>
          {todo.title}
        </div>
        {todo.description && <p className="todo-desc">{todo.description}</p>}
        <span className="todo-date">
          {new Date(todo.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </span>
      </div>
      <div className="todo-actions">
        {!todo.completed && (
          <button className="edit-btn" onClick={() => setEditing(true)} aria-label="Edit">
            ✏️
          </button>
        )}
        <button className="delete-btn" onClick={() => onDelete(todo.id)} aria-label="Delete">
          ✕
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
