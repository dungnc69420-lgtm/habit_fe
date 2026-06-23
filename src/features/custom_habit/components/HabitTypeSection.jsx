import {useState} from 'react';
import DialogOverlay from './shared/DialogOverlay';
import Row from './shared/Row';
import styles from '../../../styles/HabitDetail.module.css';
import {toCapitalCase} from "../../../utils/stringUtils";

const HABIT_TYPES = ['BUILD', 'QUIT'];

/**
 * HabitTypeSection — now themed by the habit's selected color.
 * `colors` is the same {accent, bg} object passed to every other section
 * (NameSection, GoalSection, TimeRangeSection, etc.), so the active
 * Build/Quit option uses the same accent the user picked in the
 * color dialog — border, background tint, and text all derive from it.
 */
export default function HabitTypeSection({habit, colors, onChange}) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`${styles.section} ${styles.sectionCompact}`}>
            <Row
                label="Habit Type"
                noBorder
                hint
                right={
                    <span className={`${styles.rowValue}`}>
                        {toCapitalCase(habit.habitType)}
                    </span>
                }
                onClick={() => setOpen(true)}
            />

            <DialogOverlay
                open={open}
                onClose={() => setOpen(false)}
                title="Habit Type"
            >
                {HABIT_TYPES.map(type => {

                    const isActive = habit.habitType === type;

                    return (
                        <button
                            key={type}
                            type="button"
                            className={styles.dialogOption}
                            style={isActive ? {
                                borderColor: colors.accent,
                                background: colors.accent + '22',
                                color: colors.accent,
                                fontWeight: 600,
                            } : undefined}
                            onClick={() => {
                                onChange('habitType', type);
                                setOpen(false);
                            }}
                        >
                            {toCapitalCase(type)}
                        </button>
                    );
                })}
            </DialogOverlay>
        </div>
    );
}