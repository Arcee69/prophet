import {
    COLORS,
    FONT_BODY,
    FONT_HEAD,
    PAGE_HEIGHT,
    PAGE_PADDING_BOTTOM,
    PAGE_PADDING_TOP,
    PAGE_PADDING_X,
    PAGE_WIDTH,
    TONE_COLORS,
} from './reportTheme';

// Every chart below is hand-drawn in SVG with presentation attributes and HTML
// labels layered on top. html2canvas rasterises an <svg> by serialising it and
// loading it as an image, which drops webfonts and stylesheet rules - so no <text>
// and no CSS classes inside the SVG.

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

export const Page = ({ children, index, total, tone = 'light', flush = false }) => {
    const dark = tone === 'dark';
    return (
        <div
            data-report-page="true"
            style={{
                position: 'relative',
                width: PAGE_WIDTH,
                height: PAGE_HEIGHT,
                boxSizing: 'border-box',
                backgroundColor: dark ? COLORS.midnight : '#FFFFFF',
                color: dark ? '#FFFFFF' : COLORS.ink,
                fontFamily: FONT_BODY,
                overflow: 'hidden',
                padding: flush ? 0 : `${PAGE_PADDING_TOP}px ${PAGE_PADDING_X}px ${PAGE_PADDING_BOTTOM}px`,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {children}
            {!flush && <PageFooter index={index} total={total} dark={dark} />}
        </div>
    );
};

const PageFooter = ({ index, total, dark }) => (
    <div
        style={{
            position: 'absolute',
            left: PAGE_PADDING_X,
            right: PAGE_PADDING_X,
            bottom: 26,
            paddingTop: 12,
            borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : COLORS.hairline}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 9.5,
            letterSpacing: 0.2,
            color: dark ? 'rgba(255,255,255,0.55)' : COLORS.faint,
        }}
    >
        <span>ArabyProphet sentiment analysis — a product of Chain Reactions Africa</span>
        <span style={{ fontWeight: 700, color: dark ? 'rgba(255,255,255,0.75)' : COLORS.muted }}>
            {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
    </div>
);

export const PageHeader = ({ logo, pageNumber }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 30,
        }}
    >
        {logo ? (
            <img src={logo} alt="" crossOrigin="anonymous" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
        ) : (
            <span style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 700, color: COLORS.accent }}>àRà</span>
        )}
        <span style={{ fontFamily: FONT_HEAD, fontSize: 13, fontWeight: 700, color: COLORS.faint, letterSpacing: 1 }}>
            {String(pageNumber).padStart(2, '0')}
        </span>
    </div>
);

export const SectionTitle = ({ eyebrow, title, subtitle }) => (
    <div style={{ marginBottom: 26 }}>
        <p
            style={{
                margin: 0,
                fontFamily: FONT_HEAD,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                color: COLORS.accent,
            }}
        >
            {eyebrow}
        </p>
        <h2
            style={{
                margin: '10px 0 0',
                fontFamily: FONT_HEAD,
                fontSize: 30,
                lineHeight: 1.15,
                fontWeight: 700,
                color: COLORS.ink,
                letterSpacing: -0.4,
            }}
        >
            {title}
        </h2>
        {subtitle && (
            <p style={{ margin: '8px 0 0', fontSize: 12.5, color: COLORS.muted, lineHeight: 1.5 }}>{subtitle}</p>
        )}
    </div>
);

export const BlockLabel = ({ children, color = COLORS.accent, style }) => (
    <p
        style={{
            margin: '0 0 14px',
            fontFamily: FONT_HEAD,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color,
            ...style,
        }}
    >
        {children}
    </p>
);

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

export const StatTile = ({ value, label, note, noteColor = COLORS.info, background = COLORS.infoSoft, valueColor = COLORS.ink }) => (
    <div
        style={{
            backgroundColor: background,
            borderRadius: 14,
            padding: '22px 22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 118,
            boxSizing: 'border-box',
        }}
    >
        <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 34, fontWeight: 700, color: valueColor, letterSpacing: -0.8, lineHeight: 1.1 }}>
            {value}
        </p>
        <p style={{ margin: '12px 0 0', fontSize: 10, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: COLORS.muted }}>
            {label}
        </p>
        {note && (
            <p style={{ margin: '5px 0 0', fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: noteColor }}>
                {note}
            </p>
        )}
    </div>
);

