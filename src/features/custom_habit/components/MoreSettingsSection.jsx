import Row from './shared/Row';
import Toggle from './shared/Toggle';
import styles from '../../../styles/HabitDetail.module.css';

export default function MoreSettingsSection({habit, onChange}) {
    return (
        <div className={styles.section}>
            <Row
                label="Gesture"
                hint
                onClick={() => onChange('gesture', habit.gesture === 'Mark as done' ? 'Log value' : 'Mark as done')}
            >
                <span className={styles.rowValue}>{habit.gesture}</span>
            </Row>

            <Row label="Chart Type" noBorder>
                <div className={styles.chartToggle}>
                    <button
                        type="button"
                        className={`${styles.chartBtn} ${habit.chartType === 'bar' ? styles.chartBtnActive : ''}`}
                        onClick={() => onChange('chartType', 'bar')}
                        aria-label="Bar chart"
                        aria-pressed={habit.chartType === 'bar'}
                    >
                        ▐▌
                    </button>
                    <button
                        type="button"
                        className={`${styles.chartBtn} ${habit.chartType === 'line' ? styles.chartBtnActive : ''}`}
                        onClick={() => onChange('chartType', 'line')}
                        aria-label="Line chart"
                        aria-pressed={habit.chartType === 'line'}
                    >
                        ╱
                    </button>
                </div>
            </Row>
        </div>
    );
}
