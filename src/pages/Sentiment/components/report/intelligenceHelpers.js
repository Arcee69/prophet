import { REPUTATION_COLORS as C } from './reportTheme';
import { levelOf } from './buildReputationModel';

// Layout constants and small formatters shared by the intelligence editions. Kept
// apart from IntelligencePrimitives so that file exports components only.

export const PAD_X = 44;
export const FOOTER_SPACE = 58;

export const pad2 = (value) => String(value).padStart(2, '0');
export const grid = (columns, gap = 12) => ({ display: 'grid', gridTemplateColumns: columns, gap });
export const signed3 = (value) => (value === null || value === undefined ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(3)}`);

export const LEVEL_COLOR = { high: C.red, medium: C.orange, low: C.green };

// "Medium to high" reads as MED-HIGH; anything else short enough is shown as sent.
export const levelText = (value) => {
    const label = String(value || '').trim().toUpperCase();
    if (/MED/.test(label) && /HIGH/.test(label)) return 'MED-HIGH';
    if (label === 'MEDIUM' || label === 'MODERATE') return 'MED';
    return label.length > 0 && label.length <= 9 ? label : levelOf(value).toUpperCase();
};

// Yellow reads as a fill, not as text on white.
export const readable = (color) => (color === C.yellow ? C.gold : color);
