import styles from '../../../styles/HabitDetail.module.css';

export default function HabitDetailHeader({habit, onBack}) {
    return (
        <header className={styles.header}>
            <button className={styles.backBtn} onClick={onBack} aria-label="Go back">‹</button>
            <div className={styles.headerTitle}>
                <span>{habit.icon}</span>
                <span>{habit.name || 'New Habit'}</span>
            </div>
            <div style={{width: 40}}/>
        </header>
    );
}
