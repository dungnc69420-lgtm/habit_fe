import {useEffect, useRef} from 'react';
import styles from '../../../../styles/HabitDetail.module.css';

/**
 * DialogOverlay — accessible modal shell built on native <dialog>.
 *
 * Using <dialog> instead of a clickable <div> gives us, for free:
 *  - Correct ARIA semantics (no SonarLint "non-native interactive element" warning)
 *  - Focus trapping while open
 *  - Escape key closes it automatically
 *  - ::backdrop pseudo-element for the overlay
 *
 * Usage:
 *   <DialogOverlay open={showColorDialog} onClose={() => setShowColorDialog(false)} title="Choose Color">
 *     ...content...
 *   </DialogOverlay>
 */
export default function DialogOverlay({open, onClose, title, children}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) {
            return;
        }

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    // native "close" fires on Escape and backdrop-click-via-form;
    // keep React state in sync if the dialog closes itself
    const handleNativeClose = () => {
        onClose?.();
    };

    // clicking the backdrop (the <dialog> element itself, not its content) closes it
    const handleBackdropClick = (e) => {
        if (e.target === dialogRef.current) {
            onClose?.();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            onClose={handleNativeClose}
            onClick={handleBackdropClick}
            aria-labelledby={title ? 'dialog-title' : undefined}
        >
            <button
                type="button"
                className={styles.dialogCloseBtn}
                onClick={onClose}
                aria-label="Close dialog"
            >
                ✕
            </button>

            {title && (
                <h3
                    id="dialog-title"
                    className={styles.dialogTitle}
                >
                    {title}
                </h3>
            )}

            <div className={styles.dialogBody}>
                {children}
            </div>
        </dialog>
    );
}