export const Callout = ({ eyebrow, headline, body, tone = 'dark' }) => {
    const palettes = {
        dark: { bg: COLORS.midnight, eyebrow: COLORS.accent, headline: '#FFFFFF', body: 'rgba(255,255,255,0.72)' },
        info: { bg: COLORS.infoSoft, eyebrow: COLORS.info, headline: COLORS.ink, body: COLORS.muted },
        positive: { bg: COLORS.positiveSoft, eyebrow: COLORS.positive, headline: COLORS.ink, body: COLORS.muted },
        accent: { bg: COLORS.accentSoft, eyebrow: COLORS.accent, headline: COLORS.ink, body: COLORS.muted },
    };
    const palette = palettes[tone] || palettes.dark;

    return (
        <div style={{ backgroundColor: palette.bg, borderRadius: 16, padding: '26px 30px' }}>
            {eyebrow && (
                <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: palette.eyebrow }}>
                    {eyebrow}
                </p>
            )}
            <p style={{ margin: eyebrow ? '14px 0 0' : 0, fontFamily: FONT_HEAD, fontSize: 21, fontWeight: 700, lineHeight: 1.3, color: palette.headline }}>
                {headline}
            </p>
            {body && <p style={{ margin: '10px 0 0', fontSize: 12, lineHeight: 1.6, color: palette.body }}>{body}</p>}
        </div>
    );
};

export const FootNote = ({ children }) => (
    <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.6, color: COLORS.muted }}>{children}</p>
);

export const LegendRow = ({ items, style }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, ...style }}>
        {items.map((item) => (
            <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: COLORS.muted }}>
                <span style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: item.color, display: 'inline-block' }} />
                {item.label}
            </span>
        ))}
    </div>
);

// ---------------------------------------------------------------------------
// Bars
// ---------------------------------------------------------------------------

// Label on the left, proportional track in the middle, value on the right.
export const MeterRow = ({ label, sublabel, value, max, color, valueText, trailing, trailingColor, labelWidth = 150, barHeight = 14 }) => {
    const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: labelWidth, flexShrink: 0 }}>
                <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 12.5, fontWeight: 600, color: COLORS.ink }}>{label}</p>
                {sublabel && <p style={{ margin: '2px 0 0', fontSize: 10, color: COLORS.faint }}>{sublabel}</p>}
            </div>
            <div style={{ flex: 1, height: barHeight, borderRadius: barHeight, backgroundColor: COLORS.surface, overflow: 'hidden' }}>
                <div style={{ width: `${ratio * 100}%`, height: '100%', borderRadius: barHeight, backgroundColor: color }} />
            </div>
            <div style={{ width: 78, flexShrink: 0, textAlign: 'right' }}>
                <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 12.5, fontWeight: 700, color: COLORS.ink }}>{valueText}</p>
            </div>
            {trailing !== undefined && (
                <div style={{ width: 74, flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, color: trailingColor || COLORS.muted }}>{trailing}</p>
                </div>
            )}
        </div>
    );
};

