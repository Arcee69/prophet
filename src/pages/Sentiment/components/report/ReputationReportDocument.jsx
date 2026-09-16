import React from 'react';
import {
    FONT_BODY,
    FONT_HEAD,
    PAGE_HEIGHT,
    PAGE_WIDTH,
    REPUTATION_COLORS as C,
    clampText,
    formatCompact,
    formatFull,
} from './reportTheme';
import { levelOf } from './buildReputationModel';

// The Reputation Intelligence edition: an A4 executive deck laid out after the
// ArabyProphet reputation template. Like the sentiment report it is rendered
// off-screen and captured page by page, so the same html2canvas rules apply - inline
// styles only, SVG with presentation attributes and no <text>, and long strings
// trimmed before render rather than clipped by CSS.

const PAD_X = 44;
const FOOTER_SPACE = 58;

const pad2 = (value) => String(value).padStart(2, '0');
const grid = (columns, gap = 12) => ({ display: 'grid', gridTemplateColumns: columns, gap });
const signed3 = (value) => (value === null || value === undefined ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(3)}`);

const LEVEL_COLOR = { high: C.red, medium: C.orange, low: C.green };

// "Medium to high" reads as MED-HIGH; anything else short enough is shown as sent.
const levelText = (value) => {
    const label = String(value || '').trim().toUpperCase();
    if (/MED/.test(label) && /HIGH/.test(label)) return 'MED-HIGH';
    if (label === 'MEDIUM' || label === 'MODERATE') return 'MED';
    return label.length > 0 && label.length <= 9 ? label : levelOf(value).toUpperCase();
};

// Yellow reads as a fill, not as text on white.
const readable = (color) => (color === C.yellow ? C.gold : color);

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const Eyebrow = ({ children, color = C.ink, style }) => (
    <p style={{ margin: 0, fontSize: 8.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color, ...style }}>
        {children}
    </p>
);

const Headline = ({ children, size = 16, color = C.ink, style }) => (
    <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: size, fontWeight: 700, lineHeight: 1.3, color, ...style }}>
        {children}
    </p>
);

const Body = ({ children, size = 10.5, color = C.inkSoft, style }) => (
    <p style={{ margin: 0, fontSize: size, lineHeight: 1.5, color, ...style }}>{children}</p>
);

const Panel = ({ children, background = '#FFFFFF', border = C.line, style }) => (
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

const Badge = ({ children, color, size = 30 }) => (
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

const LevelPill = ({ value, suffix = '' }) => (
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

const Bullets = ({ items, color, chars = 70, size = 9.5, gap = 7 }) => (
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
const SideAccentCard = ({ children, color, background = '#FFFFFF', minHeight }) => (
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

const TopAccentCard = ({ children, color, background = '#FFFFFF', minHeight, padding = '16px 16px' }) => (
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

const Logo = ({ logo, height }) => (logo ? (
    <img src={logo} alt="" crossOrigin="anonymous" style={{ height, width: 'auto', objectFit: 'contain', display: 'block' }} />
) : (
    <span style={{ fontFamily: FONT_HEAD, fontSize: height * 0.6, fontWeight: 700, color: C.orange }}>àRà</span>
));

const BrandRule = ({ height }) => (
    <div style={{ display: 'flex', width: '100%', height }}>
        <div style={{ width: '66%', backgroundColor: C.green }} />
        <div style={{ flex: 1, backgroundColor: C.yellow }} />
    </div>
);

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

const Sheet = ({ children, header, footerLeft, footerRight, footerRule = true }) => (
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

const InteriorHeader = ({ logo, brand, pageNumber }) => (
    <div style={{ marginBottom: 20 }}>
        <div style={{ height: 56, padding: `0 ${PAD_X}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo logo={logo} height={28} />
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: C.muted }}>
                {clampText(brand, 40)} Reputation Intelligence
                <span style={{ marginLeft: 16, fontSize: 10.5, color: C.ink }}>{pad2(pageNumber)}</span>
            </span>
        </div>
        <BrandRule height={4} />
    </div>
);

const PageTitle = ({ title, subtitle }) => (
    <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 27, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>{title}</h2>
        {subtitle && <Body size={10} color={C.muted} style={{ marginTop: 4 }}>{subtitle}</Body>}
    </div>
);

// ---------------------------------------------------------------------------
// 01 - Cover
// ---------------------------------------------------------------------------

