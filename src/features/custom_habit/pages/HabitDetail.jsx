import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styles from '../../../styles/HabitDetail.module.css';

import {useHabitForm} from '../hooks/useHabitForm';
import {useColorPalette} from '../hooks/useColorPalette';

import HabitDetailHeader from '../components/HabitDetailHeader';
import NameSection from '../components/NameSection';
import HabitTypeSection from '../components/HabitTypeSection';
import GoalSection from '../components/GoalSection';
import TimeRangeSection from '../components/TimeRangeSection';
import MoreSettingsSection from '../components/MoreSettingsSection';
import HabitTermSection from '../components/HabitTermSection';
import ColorPickerDialog from '../components/ColorPicker/ColorPickerDialog';

/**
 * HabitDetail — orchestrator only.
 *
 * All the actual UI lives in section components under ./components.
 * All the form-state mutation logic lives in useHabitForm.
 * All the color-palette logic (presets + custom + persistence) lives
 * in useColorPalette + utils/colorUtils.
 *
 * This file's only job is wiring those together and rendering the layout.
 */
export default function HabitDetail({onSave}) {
    const navigate = useNavigate();
    const location = useLocation();

    const {habit, set, toggleDay} = useHabitForm(location.state?.habit);

    const {palette, addCustomColor, removeCustomColor, isCustom} = useColorPalette();

    const [showColorDialog, setShowColorDialog] = useState(false);

    const colors = {
        accent: habit.color,
        bg: habit.color,
    };

    useEffect(() => {
        addCustomColor(habit.color);
    }, []);

    const handleSave = () => {
        if (!habit.name.trim()) {
            return;
        }
        const preset = location.state?.preset ?? {};
        onSave?.({...habit, id: preset.id ?? Date.now()});

        console.log('habit', habit)
        // navigate(-1);
    };

    return (
        <div className={styles.page}>
            <HabitDetailHeader habit={habit} onBack={() => navigate(-1)}/>

            <div className={styles.content}>
                <NameSection
                    habit={habit}
                    colors={colors}
                    onChange={set}
                    onOpenColorDialog={() => setShowColorDialog(true)}
                />

                <HabitTypeSection habit={habit} onChange={set} colors={colors}/>

                <GoalSection
                    habit={habit}
                    colors={colors}
                    onChange={set}
                    onToggleDay={toggleDay}
                />

                <TimeRangeSection habit={habit} colors={colors} onChange={set}/>

                <MoreSettingsSection habit={habit} onChange={set}/>

                <HabitTermSection habit={habit} colors={colors} onChange={set}/>
            </div>

            <div className={styles.saveWrap}>
                <button
                    type="button"
                    className={styles.saveBtn}
                    style={{background: colors.accent, color: '#000'}}
                    onClick={handleSave}
                    disabled={!habit.name.trim()}
                >
                    Save
                </button>
            </div>

            <ColorPickerDialog
                open={showColorDialog}
                onClose={() => setShowColorDialog(false)}
                palette={palette}
                selectedColor={habit.color}
                onSelect={(color) => {
                    set('color', color);
                }}
                onCreateColor={addCustomColor}
                onRemoveColor={removeCustomColor}
                isCustomColor={isCustom}
            />
        </div>
    );
}
