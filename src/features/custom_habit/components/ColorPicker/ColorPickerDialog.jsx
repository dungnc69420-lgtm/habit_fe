import DialogOverlay from '../shared/DialogOverlay';
import CustomColorCreator from './CustomColorCreator';
import styles from '../../../../styles/HabitDetail.module.css';

/**
 * ColorPickerDialog — shows preset + custom colors as swatches,
 * plus the CustomColorCreator to add new ones. Custom swatches get
 * a small remove (×) affordance; presets don't (can't delete built-ins).
 */
export default function ColorPickerDialog({
                                              open,
                                              onClose,
                                              palette,
                                              selectedColor,
                                              onSelect,
                                              onCreateColor,
                                              onRemoveColor,
                                              isCustomColor,
                                          }) {
    const handleCreate = (hex) => {
        onCreateColor(hex);
        onSelect(hex);
    };

    return (
        <DialogOverlay open={open} onClose={onClose} title="Choose Color">
            <div className={styles.colorGrid}>
                {Object.entries(palette).map(([key, val]) => (
                    <div key={key} className={styles.colorSwatchWrap}>
                        <button
                            type="button"
                            className={`${styles.colorDot} 
                            ${selectedColor === val.accent
                                ? styles.colorDotActive
                                : ''}
                                `}
                            style={{background: val.accent}}
                            onClick={() => {
                                onSelect(val.accent);
                            }}
                            aria-label={`Select color ${key}`}
                            aria-pressed={selectedColor === val.accent}
                        />
                        {isCustomColor(key) && (
                            <button
                                type="button"
                                className={styles.removeColorBtn}
                                onClick={() => onRemoveColor(key)}
                                aria-label={`Delete custom color ${key}`}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.colorPickerDivider}/>

            <p className={styles.colorPickerSectionLabel}>Create your own</p>
            <CustomColorCreator onCreate={handleCreate}/>
        </DialogOverlay>
    );
}
