import styles from '../../../styles/HabitDetail.module.css';

function dateInputStyle(colors) {
    return {
        background: colors.accent + '22',
        color: colors.accent,
        borderColor: colors.accent + '55',
        fontWeight: 600,
    };
}

export default function HabitTermSection({habit, colors, onChange}) {
    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>Habit Term</div>
            <div className={styles.termRow}>
                <div className={styles.termField}>
                    <span className={styles.termLabel}>Start Date</span>
                    <input
                        type="date"
                        className={styles.datePill}
                        style={dateInputStyle(colors)}
                        value={habit.startDate}
                        onChange={e => onChange('startDate', e.target.value)}
                    />
                </div>
                <div className={styles.termField}>
                    <span className={styles.termLabel}>End Date</span>
                    {habit.endDate ? (
                        <input
                            type="date"
                            className={styles.datePill}
                            style={dateInputStyle(colors)}
                            value={habit.endDate}
                            onChange={e => onChange('endDate', e.target.value)}
                        />
                    ) : (
                        <button
                            type="button"
                            className={styles.datePill}
                            style={dateInputStyle(colors)}
                            onClick={() => onChange('endDate', today)}
                        >
                            No End
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
