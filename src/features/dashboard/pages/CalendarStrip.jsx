import styles from '../../../styles/CalendarStrip.module.css';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarStrip({selectedDate, onSelectDate, completedDays = []}) {
    const today = new Date();
    const days = Array.from({length: 7}, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 3 + i);
        return d;
    });

    const isSameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    return (
        <div className={styles.strip}>
            {days.map((d, i) => {
                const isToday = isSameDay(d, today);
                const isSelected = isSameDay(d, selectedDate);
                const isPast = d < today && !isToday;
                const isDone = completedDays.some(cd => isSameDay(cd, d));

                return (
                    <button
                        key={i}
                        className={`${styles.day} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''} ${isDone ? styles.done : ''}`}
                        onClick={() => onSelectDate(d)}
                        aria-label={`${DAY_LABELS[d.getDay()]} ${d.getDate()}${isToday ? ', today' : ''}${isDone ? ', completed' : ''}`}
                    >
                        <span className={styles.label}>{DAY_LABELS[d.getDay()]}</span>
                        <span className={styles.num}>{d.getDate()}</span>
                    </button>
                );
            })}
        </div>
    );
}
