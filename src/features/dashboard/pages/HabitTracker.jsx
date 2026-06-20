import {useState} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {useHabitTemplates} from '../components/useHabitTemplates';
import HabitCard from '../../habit_template/pages/HabitCard';
import CalendarStrip from '../pages/CalendarStrip';
import styles from '../../../styles/HabitTracker.module.css';
import {useAuth} from "../../../context/AuthContext";

const NAV = [
    {to: '/habit-tracker', icon: '📋', label: 'Habits'},
    {to: '/statistics', icon: '🎥', label: 'Statistics'},
    {to: '/settings', icon: '🥗', label: 'Settings'},
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

const FILTERS = [
    {id: 'all', label: 'All'},
    {id: 'active', label: 'Active'},
    {id: 'completed', label: 'Done'},
];

export default function HabitTracker() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const {habits, toggleDone, completedCount, completionPct} = useHabitTemplates();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filter, setFilter] = useState('all');

    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();

    const filtered = habits.filter(h => {
        if (filter === 'completed') return h.progress >= h.target;
        if (filter === 'active') return h.progress < h.target;
        return true;
    });

    return (
        <div className={styles.layout}>

            <aside className={styles.sidebar}>
                <div>
                    <div className="auth-logo">
                        Habit<span>Tracker</span>
                    </div>

                    <nav className={styles.menu}>
                        <nav className="sidebar-nav">
                            {NAV.map(n => (
                                <NavLink
                                    key={n.to}
                                    to={n.to}
                                    end={n.to === '/habit-tracker'}
                                    className={({isActive}) =>
                                        `nav-item ${isActive ? 'nav-active' : ''}`}
                                >
                                    <span className="nav-icon">{n.icon}</span>
                                    {n.label}
                                </NavLink>
                            ))}
                        </nav>
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <div className="user-row">
                        <div className="user-avatar">{user?.name?.[0] ?? user?.email?.[0] ?? '?'}</div>
                        <div className="user-info">
                            <div className="user-name">{user?.name ?? 'Member'}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                    </div>
                    <button className='logout-btn' onClick={handleLogout}>Log out</button>
                </div>
            </aside>

            <main className={styles.content}>

                <div className={styles.topBar}>
                    <div>
                        <h1>Today's Habits</h1>
                        <p>
                            {MONTHS[today.getMonth()]} {today.getDate()}
                        </p>
                    </div>

                    <Link to="/new-habit" className="nav-btn-solid">+ New Habit</Link>
                </div>

                <div className={styles.calendarCard}>
                    <CalendarStrip
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                </div>

                {/*TODO: Implement this */}
                {/*<div className={styles.list}>*/}
                {/*    {filtered.map(habit => (*/}
                {/*        <HabitCard*/}
                {/*            key={habit.id}*/}
                {/*            habit={habit}*/}
                {/*            onToggle={toggleDone}*/}
                {/*        />*/}
                {/*    ))}*/}
                {/*</div>*/}

            </main>

            <aside className={styles.statsPanel}>

                <div className={styles.statCard}>
                    <h3>Completion</h3>
                    <h1>{completionPct}%</h1>
                </div>

                <div className={styles.statCard}>
                    <h3>Completed</h3>
                    <h1>
                        {completedCount}/{habits.length}
                    </h1>
                </div>

            </aside>

        </div>
    );
}
