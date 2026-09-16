import React from 'react';
import {
    AxisLabels,
    BlockLabel,
    Callout,
    Donut,
    FootNote,
    LegendRow,
    MeterRow,
    Page,
    PageHeader,
    SectionTitle,
    SentimentStack,
    StatTile,
    Swatch,
    TableHead,
    TrendChart,
} from './ReportPrimitives';
import {
    COLORS,
    FONT_BODY,
    FONT_HEAD,
    PAGE_PADDING_X,
    PAGE_WIDTH,
    TONE_COLORS,
    clampText,
    formatCompact,
    formatDate,
    formatDateShort,
    formatFull,
} from './reportTheme';

const CONTENT_WIDTH = PAGE_WIDTH - PAGE_PADDING_X * 2;

const TONE_LABEL = { positive: 'Positive', neutral: 'Neutral', negative: 'Negative' };

// How much text fits before the printed layout would need another line. Measured
// against Jost at the sizes used below, in the column widths used below.
const PEAK_HEADLINE_CHARS = 76;   // 3 lines in a third-width card at 13px
const CONTENT_TITLE_CHARS = 104;  // 2 lines in the content column at 12.5px

// Cover KPI rows: a 293px tile inner width, less the swatch, bar, value column and
// gaps, leaves ~147px for the brand name — about 26 characters of Lato at 11px.
const BRAND_ROW_BAR = 58;
const BRAND_ROW_CHARS = 23;

const grid = (columns, gap = 16) => ({ display: 'grid', gridTemplateColumns: columns, gap });

// A row of small figures used to give a page's lower half something to say.
// The column count never drops below three: a brand monitored on one channel would
// otherwise stretch its single tile the full width of the page.
const StatStrip = ({ items }) => (
    <div style={{ ...grid(`repeat(${Math.max(items.length, 3)}, 1fr)`, 14) }}>
        {items.map((item) => (
            <div key={item.label} style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: '18px 18px' }}>
                <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: item.color || COLORS.ink, letterSpacing: -0.4 }}>
                    {item.value}
                </p>
                <p style={{ margin: '9px 0 0', fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: COLORS.muted }}>
                    {item.label}
                </p>
                {item.note && <p style={{ margin: '4px 0 0', fontSize: 10.5, color: COLORS.faint }}>{item.note}</p>}
            </div>
        ))}
    </div>
);

// ---------------------------------------------------------------------------
// 01 - Cover
// ---------------------------------------------------------------------------

