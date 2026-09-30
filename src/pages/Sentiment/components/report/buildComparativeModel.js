import { REPUTATION_COLORS as C } from './reportTheme';
import { CHANNEL_META, channelIdOf, formatPeriod, levelOf, toneLabel } from './buildReputationModel';

// Turns the Comparative Intelligence API response, plus the board's own sentiment
// payloads, into the shape ComparativeReportDocument renders.
//
// The response (`{ success, report_type, data }`) names a lead brand and its
// competitors by the keys they were sent under ("nnpc", "dangote"). Measured figures
// prefer the response and fall back to the board's uncapped payload, so a figure the
// service leaves null (engagement, share of voice) is still filled where the board
// has it. Written analysis only ever comes from the response: a section it does not
// supply is left empty and its page is dropped from the document.
//
// Saved reports (My Reports) are rebuilt from the response alone, so every figure
// must also hold up without `summaries`.

// Lead brand first, then competitors in the order the service listed them.
const BRAND_PALETTE = [
    { color: C.green, soft: C.greenSoft, line: C.greenLine },
    { color: C.orange, soft: C.orangeSoft, line: C.orangeLine },
    { color: C.blue, soft: C.blueSoft, line: C.blueLine },
    { color: C.red, soft: C.redSoft, line: C.redLine },
];

// ---------------------------------------------------------------------------
// Readers
// ---------------------------------------------------------------------------

const list = (value) => (Array.isArray(value) ? value : []);

const str = (value) => (typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '');

const strings = (value, limit) => list(value).map(str).filter(Boolean).slice(0, limit);

const number = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const capitalize = (value) => value.replace(/^\w/, (char) => char.toUpperCase());

// "nnpc", "NNPC " and "access_bank" all name the same brand as the board's input.
const normKey = (value) => str(value).toLowerCase().replace(/[\s_-]+/g, '');
const sameKey = (a, b) => normKey(a) !== '' && normKey(a) === normKey(b);

// Without the board's own spelling, a short key reads as an acronym (nnpc -> NNPC)
// and anything longer as a name (dangote -> Dangote, access bank -> Access Bank).
export const displayNameOf = (key) => {
    const clean = str(key).replace(/[_-]+/g, ' ');
    if (/^[a-z0-9]{2,4}$/i.test(clean)) return clean.toUpperCase();
    return clean.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const unwrapComparative = (body) => {
    const data = body?.data;
    if (body?.success === false || !data || typeof data !== 'object') return null;
    return data.executive_summary || data.competitive_overview ? data : null;
};

// "The overall sentiment was classified as neutral." The service's classification
// uses wider bands than toneLabel, so its own verdict is preferred when stated.
const classifiedAs = (text) => {
    const match = str(text).match(/classified as (positive|neutral|negative|mixed)/i);
    return match ? capitalize(match[1].toLowerCase()) : '';
};

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

const brandKeysOf = (report, boardKeys) => {
    const meta = report.report_metadata || {};
    const overview = report.competitive_overview || {};
    const lead = str(meta.lead_brand) || str(overview.lead_brand) || boardKeys[0] || '';

    const named = [
        ...strings(meta.competitor_brands),
        ...strings(overview.competitor_brands),
        ...list(report.sentiment_comparison).map((item) => str(item?.brand)),
        ...list(report.chart_data?.visibility_comparison).map((item) => str(item?.brand)),
        ...boardKeys,
    ];

    const keys = [lead];
    named.forEach((key) => {
        if (key && !keys.some((existing) => sameKey(existing, key))) keys.push(key);
    });
    return keys.filter(Boolean).slice(0, BRAND_PALETTE.length);
};

// One figure from a chart_data series, e.g. chartValue(report, 'visibility_comparison', 'reach', 'nnpc').
const chartValue = (report, series, metric, key) => number(
    list(report.chart_data?.[series]).find(
        (item) => sameKey(item?.brand, key) && str(item?.metric).toLowerCase() === metric
    )?.value
);

// Engagement is summed from the channel records; null when no channel reports it. A
// channel with no mentions contributes nothing, whatever engagement it carries.
const summaryEngagement = (totals) => {
    const values = Object.values(CHANNEL_META)
        .filter((meta) => number(totals?.[meta.key]?.mentions) > 0)
        .map((meta) => number(totals?.[meta.key]?.engagement))
        .filter((value) => value !== null);
    return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) : null;
};