const CoverRings = ({ score }) => {
    // Centre of the rings, in the hero block's coordinates.
    const cx = 552;
    const cy = 104;

    return (
        <>
            <svg width="706" height="260" viewBox="0 0 706 260" style={{ position: 'absolute', left: 0, top: 0 }}>
                <circle cx={cx} cy={cy} r="88" fill="none" stroke="#DADDDC" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="64" fill="none" stroke={C.green} strokeWidth="2" />
                <circle cx={cx} cy={cy} r="42" fill="none" stroke={C.yellow} strokeWidth="2" />
                <circle cx={cx} cy={cy} r="27" fill={C.green} />
                <polyline points="400,216 624,216 668,172" fill="none" stroke={C.yellow} strokeWidth="1.5" />
            </svg>
            <div
                style={{
                    position: 'absolute',
                    left: cx - 27,
                    top: cy - 27,
                    width: 54,
                    height: 54,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span style={{ fontFamily: FONT_HEAD, fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>
                    {score === null ? '—' : Math.round(score)}
                </span>
            </div>
        </>
    );
};

const CoverTile = ({ value, label, note, color, background }) => (
    <TopAccentCard color={color} background={background} minHeight={112} padding="18px 14px 14px">
        <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: C.ink }}>{value}</p>
        <Eyebrow style={{ marginTop: 12, fontSize: 7.5 }}>{label}</Eyebrow>
        <Body size={8} color={C.muted} style={{ marginTop: 10 }}>{note}</Body>
    </TopAccentCard>
);

const CoverPage = ({ model, logo }) => {
    const { brand, metrics, score, status, tagline, signal, period } = model;
    const titleSize = brand.length > 22 ? 32 : brand.length > 12 ? 40 : 46;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 50 }}>
                <div>
                    <Logo logo={logo} height={54} />
                    <Eyebrow color={C.muted} style={{ marginTop: 26 }}>Executive reputation intelligence</Eyebrow>
                </div>
                {status && (
                    <Panel background={C.greenSoft} border={C.greenLine} style={{ width: 220, borderRadius: 14, padding: '22px 22px' }}>
                        <Eyebrow color={C.green} style={{ fontSize: 7.5 }}>Reputation status</Eyebrow>
                        <Headline size={15} style={{ marginTop: 10 }}>{clampText(status, 40)}</Headline>
                    </Panel>
                )}
            </div>

            <div style={{ position: 'relative', marginTop: 44, height: 260 }}>
                <CoverRings score={score} />
                <div style={{ position: 'absolute', left: 0, top: 0, width: 430 }}>
                    <h1 style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: titleSize, lineHeight: 1.1, fontWeight: 700, color: C.ink }}>
                        {clampText(brand, 48)}
                    </h1>
                    <Headline size={23} style={{ marginTop: 10 }}>Reputation Intelligence Report</Headline>
                    <div style={{ width: 104, height: 6, backgroundColor: C.yellow, marginTop: 20 }} />
                    {tagline && <Headline size={13} style={{ marginTop: 26 }}>{clampText(tagline, 110)}</Headline>}
                </div>
            </div>

            {signal.headline && (
                <Panel background={C.yellowSoft} border={C.yellowLine} style={{ marginTop: 'auto', borderRadius: 14, padding: '20px 24px' }}>
                    <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, color: C.orange }}>The executive signal</p>
                    <Headline size={18} style={{ marginTop: 12 }}>{clampText(signal.headline, 130)}</Headline>
                    {signal.body && <Body size={10} style={{ marginTop: 8 }}>{clampText(signal.body, 320)}</Body>}
                </Panel>
            )}

            <div style={{ ...grid('repeat(4, 1fr)', 10), marginTop: signal.headline ? 48 : 'auto' }}>
                <CoverTile value={formatFull(metrics.mentions)} label="Mentions" note="Conversation volume" color={C.green} background={C.greenSoft} />
                <CoverTile value={formatCompact(metrics.reach)} label="Est. reach" note="Audience exposure" color={C.yellow} background={C.blueSoft} />
                <CoverTile
                    value={metrics.engagement === null ? '—' : formatCompact(metrics.engagement)}
                    label="Est. engagement"
                    note="Modelled interactions"
                    color={C.orange}
                    background={C.orangeSoft}
                />
                <CoverTile
                    value={score === null ? '—' : `${Math.round(score)}/100`}
                    label="Reputation"
                    note={status || 'Composite score'}
                    color={C.red}
                    background={C.redSoft}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, marginBottom: 8 }}>
                <div>
                    <Eyebrow color={C.muted} style={{ fontSize: 7.5 }}>Monitoring period</Eyebrow>
                    <Headline size={11} style={{ marginTop: 10 }}>{period.label}</Headline>
                </div>
                <div style={{ width: 150 }}>
                    <Eyebrow color={C.muted} style={{ fontSize: 7.5 }}>Executive edition</Eyebrow>
                    <Headline size={11} style={{ marginTop: 10 }}>Reputation and risk</Headline>
                </div>
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 02 - Executive readout
// ---------------------------------------------------------------------------

const Gauge = ({ value, label, color }) => {
    const size = 96;
    const stroke = 11;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const fraction = value === null ? 0 : Math.max(0, Math.min(1, value / 100));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.track} strokeWidth={stroke} />
                    {fraction > 0 && (
                        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={color}
                                strokeWidth={stroke}
                                strokeLinecap="round"
                                strokeDasharray={`${circumference * fraction} ${circumference}`}
                            />
                        </g>
                    )}
                </svg>
                <div style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 700, color: C.ink }}>
                        {value === null ? '—' : Math.round(value)}
                    </span>
                </div>
            </div>
            <Eyebrow style={{ marginTop: 10 }}>{label}</Eyebrow>
        </div>
    );
};

