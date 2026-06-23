import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {COLOR_MAP} from '../../../data/habitPresets';
import styles from '../../../styles/NewHabit.module.css';
import {habitCategoryApi} from "../../../services/habitCategoryApi";
import {habitTemplateApi} from "../../../services/habitTemplateApi";

export default function NewHabit({onAdd}) {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('popular');
    const [showCustom, setShowCustom] = useState(false);
    const [custom, setCustom] = useState({
        name: '',
        icon: '⭐',
        goalValue: 30,
        goalUnit: 'min',
        color: 'blue'
    });
    const [categories, setCategories] = useState([]);
    const [habitTemplates, setHabitTemplates] = useState([]);

    const loadData = async () => {
        try {
            const [categories, templates] = await Promise.all([
                habitCategoryApi.getAll(),
                habitTemplateApi.getAll()
            ]);

            setCategories(categories);
            setHabitTemplates(templates);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        loadData();

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setShowCustom(false);
            }
        };

        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const filtered = habitTemplates.filter(h => h.category.includes(activeCategory));

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!custom.name.trim()) {
            return;
        }
        onAdd?.({...custom, id: `custom_${Date.now()}`, category: ['custom']});
        setShowCustom(false);
        navigate(-1);
    };

    return (
        <div className={styles.page}>

            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
                    ‹
                </button>
                <h1 className={styles.title}>New Habit</h1>
                <div className={styles.avatar}>🎒</div>
            </header>

            {/* Category tabs */}
            <div className={styles.tabs}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`${styles.tab} ${activeCategory === cat.id ? styles.tabActive : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Habit list */}
            <div className={styles.list}>
                {filtered.map(preset => {
                    return (
                        <Link
                            key={preset.id}
                            className={styles.item}
                            to="/habit-detail"
                            state={{
                                habit: preset
                            }}
                        >
                            <span className={styles.itemIcon}>{preset.icon}</span>
                            <span className={styles.itemName}>{preset.name}</span>
                            <button className={`${styles.addBtn}`}>
                                {(
                                    <>
                                        <span className={styles.heart}>♥</span>
                                        <span className={styles.plus}>+</span>
                                    </>
                                )}
                            </button>
                        </Link>
                    );
                })}
            </div>

            {/* Custom Habit button */}
            <div className={styles.customWrap}>
                <button className={styles.customBtn} onClick={() => setShowCustom(true)}>
                    + Custom Habit
                </button>
            </div>

            {/* Custom habit modal */}
            {showCustom && (
                <div className={styles.modalOverlay}>
                    <dialog
                        className={styles.modal}
                        aria-modal="true"
                    >
                        <h2 className={styles.modalTitle}>Create custom habit</h2>
                        <form onSubmit={handleCustomSubmit}>
                            <div className={styles.field}>
                                <label htmlFor="icon">Icon</label>
                                <input
                                    id="icon"
                                    value={custom.icon}
                                    onChange={e => setCustom({
                                        ...custom,
                                        icon: e.target.value
                                    })}
                                    placeholder="Paste an emoji"
                                    maxLength={2}
                                />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    value={custom.name}
                                    onChange={e => setCustom({...custom, name: e.target.value})}
                                    placeholder="e.g. Morning pages"
                                    required
                                />
                            </div>
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label htmlFor="goalValue">Target</label>
                                    <input
                                        id="goalValue"
                                        type="number"
                                        min="1"
                                        value={custom.goalValue}
                                        onChange={e => setCustom({...custom, goalValue: Number(e.target.value)})}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="goalUnit">Unit</label>
                                    <select
                                        id="goalUnit"
                                        value={custom.goalUnit}
                                        onChange={e => setCustom({...custom, goalUnit: e.target.value})}
                                    >
                                        <option value="min">min</option>
                                        <option value="h">hours</option>
                                        <option value="times">times</option>
                                        <option value="cups">cups</option>
                                        <option value="km">km</option>
                                        <option value="day">day</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="color">Color</label>
                                <div id="color" className={styles.colorPicker}>
                                    {Object.entries(COLOR_MAP).map(([key, val]) => (
                                        <button
                                            type="button"
                                            key={key}
                                            className={`${styles.colorDot} ${custom.color === key ? styles.colorDotActive : ''}`}
                                            style={{background: val.accent}}
                                            onClick={() => setCustom({...custom, color: key})}
                                            aria-label={key}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn}
                                        onClick={() => setShowCustom(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    Add habit
                                </button>
                            </div>
                        </form>
                    </dialog>
                </div>
            )}
        </div>
    );
}
