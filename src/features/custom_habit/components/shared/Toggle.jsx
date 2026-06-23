import styles from '../../../../styles/HabitDetail.module.css';

export default function Toggle({checked, onChange}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        >
            <span className={styles.toggleThumb}/>
        </button>
    );
}
