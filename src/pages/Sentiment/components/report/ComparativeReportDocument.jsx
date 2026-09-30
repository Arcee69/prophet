import React from 'react';
import {
    FONT_BODY,
    FONT_HEAD,
    PAGE_WIDTH,
    REPUTATION_COLORS as C,
    clampText,
    formatCompact,
    formatFull,
} from './reportTheme';
import {
    Badge,
    Body,
    BrandRule,
    Bullets,
    Eyebrow,
    Headline,
    InteriorHeader,
    LevelPill,
    Logo,
    PageTitle,
    Panel,
    Sheet,
    SideAccentCard,
    TopAccentCard,
} from './IntelligencePrimitives';
import { grid, pad2, readable, signed3 } from './intelligenceHelpers';

// The Comparative Intelligence edition: the lead brand measured against up to three
// competitors. It shares the reputation edition's template and capture rules - see
// IntelligencePrimitives - and, like it, drops any page the response left empty.

const EDITION = 'Comparative Intelligence';

const compact = (value) => (value === null || value === undefined ? '—' : formatCompact(value));
const full = (value) => (value === null || value === undefined ? '—' : formatFull(value));
const percent = (value) => (value === null || value === undefined ? '—' : `${value.toFixed(1)}%`);

const Swatch = ({ color, size = 9 }) => (
    <span style={{ width: size, height: size, borderRadius: size, backgroundColor: color, display: 'inline-block', flexShrink: 0 }} />
);

const BrandName = ({ brand, size = 10, chars = 22, weight = 700 }) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <Swatch color={brand.color} size={size * 0.85} />
        <span style={{ fontSize: size, fontWeight: weight, color: C.ink, whiteSpace: 'nowrap' }}>{clampText(brand.name, chars)}</span>
    </span>
);

// One brand's value against the largest in the set: name, proportional bar, figure.
const BarRow = ({ brand, value, max, text, labelWidth = 96, height = 10, size = 9.5 }) => {
    const ratio = max > 0 && value ? Math.max(0, Math.min(1, value / max)) : 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: labelWidth, flexShrink: 0 }}>
                <BrandName brand={brand} size={size} chars={Math.floor(labelWidth / 6)} weight={brand.lead ? 700 : 400} />
            </div>
            <div style={{ flex: 1, height, backgroundColor: C.track }}>
                {ratio > 0 && <div style={{ width: `${ratio * 100}%`, height: '100%', backgroundColor: brand.color }} />}
            </div>
            <span style={{ width: 52, flexShrink: 0, textAlign: 'right', fontSize: size, fontWeight: 700, color: C.ink }}>{text}</span>
        </div>
    );
};

// Positive / neutral / negative shares, when the service supplies them.
const SplitBar = ({ split }) => {
    const total = Math.max(1, split.positive + split.neutral + split.negative);
    const parts = [
        { key: 'positive', value: split.positive, color: C.green },
        { key: 'neutral', value: split.neutral, color: C.line },
        { key: 'negative', value: split.negative, color: C.red },
    ];
    return (
        <div style={{ display: 'flex', height: 8, marginTop: 10, backgroundColor: C.track }}>
            {parts.filter((part) => part.value > 0).map((part) => (
                <div key={part.key} style={{ width: `${(part.value / total) * 100}%`, height: '100%', backgroundColor: part.color }} />
            ))}
        </div>
    );
};

// ---------------------------------------------------------------------------
// 01 - Cover
// ---------------------------------------------------------------------------

// Share of voice as a ring, lead brand from 12 o'clock. The start angle is an SVG
// transform attribute because html2canvas drops a CSS transform on an <svg>.
const ShareRing = ({ brands, lead, size = 232, thickness = 30 }) => {
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = brands.reduce((sum, brand) => sum + (brand.share || 0), 0);

    let offset = 0;
    const arcs = brands.filter((brand) => brand.share > 0).map((brand) => {
        const dash = (brand.share / total) * circumference;
        const arc = (
            <circle
                key={brand.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={brand.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
            />
        );
        offset += dash;
        return arc;
    });

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.track} strokeWidth={thickness} />
                <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>{arcs}</g>
                <circle cx={size / 2} cy={size / 2} r={radius - thickness / 2 - 8} fill="none" stroke={C.yellow} strokeWidth="1.5" />
            </svg>
            <div style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: FONT_HEAD, fontSize: 32, fontWeight: 700, color: C.ink }}>{percent(lead.share)}</span>
                <Eyebrow color={C.muted} style={{ marginTop: 4, fontSize: 7 }}>{clampText(lead.name, 16)} share of voice</Eyebrow>
            </div>
        </div>
    );
};

