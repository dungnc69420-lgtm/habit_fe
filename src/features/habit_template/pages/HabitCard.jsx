import styles from '../../../styles/HabitCard.module.css';
import {COLOR_MAP} from "../../../data/habitPresets";

export default function HabitCard({habit, onToggle, onLongPress}) {
    const isDone = habit.progress >= habit.target;
    const pct = Math.min(100, Math.round((habit.progress / habit.target) * 100));
    const colors = COLOR_MAP[habit.color] || COLOR_MAP.blue;

    const cardStyle = isDone
        ? {background: colors.card, borderColor: 'transparent'}
        : {background: colors.bg, borderColor: 'transparent'};

    const formatProgress = () => {
        if (habit.unit === 'min' && habit.progress >= 60) {
            const h = Math.floor(habit.progress / 60);
            const m = habit.progress % 60;
            return `${h}h ${m > 0 ? m + 'm' : ''}`.trim();
        }
        return `${habit.progress}`;
    };

    const formatTarget = () => {
        if (habit.unit === 'min' && habit.target >= 60) {
            const h = Math.floor(habit.target / 60);
            return `${h}h`;
        }
        return `${habit.target}${habit.unit}`;
    };

    return (
        <div
            className={`${styles.card} ${isDone ? styles.done : ''}`}
            style={cardStyle}
            onClick={() => onToggle(habit.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onToggle(habit.id)}
            aria-label={`${habit.name}: ${habit.progress} of ${habit.target}${habit.unit}${isDone ? ', completed' : ''}`}
        >
            <span className={styles.icon}>{habit.icon}</span>

            <div className={styles.info}>
                <div className={styles.name} style={{color: isDone ? colors.text : '#1a1a1a'}}>
                    {habit.name}
                </div>
                {/* Progress bar — only show if in progress */}
                {pct > 0 && pct < 100 && (
                    <div className={styles.barWrap}>
                        <div className={styles.bar} style={{width: `${pct}%`, background: colors.accent}}/>
                    </div>
                )}
            </div>

            <div className={styles.right}>
                {habit.streak > 0 && (
                    <div className={styles.streak}>
                        🔥 {habit.streak} Day{habit.streak > 1 ? 's' : ''}
                    </div>
                )}
                <div className={styles.value} style={{color: isDone ? colors.text : '#555'}}>
                    {formatProgress()}/{formatTarget()}
                </div>
            </div>
        </div>
    );
}
