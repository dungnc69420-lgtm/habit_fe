import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useHabitTemplates} from '../components/useHabitTemplates';
import CalendarStrip from '../pages/CalendarStrip';
import styles from '../../../styles/HabitTracker.module.css';
import {MONTHS} from "../../../constants/dateConstants";

export default function HabitTracker() {
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

            {/*<aside className={styles.statsPanel}>*/}

            {/*    <div className={styles.statCard}>*/}
            {/*        <h3>Completion</h3>*/}
            {/*        <h1>{completionPct}%</h1>*/}
            {/*    </div>*/}

            {/*    <div className={styles.statCard}>*/}
            {/*        <h3>Completed</h3>*/}
            {/*        <h1>*/}
            {/*            {completedCount}/{habits.length}*/}
            {/*        </h1>*/}
            {/*    </div>*/}

            {/*</aside>*/}
        </div>
    );
}