const buildBrands = (report, keys, boardByKey) => {
    const brands = keys.map((key, index) => {
        const board = boardByKey(key);
        const totals = board?.summary?.summary || {};
        const sentimentRow = list(report.sentiment_comparison).find((item) => sameKey(item?.brand, key)) || {};

        const sentiment = number(sentimentRow.average_sentiment)
            ?? chartValue(report, 'sentiment_comparison', 'average sentiment', key)
            ?? number(totals.average_score);
        const interpretation = str(sentimentRow.interpretation);
        const shares = ['positive_share', 'neutral_share', 'negative_share'].map((field) => number(sentimentRow[field]));

        return {
            key,
            name: board?.name || displayNameOf(key),
            lead: index === 0,
            ...BRAND_PALETTE[index],
            mentions: chartValue(report, 'visibility_comparison', 'mentions', key)
                ?? number(sentimentRow.sample_size)
                ?? number(totals.total_mentions)
                ?? 0,
            reach: chartValue(report, 'visibility_comparison', 'reach', key)
                ?? number(totals.total_reach ?? totals.estimated_reach),
            engagement: chartValue(report, 'engagement_comparison', 'engagement', key) ?? summaryEngagement(totals),
            reportedShare: chartValue(report, 'share_of_voice_comparison', 'share of voice', key),
            sentiment,
            sentimentLabel: capitalize(str(totals.overall_sentiment).toLowerCase())
                || classifiedAs(interpretation)
                || toneLabel(sentiment),
            split: shares.every((value) => value !== null)
                ? { positive: shares[0], neutral: shares[1], negative: shares[2] }
                : null,
            interpretation,
        };
    });

    // Share of voice is the service's figure when it sends one, otherwise each
    // brand's share of all mentions across the compared set.
    const mentionTotal = brands.reduce((sum, brand) => sum + brand.mentions, 0);
    return brands.map((brand) => ({
        ...brand,
        share: brand.reportedShare ?? (mentionTotal > 0 ? (brand.mentions / mentionTotal) * 100 : null),
        shareModelled: brand.reportedShare === null,
    }));
};

const leaderBy = (brands, field) => {
    const ranked = brands.filter((brand) => brand[field] !== null && brand[field] > 0);
    if (ranked.length === 0) return null;
    return ranked.reduce((best, brand) => (brand[field] > best[field] ? brand : best));
};

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

const channelMetrics = (metrics) => ({
    mentions: number(metrics?.mentions),
    reach: number(metrics?.reach),
    engagement: number(metrics?.engagement),
    sentiment: number(metrics?.average_sentiment),
});

const buildChannels = (report, brands, boardByKey) => {
    const rows = list(report.channel_comparison);

    return Object.entries(CHANNEL_META)
        .map(([id, meta]) => {
            // With several keywords the service repeats a channel per keyword; the
            // brand-level comparison is the first one it lists.
            const row = rows.find((item) => channelIdOf(item?.channel) === id) || {};
            const competitorRows = list(row.competitor_metrics);

            const byBrand = brands.map((brand) => {
                const reported = brand.lead
                    ? channelMetrics(row.lead_brand_metrics)
                    : channelMetrics(competitorRows.find((item) => sameKey(item?.brand, brand.key))?.metrics);
                const stats = boardByKey(brand.key)?.summary?.summary?.[meta.key] || {};

                return {
                    brand,
                    mentions: reported.mentions ?? number(stats.mentions) ?? 0,
                    reach: reported.reach ?? number(stats.reach),
                    engagement: reported.engagement ?? number(stats.engagement),
                    sentiment: reported.sentiment ?? number(stats.average_score),
                };
            });

            return { id, label: meta.label, color: meta.color, text: meta.text, analysis: str(row.analysis), byBrand };
        })
        .filter((channel) => channel.byBrand.some((entry) => entry.mentions > 0));
};

// ---------------------------------------------------------------------------
// Written analysis
// ---------------------------------------------------------------------------

const finding = (item) => ({
    title: str(item?.title),
    body: str(item?.description),
    evidence: strings(item?.evidence, 2),
});

const findings = (value, limit) => list(value).map(finding).filter((item) => item.title).slice(0, limit);

// "High" / "Medium" / "Low", or a plain rank. Words sort ahead of unranked items.
const priorityRank = (value) => {
    const rank = number(value);
    if (rank !== null) return rank;
    return { high: 1, medium: 2, low: 3 }[levelOf(value)];
};

const hostOf = (url) => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return '';
    }
};

const definitionsFor = ({ channelNames, shareModelled }) => [
    { label: 'Mentions', body: `Public items captured for each brand across ${channelNames} during the period.` },
    { label: 'Reported reach', body: 'Potential audience exposure from source and account-level estimates; not unique people.' },
    {
        label: 'Share of voice',
        body: shareModelled
            ? 'Each brand’s share of all mentions across the compared brands in this report.'
            : 'Share of the compared conversation attributed to each brand by the report service.',
    },
    { label: 'Engagement', body: 'Interactions reported by the channels. Shown only where the source supplies it.' },
    { label: 'Average sentiment', body: 'Machine-assisted score from -1 to +1, read with narrative context and channel mix.' },
    { label: 'Lead brand', body: 'The brand the report is written for; every implication and recommendation is from its position.' },
];

