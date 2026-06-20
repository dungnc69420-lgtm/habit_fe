import {useState, useCallback, useEffect} from 'react';
import {habitTemplateApi} from "../../../services/habitTemplateApi";

const todayKey = () => new Date().toISOString().slice(0, 10);

export function useHabitTemplates() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useCallback: React creates this function once and reuses it. because Functions are recreated every render.
    // useCallback = cache a function
    const getAll = useCallback(async () => {
        try {
            setLoading(true);

            const data = await habitTemplateApi.getAll();
            setHabits(data);

        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect: Do something when the component loads or data changes
    // Use useEffect when you want something to happen:
    // Component loads
    // State changes
    // Props change
    useEffect(() => {
        getAll().catch(console.error);
    }, [getAll]);

    const add = useCallback(async (habit) => {
        try {
            const createdHabitTemplate = await habitTemplateApi.create(habit);

            setHabits(prev => [...prev, createdHabitTemplate]);

        } catch (err) {
            setError(err);
            console.error(err);
        }
    }, []);

    const update = useCallback(async (id, habit) => {
        try {
            const updatedHabitTemplate = await habitTemplateApi.update(id, habit);
            setHabits(prev => prev.map(h => h.id === id ? updatedHabitTemplate : h));

        } catch (err) {
            setError(err);
            console.error(err);
        }
    }, []);

    const remove = useCallback(async (id) => {
        try {
            await habitTemplateApi.delete(id);

            setHabits(prev =>
                prev.filter(h => h.id !== id)
            );

        } catch (err) {
            setError(err);
            console.error(err);
        }
    }, []);

    const toggleDone = useCallback((id) => {
        setHabits(prev => prev.map(h => {
            if (h.id !== id) return h;
            const isDone = h.progress >= h.target;
            return {...h, progress: isDone ? 0 : h.target};
        }));
    }, []);

    const completedCount = habits.filter(
        h => h.progress >= h.target
    ).length;

    const completionPct = habits.length
        ? Math.round(
            (completedCount / habits.length) * 100
        )
        : 0;

    return {
        habits,
        loading,
        error,
        getAll,
        add,
        update,
        remove,
        toggleDone,
        completedCount,
        completionPct
    };
}
