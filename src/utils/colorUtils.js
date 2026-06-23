/**
 * colorUtils.js — turns a single hex color into the {accent, bg} shape
 * that the rest of the app expects (same shape as COLOR_MAP presets),
 * and persists user-created custom colors in localStorage.
 */

const STORAGE_KEY = 'habit-tracker:custom-colors';

/**
 * Convert hex → HSL, lighten it, convert back to hex.
 * Used to derive a soft background tint from the accent color
 * the same way the preset COLOR_MAP entries pair an accent with a bg.
 */
function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            default: h = ((r - g) / d + 4);
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/**
 * Given a hex accent color, derive a lighter "bg" tint —
 * mirrors how the original COLOR_MAP presets pair accent + bg.
 */
export function deriveColorEntry(hex) {
    const [h, s, l] = hexToHsl(hex);
    const bg = hslToHex(h, Math.max(s - 20, 10), Math.min(l + 35, 92));
    return {accent: hex, bg};
}

export function isValidHex(value) {
    return /^#([0-9A-Fa-f]{6})$/.test(value);
}

// ─── Persistence (localStorage) ──────────────────────────────────────

export function loadCustomColors() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function saveCustomColor(name, hex) {
    const all = loadCustomColors();
    all[name] = deriveColorEntry(hex);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all;
}

export function deleteCustomColor(name) {
    const all = loadCustomColors();
    delete all[name];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all;
}