const CoverBrandTile = ({ brand }) => (
    <TopAccentCard color={brand.color} background={brand.soft} minHeight={150} padding="14px 14px 12px">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <Headline size={14}>{clampText(brand.name, 18)}</Headline>
            {brand.lead && <Eyebrow color={brand.color} style={{ fontSize: 7 }}>Lead</Eyebrow>}
        </div>
        <div style={{ ...grid('1fr 1fr', '10px 8px'), marginTop: 14 }}>
            {[
                { label: 'Mentions', value: full(brand.mentions) },
                { label: 'Reach', value: compact(brand.reach) },
                { label: 'Sentiment', value: signed3(brand.sentiment) },
                { label: 'Share of voice', value: percent(brand.share) },
            ].map((stat) => (
                <div key={stat.label}>
                    <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 14, fontWeight: 700, color: C.ink }}>{stat.value}</p>
                    <Eyebrow color={C.muted} style={{ marginTop: 3, fontSize: 6.5 }}>{stat.label}</Eyebrow>
                </div>
            ))}
        </div>
    </TopAccentCard>
);

const CoverPage = ({ model, logo }) => {
    const { lead, competitors, brands, industry, summary, period } = model;
    const titleSize = lead.name.length > 22 ? 32 : lead.name.length > 12 ? 40 : 46;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 50 }}>
                <div>
                    <Logo logo={logo} height={54} />
                    <Eyebrow color={C.muted} style={{ marginTop: 26 }}>Executive competitive intelligence</Eyebrow>
                </div>
                {industry && (
                    <Panel background={C.greenSoft} border={C.greenLine} style={{ width: 220, borderRadius: 14, padding: '22px 22px' }}>
                        <Eyebrow color={C.green} style={{ fontSize: 7.5 }}>Industry</Eyebrow>
                        <Headline size={15} style={{ marginTop: 10 }}>{clampText(industry, 40)}</Headline>
                    </Panel>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 64 }}>
                <div style={{ width: 440 }}>
                    <h1 style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: titleSize, lineHeight: 1.1, fontWeight: 700, color: C.ink }}>
                        {clampText(lead.name, 48)}
                    </h1>
                    <p style={{ margin: '8px 0 0', fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, lineHeight: 1.3, color: C.muted }}>
                        vs{' '}
                        {competitors.map((brand, index) => (
                            <React.Fragment key={brand.key}>
                                {index > 0 && ', '}
                                <span style={{ color: brand.color }}>{clampText(brand.name, 24)}</span>
                            </React.Fragment>
                        ))}
                    </p>
                    <Headline size={21} style={{ marginTop: 16 }}>Comparative Intelligence Report</Headline>
                    <div style={{ width: 104, height: 6, backgroundColor: C.yellow, marginTop: 20 }} />
                </div>
                {lead.share !== null && <ShareRing brands={brands} lead={lead} />}
            </div>

            {summary.headline && (
                <Panel background={C.yellowSoft} border={C.yellowLine} style={{ marginTop: 'auto', borderRadius: 14, padding: '20px 24px' }}>
                    <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, color: C.orange }}>The competitive signal</p>
                    <Headline size={17} style={{ marginTop: 12 }}>{clampText(summary.headline, 150)}</Headline>
                    {summary.position && <Body size={10} style={{ marginTop: 8 }}>{clampText(summary.position, 440)}</Body>}
                </Panel>
            )}

            <div style={{ ...grid(`repeat(${brands.length}, 1fr)`, 10), marginTop: summary.headline ? 36 : 'auto' }}>
                {brands.map((brand) => <CoverBrandTile key={brand.key} brand={brand} />)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, marginBottom: 8 }}>
                <div>
                    <Eyebrow color={C.muted} style={{ fontSize: 7.5 }}>Monitoring period</Eyebrow>
                    <Headline size={11} style={{ marginTop: 10 }}>{period.label}</Headline>
                </div>
                <div style={{ width: 170 }}>
                    <Eyebrow color={C.muted} style={{ fontSize: 7.5 }}>Executive edition</Eyebrow>
                    <Headline size={11} style={{ marginTop: 10 }}>Competitive position</Headline>
                </div>
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 02 - Executive summary
// ---------------------------------------------------------------------------