const StatusBlock = ({ label, value, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ height: 96, display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '10px 18px', borderRadius: 8, backgroundColor: color }}>
                <span style={{ fontFamily: FONT_HEAD, fontSize: 14, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                    {clampText(value, 18)}
                </span>
            </div>
        </div>
        <Eyebrow style={{ marginTop: 10 }}>{label}</Eyebrow>
    </div>
);

const ReadoutPage = ({ model }) => {
    const { metrics, readout, score, statuses, leaders, reachKnown } = model;

    const kpis = [
        {
            value: formatFull(metrics.mentions),
            label: 'Mentions',
            note: leaders.volume ? `${leaders.volume.volumeShare.toFixed(1)}% occurred on ${leaders.volume.label}` : 'Conversation volume',
            color: C.green,
        },
        {
            value: formatCompact(metrics.reach),
            label: 'Estimated reach',
            note: reachKnown && leaders.reach ? `${leaders.reach.reachShare.toFixed(1)}% delivered by ${leaders.reach.label}` : 'Audience exposure',
            color: C.blue,
        },
        {
            value: metrics.engagement === null ? '—' : formatCompact(metrics.engagement),
            label: 'Est. engagement',
            note: 'Calibrated platform proxy',
            color: C.orange,
        },
        {
            value: metrics.sentiment === null ? '—' : metrics.sentimentSignal,
            label: 'Sentiment signal',
            note: `${metrics.sentimentLabel} overall`,
            color: C.yellow,
        },
    ];

    const signals = [
        { title: 'What moved', items: readout.moved, color: C.red, background: C.redSoft },
        { title: 'What helped', items: readout.helped, color: C.green, background: C.greenSoft },
        { title: 'What to watch', items: readout.watch, color: C.orange, background: C.yellowSoft },
    ].filter((card) => card.items.length > 0);

    const statusBlocks = [
        statuses.visibility && { label: 'Visibility', value: statuses.visibility, color: { high: C.green, medium: C.blue, low: C.orange }[levelOf(statuses.visibility)] },
        statuses.risk && { label: 'Risk level', value: statuses.risk, color: LEVEL_COLOR[levelOf(statuses.risk)] },
        statuses.confidence && { label: 'Outlook confidence', value: statuses.confidence, color: { high: C.green, medium: C.blue, low: C.orange }[levelOf(statuses.confidence)] },
    ].filter(Boolean);
    const scoreColor = score === null ? C.muted : score >= 70 ? C.green : score >= 50 ? C.orange : C.red;

    return (
        <>
            <PageTitle
                title="Executive Readout"
                subtitle="The headline position, what moved it and where attention should go next."
            />

            <div style={grid('repeat(4, 1fr)', 10)}>
                {kpis.map((kpi) => (
                    <SideAccentCard key={kpi.label} color={kpi.color} minHeight={96}>
                        <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 23, fontWeight: 700, color: C.ink }}>{kpi.value}</p>
                        <Eyebrow style={{ marginTop: 6, fontSize: 7.5 }}>{kpi.label}</Eyebrow>
                        <Body size={8} color={C.muted} style={{ marginTop: 16 }}>{kpi.note}</Body>
                    </SideAccentCard>
                ))}
            </div>

            {readout.position.headline && (
                <Panel background={C.greenSoft} border={C.greenLine} style={{ marginTop: 18 }}>
                    <Eyebrow color={C.green}>Executive position</Eyebrow>
                    <Headline size={15} style={{ marginTop: 14 }}>{clampText(readout.position.headline, 170)}</Headline>
                    {readout.position.body && <Body size={10} style={{ marginTop: 8 }}>{clampText(readout.position.body, 300)}</Body>}
                </Panel>
            )}

            {signals.length > 0 && (
                <div style={{ ...grid(`repeat(${signals.length}, 1fr)`, 8), marginTop: 8 }}>
                    {signals.map((card) => (
                        <SideAccentCard key={card.title} color={card.color} background={card.background} minHeight={132}>
                            <Headline size={11}>{card.title.toUpperCase()}</Headline>
                            <div style={{ marginTop: 12 }}>
                                <Bullets items={card.items} color={card.color} chars={60} />
                            </div>
                        </SideAccentCard>
                    ))}
                </div>
            )}

            {(score !== null || statusBlocks.length > 0) && (
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', marginTop: 26 }}>
                    {score !== null && <Gauge value={score} label="Reputation" color={scoreColor} />}
                    {statusBlocks.map((block) => <StatusBlock key={block.label} {...block} />)}
                </div>
            )}

            {readout.findings.length > 0 && (
                <Panel background={C.blueSoft} border={C.blueLine} style={{ marginTop: 'auto', marginBottom: 8, padding: '18px 22px 20px' }}>
                    <Eyebrow color={C.blue}>Key findings</Eyebrow>
                    <div style={{ ...grid('1fr 1fr', '12px 26px'), marginTop: 14 }}>
                        {readout.findings.map((finding, index) => (
                            <div key={`${finding}-${index}`} style={{ display: 'flex', gap: 10 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: index % 2 === 0 ? C.green : C.orange, flexShrink: 0, lineHeight: 1.45 }}>
                                    {pad2(index + 1)}
                                </span>
                                <Body size={9}>{clampText(finding, 240)}</Body>
                            </div>
                        ))}
                    </div>
                </Panel>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// 03 - Channel architecture
// ---------------------------------------------------------------------------

const ShareCard = ({ eyebrow, headline, detail, detailColor, parts, style }) => (
    <Panel style={{ padding: '20px 22px 22px', ...style }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Headline size={20} style={{ marginTop: 14 }}>{headline}</Headline>
        <p style={{ margin: '14px 0 12px', fontSize: 11, fontWeight: 700, color: detailColor }}>{detail}</p>
        <div style={{ display: 'flex', width: '100%', height: 26, backgroundColor: C.track }}>
            {parts.filter((part) => part.share > 0).map((part) => (
                <div key={part.label} style={{ width: `${part.share}%`, height: '100%', backgroundColor: part.color }} />
            ))}
        </div>
        <div style={{ display: 'flex', marginTop: 20 }}>
            {parts.map((part) => (
                <span key={part.label} style={{ width: 196, display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, color: C.ink }}>
                    <span style={{ width: 11, height: 11, borderRadius: 11, backgroundColor: part.color, display: 'inline-block', flexShrink: 0 }} />
                    {part.label}&nbsp;&nbsp;{part.share.toFixed(2)}%
                </span>
            ))}
        </div>
    </Panel>
);

const ChannelPage = ({ model }) => {
    const { channels, metrics, leaders, reachKnown, reachTotal, channelMentions, engagementNote } = model;
    const byVolume = [...channels].sort((a, b) => b.mentions - a.mentions);
    const byReach = [...channels].sort((a, b) => b.reach - a.reach);

    return (
        <>
            <PageTitle
                title="Channel Architecture"
                subtitle="Conversation volume and audience reach by channel, and the reputation role each channel plays."
            />

            <ShareCard
                eyebrow="Conversation volume"
                headline={`${leaders.volume.label} owns the conversation`}
                detail={`${formatFull(leaders.volume.mentions)} of ${formatFull(channelMentions)} mentions`}
                detailColor={readable(leaders.volume.color)}
                parts={byVolume.map((channel) => ({ label: channel.label, color: channel.color, share: channel.volumeShare }))}
            />

            {reachKnown && leaders.reach && (
                <ShareCard
                    style={{ marginTop: 14 }}
                    eyebrow="Audience reach"
                    headline={`${leaders.reach.label} owns the scale`}
                    detail={`${formatCompact(leaders.reach.reach)} of ${formatCompact(reachTotal)} estimated reach`}
                    detailColor={readable(leaders.reach.color)}
                    parts={byReach.map((channel) => ({ label: channel.label, color: channel.color, share: channel.reachShare }))}
                />
            )}

            <div style={{ ...grid(`repeat(${Math.max(3, channels.length)}, 1fr)`, 8), marginTop: 14 }}>
                {byVolume.map((channel) => (
                    <Panel key={channel.id} background={channel.soft} border={channel.line} style={{ padding: '16px 16px', minHeight: 236 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                            <p style={{ margin: 0, fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: channel.text, textTransform: 'uppercase' }}>
                                {channel.label}
                            </p>
                            {channel.risk && <LevelPill value={channel.risk} suffix=" RISK" />}
                        </div>
                        {channel.role && <Eyebrow style={{ marginTop: 10, fontSize: 7.5, lineHeight: 1.4 }}>{clampText(channel.role, 64)}</Eyebrow>}
                        <Headline size={11} style={{ marginTop: 12 }}>{clampText(channel.toneLabel, 40)}</Headline>
                        {channel.analysis && (
                            <>
                                <div style={{ height: 1, backgroundColor: channel.line, marginTop: 12 }} />
                                <Body size={9} style={{ marginTop: 10 }}>{clampText(channel.analysis, 300)}</Body>
                            </>
                        )}
                    </Panel>
                ))}
            </div>

            <Panel background={C.blueSoft} border={C.blueLine} style={{ marginTop: 14, display: 'flex', gap: 30, padding: '18px 22px 22px' }}>
                <div style={{ width: 220, flexShrink: 0 }}>
                    <Eyebrow color={C.blue}>Estimated engagement</Eyebrow>
                    <p style={{ margin: '14px 0 0', fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 700, color: C.ink }}>
                        {metrics.engagement === null ? '—' : formatCompact(metrics.engagement)}
                    </p>
                    <Body size={9} color={C.muted} style={{ marginTop: 8 }}>Modelled interaction proxy</Body>
                </div>
                <Body size={10} style={{ flex: 1, marginTop: 22 }}>{clampText(engagementNote, 260)}</Body>
            </Panel>
        </>
    );
};

// ---------------------------------------------------------------------------
// 04 - Sentiment and trust split
// ---------------------------------------------------------------------------

const TRUST_TONES = {
    positive: { background: C.greenSoft, line: C.greenLine, eyebrow: C.green },
    negative: { background: C.redSoft, line: C.redLine, eyebrow: C.red },
    neutral: { background: C.blueSoft, line: C.blueLine, eyebrow: C.blue },
    warning: { background: C.yellowSoft, line: C.yellowLine, eyebrow: C.orange },
};

const SentimentPage = ({ model }) => {
    const { channels, metrics, interpretation, trustCards } = model;
    // A floor on the scale so a near-neutral set does not draw full-width bars.
    const maxAbs = Math.max(0.15, ...channels.map((channel) => Math.abs(channel.score || 0)));
    const barExtent = (score) => (Math.abs(score) / maxAbs) * 45;

    return (
        <>
            <PageTitle
                title="Sentiment and Trust Split"
                subtitle="How the overall sentiment signal breaks down across channels, and what it means for trust."
            />

            <Panel style={{ display: 'flex', gap: 20, padding: '20px 22px 26px' }}>
                <div style={{ width: 190, flexShrink: 0 }}>
                    <Eyebrow>Sentiment signal by channel</Eyebrow>
                    <p style={{ margin: '56px 0 0', fontFamily: FONT_HEAD, fontSize: 25, fontWeight: 700, color: C.ink }}>
                        {signed3(metrics.sentiment)}
                    </p>
                    <Eyebrow style={{ marginTop: 12 }}>Overall {clampText(metrics.sentimentLabel, 28)}</Eyebrow>
                    <Body size={9} color={C.muted} style={{ marginTop: 12 }}>Aggregate signal</Body>
                </div>

                <div style={{ flex: 1, paddingTop: 20 }}>
                    <div style={{ position: 'relative', height: 14 }}>
                        <span style={{ position: 'absolute', left: '50%', marginLeft: -24, width: 48, textAlign: 'center', fontSize: 7.5, color: C.muted }}>NEGATIVE</span>
                        <span style={{ position: 'absolute', right: 0, fontSize: 7.5, color: C.muted }}>POSITIVE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 10 }}>
                        {channels.map((channel) => {
                            const score = channel.score;
                            const extent = score === null ? 0 : barExtent(score);
                            return (
                                <div key={channel.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: C.ink }}>
                                        <span>{channel.label}</span>
                                        <span>{signed3(score)}</span>
                                    </div>
                                    <div style={{ position: 'relative', height: 14, marginTop: 10 }}>
                                        {extent > 0 && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    height: 14,
                                                    width: `${extent}%`,
                                                    left: score >= 0 ? '50%' : `${50 - extent}%`,
                                                    backgroundColor: score < 0 ? C.red : channel.color,
                                                }}
                                            />
                                        )}
                                        <div style={{ position: 'absolute', left: '50%', top: -4, width: 1, height: 22, backgroundColor: C.muted }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Panel>

            {(interpretation.headline || interpretation.body) && (
                <Panel background={C.redSoft} border={C.redLine} style={{ marginTop: 18 }}>
                    <Eyebrow color={C.red}>Interpretation</Eyebrow>
                    {interpretation.headline && <Headline size={15} style={{ marginTop: 16 }}>{clampText(interpretation.headline, 180)}</Headline>}
                    {interpretation.body && <Body size={10} style={{ marginTop: 8 }}>{clampText(interpretation.body, 320)}</Body>}
                </Panel>
            )}

            {trustCards.length > 0 && (
                <div style={{ ...grid('1fr 1fr', 12), marginTop: 30 }}>
                    {trustCards.map((card) => {
                        const palette = TRUST_TONES[card.tone] || TRUST_TONES.neutral;
                        return (
                            <Panel key={card.label} background={palette.background} border={palette.line} style={{ minHeight: 150 }}>
                                <Eyebrow color={palette.eyebrow} style={{ fontSize: 7.5 }}>{card.label}</Eyebrow>
                                <Headline size={15} style={{ marginTop: 16 }}>{clampText(card.verdict, 40)}</Headline>
                                {card.body && <Body size={9.5} style={{ marginTop: 12 }}>{clampText(card.body, 170)}</Body>}
                            </Panel>
                        );
                    })}
                </div>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// 05 - Platform analysis
// ---------------------------------------------------------------------------

const PlatformPage = ({ model }) => {
    const platforms = [...model.channels]
        .filter((channel) => channel.role || channel.positiveTopics.length > 0 || channel.negativeTopics.length > 0)
        .sort((a, b) => b.mentions - a.mentions);

    return (
        <>
            <PageTitle
                title="Platform Analysis"
                subtitle="The role each platform plays, the reputation risk it carries and the topics driving it."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {platforms.map((channel) => (
                    <Panel key={channel.id} background={channel.soft} border={channel.line} style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div
                                style={{
                                    width: 84,
                                    height: 38,
                                    flexShrink: 0,
                                    borderRadius: 6,
                                    backgroundColor: channel.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span style={{ fontSize: 12, fontWeight: 700, color: channel.color === C.yellow ? C.ink : '#FFFFFF' }}>
                                    {channel.label}
                                </span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Headline size={13}>{clampText(channel.role || channel.label, 80)}</Headline>
                                <Body size={9} color={C.muted} style={{ marginTop: 4 }}>
                                    {formatFull(channel.mentions)} mentions · {formatCompact(channel.reach)} reach · {channel.toneLabel}
                                </Body>
                            </div>
                            {channel.risk && <LevelPill value={channel.risk} suffix=" RISK" />}
                        </div>

                        <div style={{ ...grid('1fr 1fr', 12), marginTop: 14 }}>
                            {[
                                { label: 'Positive topics', items: channel.positiveTopics, color: C.green },
                                { label: 'Negative topics', items: channel.negativeTopics, color: C.red },
                            ].map((column) => (
                                <div
                                    key={column.label}
                                    style={{ backgroundColor: '#FFFFFF', border: `1px solid ${C.line}`, borderRadius: 8, padding: '12px 14px', minHeight: 60 }}
                                >
                                    <Eyebrow color={column.color} style={{ fontSize: 7.5, marginBottom: 10 }}>{column.label}</Eyebrow>
                                    {column.items.length > 0
                                        ? <Bullets items={column.items} color={column.color} chars={58} size={9} gap={5} />
                                        : <Body size={9} color={C.muted}>None reported</Body>}
                                </div>
                            ))}
                        </div>
                    </Panel>
                ))}
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// 06 - Narrative map
// ---------------------------------------------------------------------------

const NarrativeItem = ({ index, item, palette }) => (
    <div
        style={{
            backgroundColor: palette.soft,
            border: `1px solid ${palette.line}`,
            borderRadius: 10,
            padding: '14px 16px',
            display: 'flex',
            gap: 14,
            minHeight: 84,
            boxSizing: 'border-box',
        }}
    >
        <div style={{ width: 52, flexShrink: 0, paddingTop: 2 }}>
            <Badge color={palette.color}>{pad2(index + 1)}</Badge>
            {item.weight && (
                <p style={{ margin: '10px 0 0', fontSize: 7, fontWeight: 700, color: palette.color }}>{levelText(item.weight)}</p>
            )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <Headline size={11.5}>{clampText(item.title, 60)}</Headline>
            {item.detail && <Body size={8.5} style={{ marginTop: 5 }}>{clampText(item.detail, 240)}</Body>}
        </div>
    </div>
);

const NarrativePage = ({ model }) => {
    const { assets, pressures, emergingTopics, metrics, statuses, status, score } = model;
    const assetPalette = { color: C.green, soft: C.greenSoft, line: C.greenLine };
    const pressurePalette = (weight) => ({
        high: { color: C.red, soft: C.redSoft, line: C.redLine },
        medium: { color: C.orange, soft: C.yellowSoft, line: C.yellowLine },
        low: { color: C.blue, soft: C.blueSoft, line: C.blueLine },
    })[levelOf(weight)];

    const gapSteps = [
        { label: statuses.visibility ? `${statuses.visibility} visibility` : 'Visibility', value: `${formatFull(metrics.mentions)} mentions`, color: C.green },
        { label: 'Corporate proof', value: `${assets.length} positive drivers`, color: C.blue },
        { label: 'Public test', value: `${pressures.length} negative drivers`, color: C.orange },
        {
            label: 'Trust outcome',
            value: [status, score === null ? '' : `${Math.round(score)}/100`].filter(Boolean).join(', ') || '—',
            color: C.red,
        },
    ];

    return (
        <>
            <PageTitle
                title="Narrative Map"
                subtitle="The conversation drivers supporting the reputation and the pressures working against it."
            />

            <div style={grid('1fr 1fr', 14)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Eyebrow color={C.green}>Reputation assets</Eyebrow>
                    {assets.map((item, index) => (
                        <NarrativeItem key={`${item.title}-${index}`} index={index} item={item} palette={assetPalette} />
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Eyebrow color={C.red}>Active pressure</Eyebrow>
                    {pressures.map((item, index) => (
                        <NarrativeItem key={`${item.title}-${index}`} index={index} item={item} palette={pressurePalette(item.weight)} />
                    ))}
                </div>
            </div>

            <Panel background={C.blueSoft} border={C.blueLine} style={{ marginTop: 'auto', marginBottom: 8, padding: '18px 22px 20px' }}>
                <Eyebrow color={C.blue}>The reputation gap</Eyebrow>
                <div style={{ ...grid('repeat(4, 1fr)', 10), marginTop: 18 }}>
                    {gapSteps.map((step) => (
                        <div key={step.label}>
                            <div style={{ height: 6, backgroundColor: step.color }} />
                            <Eyebrow style={{ marginTop: 14, fontSize: 7.5 }}>{step.label}</Eyebrow>
                            <Headline size={11} style={{ marginTop: 10 }}>{clampText(step.value, 44)}</Headline>
                        </div>
                    ))}
                </div>
                {emergingTopics.length > 0 && (
                    <>
                        <Eyebrow color={C.blue} style={{ marginTop: 18 }}>Emerging topics</Eyebrow>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                            {emergingTopics.map((topic) => (
                                <span
                                    key={topic}
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        border: `1px solid ${C.blueLine}`,
                                        borderRadius: 12,
                                        padding: '4px 10px',
                                        fontSize: 8.5,
                                        fontWeight: 700,
                                        color: C.ink,
                                    }}
                                >
                                    {clampText(topic, 64)}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </Panel>
        </>
    );
};

// ---------------------------------------------------------------------------
// 07 - Reputation strengths and proof system
// ---------------------------------------------------------------------------

const ProofPage = ({ model }) => {
    const chain = [
        { label: 'Claim', color: C.gold },
        { label: 'Evidence', color: C.blue },
        { label: 'Public value', color: C.green },
        { label: 'Visible outcome', color: C.greenBright },
        { label: 'Trust', color: C.ink },
    ];

    return (
        <>
            <PageTitle
                title="Reputation Strengths and Proof System"
                subtitle="Credible proof points gain value when each claim is paired with evidence the public can verify."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {model.strengths.map((item, index) => {
                    const green = index % 2 === 0;
                    const color = green ? C.green : C.blue;
                    const line = green ? C.greenLine : C.blueLine;
                    return (
                        <Panel
                            key={`${item.title}-${index}`}
                            background={green ? C.greenSoft : C.blueSoft}
                            border={line}
                            style={{ display: 'flex', gap: 18, padding: '22px 22px' }}
                        >
                            <Badge color={color} size={40}>{pad2(index + 1)}</Badge>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Headline size={14}>{clampText(item.title, 80)}</Headline>
                                {item.body && <Body size={10} style={{ marginTop: 10 }}>{clampText(item.body, 230)}</Body>}
                                {item.evidence && (
                                    <div style={{ display: 'flex', gap: 24, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${line}` }}>
                                        <span style={{ width: 70, flexShrink: 0, fontSize: 7.5, fontWeight: 700, color, textTransform: 'uppercase', paddingTop: 2 }}>
                                            Evidence
                                        </span>
                                        <Body size={9.5} style={{ flex: 1 }}>{clampText(item.evidence, 200)}</Body>
                                    </div>
                                )}
                            </div>
                        </Panel>
                    );
                })}
            </div>

            <Panel background={C.surface} style={{ marginTop: 'auto', marginBottom: 8, display: 'flex', alignItems: 'center', padding: '30px 22px' }}>
                {chain.map((step, index) => (
                    <React.Fragment key={step.label}>
                        {index > 0 && <div style={{ flex: 1, height: 1, backgroundColor: C.muted, margin: '0 12px' }} />}
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: step.color, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                            {step.label}
                        </span>
                    </React.Fragment>
                ))}
            </Panel>
        </>
    );
};

// ---------------------------------------------------------------------------
// 08 - Risk and opportunity radar
// ---------------------------------------------------------------------------

const RiskPage = ({ model }) => {
    const { risks, opportunities, riskSummary } = model;
    const columns = [
        { label: 'Risk', width: 200 },
        { label: 'Severity', width: 92 },
        { label: 'Platform', width: 104 },
        { label: 'Recommended response', flex: 1 },
    ];

    return (
        <>
            <PageTitle
                title="Risk and Opportunity Radar"
                subtitle="Active reputation risks, where they surface, and the opportunities to strengthen trust."
            />

            {risks.length > 0 && (
                <div style={{ borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: C.navy, padding: '12px 12px' }}>
                        {columns.map((column) => (
                            <span key={column.label} style={{ width: column.width, flex: column.flex, fontSize: 7.5, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                                {column.label}
                            </span>
                        ))}
                    </div>
                    {risks.map((risk, index) => (
                        <div
                            key={`${risk.name}-${index}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                minHeight: 64,
                                padding: '10px 12px',
                                boxSizing: 'border-box',
                                backgroundColor: index % 2 === 1 ? C.surface : '#FFFFFF',
                            }}
                        >
                            <div style={{ width: 200, paddingRight: 12, boxSizing: 'border-box' }}>
                                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, lineHeight: 1.35, color: C.ink }}>{clampText(risk.name, 60)}</p>
                                {risk.impact && <Body size={8} color={C.muted} style={{ marginTop: 3 }}>{clampText(risk.impact, 130)}</Body>}
                            </div>
                            <div style={{ width: 92, flexShrink: 0 }}>
                                {risk.severity ? <LevelPill value={risk.severity} /> : <span style={{ fontSize: 10, color: C.muted }}>—</span>}
                            </div>
                            <div style={{ width: 104, flexShrink: 0, paddingRight: 10, boxSizing: 'border-box' }}>
                                <Body size={8.5}>{clampText(risk.platform, 36) || '—'}</Body>
                            </div>
                            <Body size={8.5} style={{ flex: 1 }}>{clampText(risk.response, 230)}</Body>
                        </div>
                    ))}
                </div>
            )}

            {opportunities.length > 0 && (
                <div style={{ marginTop: 22 }}>
                    <Eyebrow color={C.green} style={{ marginBottom: 12 }}>Opportunity system</Eyebrow>
                    <div style={grid('1fr 1fr', 10)}>
                        {opportunities.map((item, index) => {
                            const color = index % 2 === 0 ? C.green : C.blue;
                            return (
                                <SideAccentCard key={`${item.title}-${index}`} color={color} background={index % 2 === 0 ? C.greenSoft : C.blueSoft} minHeight={112}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <Badge color={color} size={24}>{pad2(index + 1)}</Badge>
                                        <Headline size={11}>{clampText(item.title, 70)}</Headline>
                                    </div>
                                    {item.body && <Body size={9} style={{ marginTop: 8 }}>{clampText(item.body, 230)}</Body>}
                                </SideAccentCard>
                            );
                        })}
                    </div>
                </div>
            )}

            {riskSummary && (
                <Panel background={C.yellowSoft} border={C.yellowLine} style={{ marginTop: 'auto', marginBottom: 8, padding: '18px 22px 20px' }}>
                    <Eyebrow color={C.orange}>Strengths and risks in balance</Eyebrow>
                    <Headline size={12.5} style={{ marginTop: 12 }}>{clampText(riskSummary, 280)}</Headline>
                </Panel>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// 09 - Strategic recommendations
// ---------------------------------------------------------------------------

const PRIORITY_COLORS = [C.red, C.orange, C.yellow, C.blue, C.green, C.greenBright];

const RecommendationsPage = ({ model }) => {
    const { recommendations, watchpoints } = model;

    return (
        <>
            <PageTitle
                title="Strategic Recommendations"
                subtitle="Prioritised actions, the reason for each and the impact expected."
            />

            <div style={{ ...grid('1fr 1fr', 12), marginTop: 6 }}>
                {recommendations.map((item, index) => {
                    const color = PRIORITY_COLORS[index % PRIORITY_COLORS.length];
                    return (
                        <TopAccentCard key={`${item.priority}-${index}`} color={color} minHeight={196} padding="14px 16px">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Badge color={color} size={24}>{pad2(item.priority)}</Badge>
                                <Eyebrow color={readable(color)} style={{ fontSize: 7.5 }}>Priority</Eyebrow>
                            </div>
                            <Headline size={11} style={{ marginTop: 10 }}>{clampText(item.title, 180)}</Headline>
                            <div style={{ height: 1, backgroundColor: C.line, marginTop: 10 }} />
                            {item.reason && (
                                <>
                                    <Eyebrow color={C.muted} style={{ fontSize: 7, marginTop: 9 }}>Why</Eyebrow>
                                    <Body size={8.5} style={{ marginTop: 3 }}>{clampText(item.reason, 180)}</Body>
                                </>
                            )}
                            {item.impact && (
                                <>
                                    <Eyebrow color={C.muted} style={{ fontSize: 7, marginTop: 8 }}>Expected impact</Eyebrow>
                                    <Body size={8.5} style={{ marginTop: 3 }}>{clampText(item.impact, 120)}</Body>
                                </>
                            )}
                        </TopAccentCard>
                    );
                })}
            </div>

            {watchpoints.length > 0 && (
                <Panel background={C.yellowSoft} border={C.yellowLine} style={{ marginTop: 'auto', marginBottom: 8, padding: '18px 22px 20px' }}>
                    <Eyebrow color={C.orange}>Key watchpoints</Eyebrow>
                    <div style={{ ...grid('1fr 1fr', '8px 26px'), marginTop: 14 }}>
                        {watchpoints.map((point) => (
                            <Bullets key={point} items={[point]} color={C.orange} chars={80} size={9} />
                        ))}
                    </div>
                </Panel>
            )}
        </>
    );
};

// ---------------------------------------------------------------------------
// 10 - Executive conclusion and method note
// ---------------------------------------------------------------------------

const ConclusionPage = ({ model }) => {
    const { conclusion, outlook, definitions, analyticalNote } = model;

    return (
        <>
            <PageTitle
                title="Executive Conclusion and Method Note"
                subtitle="The position, the outlook and the transparent basis for every headline metric."
            />

            {conclusion.headline && (
                <Panel background={C.greenSoft} border={C.greenLine} style={{ padding: '20px 22px 24px' }}>
                    <Eyebrow color={C.green}>Executive conclusion</Eyebrow>
                    <Headline size={21} style={{ marginTop: 16 }}>{clampText(conclusion.headline, 120)}</Headline>
                    {conclusion.body && <Body size={10} color={C.ink} style={{ marginTop: 10 }}>{clampText(conclusion.body, 640)}</Body>}
                    <div style={{ display: 'flex', marginTop: 18 }}>
                        <div style={{ width: 175, height: 7, backgroundColor: C.greenBright }} />
                        <div style={{ width: 95, height: 7, backgroundColor: C.yellow }} />
                        <div style={{ width: 55, height: 7, backgroundColor: C.red }} />
                    </div>
                </Panel>
            )}

            {outlook.headline && (
                <Panel background={C.yellowSoft} border={C.yellowLine} style={{ marginTop: 16, padding: '18px 22px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Eyebrow color={C.orange}>Outlook</Eyebrow>
                        {outlook.confidence && <Eyebrow color={C.muted}>Confidence: {outlook.confidence}</Eyebrow>}
                    </div>
                    <Headline size={15} style={{ marginTop: 12 }}>{clampText(outlook.headline, 90)}</Headline>
                    {outlook.body && <Body size={9.5} style={{ marginTop: 8 }}>{clampText(outlook.body, 340)}</Body>}
                </Panel>
            )}

            <Eyebrow style={{ marginTop: 22 }}>Metric definitions</Eyebrow>
            <div style={{ ...grid('1fr 1fr', 10), marginTop: 12 }}>
                {definitions.map((definition, index) => (
                    <Panel key={definition.label} style={{ minHeight: 74, padding: '14px 16px' }}>
                        <Eyebrow color={index % 2 === 0 ? C.green : C.blue} style={{ fontSize: 7.5 }}>{definition.label}</Eyebrow>
                        <Body size={9} style={{ marginTop: 8 }}>{clampText(definition.body, 140)}</Body>
                    </Panel>
                ))}
            </div>

            <Panel background={C.greenSoft} border={C.greenLine} style={{ marginTop: 'auto', marginBottom: 8, padding: '16px 22px 18px' }}>
                <Eyebrow color={C.green}>Analytical note</Eyebrow>
                <Body size={8.5} style={{ marginTop: 10 }}>{clampText(analyticalNote, 620)}</Body>
            </Panel>
        </>
    );
};

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

const ReputationReportDocument = React.forwardRef(({ model, logo }, ref) => {
    if (!model) return null;

    const hasPlatformDetail = model.channels.some(
        (channel) => channel.role || channel.positiveTopics.length > 0 || channel.negativeTopics.length > 0
    );

    const pages = [
        { key: 'cover', cover: true, node: <CoverPage model={model} logo={logo} /> },
        { key: 'readout', node: <ReadoutPage model={model} /> },
        model.channels.length > 0 && { key: 'channels', node: <ChannelPage model={model} /> },
        model.channels.length > 0 && { key: 'sentiment', node: <SentimentPage model={model} /> },
        hasPlatformDetail && { key: 'platforms', node: <PlatformPage model={model} /> },
        (model.assets.length > 0 || model.pressures.length > 0) && { key: 'narrative', node: <NarrativePage model={model} /> },
        model.strengths.length > 0 && { key: 'proof', node: <ProofPage model={model} /> },
        (model.risks.length > 0 || model.opportunities.length > 0) && { key: 'risk', node: <RiskPage model={model} /> },
        (model.recommendations.length > 0 || model.watchpoints.length > 0) && { key: 'recommendations', node: <RecommendationsPage model={model} /> },
        { key: 'conclusion', node: <ConclusionPage model={model} /> },
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
                    header={<InteriorHeader logo={logo} brand={model.brand} pageNumber={index + 1} />}
                    footerLeft="ArabyProphet reputation intelligence - a product of Chain Reactions Africa"
                    footerRight={model.period.label}
                >
                    {page.node}
                </Sheet>
            )))}
        </div>
    );
});

ReputationReportDocument.displayName = 'ReputationReportDocument';

export default ReputationReportDocument;