// Fixed stack order positive -> neutral -> negative, as in the reference template.
export const SentimentStack = ({ positive, neutral, negative, height = 16, showLabels = true, radius = 4 }) => {
    const total = Math.max(1, positive + neutral + negative);
    const parts = [
        { key: 'positive', value: positive, color: TONE_COLORS.positive },
        { key: 'neutral', value: neutral, color: TONE_COLORS.neutral },
        { key: 'negative', value: negative, color: TONE_COLORS.negative },
    ];

    return (
        <div style={{ display: 'flex', width: '100%', height, borderRadius: radius, overflow: 'hidden', backgroundColor: COLORS.surface }}>
            {parts.map((part) => {
                const pct = (part.value / total) * 100;
                if (pct <= 0) return null;
                return (
                    <div
                        key={part.key}
                        style={{
                            width: `${pct}%`,
                            height: '100%',
                            backgroundColor: part.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {showLabels && pct >= 12 && (
                            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#FFFFFF', letterSpacing: 0.3 }}>
                                {Math.round(pct)}%
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ---------------------------------------------------------------------------
// Donut
// ---------------------------------------------------------------------------

export const Donut = ({ segments, size = 200, thickness = 22, centerValue, centerLabel, centerValueColor = COLORS.ink }) => {
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((sum, s) => sum + (s.value || 0), 0);

    let offset = 0;
    const arcs = segments
        .filter((s) => s.value > 0)
        .map((segment, index) => {
            const fraction = total > 0 ? segment.value / total : 0;
            const dash = fraction * circumference;
            const arc = (
                <circle
                    key={index}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={thickness}
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                />
            );
            offset += dash;
            return arc;
        });

    // The 12 o'clock start is an SVG transform attribute rather than a CSS one:
    // html2canvas serialises the SVG markup and drops the element's CSS transform,
    // which silently rotated the whole ring in the exported PDF.
    return (
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={COLORS.surface} strokeWidth={thickness} />
                <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>{arcs}</g>
            </svg>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: size >= 180 ? 34 : 26, fontWeight: 700, color: centerValueColor, letterSpacing: -0.6 }}>
                    {centerValue}
                </p>
                {centerLabel && (
                    <p style={{ margin: '6px 0 0', fontSize: 9.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: COLORS.muted }}>
                        {centerLabel}
                    </p>
                )}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Trend chart
// ---------------------------------------------------------------------------

// Multi-series line with a soft fill under the first series, plus optional
// annotated peaks. Axis labels are HTML so they keep the report's webfont.
export const TrendChart = ({ series, labels, width, height = 230, markers = [] }) => {
    const padding = { top: 18, right: 14, bottom: 8, left: 14 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const allValues = series.flatMap((s) => s.data);
    const max = Math.max(1, ...allValues);
    const count = Math.max(labels.length, 1);

    const xAt = (i) => padding.left + (count <= 1 ? plotW / 2 : (i / (count - 1)) * plotW);
    const yAt = (v) => padding.top + plotH - (v / max) * plotH;

    const pointsFor = (data) => data.map((v, i) => `${xAt(i).toFixed(2)},${yAt(v).toFixed(2)}`).join(' ');

    const gridLines = [0.25, 0.5, 0.75, 1].map((f) => padding.top + plotH - f * plotH);

    return (
        <div style={{ position: 'relative', width, height }}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {gridLines.map((y, i) => (
                    <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={COLORS.hairline} strokeWidth="1" />
                ))}

                {series.length > 0 && series[0].data.length > 1 && (
                    <polygon
                        points={`${xAt(0)},${padding.top + plotH} ${pointsFor(series[0].data)} ${xAt(count - 1)},${padding.top + plotH}`}
                        fill={series[0].color}
                        fillOpacity="0.10"
                    />
                )}

                {series.map((s) => (
                    <polyline
                        key={s.name}
                        points={pointsFor(s.data)}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                ))}

                {markers.map((marker, i) => {
                    const x = xAt(marker.index);
                    const y = yAt(marker.value);
                    return (
                        <g key={i}>
                            <line x1={x} y1={padding.top - 6} x2={x} y2={y} stroke={marker.color} strokeWidth="1.5" />
                            <circle cx={x} cy={y} r="6" fill={marker.color} stroke="#FFFFFF" strokeWidth="2.5" />
                        </g>
                    );
                })}
            </svg>

            {markers.map((marker, i) => {
                const x = xAt(marker.index);
                return (
                    <span
                        key={i}
                        style={{
                            position: 'absolute',
                            left: Math.max(0, Math.min(width - 70, x - 35)),
                            top: 0,
                            width: 70,
                            textAlign: 'center',
                            fontFamily: FONT_HEAD,
                            fontSize: 9.5,
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            color: marker.color,
                        }}
                    >
                        {marker.label}
                    </span>
                );
            })}
        </div>
    );
};

export const AxisLabels = ({ items, width }) => (
    <div style={{ width, display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {items.map((item, i) => (
            <span key={i} style={{ fontSize: 10, color: COLORS.faint }}>{item}</span>
        ))}
    </div>
);

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

export const TableHead = ({ columns }) => (
    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${COLORS.hairline}` }}>
        {columns.map((column) => (
            <div key={column.label} style={{ width: column.width, flex: column.flex, textAlign: column.align || 'left' }}>
                <span style={{ fontFamily: FONT_HEAD, fontSize: 9.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: COLORS.faint }}>
                    {column.label}
                </span>
            </div>
        ))}
    </div>
);

export const Swatch = ({ color, size = 10 }) => (
    <span style={{ width: size, height: size, borderRadius: size, backgroundColor: color, display: 'inline-block', flexShrink: 0 }} />
);
