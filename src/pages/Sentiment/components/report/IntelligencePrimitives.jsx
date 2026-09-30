import {
    FONT_BODY,
    FONT_HEAD,
    PAGE_HEIGHT,
    PAGE_WIDTH,
    REPUTATION_COLORS as C,
    clampText,
} from './reportTheme';
import { levelOf } from './buildReputationModel';
import { FOOTER_SPACE, LEVEL_COLOR, PAD_X, levelText, pad2 } from './intelligenceHelpers';

// Building blocks shared by the intelligence editions (Reputation and Comparative).
// Both are A4 decks rendered off-screen and captured page by page, so the same
// html2canvas rules apply - inline styles only, SVG with presentation attributes and
// no <text>, and long strings trimmed before render rather than clipped by CSS.

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const Eyebrow = ({ children, color = C.ink, style }) => (
    <p style={{ margin: 0, fontSize: 8.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color, ...style }}>
        {children}
    </p>
);

export const Headline = ({ children, size = 16, color = C.ink, style }) => (
    <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: size, fontWeight: 700, lineHeight: 1.3, color, ...style }}>
        {children}
    </p>
);

export const Body = ({ children, size = 10.5, color = C.inkSoft, style }) => (
    <p style={{ margin: 0, fontSize: size, lineHeight: 1.5, color, ...style }}>{children}</p>
);

export const Panel = ({ children, background = '#FFFFFF', border = C.line, style }) => (
    <div
        style={{
            backgroundColor: background,
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: '18px 22px',
            boxSizing: 'border-box',
            ...style,
        }}
    >
        {children}
    </div>
);

export const Badge = ({ children, color, size = 30 }) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: 6,
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}
    >
        <span style={{ fontFamily: FONT_HEAD, fontSize: size < 28 ? 10 : 11, fontWeight: 700, color: color === C.yellow ? C.ink : '#FFFFFF' }}>
            {children}
        </span>
    </div>
);

export const LevelPill = ({ value, suffix = '' }) => (
    <div
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 62,
            height: 24,
            padding: '0 9px',
            boxSizing: 'border-box',
            borderRadius: 5,
            backgroundColor: LEVEL_COLOR[levelOf(value)],
        }}
    >
        <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 0.4, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
            {levelText(value)}{suffix}
        </span>
    </div>
);

export const Bullets = ({ items, color, chars = 70, size = 9.5, gap = 7 }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {items.map((item, index) => (
            <div key={`${item}-${index}`} style={{ display: 'flex', gap: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: color, flexShrink: 0, marginTop: size * 0.6 }} />
                <Body size={size}>{clampText(item, chars)}</Body>
            </div>
        ))}
    </div>
);

// Accent strips are separate boxes rather than a thick border-left/top on a rounded
// card: html2canvas draws mixed border widths around a radius as a skewed wedge.
export const SideAccentCard = ({ children, color, background = '#FFFFFF', minHeight }) => (
    <div style={{ display: 'flex', minHeight }}>
        <div style={{ width: 5, flexShrink: 0, backgroundColor: color }} />
        <div
            style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: background,
                border: `1px solid ${C.line}`,
                borderLeft: 'none',
                borderRadius: '0 10px 10px 0',
                padding: '14px 16px',
                boxSizing: 'border-box',
            }}
        >
            {children}
        </div>
    </div>
);

export const TopAccentCard = ({ children, color, background = '#FFFFFF', minHeight, padding = '16px 16px' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight }}>
        <div style={{ height: 5, flexShrink: 0, backgroundColor: color }} />
        <div
            style={{
                flex: 1,
                backgroundColor: background,
                border: `1px solid ${C.line}`,
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                padding,
                boxSizing: 'border-box',
            }}
        >
            {children}
        </div>
    </div>
);

export const Logo = ({ logo, height }) => (logo ? (
    <img src={logo} alt="" crossOrigin="anonymous" style={{ height, width: 'auto', objectFit: 'contain', display: 'block' }} />
) : (
    <span style={{ fontFamily: FONT_HEAD, fontSize: height * 0.6, fontWeight: 700, color: C.orange }}>àRà</span>
));

export const BrandRule = ({ height }) => (
    <div style={{ display: 'flex', width: '100%', height }}>
        <div style={{ width: '66%', backgroundColor: C.green }} />
        <div style={{ flex: 1, backgroundColor: C.yellow }} />
    </div>
);

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

export const Sheet = ({ children, header, footerLeft, footerRight, footerRule = true }) => (
    <div
        data-report-page="true"
        style={{
            position: 'relative',
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            boxSizing: 'border-box',
            paddingBottom: FOOTER_SPACE,
            backgroundColor: '#FFFFFF',
            color: C.ink,
            fontFamily: FONT_BODY,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        {header}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: `0 ${PAD_X}px` }}>
            {children}
        </div>
        <div
            style={{
                position: 'absolute',
                left: PAD_X,
                right: PAD_X,
                bottom: 20,
                paddingTop: 8,
                borderTop: footerRule ? `1px solid ${C.line}` : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 8,
                color: C.muted,
            }}
        >
            <span>{footerLeft}</span>
            <span>{footerRight}</span>
        </div>
    </div>
);

export const InteriorHeader = ({ logo, brand, edition, pageNumber }) => (
    <div style={{ marginBottom: 20 }}>
        <div style={{ height: 56, padding: `0 ${PAD_X}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo logo={logo} height={28} />
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: C.muted }}>
                {clampText(brand, 40)} {edition}
                <span style={{ marginLeft: 16, fontSize: 10.5, color: C.ink }}>{pad2(pageNumber)}</span>
            </span>
        </div>
        <BrandRule height={4} />
    </div>
);

export const PageTitle = ({ title, subtitle }) => (
    <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 27, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>{title}</h2>
        {subtitle && <Body size={10} color={C.muted} style={{ marginTop: 4 }}>{subtitle}</Body>}
    </div>
);