const SummaryPage = ({ model }) => {
    const { lead, summary } = model;

    return (
        <>
            <PageTitle
                title="Executive Summary"
                subtitle={`Where ${lead.name} stands against the compared brands, and what the evidence supports.`}
            />

            {(summary.headline || summary.body) && (
                <Panel background={C.greenSoft} border={C.greenLine} style={{ padding: '20px 22px 22px' }}>
                    <Eyebrow color={C.green}>The competitive signal</Eyebrow>
                    {summary.headline && <Headline size={16} style={{ marginTop: 14 }}>{clampText(summary.headline, 170)}</Headline>}
                    {summary.body && <Body size={10} style={{ marginTop: 10 }}>{clampText(summary.body, 720)}</Body>}
                </Panel>
            )}

            {summary.position && (
                <div style={{ marginTop: 14 }}>
                    <SideAccentCard color={lead.color} background={C.yellowSoft}>
                        <Eyebrow color={C.orange}>{clampText(lead.name, 30)} position</Eyebrow>
                        <Body size={10} color={C.ink} style={{ marginTop: 10 }}>{clampText(summary.position, 480)}</Body>
                    </SideAccentCard>
                </div>
            )}

            {summary.findings.length > 0 && (
                <Panel background={C.blueSoft} border={C.blueLine} style={{ marginTop: 14, padding: '18px 22px 20px' }}>
                    <Eyebrow color={C.blue}>Key findings</Eyebrow>
                    <div style={{ ...grid('1fr 1fr', '12px 26px'), marginTop: 14 }}>
                        {summary.findings.map((finding, index) => (
                            <div key={`${finding}-${index}`} style={{ display: 'flex', gap: 10 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: index % 2 === 0 ? C.green : C.orange, flexShrink: 0, lineHeight: 1.45 }}>
                                    {pad2(index + 1)}
                                </span>
                                <Body size={9}>{clampText(finding, 320)}</Body>
                            </div>
                        ))}
                    </div>
                </Panel>
            )}

            {summary.limitations.length > 0 && (
                <Panel background={C.surface} style={{ marginTop: 'auto', marginBottom: 8, padding: '16px 22px 18px' }}>
                    <Eyebrow color={C.muted}>Read with care</Eyebrow>
                    <div style={{ ...grid('1fr 1fr', '8px 26px'), marginTop: 12 }}>
                        {summary.limitations.map((item) => (
                            <Bullets key={item} items={[item]} color={C.orange} chars={150} size={8.5} />
                        ))}
                    </div>
                </Panel>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// 03 - Competitive scorecard
// ---------------------------------------------------------------------------

const ScorecardPage = ({ model }) => {
    const { brands, leaders, overview, hasEngagement, shareModelled } = model;
    const maxOf = (field) => Math.max(0, ...brands.map((brand) => brand[field] || 0));
    const reachKnown = maxOf('reach') > 0;

    const columns = [
        { label: 'Brand', flex: 1 },
        { label: 'Mentions', width: 92, value: (brand) => full(brand.mentions), leader: leaders.mentions },
        { label: 'Reported reach', width: 102, value: (brand) => compact(brand.reach), leader: leaders.reach },
        hasEngagement && { label: 'Engagement', width: 92, value: (brand) => compact(brand.engagement), leader: leaders.engagement },
        { label: 'Share of voice', width: 96, value: (brand) => percent(brand.share), leader: leaders.mentions },
        { label: 'Avg sentiment', width: 96, value: (brand) => signed3(brand.sentiment) },
    ].filter(Boolean);

    const shareLeader = leaders.mentions;

    return (
        <>
            <PageTitle
                title="Competitive Scorecard"
                subtitle="Volume, audience scale and tone for every brand in the comparison, side by side."
            />

            <div style={{ borderBottom: `1px solid ${C.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: C.navy, padding: '12px 14px' }}>
                    {columns.map((column) => (
                        <span
                            key={column.label}
                            style={{
                                width: column.width,
                                flex: column.flex,
                                textAlign: column.flex ? 'left' : 'right',
                                fontSize: 7.5,
                                fontWeight: 700,
                                color: '#FFFFFF',
                                textTransform: 'uppercase',
                            }}
                        >
                            {column.label}
                        </span>
                    ))}
                </div>
                {brands.map((brand, index) => (
                    <div
                        key={brand.key}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: 46,
                            padding: '8px 14px',
                            boxSizing: 'border-box',
                            backgroundColor: index % 2 === 1 ? C.surface : '#FFFFFF',
                        }}
                    >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <BrandName brand={brand} size={11} chars={24} />
                            {brand.lead && <Eyebrow color={C.green} style={{ fontSize: 6.5 }}>Lead</Eyebrow>}
                        </div>
                        {columns.slice(1).map((column) => {
                            const leads = column.leader && column.leader.key === brand.key;
                            return (
                                <span
                                    key={column.label}
                                    style={{
                                        width: column.width,
                                        textAlign: 'right',
                                        fontFamily: FONT_HEAD,
                                        fontSize: 12,
                                        fontWeight: leads ? 700 : 500,
                                        color: leads ? readable(brand.color) : C.ink,
                                    }}
                                >
                                    {column.value(brand)}
                                </span>
                            );
                        })}
                    </div>
                ))}
            </div>
            <Body size={8} color={C.muted} style={{ marginTop: 8 }}>
                Coloured figures mark the leader on each measure.
                {shareModelled ? ' Share of voice is each brand’s share of all mentions in this comparison.' : ''}
                {hasEngagement ? '' : ' Engagement was not reported for these brands.'}
            </Body>

            <Panel style={{ marginTop: 16, padding: '18px 22px 20px' }}>
                <div style={grid(reachKnown ? '1fr 1fr' : '1fr', 28)}>
                    <div>
                        <Eyebrow>Mentions</Eyebrow>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                            {brands.map((brand) => (
                                <BarRow key={brand.key} brand={brand} value={brand.mentions} max={maxOf('mentions')} text={full(brand.mentions)} />
                            ))}
                        </div>
                    </div>
                    {reachKnown && (
                        <div>
                            <Eyebrow>Reported reach</Eyebrow>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                                {brands.map((brand) => (
                                    <BarRow key={brand.key} brand={brand} value={brand.reach} max={maxOf('reach')} text={compact(brand.reach)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {shareLeader && (
                    <>
                        <div style={{ height: 1, backgroundColor: C.line, margin: '18px 0 16px' }} />
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                            <Eyebrow>Share of voice</Eyebrow>
                            <span style={{ fontSize: 10, fontWeight: 700, color: readable(shareLeader.color) }}>
                                {clampText(shareLeader.name, 24)} holds {percent(shareLeader.share)} of the conversation
                            </span>
                        </div>
                        <div style={{ display: 'flex', width: '100%', height: 22, marginTop: 12, backgroundColor: C.track }}>
                            {brands.filter((brand) => brand.share > 0).map((brand) => (
                                <div key={brand.key} style={{ width: `${brand.share}%`, height: '100%', backgroundColor: brand.color }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', marginTop: 12 }}>
                            {brands.map((brand) => (
                                <span key={brand.key} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 9.5, fontWeight: 700, color: C.ink }}>
                                    <Swatch color={brand.color} />
                                    {clampText(brand.name, 22)}&nbsp;&nbsp;{percent(brand.share)}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </Panel>

            {(overview.analysis || overview.position) && (
                <Panel background={C.blueSoft} border={C.blueLine} style={{ marginTop: 16, padding: '18px 22px 20px' }}>
                    <Eyebrow color={C.blue}>Competitive position</Eyebrow>
                    {overview.position && <Headline size={13} style={{ marginTop: 12 }}>{clampText(overview.position, 220)}</Headline>}
                    {overview.analysis && <Body size={9.5} style={{ marginTop: 10 }}>{clampText(overview.analysis, 900)}</Body>}
                    {overview.basis && (
                        <Body size={8} color={C.muted} style={{ marginTop: 10 }}>Basis: {clampText(overview.basis, 200)}</Body>
                    )}
                </Panel>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// 04 - Channel comparison
// ---------------------------------------------------------------------------

const ChannelPage = ({ model }) => {
    const { channels, brands, overview } = model;
    // Four channels of four brands leaves room for less commentary per channel.
    const dense = channels.length * brands.length > 9;

    const metrics = [
        { label: 'Mentions', field: 'mentions', text: full },
        { label: 'Reported reach', field: 'reach', text: compact },
        { label: 'Engagement', field: 'engagement', text: compact },
    ];

    return (
        <>
            <PageTitle
                title="Channel Comparison"
                subtitle="Where each brand's conversation happens, and how far it travels on every channel."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {channels.map((channel) => {
                    // A measure no brand reports on this channel is left out rather
                    // than drawn as a row of dashes.
                    const shown = metrics.filter((metric) => channel.byBrand.some((entry) => entry[metric.field] > 0)).slice(0, 3);
                    const volumeLeader = [...channel.byBrand].sort((a, b) => b.mentions - a.mentions)[0];

                    return (
                        <Panel key={channel.id} style={{ padding: dense ? '12px 18px 14px' : '16px 20px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div
                                    style={{
                                        width: 84,
                                        height: 30,
                                        flexShrink: 0,
                                        borderRadius: 6,
                                        backgroundColor: channel.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span style={{ fontSize: 11, fontWeight: 700, color: channel.color === C.yellow ? C.ink : '#FFFFFF' }}>{channel.label}</span>
                                </div>
                                <Body size={9.5} color={C.muted} style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 700, color: readable(volumeLeader.brand.color) }}>{clampText(volumeLeader.brand.name, 24)}</span>
                                    {' '}leads with {full(volumeLeader.mentions)} mentions
                                </Body>
                            </div>

                            <div style={{ ...grid(`repeat(${Math.max(shown.length, 1)}, 1fr)`, 22), marginTop: dense ? 10 : 14 }}>
                                {shown.map((metric) => {
                                    const max = Math.max(0, ...channel.byBrand.map((entry) => entry[metric.field] || 0));
                                    return (
                                        <div key={metric.field}>
                                            <Eyebrow color={C.muted} style={{ fontSize: 7 }}>{metric.label}</Eyebrow>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: dense ? 5 : 7, marginTop: 8 }}>
                                                {channel.byBrand.map((entry) => (
                                                    <BarRow
                                                        key={entry.brand.key}
                                                        brand={entry.brand}
                                                        value={entry[metric.field]}
                                                        max={max}
                                                        text={metric.text(entry[metric.field])}
                                                        labelWidth={shown.length > 2 ? 70 : 96}
                                                        height={7}
                                                        size={8.5}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {channel.analysis && (
                                <Body size={8.5} style={{ marginTop: dense ? 8 : 12 }}>{clampText(channel.analysis, dense ? 170 : 300)}</Body>
                            )}
                        </Panel>
                    );
                })}
            </div>

            {overview.notes.length > 0 && !dense && (
                <Panel background={C.surface} style={{ marginTop: 'auto', marginBottom: 8, padding: '16px 22px 18px' }}>
                    <Eyebrow color={C.muted}>Comparability notes</Eyebrow>
                    <div style={{ marginTop: 12 }}>
                        <Bullets items={overview.notes.slice(0, 4)} color={C.blue} chars={170} size={8.5} gap={5} />
                    </div>
                </Panel>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// 05 - Sentiment comparison
// ---------------------------------------------------------------------------

const toneColor = (score) => (score === null ? C.muted : score <= -0.05 ? C.red : score >= 0.05 ? C.green : C.blue);

const SentimentPage = ({ model }) => {
    const { brands, channels } = model;
    // A floor on the scale so a near-neutral set does not draw full-width bars.
    const maxAbs = Math.max(0.15, ...brands.map((brand) => Math.abs(brand.sentiment || 0)));
    const barExtent = (score) => (Math.abs(score) / maxAbs) * 45;

    return (
        <>
            <PageTitle
                title="Sentiment Comparison"
                subtitle="The tone of each brand's coverage overall and by channel, and what drives it."
            />

            <Panel style={{ padding: '18px 22px 22px' }}>
                <div style={{ position: 'relative', height: 14 }}>
                    <Eyebrow>Average sentiment</Eyebrow>
                    <span style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -24, width: 48, textAlign: 'center', fontSize: 7.5, color: C.muted }}>NEUTRAL</span>
                    <span style={{ position: 'absolute', right: 0, top: 0, fontSize: 7.5, color: C.muted }}>POSITIVE</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
                    {brands.map((brand) => {
                        const score = brand.sentiment;
                        const extent = score === null ? 0 : barExtent(score);
                        return (
                            <div key={brand.key}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <BrandName brand={brand} size={10.5} chars={30} />
                                    <span style={{ fontSize: 10.5, fontWeight: 700, color: C.ink }}>
                                        {signed3(score)}
                                        <span style={{ marginLeft: 8, fontSize: 8.5, color: C.muted }}>{clampText(brand.sentimentLabel, 18)}</span>
                                    </span>
                                </div>
                                <div style={{ position: 'relative', height: 14, marginTop: 8 }}>
                                    {extent > 0 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                height: 14,
                                                width: `${extent}%`,
                                                left: score >= 0 ? '50%' : `${50 - extent}%`,
                                                backgroundColor: score < 0 ? C.red : brand.color,
                                            }}
                                        />
                                    )}
                                    <div style={{ position: 'absolute', left: '50%', top: -4, width: 1, height: 22, backgroundColor: C.muted }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Panel>

            {channels.length > 0 && (
                <div style={{ marginTop: 14, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: C.navy, padding: '10px 14px' }}>
                        <span style={{ flex: 1, fontSize: 7.5, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>Sentiment by channel</span>
                        {brands.map((brand) => (
                            <span key={brand.key} style={{ width: 112, textAlign: 'right', fontSize: 7.5, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                                {clampText(brand.name, 16)}
                            </span>
                        ))}
                    </div>
                    {channels.map((channel, index) => (
                        <div
                            key={channel.id}
                            style={{ display: 'flex', alignItems: 'center', padding: '9px 14px', backgroundColor: index % 2 === 1 ? C.surface : '#FFFFFF' }}
                        >
                            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, color: C.ink }}>
                                <Swatch color={channel.color} />
                                {channel.label}
                            </span>
                            {channel.byBrand.map((entry) => (
                                <span
                                    key={entry.brand.key}
                                    style={{ width: 112, textAlign: 'right', fontFamily: FONT_HEAD, fontSize: 11, fontWeight: 700, color: entry.mentions > 0 ? toneColor(entry.sentiment) : C.muted }}
                                >
                                    {entry.mentions > 0 ? signed3(entry.sentiment) : '—'}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ ...grid(brands.length > 2 ? '1fr 1fr' : `repeat(${brands.length}, 1fr)`, 10), marginTop: 18 }}>
                {brands.filter((brand) => brand.interpretation || brand.split).map((brand) => (
                    <SideAccentCard key={brand.key} color={brand.color} background={brand.soft}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                            <Headline size={12}>{clampText(brand.name, 24)}</Headline>
                            <Eyebrow color={C.muted} style={{ fontSize: 7 }}>{full(brand.mentions)} items</Eyebrow>
                        </div>
                        <Eyebrow color={readable(brand.color)} style={{ marginTop: 6, fontSize: 7.5 }}>{clampText(brand.sentimentLabel, 24)} overall</Eyebrow>
                        {brand.split && <SplitBar split={brand.split} />}
                        {brand.interpretation && (
                            <Body size={9} style={{ marginTop: 10 }}>{clampText(brand.interpretation, brands.length > 2 ? 230 : 340)}</Body>
                        )}
                    </SideAccentCard>
                ))}
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 06 - Competitive insights
// ---------------------------------------------------------------------------

const InsightsPage = ({ model }) => {
    const { insights, lead } = model;
    const palette = [C.green, C.blue, C.orange, C.red];

    return (
        <>
            <PageTitle
                title="Competitive Insights"
                subtitle={`What the comparison reveals, and what each finding means for ${lead.name}.`}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {insights.map((item, index) => {
                    const color = palette[index % palette.length];
                    return (
                        <Panel key={`${item.title}-${index}`} style={{ display: 'flex', gap: 16, padding: '18px 20px' }}>
                            <Badge color={color} size={34}>{pad2(index + 1)}</Badge>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Headline size={13}>{clampText(item.title, 90)}</Headline>
                                {item.insight && <Body size={9.5} style={{ marginTop: 8 }}>{clampText(item.insight, 280)}</Body>}
                                {(item.implication || item.evidence.length > 0) && (
                                    <div style={{ ...grid('1fr 1fr', 18), marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}` }}>
                                        <div>
                                            <Eyebrow color={C.green} style={{ fontSize: 7.5 }}>Implication for {clampText(lead.name, 20)}</Eyebrow>
                                            <Body size={8.5} style={{ marginTop: 6 }}>{clampText(item.implication, 230) || '—'}</Body>
                                        </div>
                                        <div>
                                            <Eyebrow color={C.blue} style={{ fontSize: 7.5, marginBottom: 6 }}>Evidence</Eyebrow>
                                            {item.evidence.length > 0
                                                ? <Bullets items={item.evidence} color={C.blue} chars={150} size={8.5} gap={4} />
                                                : <Body size={8.5} color={C.muted}>—</Body>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Panel>
                    );
                })}
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 07 / 08 - Strengths and gaps, risks and opportunities
// ---------------------------------------------------------------------------

const FindingCard = ({ item, index, color, background }) => (
    <SideAccentCard color={color} background={background}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Badge color={color} size={22}>{pad2(index + 1)}</Badge>
            <Headline size={11}>{clampText(item.title, 80)}</Headline>
        </div>
        {item.body && <Body size={9} style={{ marginTop: 8 }}>{clampText(item.body, 210)}</Body>}
        {item.evidence.length > 0 && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.line}` }}>
                <Bullets items={item.evidence} color={color} chars={140} size={8} gap={4} />
            </div>
        )}
    </SideAccentCard>
);

const FindingColumns = ({ columns }) => (
    <div style={grid('1fr 1fr', 14)}>
        {columns.map((column) => (
            <div key={column.label} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Eyebrow color={column.color}>{column.label}</Eyebrow>
                {column.items.length > 0
                    ? column.items.map((item, index) => (
                        <FindingCard key={`${item.title}-${index}`} item={item} index={index} color={column.color} background={column.background} />
                    ))
                    : <Body size={9} color={C.muted}>None identified for this period.</Body>}
            </div>
        ))}
    </div>
);

const StrengthsPage = ({ model }) => {
    const { lead, strengths, gaps, themes } = model;
    return (
        <>
            <PageTitle
                title="Strengths and Gaps"
                subtitle={`Where ${lead.name} holds an advantage over the compared brands, and where it falls behind.`}
            />
            <FindingColumns
                columns={[
                    { label: `${clampText(lead.name, 24)} strengths`, items: strengths, color: C.green, background: C.greenSoft },
                    { label: `${clampText(lead.name, 24)} gaps`, items: gaps, color: C.red, background: C.redSoft },
                ]}
            />
            {themes && (
                <Panel background={C.yellowSoft} border={C.yellowLine} style={{ marginTop: 'auto', marginBottom: 8, padding: '16px 22px 18px' }}>
                    <Eyebrow color={C.orange}>Narrative themes</Eyebrow>
                    <Body size={9.5} color={C.ink} style={{ marginTop: 10 }}>{clampText(themes, 420)}</Body>
                </Panel>
            )}
        </>
    );
};

const RiskPage = ({ model }) => {
    const { risks, opportunities } = model;
    return (
        <>
            <PageTitle
                title="Risks and Opportunities"
                subtitle="Competitive pressures to manage, and the openings the comparison exposes."
            />
            <FindingColumns
                columns={[
                    { label: 'Competitive risks', items: risks, color: C.orange, background: C.orangeSoft },
                    { label: 'Competitive opportunities', items: opportunities, color: C.blue, background: C.blueSoft },
                ]}
            />
        </>
    );
};

// ---------------------------------------------------------------------------
// 09 - Strategic recommendations
// ---------------------------------------------------------------------------

const PRIORITY_COLORS = { 1: C.red, 2: C.orange, 3: C.blue };

const RecommendationsPage = ({ model }) => {
    const { recommendations, direction } = model;

    return (
        <>
            <PageTitle
                title="Strategic Recommendations"
                subtitle="Prioritised actions, the competitive reason for each and how success will be measured."
            />

            <div style={grid('1fr 1fr', 12)}>
                {recommendations.map((item, index) => {
                    const color = PRIORITY_COLORS[item.rank] || C.green;
                    const numbered = /^\d+$/.test(item.priority);
                    return (
                        <TopAccentCard key={`${item.title}-${index}`} color={color} padding="14px 16px">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {numbered || !item.priority
                                    ? <Badge color={color} size={24}>{pad2(item.priority || index + 1)}</Badge>
                                    : <LevelPill value={item.priority} />}
                                <Eyebrow color={readable(color)} style={{ fontSize: 7.5 }}>Priority</Eyebrow>
                            </div>
                            <Headline size={11} style={{ marginTop: 10 }}>{clampText(item.title, 170)}</Headline>
                            <div style={{ height: 1, backgroundColor: C.line, marginTop: 10 }} />
                            {[
                                { label: 'Why', text: item.rationale },
                                { label: 'Competitive context', text: item.context },
                                { label: 'Success measure', text: item.measure },
                            ].filter((part) => part.text).map((part) => (
                                <React.Fragment key={part.label}>
                                    <Eyebrow color={C.muted} style={{ fontSize: 7, marginTop: 8 }}>{part.label}</Eyebrow>
                                    <Body size={8.5} style={{ marginTop: 3 }}>{clampText(part.text, 140)}</Body>
                                </React.Fragment>
                            ))}
                        </TopAccentCard>
                    );
                })}
            </div>

            {direction && (
                <Panel background={C.greenSoft} border={C.greenLine} style={{ marginTop: 'auto', marginBottom: 8, padding: '16px 22px 18px' }}>
                    <Eyebrow color={C.green}>Strategic direction</Eyebrow>
                    <Headline size={12} style={{ marginTop: 10 }}>{clampText(direction, 280)}</Headline>
                </Panel>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// 10 - Executive conclusion
// ---------------------------------------------------------------------------

const ConclusionPage = ({ model }) => {
    const { conclusion, lead, definitions } = model;

    return (
        <>
            <PageTitle
                title="Executive Conclusion"
                subtitle={`The competitive position, ${lead.name}'s priorities and the measures to track next period.`}
            />

            {conclusion.body && (
                <Panel background={C.greenSoft} border={C.greenLine} style={{ padding: '20px 22px 22px' }}>
                    <Eyebrow color={C.green}>Executive conclusion</Eyebrow>
                    <Body size={10.5} color={C.ink} style={{ marginTop: 12 }}>{clampText(conclusion.body, 700)}</Body>
                    <div style={{ display: 'flex', marginTop: 16 }}>
                        <div style={{ width: 175, height: 7, backgroundColor: C.greenBright }} />
                        <div style={{ width: 95, height: 7, backgroundColor: C.yellow }} />
                        <div style={{ width: 55, height: 7, backgroundColor: C.red }} />
                    </div>
                </Panel>
            )}

            {conclusion.priorities.length > 0 && (
                <div style={{ marginTop: 16 }}>
                    <Eyebrow color={C.orange}>{clampText(lead.name, 24)} priorities</Eyebrow>
                    <div style={{ ...grid('1fr 1fr', 8), marginTop: 10 }}>
                        {conclusion.priorities.map((item, index) => (
                            <div
                                key={`${item}-${index}`}
                                style={{ display: 'flex', gap: 10, alignItems: 'flex-start', backgroundColor: C.yellowSoft, border: `1px solid ${C.yellowLine}`, borderRadius: 8, padding: '10px 12px' }}
                            >
                                <Badge color={C.orange} size={22}>{pad2(index + 1)}</Badge>
                                <Body size={9}>{clampText(item, 130)}</Body>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {conclusion.monitor.length > 0 && (
                <div style={{ marginTop: 16 }}>
                    <Eyebrow color={C.blue}>Metrics to monitor</Eyebrow>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                        {conclusion.monitor.map((item) => (
                            <span
                                key={item}
                                style={{ backgroundColor: C.blueSoft, border: `1px solid ${C.blueLine}`, borderRadius: 12, padding: '4px 10px', fontSize: 8.5, fontWeight: 700, color: C.ink }}
                            >
                                {clampText(item, 80)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <Eyebrow style={{ marginTop: 'auto' }}>Metric definitions</Eyebrow>
            <div style={{ ...grid('1fr 1fr', 10), marginTop: 12, marginBottom: 8 }}>
                {definitions.map((definition, index) => (
                    <Panel key={definition.label} style={{ minHeight: 66, padding: '12px 16px' }}>
                        <Eyebrow color={index % 2 === 0 ? C.green : C.blue} style={{ fontSize: 7.5 }}>{definition.label}</Eyebrow>
                        <Body size={9} style={{ marginTop: 6 }}>{clampText(definition.body, 140)}</Body>
                    </Panel>
                ))}
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 11 - Evidence and methodology
// ---------------------------------------------------------------------------

const MethodPage = ({ model }) => {
    const { method } = model;

    return (
        <>
            <PageTitle
                title="Evidence and Methodology"
                subtitle="How the comparison was made, what the data covers and the sources behind the findings."
            />

            {(method.summary || method.coverage) && (
                <div style={grid(method.summary && method.coverage ? '1fr 1fr' : '1fr', 12)}>
                    {method.summary && (
                        <Panel background={C.greenSoft} border={C.greenLine}>
                            <Eyebrow color={C.green}>Methodology</Eyebrow>
                            <Body size={9} style={{ marginTop: 10 }}>{clampText(method.summary, 420)}</Body>
                        </Panel>
                    )}
                    {method.coverage && (
                        <Panel background={C.blueSoft} border={C.blueLine}>
                            <Eyebrow color={C.blue}>Data coverage</Eyebrow>
                            <Body size={9} style={{ marginTop: 10 }}>{clampText(method.coverage, 420)}</Body>
                        </Panel>
                    )}
                </div>
            )}

            {(method.notes.length > 0 || method.limitations.length > 0) && (
                <div style={{ ...grid('1fr 1fr', 12), marginTop: 14 }}>
                    {[
                        { label: 'Estimation notes', items: method.notes, color: C.blue },
                        { label: 'Data limitations', items: method.limitations, color: C.orange },
                    ].map((column) => (
                        <Panel key={column.label} background={C.surface}>
                            <Eyebrow color={readable(column.color)}>{column.label}</Eyebrow>
                            <div style={{ marginTop: 10 }}>
                                {column.items.length > 0
                                    ? <Bullets items={column.items} color={column.color} chars={140} size={8.5} gap={5} />
                                    : <Body size={9} color={C.muted}>None noted.</Body>}
                            </div>
                        </Panel>
                    ))}
                </div>
            )}

            {method.sources.length > 0 && (
                <div style={{ marginTop: 16 }}>
                    <Eyebrow>Source references</Eyebrow>
                    <div style={{ marginTop: 10, borderTop: `1px solid ${C.line}` }}>
                        {method.sources.map((source, index) => (
                            <div
                                key={`${source.url}-${index}`}
                                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px', borderBottom: `1px solid ${C.line}` }}
                            >
                                <span style={{ width: 20, flexShrink: 0, fontSize: 9, fontWeight: 700, color: C.muted }}>{pad2(index + 1)}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, lineHeight: 1.35, color: C.ink }}>{clampText(source.title, 100)}</p>
                                    <Body size={8} color={C.muted} style={{ marginTop: 2 }}>
                                        {[source.host, source.platform].filter(Boolean).join(' · ')}
                                    </Body>
                                </div>
                                {source.brand && (
                                    <div style={{ width: 110, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
                                        <BrandName brand={source.brand} size={8.5} chars={16} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

const ComparativeReportDocument = React.forwardRef(({ model, logo }, ref) => {
    if (!model?.lead) return null;

    const { method, conclusion } = model;
    const pages = [
        { key: 'cover', cover: true, node: <CoverPage model={model} logo={logo} /> },
        (model.summary.headline || model.summary.body || model.summary.findings.length > 0) && { key: 'summary', node: <SummaryPage model={model} /> },
        { key: 'scorecard', node: <ScorecardPage model={model} /> },
        model.channels.length > 0 && { key: 'channels', node: <ChannelPage model={model} /> },
        { key: 'sentiment', node: <SentimentPage model={model} /> },
        model.insights.length > 0 && { key: 'insights', node: <InsightsPage model={model} /> },
        (model.strengths.length > 0 || model.gaps.length > 0) && { key: 'strengths', node: <StrengthsPage model={model} /> },
        (model.risks.length > 0 || model.opportunities.length > 0) && { key: 'risks', node: <RiskPage model={model} /> },
        model.recommendations.length > 0 && { key: 'recommendations', node: <RecommendationsPage model={model} /> },
        (conclusion.body || conclusion.priorities.length > 0) && { key: 'conclusion', node: <ConclusionPage model={model} /> },
        (method.summary || method.coverage || method.limitations.length > 0 || method.sources.length > 0) && { key: 'method', node: <MethodPage model={model} /> },
    ].filter(Boolean);

    return (
        <div ref={ref} style={{ width: PAGE_WIDTH, backgroundColor: '#FFFFFF', fontFamily: FONT_BODY, color: C.ink }}>
            {pages.map((page, index) => (page.cover ? (
                <Sheet
                    key={page.key}
                    header={<BrandRule height={14} />}
                    footerLeft="A product of Chain Reactions Africa"
                    footerRight="Executive intelligence"
                    footerRule={false}
                >
                    {page.node}
                </Sheet>
            ) : (
                <Sheet
                    key={page.key}
                    header={<InteriorHeader logo={logo} brand={model.title} edition={EDITION} pageNumber={index + 1} />}
                    footerLeft="ArabyProphet comparative intelligence - a product of Chain Reactions Africa"
                    footerRight={model.period.label}
                >
                    {page.node}
                </Sheet>
            )))}
        </div>
    );
});

ComparativeReportDocument.displayName = 'ComparativeReportDocument';

export default ComparativeReportDocument;
