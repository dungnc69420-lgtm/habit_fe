import React, { useState } from 'react';
import { TodoRequest, Priority } from '../types';

interface Props {
  onAdd: (req: TodoRequest) => Promise<void>;
}

const TodoForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title: title.trim(), description: description.trim() || undefined, priority });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setExpanded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-main">
        <input
          className="form-input"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          disabled={loading}
        />
        <button
          type="button"
          className="expand-btn"
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle options"
        >
          {expanded ? '−' : '+'}
        </button>
        <button className="add-btn" type="submit" disabled={!title.trim() || loading}>
          {loading ? '...' : 'Add'}
        </button>
      </div>
      {expanded && (
        <div className="form-extras">
          <textarea
            className="form-textarea"
            placeholder="Add a description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />
          <div className="priority-select">
            <span className="priority-label">Priority:</span>
            {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                className={`priority-btn priority-${p.toLowerCase()} ${priority === p ? 'active' : ''}`}
                onClick={() => setPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;
