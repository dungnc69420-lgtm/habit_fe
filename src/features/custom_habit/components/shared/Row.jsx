import styles from '../../styles/Row.module.css';

/**
 * Row — a clickable settings row.
 *
 * When `onClick` is provided, this renders as a real <button> (full width,
 * styled to look like a row) instead of a <div onClick>. That's what
 * actually satisfies "support for tabbing, mouse, keyboard, and touch
 * inputs" — a native button gets all of that automatically, no manual
 * onKeyDown/role/tabIndex wiring needed.
 *
 * When there's no onClick, it's a plain non-interactive <div> — correct,
 * since it isn't interactive.
 */
export default function Row({label, hint, right, onClick, children, noBorder, className = ''}) {
    const rowClasses = `
        ${styles.row} 
        ${noBorder ? styles.noBorder : ''} 
        ${onClick ? styles.rowClickable : ''} 
        ${className}
    `;

    const content = (
        <>
            <div className={styles.rowLeft}>
                <span className={styles.rowLabel}>{label}</span>
                {hint && <span className={styles.rowHint}>?</span>}
            </div>
            <div className={styles.rowRight}>
                {children}
                {right}
                {onClick && <span className={`${styles.rowArrow} ${styles.clickDialog}`}>›</span>}
            </div>
        </>
    );

    if (onClick) {
        return (
            <button type="button" className={rowClasses} onClick={onClick}>
                {content}
            </button>
        );
    }

    return <div className={rowClasses}>{content}</div>;
}
