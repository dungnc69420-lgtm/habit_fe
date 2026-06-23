import {useState} from 'react';
import DialogOverlay from './shared/DialogOverlay';
import Row from './shared/Row';
import styles from '../../../styles/HabitDetail.module.css';
import UnitPickerDialog from "./UnitPickerDialog";
import {toCapitalCase} from "../../../utils/stringUtils";

const GOAL_PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY'];

const DAYS_OF_WEEK = [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];

const MONTH_DAYS = Array.from(
    {length: 31},
    (_, i) => i + 1
);

const DAILY_RULES = [
    {value: 'EVERY_DAY', label: 'Every Day'},
    {value: 'WEEK_DAYS', label: 'Specific Week Days'},
    {value: 'MONTH_DAYS', label: 'Specific Month Days'},
    {value: 'DAYS_PER_WEEK', label: 'Number of days per week'},
    {value: 'DAYS_PER_MONTH', label: 'Number of days per month'},
];

export default function GoalSection({
                                        habit,
                                        colors,
                                        onChange,
                                        onToggleDay
                                    }) {
    const [showGoalPeriodDialog, setShowGoalPeriodDialog] = useState(false);
    const [showTaskDaysDialog, setShowTaskDaysDialog] = useState(false);
    const [showUnitDialog, setShowUnitDialog] = useState(false);
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);

    const scheduleType = habit.scheduleType ?? 'EVERY_DAY';
    const targetDays = habit.targetDays ?? 1;
    const selectedDays = habit.selectedDays ?? [];

    const maxDays = scheduleType === 'DAYS_PER_WEEK' ? 7 : 31;
    const isInvalid = targetDays < 1 || targetDays > maxDays;

    const getSelectedWeekDays = () => {
        if (!selectedDays?.length) {
            return null;
        }

        if (selectedDays.length === DAYS_OF_WEEK.length) {
            return 'Every day';
        }

        return [...selectedDays]
            .sort(
                (a, b) =>
                    DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b)
            )
            .join(', ');
    };

    const getSelectedMonthDays = () => {
        if (!selectedDays?.length) {
            return null;
        }

        if (selectedDays.length === MONTH_DAYS.length) {
            return 'Every day';
        }

        return selectedDays.sort((a, b) => a - b).join(', ');
    }

    const weekDays = getSelectedWeekDays();
    const monthDays = getSelectedMonthDays();

    const hasWeekDays = !!weekDays;
    const hasMonthDays = !!monthDays;

    const getTaskDayLabel = () => {
        if (habit.goalPeriod === 'WEEKLY') {
            return weekDays || 'Select week days';
        }

        if (habit.goalPeriod === 'MONTHLY') {
            return monthDays || 'Select month days';
        }

        const labels = {
            EVERY_DAY: 'Every day',
            WEEK_DAYS: weekDays || 'Select week days',
            MONTH_DAYS: monthDays || 'Select month days',
            DAYS_PER_WEEK: `${targetDays} days/week`,
            DAYS_PER_MONTH: `${targetDays} days/month`,
        };

        return labels[scheduleType] || 'Not selected';
    };

    const taskDayLabel = getTaskDayLabel();

    const activeStyle = {
        borderColor: colors.accent,
        background: `${colors.accent}22`,
        color: colors.accent,
        fontWeight: 600,
    };

    const enterTargetDays = () => {
        return (e) => {
            const value = e.target.value;

            if (value === '') {
                onChange('targetDays', '');
                return;
            }

            const num = Number(value);

            if (num <= maxDays) {
                onChange('targetDays', num);
            }
        };
    }

    const getGoalSummary = () => {
        const { goalValue, goalUnit, goalPeriod } = habit;

        const prefix = `Complete ${goalValue} ${goalUnit}`;

        if (goalPeriod === 'WEEKLY') {
            return hasWeekDays
                ? `${prefix} on each ${weekDays}`
                : 'Please select at least one week day';
        }

        if (goalPeriod === 'MONTHLY') {
            return hasMonthDays
                ? `${prefix} on each ${monthDays}`
                : 'Please select at least one month day';
        }

        switch (scheduleType) {
            case 'EVERY_DAY':
                return `${prefix} every day`;

            case 'WEEK_DAYS':
                if (!hasWeekDays) {
                    return 'Please select at least one week day';
                }

                return selectedDays.length === DAYS_OF_WEEK.length
                    ? `${prefix} every day`
                    : `${prefix} on each ${weekDays}`;

            case 'MONTH_DAYS':
                if (!hasMonthDays) {
                    return 'Please select at least one month day';
                }

                return selectedDays.length === MONTH_DAYS.length
                    ? `${prefix} every day`
                    : `${prefix} on each ${monthDays}`;

            case 'DAYS_PER_WEEK':
                return `${prefix} each day, any ${targetDays} day${targetDays > 1 ? 's' : ''} in a week`;

            case 'DAYS_PER_MONTH':
                return `${prefix} each day, any ${targetDays} day${targetDays > 1 ? 's' : ''} in a month`;

            default:
                return prefix;
        }
    };

    return (
        <div className={`${styles.section} ${styles.sectionCompact}`}>

            {/* GOAL PERIOD */}
            <Row
                label="Goal Period"
                hint
                right={
                    <span className={styles.rowValue}>
                        {toCapitalCase(habit.goalPeriod)}
                    </span>
                }
                onClick={() =>
                    setShowGoalPeriodDialog(true)
                }
            />

            <DialogOverlay
                open={showGoalPeriodDialog}
                onClose={() =>
                    setShowGoalPeriodDialog(false)
                }
                title="Goal Period"
            >
                {GOAL_PERIODS.map(period => {
                    const isActive = habit.goalPeriod === period;

                    return (<button
                            key={period}
                            type="button"
                            className={styles.dialogOption}
                            style={isActive ? activeStyle : undefined}
                            onClick={() => {
                                onChange('goalPeriod', period);
                                if (period === 'DAILY') {
                                    onChange('scheduleType', 'EVERY_DAY');
                                }

                                if (period === 'WEEKLY') {
                                    onChange('scheduleType', 'WEEK_DAYS');
                                }

                                if (period === 'MONTHLY') {
                                    onChange('scheduleType', 'MONTH_DAYS');
                                }

                                onChange('selectedDays', []);

                                setShowGoalPeriodDialog(false);
                            }}
                        >
                            {toCapitalCase(period)}
                        </button>
                    );
                })}
            </DialogOverlay>

            {/* DAILY RULE */}
            {habit.goalPeriod === 'DAILY' && (
                <>
                    <Row
                        label="Repeat Rule"
                        right={
                            <span className={styles.rowValue}>
                                {
                                    DAILY_RULES.find(r => r.value === scheduleType)?.label
                                }
                            </span>
                        }
                        onClick={() => setShowScheduleDialog(true)}
                    />

                    <DialogOverlay
                        open={showScheduleDialog}
                        onClose={() => setShowScheduleDialog(false)}
                        title="Repeat Rule"
                    >
                        {DAILY_RULES.map(rule => {
                            const isActive = scheduleType === rule.value;

                            return (
                                <button
                                    key={rule.value}
                                    type="button"
                                    className={styles.dialogOption}
                                    style={isActive ? activeStyle : undefined}
                                    onClick={() => {
                                        onChange('scheduleType', rule.value);
                                        onChange('selectedDays', []);
                                        setShowScheduleDialog(false);
                                    }}
                                >
                                    {rule.label}
                                </button>
                            );
                        })}
                    </DialogOverlay>
                </>
            )}

            {/* GOAL VALUE */}
            <div className={styles.goalRow}>
                <span className={styles.rowLabel}>
                    Goal Value
                </span>

                <div className={styles.goalInputWrap}>
                    <input
                        type="number"
                        className={styles.goalInput}
                        value={habit.goalValue}
                        min={1}
                        onChange={e => onChange('goalValue', Number(e.target.value))}
                    />
                    <button
                        type="button"
                        className={styles.goalSelect}
                        onClick={() => setShowUnitDialog(true)}
                    >
                        {habit.goalUnit}
                    </button>

                    <UnitPickerDialog
                        colors={colors}
                        open={showUnitDialog}
                        value={habit.goalUnit}
                        onClose={() => setShowUnitDialog(false)}
                        onSelect={(unit) => onChange('goalUnit', unit)}
                    />
                </div>
            </div>

            {/* TASK DAYS */}
            <Row
                label="Task Days"
                right={<span className={styles.rowValue}>{taskDayLabel}</span>}
                onClick={() => setShowTaskDaysDialog(true)}
            />

            <DialogOverlay
                open={showTaskDaysDialog}
                onClose={() => setShowTaskDaysDialog(false)}
                title="Task Days"
            >
                {/* WEEK DAYS */}

                {((habit.goalPeriod === 'WEEKLY') ||
                    (habit.goalPeriod === 'DAILY' &&
                        scheduleType === 'WEEK_DAYS')) && (
                    <div
                        className={styles.daysGrid}
                    >
                        {DAYS_OF_WEEK.map(day => {
                            const isActive = selectedDays.includes(day);

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    className={styles.dayBtn}
                                    style={isActive ? activeStyle : undefined}
                                    onClick={() => onToggleDay(day)}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* MONTH DAYS */}

                {((habit.goalPeriod === 'MONTHLY') ||
                    (habit.goalPeriod === 'DAILY' &&
                        scheduleType === 'MONTH_DAYS')) && (
                    <>
                        <div className={styles.dayHeader}>
                            <span className={styles.dayCount}>
                                {selectedDays.length} selected
                            </span>

                            <button
                                type="button"
                                className={styles.actionBtn}
                                onClick={() =>
                                    selectedDays.length === MONTH_DAYS.length
                                        ? onChange('selectedDays', [])
                                        : onChange('selectedDays', MONTH_DAYS)
                                }
                            >
                                {selectedDays.length === MONTH_DAYS.length
                                    ? 'Clear All'
                                    : 'Select All'}
                            </button>
                        </div>

                        <div className={styles.daysGrid}>
                            {MONTH_DAYS.map(day => {
                                const isActive = selectedDays.includes(day);

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        className={styles.dayBtn}
                                        style={isActive ? activeStyle : undefined}
                                        onClick={() => onToggleDay(day)}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* X DAYS PER WEEK */}
                {/* X DAYS PER MONTH */}

                {habit.goalPeriod === 'DAILY' &&
                    (scheduleType === 'DAYS_PER_MONTH' ||
                        scheduleType === 'DAYS_PER_WEEK') && (
                        <>
                            <div className={styles.counter}>
                                <button
                                    type="button"
                                    className={styles.counterBtn}
                                    onClick={() =>
                                        onChange(
                                            'targetDays',
                                            Math.max(1, targetDays - 1)
                                        )
                                    }
                                >
                                    −
                                </button>

                                <input
                                    type="number"
                                    className={`
                                        ${styles.counterInput}
                                        ${isInvalid ? styles.inputError : ''}
                                    `}
                                    value={targetDays}
                                    onChange={enterTargetDays()}
                                />

                                <button
                                    type="button"
                                    className={styles.counterBtn}
                                    onClick={() =>
                                        onChange(
                                            'targetDays',
                                            Math.min(
                                                maxDays,
                                                targetDays + 1
                                            )
                                        )
                                    }
                                >
                                    +
                                </button>
                            </div>

                            {isInvalid && (
                                <p className={styles.errorText}>
                                    {scheduleType === 'DAYS_PER_WEEK'
                                        ? 'Value must be between 1 and 7.'
                                        : 'Value must be between 1 and 31.'}
                                </p>
                            )}
                        </>
                    )}

                {/* EVERY DAY */}

                {habit.goalPeriod === 'DAILY' &&
                    scheduleType === 'EVERY_DAY' && (
                        <div className={styles.goalSummary}>
                            Habit can be completed
                            every day.
                        </div>
                    )
                }
            </DialogOverlay>

            <div
                className={styles.goalSummary}
                style={{color: colors.accent}}
            >
                * {getGoalSummary()}
            </div>
        </div>
    );
}
