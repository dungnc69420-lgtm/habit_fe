import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styles from '../../../styles/HabitDetail.module.css';
import {COLOR_MAP} from "../../../data/habitPresets";

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_RANGES = ['Anytime', 'Morning', 'Afternoon', 'Evening'];
const UNITS = ['min', 'h', 'times', 'cups', 'km', 'steps', 'kcal', 'day'];
const HABIT_TYPES = ['BUILD', 'QUIT'];

const GOAL_PERIODS = [
    'DAILY',
    'WEEKLY',
    'MONTHLY'
];

// Toggle component
function Toggle({checked, onChange}) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        >
            <span className={styles.toggleThumb}/>
        </button>
    );
}

// Row component
function Row({label, hint, right, onClick, children, noBorder, className = ''}) {
    return (
        <div
            className={`
                ${styles.row}
                ${noBorder ? styles.noBorder : ''}
                ${onClick ? styles.rowClickable : ''}
                ${className}
            `}
            onClick={onClick}
        >
            <div className={styles.rowLeft}>
                <span className={styles.rowLabel}>{label}</span>
                {hint && <span className={styles.rowHint}>?</span>}
            </div>
            <div className={styles.rowRight}>
                {children}
                {right}
                {onClick && <span className={`${styles.rowArrow} ${styles.clickDialog}`}>›</span>}
            </div>
        </div>
    );
}

function getStyle(colors) {
    return {
        background: colors.accent + '22',
        color: colors.accent,
        borderColor: colors.accent + '55'
    };
}

