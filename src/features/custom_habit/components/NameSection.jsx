import Row from './shared/Row';
import styles from '../../../styles/HabitDetail.module.css';

/**
 * NameSection — icon picker, name/description inputs, color row, group row.
 * `colors` is the resolved {accent, bg} for the habit's currently selected color.
 */
export default function NameSection({habit, colors, onChange, onOpenColorDialog}) {
    const handleIconClick = () => {
        const emoji = prompt('Enter an emoji for your habit:');
        if (emoji) {
            onChange('icon', emoji.slice(0, 2));
        }
    };

    return (
        <div className={`${styles.section} ${styles.sectionNoBottomPadding}`}>
            <div className={styles.nameRow}>
                <button
                    type="button"
                    className={styles.iconPicker}
                    style={{borderColor: colors.accent, background: colors.bg + '33'}}
                    onClick={handleIconClick}
                >
                    <span className={styles.iconDisplay}>{habit.icon}</span>
                </button>
                <div className={styles.nameFields}>
                    <input
                        className={styles.nameInput}
                        value={habit.name}
                        onChange={e => onChange('name', e.target.value)}
                        placeholder="Habit name"
                    />
                    <input
                        className={styles.descInput}
                        value={habit.description}
                        onChange={e => onChange('description', e.target.value)}
                        placeholder="Description (Optional)"
                    />
                </div>
            </div>

            <Row
                label="Color"
                right={<div className={styles.colorPreview} style={{background: colors.accent}}/>}
                onClick={onOpenColorDialog}
            />

            <Row label="Group" noBorder>
                <span className={styles.rowValue}>{habit.group || '(Optional)'}</span>
            </Row>
        </div>
    );
}
