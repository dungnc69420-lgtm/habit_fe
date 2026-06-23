import {useState} from 'react';
import styles from '../../../../styles/HabitDetail.module.css';
import {isValidHex} from '../../../../utils/colorUtils';

/**
 * CustomColorCreator — lets the user pick any color via the native
 * color picker (or type a hex code) and save it to their palette.
 *
 * Native <input type="color"> is used deliberately: it gives a real
 * OS/browser color picker (with eyedropper on supported browsers) for
 * free, fully accessible and keyboard-operable, no custom UI needed.
 */
export default function CustomColorCreator({onCreate}) {
    const [hex, setHex] = useState('#7c3aed');
    const [hexInput, setHexInput] = useState('#7c3aed');
    const [error, setError] = useState('');

    const handleColorPicker = (e) => {
        const value = e.target.value;
        setHex(value);
        setHexInput(value);
        setError('');
    };

    const handleHexTyped = (e) => {
        const value = e.target.value;
        setHexInput(value);
        if (isValidHex(value)) {
            setHex(value);
            setError('');
        }
    };

    const handleHexBlur = () => {
        if (!isValidHex(hexInput)) {
            setError('Enter a valid hex color, e.g. #7c3aed');
            setHexInput(hex); // revert to last valid value
        }
    };

    const handleAdd = () => {
        if (!isValidHex(hex)) {
            setError('Enter a valid hex color, e.g. #7c3aed');
            return;
        }
        onCreate(hex);
    };

    return (
        <div className={styles.customColorCreator}>
            <div className={styles.customColorRow}>
                <label className={styles.colorSwatchPicker}>
                    <input
                        type="color"
                        value={hex}
                        onChange={handleColorPicker}
                        aria-label="Pick a custom color"
                    />
                    <span
                        className={styles.colorSwatchPreview}
                        style={{background: hex}}
                    />
                </label>

                <input
                    type="text"
                    className={styles.hexInput}
                    value={hexInput}
                    onChange={handleHexTyped}
                    onBlur={handleHexBlur}
                    placeholder="#7c3aed"
                    maxLength={7}
                    aria-label="Hex color code"
                />

                <button
                    type="button"
                    className={styles.addColorBtn}
                    onClick={handleAdd}
                >
                    + Add
                </button>
            </div>
            {error && <p className={styles.colorError}>{error}</p>}
        </div>
    );
}