export default function HabitDetail({onSave}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [habit, setHabit] = useState(
        location.state?.habit
    );

    const [showColorDialog, setShowColorDialog] = useState(false);
    const [showHabitTypeDialog, setShowHabitTypeDialog] = useState(false);
    const [showGoalPeriodDialog, setShowGoalPeriodDialog] = useState(false);
    const [showTaskDaysDialog, setShowTaskDaysDialog] = useState(false);

    // Prefill from preset if passed via navigation state
    const preset = location.state?.preset ?? {};

    const toCapitalCase = (value) =>
        value.charAt(0) + value.slice(1).toLowerCase();

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setShowHabitTypeDialog(false);
            }
        };

        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const closeAllDialogs = () => {
        setShowHabitTypeDialog(false);
        setShowGoalPeriodDialog(false);
        setShowTaskDaysDialog(false);
        setShowColorDialog(false);
    };

    const taskDayLabel =
        habit.selectedDays == null || habit.selectedDays.length === 7
            ? 'Every Day'
            : habit.selectedDays.join(', ');

    const set = (key, val) => setHabit(f => ({...f, [key]: val}));

    const colors = COLOR_MAP[habit.color] || COLOR_MAP.blue;

    const toggleDay = (day) => {
        const days = habit.selectedDays?.includes(day)
            ? habit.selectedDays.filter(d => d !== day)
            : [...habit.selectedDays, day];
        set('selectedDays', days);
    };

    const addReminderTime = () => {
        set('reminderTimes', [...habit.reminderTimes, '08:00']);
    };

    const updateReminderTime = (idx, val) => {
        const times = [...habit.reminderTimes];
        times[idx] = val;
        set('reminderTimes', times);
    };

    const removeReminderTime = (idx) => {
        set('reminderTimes', habit.reminderTimes.filter((_, i) => i !== idx));
    };

    const handleSave = () => {
        if (!habit.name.trim()) return;
        onSave?.({...habit, id: preset.id ?? Date.now()});
        navigate(-1);
    };

    const goalSummary = `${habit.goalValue} ${habit.goalUnit}/${habit.goalPeriod === 'DAILY' ? 'D' : habit.goalPeriod}`;

    return (
        <div className={styles.page}>

            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">‹</button>
                <div className={styles.headerTitle}>
                    <span>{habit.icon}</span>
                    <span>{habit.name || 'New Habit'}</span>
                </div>
                <div style={{width: 40}}/>
            </header>

            <div className={styles.content}>

                {/* Section: Name + Icon */}
                <div className={styles.section}>
                    <div className={styles.nameRow}>
                        {/* Icon picker */}
                        <button
                            className={styles.iconPicker}
                            style={{borderColor: colors.accent, background: colors.bg + '33'}}
                            onClick={() => {
                                const emoji = prompt('Enter an emoji for your habit:');
                                if (emoji) set('icon', emoji.slice(0, 2));
                            }}
                        >
                            <span className={styles.iconDisplay}>{habit.icon}</span>
                        </button>
                        <div className={styles.nameFields}>
                            <input
                                className={styles.nameInput}
                                value={habit.name}
                                onChange={e => set('name', e.target.value)}
                                placeholder="Habit name"
                            />
                            <input
                                className={styles.descInput}
                                value={habit.description}
                                onChange={e => set('description', e.target.value)}
                                placeholder="Description (Optional)"
                            />
                        </div>
                    </div>

                    {/* Color */}
                    <Row
                        label="Color"
                        right={<div className={styles.colorPreview} style={{background: colors.accent}}/>}
                        onClick={() => {
                            setShowColorDialog(true)
                        }}
                    />

                    {showColorDialog && (
                        <div className={styles.dialogOverlay}>
                            <div className={styles.dialog}>
                                <h3>Choose Color</h3>

                                <div className={styles.colorGrid}>
                                    {Object.entries(COLOR_MAP).map(([key, val]) => (
                                        <button key={key}
                                                className={`${styles.colorDot} 
                                                ${habit.color === key ? styles.colorDotActive : ''}`}
                                                style={{background: val.accent}}
                                                onClick={() => {
                                                    set('color', key);
                                                    setShowColorDialog(false);
                                                }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                    }

                    {/* Group */}
                    <Row label="Group" onClick={() => {
                    }} noBorder className={styles.rowCompact}>
                        <span className={styles.rowValue}>{habit.group || '(Optional)'}</span>
                    </Row>
                </div>

                {/* Section: Habit Type */}
                <div className={`${styles.section} ${styles.sectionCompact}`}>
                    <Row
                        label="Habit Type"
                        noBorder
                        hint
                        right={<span className={`${styles.rowValue} ${styles.clickDialog}`}>{toCapitalCase(habit.habitType)}</span>}
                        onClick={() => setShowHabitTypeDialog(true)}
                    />

                    {
                        showHabitTypeDialog && (
                            <div
                                className={styles.dialogOverlay}
                                onClick={closeAllDialogs}
                            >
                                <div
                                    className={styles.dialog}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className={styles.dialogTitle}>
                                        Habit Type
                                    </div>

                                    <div className={styles.dialogBody}>
                                        {HABIT_TYPES.map(type => (
                                            <button
                                                key={type}
                                                className={`${styles.dialogOption} ${habit.habitType === type
                                                    ? styles.dialogOptionActive
                                                    : ''}`}
                                                onClick={() => {
                                                    set('habitType', type);
                                                    closeAllDialogs();
                                                }}
                                            >
                                                {toCapitalCase(type)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* Section: Goal */}
                <div className={`${styles.section} ${styles.sectionCompact}`}>
                    <Row
                        label="Goal Period"
                        hint
                        right={<span className={styles.rowValue}>{habit.goalPeriod}</span>}
                        onClick={() => setShowGoalPeriodDialog(true)}
                    />
                    {showGoalPeriodDialog && (
                        <div className={styles.dialog}>
                            <h3>Goal Period</h3>

                            {GOAL_PERIODS.map(period => (
                                <button key={period}
                                        className={styles.optionBtn}
                                        onClick={() => {
                                            set('goalPeriod', period);
                                            setShowGoalPeriodDialog(false);
                                        }}>
                                    {period}
                                </button>
                            ))}
                        </div>
                    )}
                    {/* Goal value inline editor */}
                    <div className={styles.goalRow}>
                        <span className={styles.rowLabel}>Goal Value</span>
                        <div className={styles.goalInputWrap}>
                            <input
                                type="number"
                                className={styles.goalInput}
                                value={habit.goalValue}
                                min={1}
                                onChange={e => set('goalValue', Number(e.target.value))}
                            />
                            <select
                                className={styles.goalSelect}
                                value={habit.goalUnit}
                                onChange={e => set('goalUnit', e.target.value)}
                            >
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Task days */}
                    <Row
                        label="Task Days"
                        right={<span className={styles.rowValue}>{taskDayLabel}</span>}
                        onClick={() => setShowTaskDaysDialog(true)}
                    />

                    {showTaskDaysDialog && (
                        <div className={styles.dialogOverlay}>
                            <div className={styles.dialog}>
                                <h3>Select Days</h3>

                                <div className={styles.daysGrid}>
                                    {DAYS_OF_WEEK.map(day => (
                                        <button
                                            key={day}
                                            className={`${styles.dayBtn} ${habit.selectedDays?.includes(day)
                                                ? styles.dayBtnActive
                                                : ''}`}
                                            onClick={() => toggleDay(day)}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    className={styles.doneBtn}
                                    onClick={() => setShowTaskDaysDialog(false)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Goal summary */}
                    <div className={styles.goalSummary} style={{color: colors.accent}}>
                        *
                        Complete {habit.goalValue} {habit.goalUnit} each {habit.goalPeriod === 'DAILY' ? 'day' : habit.goalPeriod.toLowerCase()}
                    </div>
                </div>

                {/* Section: Time Range */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Time Range</div>
                    <div className={styles.timeRangeRow}>
                        {TIME_RANGES.map(t => (
                            <button
                                key={t}
                                className={`${styles.timeBtn} ${habit.timeRange === t ? styles.timeBtnActive : ''}`}
                                style={habit.timeRange === t ? {
                                    background: colors.accent,
                                    borderColor: colors.accent,
                                    color: '#000'
                                } : {}}
                                onClick={() => set('timeRange', t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section: Reminders */}
                <div className={styles.section}>
                    <Row label="Reminders" noBorder={!habit.reminders}>
                        <Toggle checked={habit.reminders} onChange={v => set('reminders', v)}/>
                    </Row>

                    {habit.reminders && (
                        <>
                            <div className={styles.reminderRow}>
                                <span className={styles.rowLabel}>Time</span>
                                <button
                                    className={styles.addTimeBtn}
                                    style={{
                                        background: colors.accent + '22',
                                        color: colors.accent,
                                        borderColor: colors.accent + '44'
                                    }}
                                    onClick={addReminderTime}
                                >
                                    +
                                </button>
                            </div>
                            <div className={styles.timePills}>
                                {habit.reminderTimes.map((t, i) => (
                                    <div key={i} className={styles.timePill}
                                         style={{background: colors.accent + '22', borderColor: colors.accent + '55'}}>
                                        <input
                                            type="time"
                                            value={t}
                                            onChange={e => updateReminderTime(i, e.target.value)}
                                            className={styles.timeInput}
                                            style={{color: colors.accent}}
                                        />
                                        {habit.reminderTimes.length > 1 && (
                                            <button className={styles.removeTime}
                                                    onClick={() => removeReminderTime(i)}>×</button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Row label="Ringtone" onClick={() => {
                            }}>
                                <span className={styles.rowValue}>Default</span>
                            </Row>

                            <div className={styles.reminderMsgWrap}>
                                <input
                                    className={styles.reminderMsg}
                                    value={habit.reminderMsg}
                                    onChange={e => set('reminderMsg', e.target.value)}
                                    placeholder="Reminder message"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Section: More settings */}
                <div className={styles.section}>
                    <Row label="Show memo after completion">
                        <Toggle checked={habit.showMemo} onChange={v => set('showMemo', v)}/>
                    </Row>

                    <Row label="Gesture" hint
                         onClick={() => set('gesture', habit.gesture === 'Mark as done' ? 'Log value' : 'Mark as done')}>
                        <span className={styles.rowValue}>{habit.gesture}</span>
                    </Row>

                    {/* Chart type */}
                    <Row label="Chart Type" noBorder>
                        <div className={styles.chartToggle}>
                            <button
                                className={`${styles.chartBtn} ${habit.chartType === 'bar' ? styles.chartBtnActive : ''}`}
                                style={habit.chartType === 'bar' ? {background: colors.accent, color: '#000'} : {}}
                                onClick={() => set('chartType', 'bar')}
                                aria-label="Bar chart"
                            >
                                ▐▌
                            </button>
                            <button
                                className={`${styles.chartBtn} ${habit.chartType === 'line' ? styles.chartBtnActive : ''}`}
                                style={habit.chartType === 'line' ? {background: colors.accent, color: '#000'} : {}}
                                onClick={() => set('chartType', 'line')}
                                aria-label="Line chart"
                            >
                                ╱
                            </button>
                        </div>
                    </Row>
                </div>

                {/* Section: Habit Term */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Habit Term</div>
                    <div className={styles.termRow}>
                        <div className={styles.termField}>
                            <span className={styles.termLabel}>Start Date</span>
                            <input
                                type="date"
                                className={styles.datePill}
                                style={getStyle(colors)}
                                value={habit.startDate}
                                onChange={e => set('startDate', e.target.value)}
                            />
                        </div>
                        <div className={styles.termField}>
                            <span className={styles.termLabel}>End Date</span>
                            {habit.endDate ?
                                <input
                                    type="date"
                                    className={styles.datePill}
                                    style={getStyle(colors)}
                                    value={habit.endDate}
                                    onChange={e => set('endDate', e.target.value)}
                                />
                                :
                                <button
                                    className={styles.datePill}
                                    style={getStyle(colors)}
                                    onClick={() => set('endDate', habit.endDate ? '' : today)}
                                >
                                    {habit.endDate || 'No End'}
                                </button>}

                        </div>
                    </div>
                </div>

            </div>

            {/* Save button */}
            <div className={styles.saveWrap}>
                <button
                    className={styles.saveBtn}
                    style={{
                        background: colors.accent,
                        color: habit.color === 'amber' || habit.color === 'blue' ? '#000' : '#000'
                    }}
                    onClick={handleSave}
                    disabled={!habit.name.trim()}
                >
                    Save
                </button>
            </div>

        </div>
    );
}
