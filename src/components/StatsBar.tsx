import React from 'react';
import { Stats } from '../types';

interface Props {
  stats: Stats;
  onClearCompleted: () => void;
}

const StatsBar: React.FC<Props> = ({ stats, onClearCompleted }) => {
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-bar">
      <div className="stats-counts">
        <div className="stat">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-lbl">Total</span>
        </div>
        <div className="stat">
          <span className="stat-num pending">{stats.pending}</span>
          <span className="stat-lbl">Pending</span>
        </div>
        <div className="stat">
          <span className="stat-num done">{stats.completed}</span>
          <span className="stat-lbl">Done</span>
        </div>
      </div>
      <div className="progress-wrap">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-pct">{pct}%</span>
      </div>
      {stats.completed > 0 && (
        <button className="clear-btn" onClick={onClearCompleted}>
          Clear completed ({stats.completed})
        </button>
      )}
    </div>
  );
};

export default StatsBar;