// A cover KPI broken out per brand. On a comparison board a single headline figure
// belongs to the lead brand only, which reads as the whole board's number when it
// sits under a "A vs B vs C" title - so each brand gets its own row and bar, with
// the set total alongside the label.
const ComparisonTile = ({ label, total, rows, background, diverging = false }) => {
    const max = Math.max(1, ...rows.map((row) => Math.abs(row.value)));

    return (
        <div style={{ backgroundColor: background, borderRadius: 14, padding: '18px 20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: COLORS.muted }}>
                    {label}
                </span>
                {total && (
                    <span style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700, color: COLORS.ink }}>
                        {total}
                    </span>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {rows.map((row) => (
                    <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <Swatch color={row.color} size={7} />
                        <span
                            style={{
                                flex: 1,
                                minWidth: 0,
                                fontSize: 11,
                                lineHeight: 1.5,
                                color: COLORS.inkSoft,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {clampText(row.name, BRAND_ROW_CHARS)}
                        </span>

                        {diverging ? (
                            <DivergingBar value={row.value} max={max} width={BRAND_ROW_BAR} />
                        ) : (
                            <div style={{ width: BRAND_ROW_BAR, height: 7, borderRadius: 7, backgroundColor: 'rgba(16,25,40,0.07)', overflow: 'hidden', flexShrink: 0 }}>
                                <div style={{ width: `${(Math.abs(row.value) / max) * 100}%`, height: '100%', borderRadius: 7, backgroundColor: row.color }} />
                            </div>
                        )}

                        <span
                            style={{
                                width: 58,
                                flexShrink: 0,
                                textAlign: 'right',
                                fontFamily: FONT_HEAD,
                                fontSize: 13,
                                fontWeight: 700,
                                color: row.valueColor || COLORS.ink,
                            }}
                        >
                            {row.display}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Net sentiment runs -100 to +100, so it grows out of a centre line instead of
// filling from the left like a volume bar.
const DivergingBar = ({ value, max, width }) => {
    const half = width / 2;
    const extent = Math.min(half, (Math.abs(value) / max) * half);
    const positive = value >= 0;

    return (
        <div style={{ position: 'relative', width, height: 7, flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 7, backgroundColor: 'rgba(16,25,40,0.07)' }} />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    height: 7,
                    width: extent,
                    left: positive ? half : half - extent,
                    borderRadius: 7,
                    backgroundColor: positive ? COLORS.positive : COLORS.negative,
                }}
            />
            <div style={{ position: 'absolute', left: half - 0.5, top: -2, width: 1, height: 11, backgroundColor: 'rgba(16,25,40,0.22)' }} />
        </div>
    );
};


const CoverPage = ({ model, logo }) => {
    const { lead, period, narrative, brands, isComparison, totals } = model;
    // A comparison cover summarises the whole board; a single-brand cover is the brand.
    const headline = isComparison ? totals : lead;

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {logo ? (
                    <img src={logo} alt="" crossOrigin="anonymous" style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
                ) : (
                    <span style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 700, color: COLORS.accent }}>àRà</span>
                )}
                <CoverRing figures={headline} label="Mentions" />
            </div>

            <div style={{ marginTop: 34 }}>
                <span
                    style={{
                        display: 'inline-block',
                        backgroundColor: COLORS.accentSoft,
                        color: COLORS.accent,
                        fontFamily: FONT_HEAD,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.4,
                        textTransform: 'uppercase',
                        padding: '7px 12px',
                        borderRadius: 6,
                    }}
                >
                    {model.reportType} Report
                </span>

                <h1
                    style={{
                        margin: '26px 0 0',
                        fontFamily: FONT_HEAD,
                        fontSize: model.title.length > 60 ? 34 : model.title.length > 34 ? 40 : 52,
                        lineHeight: 1.08,
                        fontWeight: 700,
                        letterSpacing: -1.4,
                        color: COLORS.ink,
                        maxWidth: 560,
                    }}
                >
                    {model.title}
                </h1>

                <p style={{ margin: '14px 0 0', fontSize: 17, color: COLORS.muted, fontFamily: FONT_HEAD, fontWeight: 400 }}>
                    {model.isComparison
                        ? 'Head-to-head competitive sentiment intelligence'
                        : 'Brand sentiment and conversation intelligence'}
                </p>

                <p style={{ margin: '22px 0 0', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: COLORS.inkSoft }}>
                    {period.start ? `${formatDateShort(period.start)} – ${formatDate(period.end)}` : 'Full monitored period'}
                    <span style={{ color: COLORS.faint, fontWeight: 400 }}>{'   ·   '}{period.days} day window</span>
                </p>
            </div>

            <div style={{ marginTop: 36, ...grid('1fr 1fr', 16) }}>
                {isComparison ? (
                    <>
                        <ComparisonTile
                            label="Mentions"
                            total={formatFull(totals.mentions)}
                            background={COLORS.infoSoft}
                            rows={brands.map((brand) => ({
                                name: brand.name,
                                color: brand.color,
                                value: brand.mentions,
                                display: formatFull(brand.mentions),
                            }))}
                        />
                        <ComparisonTile
                            label="Potential reach"
                            total={formatCompact(totals.reach)}
                            background={COLORS.violetSoft}
                            rows={brands.map((brand) => ({
                                name: brand.name,
                                color: brand.color,
                                value: brand.reach,
                                display: formatCompact(brand.reach),
                            }))}
                        />
                        <ComparisonTile
                            label="Engagements"
                            total={formatCompact(totals.engagement)}
                            background={COLORS.positiveSoft}
                            rows={brands.map((brand) => ({
                                name: brand.name,
                                color: brand.color,
                                value: brand.engagement,
                                display: formatCompact(brand.engagement),
                            }))}
                        />
                        <ComparisonTile
                            label="Net sentiment"
                            background={COLORS.accentSoft}
                            diverging
                            rows={brands.map((brand) => ({
                                name: brand.name,
                                color: brand.color,
                                value: brand.netSentiment,
                                display: `${brand.netSentiment > 0 ? '+' : ''}${brand.netSentiment}`,
                                valueColor: brand.netSentiment > 0 ? COLORS.positive : brand.netSentiment < 0 ? COLORS.negative : COLORS.muted,
                            }))}
                        />
                    </>
                ) : (
                    <>
                        <StatTile
                            value={formatFull(lead.mentions)}
                            label="Mentions"
                            note={`${formatFull(lead.scoredCount)} classified`}
                            background={COLORS.infoSoft}
                            noteColor={COLORS.info}
                        />
                        <StatTile
                            value={formatCompact(lead.reach)}
                            label="Potential reach"
                            note={`${lead.amplification >= 10 ? formatCompact(lead.amplification) : lead.amplification.toFixed(1)}× per mention`}
                            background={COLORS.violetSoft}
                            noteColor={COLORS.violet}
                        />
                        <StatTile
                            value={formatCompact(lead.engagement)}
                            label="Engagements"
                            note={`${lead.engagementRate.toFixed(2)}% rate`}
                            background={COLORS.positiveSoft}
                            noteColor={COLORS.positive}
                        />
                        <StatTile
                            value={`${lead.netSentiment > 0 ? '+' : ''}${lead.netSentiment}`}
                            label="Net sentiment"
                            note={lead.netSentiment > 0 ? 'Positive lead' : lead.netSentiment < 0 ? 'Negative lead' : 'Balanced'}
                            background={COLORS.accentSoft}
                            noteColor={COLORS.accent}
                            valueColor={lead.netSentiment > 0 ? COLORS.positive : lead.netSentiment < 0 ? COLORS.negative : COLORS.ink}
                        />
                    </>
                )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 24, paddingBottom: 16 }}>
                <Callout eyebrow="Executive signal" headline={narrative.verdict} body={narrative.executive} tone="dark" />
            </div>
        </div>
    );
};

// Three nested arcs sized by positive / neutral / negative share - the cover's only
// piece of ornament, and it still carries the headline number.
const CoverRing = ({ figures, label }) => {
    const size = 190;
    const rings = [
        { radius: 82, width: 9, color: COLORS.violet, fraction: Math.min(1, figures.mentions > 0 ? 0.9 : 0) },
        { radius: 68, width: 9, color: COLORS.info, fraction: (figures.positive + figures.neutral) / 100 },
        { radius: 54, width: 9, color: COLORS.accent, fraction: figures.positive / 100 },
    ];

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <g transform={`rotate(135 ${size / 2} ${size / 2})`}>
                {rings.map((ring, index) => {
                    const circumference = 2 * Math.PI * ring.radius;
                    const dash = circumference * 0.75 * ring.fraction;
                    return (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={ring.radius}
                            fill="none"
                            stroke={ring.color}
                            strokeWidth={ring.width}
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${circumference}`}
                        />
                    );
                })}
                </g>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 700, color: COLORS.ink, letterSpacing: -0.6 }}>
                    {formatCompact(figures.mentions)}
                </span>
                <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: COLORS.muted, marginTop: 4 }}>
                    {label}
                </span>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// 02 - Sentiment pulse
// ---------------------------------------------------------------------------

const PulsePage = ({ model }) => {
    const { lead } = model;
    const share = (pct) => Math.round((pct / 100) * lead.mentions);

    const tiles = [
        { key: 'positive', pct: lead.positive, background: COLORS.positiveSoft, color: COLORS.positive },
        { key: 'neutral', pct: lead.neutral, background: COLORS.neutralSoft, color: COLORS.muted },
        { key: 'negative', pct: lead.negative, background: COLORS.negativeSoft, color: COLORS.negative },
    ];

    return (
        <>
            <SectionTitle
                eyebrow="01 / Sentiment pulse"
                title="How the conversation feels"
                subtitle={`Classification across ${formatFull(lead.mentions)} mentions for ${lead.name} — based on ${lead.basis}.`}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                <Donut
                    size={210}
                    thickness={26}
                    segments={[
                        { value: lead.positive, color: TONE_COLORS.positive },
                        { value: lead.neutral, color: TONE_COLORS.neutral },
                        { value: lead.negative, color: TONE_COLORS.negative },
                    ]}
                    centerValue={`${lead.netSentiment > 0 ? '+' : ''}${lead.netSentiment}`}
                    centerLabel="Net sentiment"
                    centerValueColor={lead.netSentiment > 0 ? COLORS.positive : lead.netSentiment < 0 ? COLORS.negative : COLORS.ink}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {tiles.map((tile) => (
                        <div key={tile.key} style={{ backgroundColor: tile.background, borderRadius: 12, padding: '16px 20px' }}>
                            <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 27, fontWeight: 700, color: COLORS.ink, letterSpacing: -0.5 }}>
                                {tile.pct}%
                            </p>
                            <p style={{ margin: '8px 0 0', fontSize: 9.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: COLORS.muted }}>
                                {TONE_LABEL[tile.key]}
                            </p>
                            <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 700, color: tile.color }}>
                                {formatFull(share(tile.pct))} mentions
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 38 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <BlockLabel style={{ marginBottom: 0 }}>Sentiment by channel</BlockLabel>
                    <LegendRow
                        items={[
                            { label: 'Positive', color: TONE_COLORS.positive },
                            { label: 'Neutral', color: TONE_COLORS.neutral },
                            { label: 'Negative', color: TONE_COLORS.negative },
                        ]}
                    />
                </div>

                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {lead.channels.map((channel) => (
                        <div key={channel.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 120, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Swatch color={channel.color} />
                                <div>
                                    <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 12.5, fontWeight: 600, color: COLORS.ink }}>{channel.label}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 10, color: COLORS.faint }}>{formatFull(channel.mentions)} mentions</p>
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <SentimentStack positive={channel.positive} neutral={channel.neutral} negative={channel.negative} height={20} />
                            </div>
                            <div style={{ width: 92, flexShrink: 0, textAlign: 'right' }}>
                                <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 12, fontWeight: 700, color: COLORS.ink }}>
                                    {channel.positive}/{channel.neutral}/{channel.negative}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {model.isComparison && (
                <div style={{ marginTop: 34 }}>
                    <BlockLabel>Net sentiment across the compared set</BlockLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[...model.brands].sort((a, b) => b.netSentiment - a.netSentiment).map((brand) => (
                            <div key={brand.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 130, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Swatch color={brand.color} />
                                    <span style={{ fontFamily: FONT_HEAD, fontSize: 12.5, fontWeight: 600, color: COLORS.ink }}>{brand.name}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <SentimentStack positive={brand.positive} neutral={brand.neutral} negative={brand.negative} height={18} />
                                </div>
                                <div style={{ width: 60, textAlign: 'right', flexShrink: 0 }}>
                                    <span
                                        style={{
                                            fontFamily: FONT_HEAD,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: brand.netSentiment > 0 ? COLORS.positive : brand.netSentiment < 0 ? COLORS.negative : COLORS.muted,
                                        }}
                                    >
                                        {brand.netSentiment > 0 ? '+' : ''}{brand.netSentiment}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                <FootNote>
                    Net sentiment is the positive share minus the negative share, on a −100 to +100 scale. Channel splits are
                    read left to right as positive / neutral / negative.
                </FootNote>
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 03 - Conversation movement
// ---------------------------------------------------------------------------

const MovementPage = ({ model }) => {
    const { timeline, narrative } = model;
    const axis = timeline.days.length > 0
        ? [
            formatDateShort(timeline.days[0]),
            timeline.days.length > 2 ? formatDateShort(timeline.days[Math.floor(timeline.days.length / 2)]) : '',
            formatDateShort(timeline.days[timeline.days.length - 1]),
        ].filter(Boolean)
        : [];

    return (
        <>
            <SectionTitle
                eyebrow="02 / Conversation movement"
                title="When attention moved"
                subtitle="Daily mention volume with peak attribution"
            />

            {timeline.series.length > 1 && (
                <LegendRow
                    style={{ marginBottom: 14 }}
                    items={timeline.series.map((s) => ({ label: s.name, color: s.color }))}
                />
            )}

            <TrendChart series={timeline.series} labels={timeline.days} width={CONTENT_WIDTH} height={250} markers={timeline.markers} />
            <AxisLabels items={axis} width={CONTENT_WIDTH} />

            <div style={{ marginTop: 40, ...grid(`repeat(${Math.max(1, timeline.peaks.length)}, 1fr)`, 14) }}>
                {timeline.peaks.map((peak) => (
                    <div key={peak.day} style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: '18px 18px 20px' }}>
                        <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 10, fontWeight: 700, letterSpacing: 1.1, color: peak.color }}>
                            {peak.label}
                        </p>
                        <p
                            style={{
                                margin: '12px 0 0',
                                fontFamily: FONT_HEAD,
                                fontSize: 13,
                                fontWeight: 600,
                                lineHeight: 1.35,
                                color: COLORS.ink,
                                // Three lines at this size and column width; the string is
                                // trimmed to fit rather than clipped by the box.
                                minHeight: 53,
                            }}
                        >
                            {clampText(peak.headline, PEAK_HEADLINE_CHARS)}
                        </p>
                        <p style={{ margin: '12px 0 0', fontSize: 11, color: COLORS.muted }}>
                            {formatFull(peak.value)} mentions{peak.channel ? ` · ${peak.channel}` : ''}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 34 }}>
                <BlockLabel>Period at a glance</BlockLabel>
                <StatStrip
                    items={[
                        { value: formatFull(Math.round(timeline.stats.averagePerDay)), label: 'Mentions per day', note: 'Daily average' },
                        { value: String(timeline.stats.activeDays), label: 'Days with coverage' },
                        { value: formatFull(timeline.stats.busiest.value), label: 'Busiest day', note: timeline.stats.busiest.label, color: COLORS.positive },
                        { value: formatFull(timeline.stats.quietest.value), label: 'Quietest day', note: timeline.stats.quietest.label, color: COLORS.faint },
                    ]}
                />
            </div>

            <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                <FootNote>{narrative.peakLine}</FootNote>
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 04 - Channel performance
// ---------------------------------------------------------------------------

const ChannelPage = ({ model }) => {
    const { lead, narrative } = model;
    const maxMentions = Math.max(1, ...lead.channels.map((c) => c.mentions));

    return (
        <>
            <SectionTitle
                eyebrow="03 / Channel performance"
                title="Volume, reach and engagement"
                subtitle={`Cross-channel monitoring view for ${lead.name}`}
            />

            <TableHead
                columns={[
                    { label: 'Channel', width: 128 },
                    { label: 'Share of volume', flex: 1 },
                    { label: 'Mentions', width: 86, align: 'right' },
                    { label: 'Reach', width: 78, align: 'right' },
                    { label: 'Eng.', width: 68, align: 'right' },
                ]}
            />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {lead.channels.map((channel) => (
                    <div
                        key={channel.label}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px 0',
                            borderBottom: `1px solid ${COLORS.hairline}`,
                        }}
                    >
                        <div style={{ width: 128, display: 'flex', alignItems: 'center', gap: 9 }}>
                            <Swatch color={channel.color} size={11} />
                            <span style={{ fontFamily: FONT_HEAD, fontSize: 13, fontWeight: 600, color: COLORS.ink }}>{channel.label}</span>
                        </div>
                        <div style={{ flex: 1, paddingRight: 20 }}>
                            <div style={{ height: 16, borderRadius: 16, backgroundColor: COLORS.surface, overflow: 'hidden' }}>
                                <div style={{ width: `${(channel.mentions / maxMentions) * 100}%`, height: '100%', borderRadius: 16, backgroundColor: channel.color }} />
                            </div>
                        </div>
                        <div style={{ width: 86, textAlign: 'right' }}>
                            <span style={{ fontFamily: FONT_HEAD, fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{formatFull(channel.mentions)}</span>
                        </div>
                        <div style={{ width: 78, textAlign: 'right' }}>
                            <span style={{ fontSize: 12, color: COLORS.muted }}>{formatCompact(channel.reach)}</span>
                        </div>
                        <div style={{ width: 68, textAlign: 'right' }}>
                            <span style={{ fontFamily: FONT_HEAD, fontSize: 12.5, fontWeight: 700, color: COLORS.ink }}>{formatCompact(channel.engagement)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {model.isComparison && (
                <div style={{ marginTop: 34 }}>
                    <BlockLabel>Brand comparison</BlockLabel>
                    <TableHead
                        columns={[
                            { label: 'Brand', width: 128 },
                            { label: 'Share of voice', flex: 1 },
                            { label: 'Mentions', width: 86, align: 'right' },
                            { label: 'Reach', width: 78, align: 'right' },
                            { label: 'Eng.', width: 68, align: 'right' },
                        ]}
                    />
                    {model.brands.map((brand) => (
                        <div key={brand.name} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: `1px solid ${COLORS.hairline}` }}>
                            <div style={{ width: 128, display: 'flex', alignItems: 'center', gap: 9 }}>
                                <Swatch color={brand.color} size={11} />
                                <span style={{ fontFamily: FONT_HEAD, fontSize: 13, fontWeight: 600, color: COLORS.ink }}>{brand.name}</span>
                            </div>
                            <div style={{ flex: 1, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ flex: 1, height: 14, borderRadius: 14, backgroundColor: COLORS.surface, overflow: 'hidden' }}>
                                    <div style={{ width: `${brand.shareOfVoice}%`, height: '100%', borderRadius: 14, backgroundColor: brand.color }} />
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, width: 40, textAlign: 'right' }}>
                                    {brand.shareOfVoice.toFixed(1)}%
                                </span>
                            </div>
                            <div style={{ width: 86, textAlign: 'right' }}>
                                <span style={{ fontFamily: FONT_HEAD, fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{formatFull(brand.mentions)}</span>
                            </div>
                            <div style={{ width: 78, textAlign: 'right' }}>
                                <span style={{ fontSize: 12, color: COLORS.muted }}>{formatCompact(brand.reach)}</span>
                            </div>
                            <div style={{ width: 68, textAlign: 'right' }}>
                                <span style={{ fontFamily: FONT_HEAD, fontSize: 12.5, fontWeight: 700, color: COLORS.ink }}>{formatCompact(brand.engagement)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: 34 }}>
                <BlockLabel>Channel efficiency</BlockLabel>
                <StatStrip
                    items={lead.channels.slice(0, 4).map((channel) => ({
                        value: channel.reach > 0 ? `${((channel.engagement / channel.reach) * 100).toFixed(2)}%` : '—',
                        label: `${channel.label} eng. rate`,
                        note: `${formatCompact(channel.engagement)} on ${formatCompact(channel.reach)} reach`,
                        color: channel.color,
                    }))}
                />
            </div>

            <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                <Callout eyebrow="Channel signal" headline={narrative.channelSignal.headline} body={narrative.channelSignal.body} tone="info" />
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 05 - Narrative intelligence
// ---------------------------------------------------------------------------

const NarrativePage = ({ model }) => {
    const { themes, phrases, narrative } = model;
    const maxMentions = Math.max(1, ...themes.map((t) => t.mentions));

    return (
        <>
            <SectionTitle
                eyebrow="04 / Narrative intelligence"
                title="What people are talking about"
                subtitle="Themes driving the conversation, with the sentiment each one carries"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {themes.map((theme) => (
                    <MeterRow
                        key={theme.label}
                        label={theme.label}
                        value={theme.mentions}
                        max={maxMentions}
                        color={theme.color}
                        valueText={formatFull(theme.mentions)}
                        trailing={theme.positivePct === null ? '—' : `${theme.positivePct}% POS`}
                        trailingColor={
                            theme.positivePct === null ? COLORS.faint
                                : theme.positivePct >= 55 ? COLORS.positive
                                    : theme.positivePct >= 35 ? COLORS.accent
                                        : COLORS.negative
                        }
                        labelWidth={160}
                        barHeight={16}
                    />
                ))}
            </div>

            {phrases.length > 0 && (
                <div style={{ marginTop: 34, backgroundColor: COLORS.surface, borderRadius: 16, padding: '28px 26px' }}>
                    <BlockLabel color={COLORS.muted}>Phrase cloud</BlockLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'center', gap: '14px 22px' }}>
                        {phrases.map((phrase) => (
                            <span
                                key={phrase.text}
                                style={{
                                    fontFamily: FONT_HEAD,
                                    fontSize: phrase.size,
                                    fontWeight: phrase.size > 20 ? 700 : 600,
                                    color: phrase.color,
                                    lineHeight: 1.2,
                                }}
                            >
                                {phrase.text}
                            </span>
                        ))}
                    </div>
                    <LegendRow
                        style={{ marginTop: 22, justifyContent: 'center' }}
                        items={[
                            { label: 'Positive driver', color: COLORS.positive },
                            { label: 'Contested', color: COLORS.accent },
                            { label: 'Negative driver', color: COLORS.negative },
                        ]}
                    />
                </div>
            )}

            <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                <FootNote>{narrative.narrativeSignal}</FootNote>
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 06 - Geography
// ---------------------------------------------------------------------------

const GeographyPage = ({ model }) => {
    const { regions, lead } = model;
    const total = regions.reduce((sum, region) => sum + region.mentions, 0);
    const maxMentions = Math.max(1, ...regions.map((r) => r.mentions));
    const ranked = [...regions].sort((a, b) => b.score - a.score);
    const best = ranked[0];
    const worst = ranked[ranked.length - 1];
    const leading = regions[0];

    return (
        <>
            <SectionTitle
                eyebrow="05 / Audience intelligence"
                title="Where the conversation sits"
                subtitle={`Geographic distribution of ${lead.name} coverage, with the sentiment each market carries`}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
                <Donut
                    size={200}
                    thickness={24}
                    segments={regions.map((region) => ({ value: region.mentions, color: region.color }))}
                    centerValue={formatCompact(total)}
                    centerLabel="Located mentions"
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {regions.map((region) => (
                        <MeterRow
                            key={region.name}
                            label={region.name}
                            sublabel={`${formatFull(region.mentions)} mentions`}
                            value={region.mentions}
                            max={maxMentions}
                            color={region.color}
                            valueText={total > 0 ? `${Math.round((region.mentions / total) * 100)}%` : '—'}
                            trailing={TONE_LABEL[region.tone]}
                            trailingColor={region.color}
                            labelWidth={112}
                            barHeight={13}
                        />
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 40 }}>
                <BlockLabel>Market signals</BlockLabel>
                <StatStrip
                    items={[
                        {
                            value: best ? best.name : '—',
                            label: 'Most favourable market',
                            note: best ? `score ${best.score >= 0 ? '+' : ''}${best.score.toFixed(2)} · ${formatFull(best.mentions)} mentions` : '',
                            color: COLORS.positive,
                        },
                        {
                            value: worst ? worst.name : '—',
                            label: 'Most critical market',
                            note: worst ? `score ${worst.score >= 0 ? '+' : ''}${worst.score.toFixed(2)} · ${formatFull(worst.mentions)} mentions` : '',
                            color: COLORS.negative,
                        },
                        {
                            value: leading && total > 0 ? `${Math.round((leading.mentions / total) * 100)}%` : '—',
                            label: 'Concentration',
                            note: leading ? `in ${leading.name}` : '',
                            color: COLORS.info,
                        },
                    ]}
                />
            </div>

            <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                <FootNote>
                    Geographic attribution is derived from news coverage, which is the only channel in the set that reliably
                    carries a location. Social mentions are counted in the totals but not in this split.
                </FootNote>
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 07 - Top content
// ---------------------------------------------------------------------------

const ContentPage = ({ model }) => {
    const { topContent, narrative } = model;
    const toneStyle = {
        positive: { color: COLORS.positive, background: COLORS.positiveSoft },
        neutral: { color: COLORS.muted, background: COLORS.neutralSoft },
        negative: { color: COLORS.negative, background: COLORS.negativeSoft },
    };

    return (
        <>
            <SectionTitle
                eyebrow="06 / Content performance"
                title="Top-performing coverage"
                subtitle="Cross-channel ranking by audience interaction"
            />

            <TableHead
                columns={[
                    { label: '#', width: 46 },
                    { label: 'Channel + item', flex: 1 },
                    { label: 'Reach', width: 76, align: 'right' },
                    { label: 'Eng.', width: 68, align: 'right' },
                    { label: 'Tone', width: 76, align: 'right' },
                ]}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
                {topContent.map((item) => {
                    const tone = toneStyle[item.tone] || toneStyle.neutral;
                    return (
                        <div
                            key={`${item.rank}-${item.title}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: COLORS.surface,
                                borderRadius: 12,
                                padding: '14px 16px',
                            }}
                        >
                            <div style={{ width: 46, flexShrink: 0 }}>
                                <div
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 8,
                                        backgroundColor: tone.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span style={{ fontFamily: FONT_HEAD, fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{item.rank}</span>
                                </div>
                            </div>

                            <div style={{ flex: 1, paddingRight: 18, minWidth: 0 }}>
                                <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: item.channelColor }}>
                                    {item.channel}
                                    {item.brand ? <span style={{ color: COLORS.faint }}>{`  ·  ${item.brand}`}</span> : null}
                                </p>
                                <p
                                    style={{
                                        margin: '6px 0 0',
                                        fontFamily: FONT_HEAD,
                                        fontSize: 12.5,
                                        fontWeight: 600,
                                        lineHeight: 1.35,
                                        color: COLORS.ink,
                                        // Two lines at this size and column width.
                                        minHeight: 34,
                                    }}
                                >
                                    {clampText(item.title, CONTENT_TITLE_CHARS)}
                                </p>
                            </div>

                            <div style={{ width: 76, textAlign: 'right', flexShrink: 0 }}>
                                <span style={{ fontFamily: FONT_HEAD, fontSize: 12.5, fontWeight: 700, color: COLORS.ink }}>{formatCompact(item.reach)}</span>
                            </div>
                            <div style={{ width: 68, textAlign: 'right', flexShrink: 0 }}>
                                <span style={{ fontFamily: FONT_HEAD, fontSize: 12.5, fontWeight: 700, color: COLORS.ink }}>{formatCompact(item.engagement)}</span>
                            </div>
                            <div style={{ width: 76, textAlign: 'right', flexShrink: 0 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: tone.color }}>{TONE_LABEL[item.tone]}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                <Callout eyebrow="Content signal" headline={narrative.contentSignal.headline} body={narrative.contentSignal.body} tone="positive" />
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 08 - Executive action
// ---------------------------------------------------------------------------

const ActionPage = ({ model }) => {
    const { narrative, lead } = model;

    return (
        <>
            <SectionTitle
                eyebrow="07 / Executive action"
                title={`What ${lead.name} should do next`}
                subtitle="Prioritised actions, each tied to a figure in this report"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {narrative.actions.map((action, index) => (
                    <div
                        key={action.title}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 20,
                            backgroundColor: action.background,
                            borderRadius: 14,
                            padding: '20px 22px',
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                backgroundColor: action.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <span style={{ fontFamily: FONT_HEAD, fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700, color: COLORS.ink }}>{action.title}</p>
                            <p style={{ margin: '6px 0 0', fontSize: 11.5, lineHeight: 1.5, color: COLORS.muted }}>{action.body}</p>
                        </div>

                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                            <span
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 6,
                                    padding: '5px 10px',
                                    fontSize: 9.5,
                                    fontWeight: 700,
                                    letterSpacing: 0.8,
                                    textTransform: 'uppercase',
                                    color: action.color,
                                }}
                            >
                                {action.owner}
                            </span>
                            <p style={{ margin: '8px 0 0', fontFamily: FONT_HEAD, fontSize: 12, fontWeight: 700, color: action.color }}>{action.due}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                <Callout eyebrow="Executive conclusion" headline={narrative.conclusion} body={narrative.executive} tone="dark" />
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 09 - Methodology
// ---------------------------------------------------------------------------

const MethodologyPage = ({ model }) => {
    const { lead, period, brands } = model;

    const coverage = [
        { value: formatFull(lead.mentions), label: 'Mentions analysed' },
        { value: String(lead.channels.length || 0), label: 'Channels monitored' },
        { value: formatCompact(lead.reach), label: 'Potential reach' },
        { value: formatCompact(lead.engagement), label: 'Engagements' },
        { value: String(period.days), label: 'Days covered' },
        { value: String(brands.length), label: brands.length > 1 ? 'Brands compared' : 'Brand tracked' },
    ];

    const dimensions = [
        'Sentiment classification', 'Channel performance',
        'Daily trend + peak drivers', 'Narrative themes',
        'Geographic distribution', 'Top-performing content',
        'Competitive share of voice', 'Prioritised actions',
    ];

    return (
        <>
            <SectionTitle
                eyebrow="08 / Methodology"
                title="How this report is built"
                subtitle="Coverage, classification basis and the dimensions included in this edition"
            />

            <BlockLabel>Report coverage</BlockLabel>
            <div style={{ ...grid('repeat(3, 1fr)', 14) }}>
                {coverage.map((item) => (
                    <div key={item.label} style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: '20px 20px' }}>
                        <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 25, fontWeight: 700, color: COLORS.ink, letterSpacing: -0.5 }}>
                            {item.value}
                        </p>
                        <p style={{ margin: '10px 0 0', fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: COLORS.muted }}>
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 34 }}>
                <BlockLabel>Included dimensions</BlockLabel>
                <div style={{ ...grid('1fr 1fr', '12px 24px') }}>
                    {dimensions.map((dimension) => (
                        <div key={dimension} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Swatch color={COLORS.positive} size={9} />
                            <span style={{ fontSize: 12, color: COLORS.inkSoft }}>{dimension}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 34 }}>
                <BlockLabel>Classification basis</BlockLabel>
                <div style={{ backgroundColor: COLORS.accentSoft, borderRadius: 14, padding: '22px 24px' }}>
                    <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.7, color: COLORS.inkSoft }}>
                        Mentions are scored per item where the source supports it, and fall back to the channel&rsquo;s average
                        sentiment score where per-item coverage is below half the channel&rsquo;s volume. This edition classified{' '}
                        <strong>{formatFull(lead.scoredCount)}</strong> of <strong>{formatFull(lead.mentionCount)}</strong>{' '}
                        retrieved items directly for {lead.name}; the remainder is represented by its channel average.
                        Potential reach is the audience a piece of coverage could have been seen by, not a count of unique
                        people. Engagement counts likes and comments where the platform exposes them.
                    </p>
                </div>
            </div>

            <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                <FootNote>
                    Generated {formatDate(model.generatedOn)} by ArabyProphet · {period.start ? `${formatDateShort(period.start)} – ${formatDate(period.end)}` : 'full monitored period'}.
                </FootNote>
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

// Rendered off-screen at true A4 size; the exporter walks the [data-report-page]
// nodes and puts one node on one PDF page, so nothing is ever sliced in half.
const SentimentReportDocument = React.forwardRef(({ model, logo }, ref) => {
    if (!model) return null;

    const pages = [
        { key: 'cover', node: <CoverPage model={model} logo={logo} />, flush: false, cover: true },
        { key: 'pulse', node: <PulsePage model={model} /> },
        model.timeline.days.length > 1 && { key: 'movement', node: <MovementPage model={model} /> },
        model.lead.channels.length > 0 && { key: 'channel', node: <ChannelPage model={model} /> },
        model.themes.length > 0 && { key: 'narrative', node: <NarrativePage model={model} /> },
        model.regions.length > 0 && { key: 'geography', node: <GeographyPage model={model} /> },
        model.topContent.length > 0 && { key: 'content', node: <ContentPage model={model} /> },
        model.narrative.actions.length > 0 && { key: 'action', node: <ActionPage model={model} /> },
        { key: 'methodology', node: <MethodologyPage model={model} /> },
    ].filter(Boolean);

    return (
        <div
            ref={ref}
            style={{
                width: PAGE_WIDTH,
                backgroundColor: '#FFFFFF',
                fontFamily: FONT_BODY,
                color: COLORS.ink,
            }}
        >
            {pages.map((page, index) => (
                <Page key={page.key} index={index + 1} total={pages.length}>
                    {!page.cover && <PageHeader logo={logo} pageNumber={index + 1} />}
                    {page.node}
                </Page>
            ))}
        </div>
    );
});

SentimentReportDocument.displayName = 'SentimentReportDocument';

export default SentimentReportDocument;
