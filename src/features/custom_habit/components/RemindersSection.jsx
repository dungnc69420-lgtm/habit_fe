import Row from './shared/Row';
import Toggle from './shared/Toggle';
import styles from '../../../styles/HabitDetail.module.css';

export default function RemindersSection({habit, colors, onChange, onAddTime, onUpdateTime, onRemoveTime}) {
    return (
        <div className={styles.section}>
            <Row label="Reminders" noBorder={!habit.reminders}>
                <Toggle checked={habit.reminders} onChange={v => onChange('reminders', v)}/>
            </Row>

            {habit.reminders && (
                <>
                    <div className={styles.reminderRow}>
                        <span className={styles.rowLabel}>Time</span>
                        <button
                            type="button"
                            className={styles.addTimeBtn}
                            style={{
                                background: colors.accent,
                                color: colors.accent,
                                borderColor: colors.accent + '44'
                            }}
                            onClick={onAddTime}
                        >
                            +
                        </button>
                    </div>

                    <div className={styles.timePills}>
                        {habit.reminderTimes.map((t, i) => (
                            <div
                                key={i}
                                className={styles.timePill}
                                style={{background: colors.accent, borderColor: colors.accent}}
                            >
                                <input
                                    type="time"
                                    value={t}
                                    onChange={e => onUpdateTime(i, e.target.value)}
                                    className={styles.timeInput}
                                    style={{color: colors.accent}}
                                />
                                {habit.reminderTimes.length > 1 && (
                                    <button
                                        type="button"
                                        className={styles.removeTime}
                                        onClick={() => onRemoveTime(i)}
                                        aria-label="Remove reminder time"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Row label="Ringtone">
                        <span className={styles.rowValue}>Default</span>
                    </Row>

                    <div className={styles.reminderMsgWrap}>
                        <input
                            className={styles.reminderMsg}
                            value={habit.reminderMsg}
                            onChange={e => onChange('reminderMsg', e.target.value)}
                            placeholder="Reminder message"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
