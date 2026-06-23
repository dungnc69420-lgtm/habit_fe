import {useState} from 'react';

/**
 * useHabitForm — owns the habit draft state and every mutation function
 * that HabitDetail's sections need. Keeps HabitDetail.jsx itself down to
 * composition only.
 */
export function useHabitForm(initialHabit) {
    const [habit, setHabit] = useState(initialHabit);

    const set = (key, val) => setHabit(h => ({...h, [key]: val}));

    const toggleDay = (day) => {
        const currentDays = habit.selectedDays ?? [];

        const updated = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];

        set('selectedDays', updated);
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

    return {
        habit,
        set,
        toggleDay,
        addReminderTime,
        updateReminderTime,
        removeReminderTime,
    };
}