// ---------------------------------------------------------------------------

// `brands` and `brandKeys` are the board's display names and the keys the sentiment
// API returned them under, in board order; `summaries` holds each brand's payload.
export const buildComparativeModel = ({ brands = [], brandKeys = [], summaries = [], response, startDate, endDate }) => {
    const report = unwrapComparative(response);
    const r = report || {};

    const meta = r.report_metadata || {};
    const exec = r.executive_summary || {};
    const overview = r.competitive_overview || {};
    const conclusionNode = r.executive_conclusion || {};
    const method = r.evidence_and_methodology || {};

    const boardByKey = (key) => {
        const index = brandKeys.findIndex((boardKey) => sameKey(boardKey, key));
        return index === -1 ? null : { name: brands[index], summary: summaries[index] };
    };

    const keys = brandKeysOf(r, brandKeys);
    const compared = buildBrands(r, keys, boardByKey);
    const lead = compared[0] || null;
    const competitors = compared.slice(1);
    const channels = buildChannels(r, compared, boardByKey);

    const range = meta.reporting_period || {};
    const period = str(range.label) || formatPeriod(range.start_date || startDate, range.end_date || endDate);
    const channelNames = channels.map((channel) => channel.label).join(', ') || 'the monitored channels';

    const sectionText = (name) => str(
        list(r.report_sections).find((section) => str(section?.section).toLowerCase() === name)?.content
    );

    const recommendations = list(r.strategic_recommendations)
        .map((item, index) => ({
            order: index,
            priority: str(item?.priority),
            rank: priorityRank(item?.priority),
            title: str(item?.recommendation),
            rationale: str(item?.rationale),
            context: str(item?.competitive_context),
            measure: str(item?.success_measure),
        }))
        .filter((item) => item.title)
        .sort((a, b) => (a.rank - b.rank) || (a.order - b.order))
        .slice(0, 6);

    const sources = list(method.source_references)
        .map((item) => ({
            title: str(item?.title),
            url: str(item?.url),
            host: hostOf(item?.url),
            platform: str(item?.platform),
            brand: compared.find((brand) => sameKey(brand.key, item?.brand)) || null,
        }))
        .filter((item) => item.title)
        .slice(0, 8);

    return {
        hasReport: Boolean(report) && compared.length > 1,
        title: compared.map((brand) => brand.name).join(' vs '),
        industry: str(meta.industry),
        period: { label: period },

        lead,
        competitors,
        brands: compared,
        leaders: {
            mentions: leaderBy(compared, 'mentions'),
            reach: leaderBy(compared, 'reach'),
            engagement: leaderBy(compared, 'engagement'),
        },
        hasEngagement: compared.some((brand) => brand.engagement !== null),
        shareModelled: compared.some((brand) => brand.shareModelled),
        channels,

        summary: {
            headline: str(exec.headline),
            body: str(exec.summary),
            position: str(exec.lead_brand_position),
            findings: strings(exec.key_findings, 6),
            limitations: strings(exec.important_limitations, 4),
        },

        overview: {
            analysis: str(overview.overall_analysis),
            basis: str(overview.comparison_basis),
            notes: strings(overview.comparability_notes, 5),
            position: sectionText('competitive position'),
        },

        insights: list(r.competitive_insights)
            .map((item) => ({
                title: str(item?.title),
                insight: str(item?.insight),
                implication: str(item?.lead_brand_implication),
                evidence: strings(item?.evidence, 2),
            }))
            .filter((item) => item.title)
            .slice(0, 4),

        strengths: findings(r.lead_brand_strengths, 4),
        gaps: findings(r.lead_brand_gaps, 4),
        risks: findings(r.competitive_risks, 4),
        opportunities: findings(r.competitive_opportunities, 4),
        themes: sectionText('narrative themes'),

        recommendations,
        direction: sectionText('strategic direction'),

        conclusion: {
            body: str(conclusionNode.conclusion),
            priorities: strings(conclusionNode.lead_brand_priorities, 5),
            monitor: strings(conclusionNode.metrics_to_monitor, 8),
        },

        method: {
            summary: str(method.methodology_summary),
            coverage: str(method.data_coverage),
            notes: strings(method.estimation_notes, 4),
            limitations: strings(method.data_limitations, 6),
            sources,
        },
        definitions: definitionsFor({ channelNames, shareModelled: compared.some((brand) => brand.shareModelled) }),
    };
};

export default buildComparativeModel;
