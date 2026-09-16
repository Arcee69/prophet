// Design tokens for the exported sentiment PDF.
//
// The report is rendered off-screen at exactly A4 @ 96dpi and captured page by
// page, so every value here is in CSS pixels that map 1:1 onto the printed page.
// Styling is inline rather than Tailwind on purpose: html2canvas resolves computed
// styles, and inline hex values are the only thing guaranteed to survive the
// capture identically across browsers.

// A4 at 96dpi. 794 / 1123 = 0.7071, the same ratio as 210mm / 297mm, so a captured
// page drops onto a jsPDF A4 page with no letterboxing.
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;
export const PAGE_PADDING_X = 56;
export const PAGE_PADDING_TOP = 44;
export const PAGE_PADDING_BOTTOM = 78; // clears the fixed page footer

export const COLORS = {
    accent: '#F48A1F',
    accentSoft: '#FDF3E7',
    ink: '#101928',
    inkSoft: '#344054',
    muted: '#667185',
    faint: '#98A2B3',
    hairline: '#E7EAEE',
    surface: '#F7F8FA',
    surfaceAlt: '#FFFFFF',
    midnight: '#111827',
    positive: '#1E5631',
    positiveSoft: '#E8F3EC',
    neutral: '#BFBFBF',
    neutralSoft: '#F2F4F7',
    negative: '#FF4E4C',
    negativeSoft: '#FDECEC',
    info: '#3B82F6',
    infoSoft: '#EEF4FF',
    violet: '#7C5CFF',
    violetSoft: '#F1EEFF',
};

// Palette for the reputation intelligence edition, which follows its own green and
// gold executive template rather than the sentiment report's orange.
export const REPUTATION_COLORS = {
    green: '#00874F',
    greenBright: '#1FA463',
    greenSoft: '#E5F2EA',
    greenLine: '#BFDFCB',
    yellow: '#F2C300',
    gold: '#E0B000',
    yellowSoft: '#FFF5CE',
    yellowLine: '#F0DC8A',
    orange: '#E8822A',
    orangeSoft: '#FDEFE3',
    orangeLine: '#F5D3B5',
    red: '#D9534F',
    redSoft: '#FBE7E6',
    redLine: '#F2C4C2',
    blue: '#3A76A8',
    blueSoft: '#E8F0F7',
    blueLine: '#C5D8E8',
    ink: '#1B3345',
    inkSoft: '#2F4454',
    muted: '#6B7A89',
    line: '#DDE3E7',
    track: '#EEF1F0',
    surface: '#F4F6F5',
    navy: '#0B2239',
};

export const TONE_COLORS = {
    positive: COLORS.positive,
    neutral: COLORS.neutral,
    negative: COLORS.negative,
};

export const FONT_HEAD = "'Jost', 'Helvetica Neue', Arial, sans-serif";
export const FONT_BODY = "'Lato', 'Helvetica Neue', Arial, sans-serif";

// Channel identity, shared by the channel table and the per-channel sentiment bars.
export const CHANNEL_STYLE = {
    'YouTube': '#FF4E4C',
    'Twitter/X': '#1DA1F2',
    'Twitter': '#1DA1F2',
    'News': '#F48A1F',
    'Youtube': '#FF4E4C',
};

export const channelColor = (label) => CHANNEL_STYLE[label] || COLORS.violet;

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

const grouped = new Intl.NumberFormat('en-US');

export const formatFull = (value) => grouped.format(Math.round(Number(value) || 0));

// Compact form for the big display numbers: 33,760 -> 33.8K, 10,130,000 -> 10.1M,
// 1,380,690,000 -> 1.38B. Precision drops as the number grows so every value stays
// roughly four characters wide and the tiles stay aligned.
const trimZeros = (text) => (text.includes('.') ? text.replace(/\.?0+$/, '') : text);

export const formatCompact = (value) => {
    const n = Number(value) || 0;
    const abs = Math.abs(n);

    const scaled = (divisor, suffix) => {
        const result = n / divisor;
        const magnitude = Math.abs(result);
        const digits = magnitude >= 100 ? 0 : magnitude >= 10 ? 1 : 2;
        return `${trimZeros(result.toFixed(digits))}${suffix}`;
    };

    if (abs >= 1_000_000_000) return scaled(1_000_000_000, 'B');
    if (abs >= 1_000_000) return scaled(1_000_000, 'M');
    if (abs >= 1_000) return scaled(1_000, 'K');
    return grouped.format(Math.round(n));
};

export const formatSigned = (value) => {
    const n = Math.round(Number(value) || 0);
    return n > 0 ? `+${n}` : `${n}`;
};

export const formatPercent = (value, digits = 0) => `${(Number(value) || 0).toFixed(digits)}%`;

export const formatDate = (value) =>
    new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateShort = (value) =>
    new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

export const formatRange = (start, end) => `${formatDateShort(start)} – ${formatDate(end)}`;

// Shortens text to fit a fixed number of lines in the printed layout.
//
// CSS line clamping (`-webkit-line-clamp`) cannot be used here: html2canvas lays the
// element out itself and ignores the clamp, so the full string renders and the
// surrounding `overflow: hidden` slices it through the middle of a line of glyphs.
// Trimming the string before it is rendered is the only thing both the browser and
// the capture agree on.
export const clampText = (value, maxChars) => {
    const clean = String(value || '').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxChars) return clean;

    const cut = clean.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(' ');
    // Back off to a word boundary unless that would throw away most of the budget.
    const trimmed = lastSpace > maxChars * 0.6 ? cut.slice(0, lastSpace) : cut;
    return `${trimmed.replace(/[\s.,;:!?-]+$/, '')}…`;
};

// A slug safe for a downloaded filename.
export const slugify = (value) =>
    String(value || 'report')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'report';
