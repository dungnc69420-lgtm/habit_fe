import {useAuth} from '../../../context/AuthContext';
import {useNavigate, NavLink} from 'react-router-dom';
import '../../../styles/Dashboard.css';

const NAV = [
    {to: '/dashboard', icon: '⊞', label: 'Dashboard'},
    {to: '/dashboard/plans', icon: '📋', label: 'Plans'},
    {to: '/dashboard/exercises', icon: '🎥', label: 'Exercises'},
    {to: '/dashboard/nutrition', icon: '🥗', label: 'Nutrition'},
    {to: '/dashboard/progress', icon: '📈', label: 'Progress'},
    {to: '/dashboard/community', icon: '💬', label: 'Community'},
];

const STATS = [
    {label: 'Current streak', value: '0 days', accent: false},
    {label: 'Workouts done', value: '0', accent: false},
    {label: 'Plan progress', value: '0%', accent: true},
];

export default function Dashboard() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dash-layout">

            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">Train<span>Wise</span></div>

                <nav className="sidebar-nav">
                    {NAV.map(n => (
                        <NavLink
                            key={n.to}
                            to={n.to}
                            end={n.to === '/dashboard'}
                            className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}
                        >
                            <span className="nav-icon">{n.icon}</span>
                            {n.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-row">
                        <div className="user-avatar">{user?.name?.[0] ?? user?.email?.[0] ?? '?'}</div>
                        <div className="user-info">
                            <div className="user-name">{user?.name ?? 'Member'}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>Log out</button>
                </div>
            </aside>

            {/* Main */}
            <main className="dash-main">
                <header className="dash-header">
                    <div>
                        <div className="dash-eyebrow">// dashboard</div>
                        <h1 className="dash-title">
                            Good day, <span>{user?.name?.split(' ')[0] ?? 'Athlete'}</span>
                        </h1>
                    </div>
                </header>

                {/* Stats row */}
                <div className="stats-row">
                    {STATS.map(s => (
                        <div className={`stat-card ${s.accent ? 'stat-accent' : ''}`} key={s.label}>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Placeholder sections */}
                <div className="dash-grid">
                    <div className="dash-card">
                        <div className="card-label">// today's workout</div>
                        <div className="card-empty">
                            <span>🏋️</span>
                            <p>No plan started yet.</p>
                            <button className="btn-cta" onClick={() => navigate('/dashboard/plans')}>
                                Browse plans
                            </button>
                        </div>
                    </div>

                    <div className="dash-card">
                        <div className="card-label">// recent progress</div>
                        <div className="card-empty">
                            <span>📈</span>
                            <p>Start logging to see your progress.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
