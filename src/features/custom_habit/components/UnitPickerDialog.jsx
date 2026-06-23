import {useEffect, useMemo, useState} from 'react';
import DialogOverlay from './shared/DialogOverlay';
import styles from '../styles/UnitPickerDialog.module.css';
import {goalUnitApi} from "../../../services/goalUnitApi";

export default function UnitPickerDialog({
                                             colors,
                                             open,
                                             onClose,
                                             value,
                                             onSelect,
                                         }) {
    const [units, setUnits] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!open) {
            return;
        }

        goalUnitApi.getAll()
            .then(setUnits)
            .catch(console.error);
    }, [open]);

    const filteredUnits = useMemo(() => {
        const keyword = search.toLowerCase();

        return units.filter(unit =>
            unit.name.toLowerCase().includes(keyword) ||
            unit.symbol.toLowerCase().includes(keyword)
        );
    }, [units, search]);

    const selectUnit = (unit) => {
        return () => {
            onSelect(unit.symbol);
            onClose();
        };
    }

    return (
        <DialogOverlay
            open={open}
            onClose={onClose}
            title="Select Unit"
        >
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search units..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <div className={styles.unitList}>
                {filteredUnits.map(unit => {

                    const isActive = value === unit.symbol;

                    return (
                        <button
                            key={unit.id}
                            type="button"
                            className={`${styles.unitOption}
                            ${value === unit.symbol
                                ? styles.unitOptionActive
                                : ''}`
                            }
                            style={isActive ? {
                                borderColor: colors.accent,
                                background: colors.accent + '22',
                                color: colors.accent,
                                fontWeight: 600,
                            } : undefined}
                            onClick={selectUnit(unit)}
                        >
                            <span>{unit.name}</span>
                            <span>{unit.symbol}</span>
                        </button>
                    )
                })}
            </div>
        </DialogOverlay>
    );
}