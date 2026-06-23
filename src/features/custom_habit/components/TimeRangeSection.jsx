import styles from '../../../styles/HabitDetail.module.css';

const TIME_RANGES = ['Anytime', 'Morning', 'Afternoon', 'Evening'];

export default function TimeRangeSection({habit, colors, onChange}) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>Time Range</div>
            <div className={styles.timeRangeRow}>
                {TIME_RANGES.map(t => (
                    <button
                        key={t}
                        type="button"
                        className={`${styles.timeBtn} ${habit.timeRange === t ? styles.timeBtnActive : ''}`}
                        style={habit.timeRange === t ? {
                            background: colors.accent,
                            borderColor: colors.accent,
                            color: '#000'
                        } : {}}
                        onClick={() => onChange('timeRange', t)}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
    );
}
