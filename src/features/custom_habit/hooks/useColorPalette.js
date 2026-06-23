import {useCallback, useState} from 'react';
import {deleteCustomColor, loadCustomColors, saveCustomColor,} from '../../../utils/colorUtils';

/**
 * useColorPalette — merges built-in COLOR_MAP presets with user-created
 * custom colors (persisted in localStorage), and exposes add/remove actions.
 */
export function useColorPalette() {
    const [customColors, setCustomColors] = useState(() => loadCustomColors());

    const palette = {...customColors};

    const addCustomColor = useCallback((hex) => {
        const updated = saveCustomColor(hex, hex);

        setCustomColors(updated);

        return hex;
    }, [customColors]);

    const removeCustomColor = useCallback((key) => {
        const updated = deleteCustomColor(key);
        setCustomColors(updated);
    }, []);

    const isCustom = useCallback((key) => key in customColors, [customColors]);

    return {palette, addCustomColor, removeCustomColor, isCustom};
}
