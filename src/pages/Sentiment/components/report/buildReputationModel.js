import { formatCompact, formatFull, REPUTATION_COLORS as C } from './reportTheme';

// Turns the Reputation Intelligence API response, plus the board's own sentiment
// payload, into the shape ReputationReportDocument renders.
//
// The response (`{ success, report_type, data }`) carries both measured figures and
// written analysis. Measured figures prefer the response and fall back to the full,
// uncapped sentiment payload, so the document still holds together if a figure is
// missing. Written analysis only ever comes from the response: a section it does not
// supply is left empty and its page is dropped from the document.

// Interaction rates used to model engagement from reach. The response carries no
// engagement figure, so this is directional only and labelled as modelled in the PDF.
export const CHANNEL_META = {
    twitter: { key: 'twitter_sentiment', label: 'X', color: C.green, text: C.green, soft: C.greenSoft, line: C.greenLine, rate: 0.042 },
    news: { key: 'news_sentiment', label: 'News', color: C.blue, text: C.blue, soft: C.blueSoft, line: C.blueLine, rate: 0.0035 },
    youtube: { key: 'youtube_sentiment', label: 'YouTube', color: C.yellow, text: C.gold, soft: C.yellowSoft, line: C.yellowLine, rate: 0.055 },
};

export const channelIdOf = (name) => {
    const value = String(name || '').toLowerCase().trim();
    if (value === 'x' || value.includes('twit')) return 'twitter';
    if (value.includes('news')) return 'news';
    if (value.includes('you')) return 'youtube';
    return null;
};

// "Critical", "Very high", "Medium to high" and so on, collapsed to three levels.
export const levelOf = (value) => {
    const v = String(value || '').toLowerCase();
    if (/crit|high|severe|urgent/.test(v)) return 'high';
    if (/low|minor/.test(v)) return 'low';
    return 'medium';
};

export const toneLabel = (score) => {
    if (score === null || score === undefined) return 'Unscored';
    const magnitude = Math.abs(score);
    if (magnitude < 0.05) return 'Neutral';
    if (magnitude < 0.1) return score > 0 ? 'Mildly positive' : 'Mildly negative';
    return score > 0 ? 'Positive' : 'Negative';
};

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

// Splits a paragraph into its first sentence and the rest, so one field can feed a
// headline and body pair. The split needs whitespace after the stop, so figures like
// "N7.913tn" stay whole.
const splitLead = (value) => {
    const clean = str(value).replace(/\s+/g, ' ');
    const match = clean.match(/^(.+?[.!?])\s+(.+)$/);
    return match ? { headline: match[1], body: match[2] } : { headline: clean, body: '' };
};

const capitalize = (value) => value.replace(/^\w/, (char) => char.toUpperCase());

const joinList = (items) => (items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

// A date-only string ("2026-09-01") parses as UTC midnight, which is the previous day
// west of Greenwich, so it is read as local time instead.
const toDate = (value) => (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value));

export const formatPeriod = (start, end) => {
    if (!start || !end) return 'Full monitored period';
    const s = toDate(start);
    const e = toDate(end);
    const month = (date) => date.toLocaleDateString('en-GB', { month: 'long' });

    if (s.toDateString() === e.toDateString()) return `${e.getDate()} ${month(e)} ${e.getFullYear()}`;
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
        return `${s.getDate()}–${e.getDate()} ${month(e)} ${e.getFullYear()}`;
    }
    if (s.getFullYear() === e.getFullYear()) {
        return `${s.getDate()} ${month(s)} – ${e.getDate()} ${month(e)} ${e.getFullYear()}`;
    }
    return `${s.getDate()} ${month(s)} ${s.getFullYear()} – ${e.getDate()} ${month(e)} ${e.getFullYear()}`;
};

export const unwrapReport = (body) => {
    const data = body?.data;
    if (body?.success === false || !data || typeof data !== 'object') return null;
    return data.executive_summary || data.reputation_overview ? data : null;
};

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

const buildChannels = (summary, report) => {
    const totals = summary?.summary || {};
    const platforms = list(report.sentiment_analysis?.platforms);
    const chartReach = list(report.chart_data?.platform_reach);
    const analysis = report.platform_analysis || {};

    let channels = Object.entries(CHANNEL_META)
        .map(([id, meta]) => {
            const stats = totals?.[meta.key] || {};
            const platform = platforms.find((item) => channelIdOf(item?.platform) === id) || {};
            const detail = analysis[id] || {};
            const items = Array.isArray(summary?.sources?.[id]) ? summary.sources[id] : [];
            const reportedReach = number(platform.reach) ?? number(chartReach.find((item) => channelIdOf(item?.label) === id)?.value);
            const score = number(platform.average_score) ?? number(stats.average_score);

            return {
                id,
                ...meta,
                mentions: number(platform.mentions) ?? (number(stats.mentions) || items.length),
                reportedReach,
                reach: reportedReach ?? items.reduce((sum, item) => sum + (number(item?.statistics?.viewCount) || 0), 0),
                score,
                toneLabel: str(platform.classification) || toneLabel(score),
                role: str(detail.role),
                risk: str(detail.reputation_risk),
                analysis: str(detail.analysis) || str(platform.analysis),
                positiveTopics: strings(detail.key_positive_topics, 5),
                negativeTopics: strings(detail.key_negative_topics, 5),
            };
        })
        .filter((channel) => channel.mentions > 0);

    // Without channel-level reach, item view counts only cover the items that expose
    // them, so they are used for the split and scaled to the summary's total reach.
    const summaryReach = number(totals.total_reach ?? totals.estimated_reach);
    const viewTotal = channels.reduce((sum, channel) => sum + channel.reach, 0);
    if (summaryReach && viewTotal > 0 && channels.every((channel) => channel.reportedReach === null)) {
        channels = channels.map((channel) => ({ ...channel, reach: (channel.reach / viewTotal) * summaryReach }));
    }

    const mentionTotal = channels.reduce((sum, channel) => sum + channel.mentions, 0);
    const reachTotal = channels.reduce((sum, channel) => sum + channel.reach, 0);

    return {
        mentionTotal,
        reachTotal,
        channels: channels.map((channel) => ({
            ...channel,
            volumeShare: mentionTotal > 0 ? (channel.mentions / mentionTotal) * 100 : 0,
            reachShare: reachTotal > 0 ? (channel.reach / reachTotal) * 100 : 0,
        })),
    };
};

const definitionsFor = ({ channelNames, engagement }) => [
    { label: 'Mentions', body: `Public items captured across ${channelNames} during the monitoring period.` },
    { label: 'Estimated reach', body: 'Potential audience exposure from source and account-level reach estimates; not unique people.' },
    {
        label: 'Estimated engagement',
        body: engagement === null
            ? 'Not available for this period: channel reach was too sparse to model interactions.'
            : `Directional proxy of ${formatCompact(engagement)} based on reach-weighted channel assumptions, not certified interactions.`,
    },
    { label: 'Sentiment', body: 'Average machine-assisted directional score, interpreted with narrative context and channel mix.' },
    { label: 'Reputation score', body: 'Composite 0-100 view of sentiment, visibility quality, risk exposure and proof strength.' },
    { label: 'Risk level', body: 'Assessment of public relevance, amplification speed, credibility exposure and likely persistence.' },
];

// ---------------------------------------------------------------------------

export const buildReputationModel = ({ brand, summary = {}, response, startDate, endDate }) => {
    const report = unwrapReport(response);
    const r = report || {};
    const totals = summary?.summary || {};

    const meta = r.report_metadata || {};
    const exec = r.executive_summary || {};
    const overview = r.reputation_overview || {};
    const audience = r.audience_and_visibility || {};
    const sentimentNode = r.sentiment_analysis || {};
    const drivers = r.conversation_drivers || {};
    const outlookNode = r.reputation_outlook || {};
    const locationNode = r.location_insights || {};

    const brandName = str(meta.brand_name) || brand;
    const period = formatPeriod(meta.reporting_period?.start_date || startDate, meta.reporting_period?.end_date || endDate);

    // Measured figures
    const { channels, mentionTotal, reachTotal } = buildChannels(summary, r);
    const reachKnown = reachTotal > 0;
    const mentions = number(audience.total_mentions) ?? number(totals.total_mentions) ?? mentionTotal;
    const reach = number(audience.total_reach) ?? number(totals.total_reach ?? totals.estimated_reach) ?? reachTotal;
    const engagement = reachKnown
        ? Math.round(channels.reduce((sum, channel) => sum + channel.reach * channel.rate, 0))
        : null;

    const weightedScore = mentionTotal > 0 && channels.some((channel) => channel.score !== null)
        ? channels.reduce((sum, channel) => sum + (channel.score || 0) * channel.mentions, 0) / mentionTotal
        : null;
    const sentiment = number(sentimentNode.overall?.average_score) ?? number(totals.average_score) ?? weightedScore;
    const sentimentPoints = Math.round((sentiment || 0) * 100);
    const sentimentLabel = str(sentimentNode.overall?.classification) || toneLabel(sentiment);

    const volumeLeader = [...channels].sort((a, b) => b.mentions - a.mentions)[0] || null;
    const reachLeader = reachKnown ? [...channels].sort((a, b) => b.reach - a.reach)[0] : null;
    const channelNames = joinList(channels.map((channel) => channel.label)) || 'the monitored channels';

    // Headline judgement
    const score = number(overview.reputation_score) ?? number(exec.reputation_score);
    const status = str(overview.reputation_status);
    const statuses = {
        visibility: str(overview.visibility_status),
        risk: str(overview.risk_level),
        sentiment: str(overview.sentiment_status),
        confidence: str(outlookNode.confidence),
    };
    const outlook = str(outlookNode.outlook);
    const assessment = splitLead(exec.overall_reputation_assessment);

    const tagline = [
        statuses.visibility && `${capitalize(statuses.visibility)} visibility.`,
        statuses.risk && `${capitalize(statuses.risk)} risk.`,
        outlook && `${capitalize(outlook)}.`,
    ].filter(Boolean).join(' ');

    // Conversation drivers, strengths, risks, opportunities, recommendations
    const driver = (item) => ({
        title: str(item?.topic),
        detail: str(item?.description),
        weight: str(item?.impact),
        platform: str(item?.platform),
    });
    const assets = list(drivers.positive_drivers).map(driver).filter((item) => item.title).slice(0, 6);
    const pressures = list(drivers.negative_drivers).map(driver).filter((item) => item.title).slice(0, 6);

    const strengths = list(r.key_reputation_strengths)
        .map((item) => ({ title: str(item?.title), body: str(item?.description), evidence: str(item?.evidence) }))
        .filter((item) => item.title)
        .slice(0, 4);

    const risks = list(r.reputation_risks)
        .map((item) => ({
            name: str(item?.title),
            severity: str(item?.severity),
            platform: str(item?.platform),
            impact: str(item?.potential_impact),
            response: str(item?.recommended_response),
        }))
        .filter((item) => item.name)
        .slice(0, 5);

    const opportunities = list(r.reputation_opportunities)
        .map((item) => ({ title: str(item?.title), body: str(item?.recommended_action) || str(item?.description) }))
        .filter((item) => item.title)
        .slice(0, 4);

    const recommendations = list(r.strategic_recommendations)
        .map((item, index) => ({
            priority: number(item?.priority) ?? index + 1,
            title: str(item?.recommendation),
            reason: str(item?.reason),
            impact: str(item?.expected_impact),
        }))
        .filter((item) => item.title)
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 6);

    const sectionText = (name) => str(
        list(r.report_sections).find((section) => str(section?.section).toLowerCase() === name)?.content
    );

    // Sentiment and trust split
    const measuredInterpretation = !volumeLeader
        ? ''
        : reachLeader && reachLeader.id !== volumeLeader.id
            ? `The channel producing ${volumeLeader.volumeShare.toFixed(1)}% of mentions is ${volumeLeader.toneLabel.toLowerCase()}. The channel producing ${reachLeader.reachShare.toFixed(1)}% of reach is ${reachLeader.toneLabel.toLowerCase()}.`
            : `${volumeLeader.label} produces ${volumeLeader.volumeShare.toFixed(1)}% of mentions and reads ${volumeLeader.toneLabel.toLowerCase()}.`;

    const trustCards = [
        status && {
            label: 'Reputation status',
            verdict: status,
            body: score === null ? '' : `Composite reputation score of ${Math.round(score)}/100.`,
            tone: score === null ? 'neutral' : score >= 70 ? 'positive' : score >= 50 ? 'warning' : 'negative',
        },
        sentiment !== null && {
            label: 'Sentiment',
            verdict: sentimentLabel,
            body: statuses.sentiment,
            tone: sentiment <= -0.05 ? 'negative' : sentiment >= 0.05 ? 'positive' : 'neutral',
        },
        statuses.visibility && {
            label: 'Visibility',
            verdict: capitalize(statuses.visibility),
            body: splitLead(audience.visibility_analysis).headline,
            tone: { high: 'positive', medium: 'neutral', low: 'warning' }[levelOf(statuses.visibility)],
        },
        statuses.risk && {
            label: 'Risk level',
            verdict: capitalize(statuses.risk),
            body: risks.length > 0 ? `${risks.length} active reputation risks, led by ${risks[0].name.toLowerCase()}.` : '',
            tone: { high: 'negative', medium: 'warning', low: 'positive' }[levelOf(statuses.risk)],
        },
    ].filter(Boolean);

    const engagementNote = engagement === null
        ? 'Per-channel reach was not available for this period, so engagement could not be modelled.'
        : `Engagement is calibrated from channel reach using category interaction assumptions: ${channels.map((c) => `${c.label} ${+(c.rate * 100).toFixed(2)}%`).join(', ')}. It is directional and should not be read as a publisher-certified count.`;

    const locationAnalysis = locationNode.available ? str(locationNode.analysis) : '';
    const analyticalNote = [
        `Coverage: ${period}.`,
        `The intelligence view includes ${formatFull(mentions)} mentions${reach > 0 ? ` and ${formatCompact(reach)} estimated reach` : ''} across ${channelNames}.`,
        `Reposts, repeated narratives and unrelated uses of the ${brandName} name may affect raw volume.`,
        locationAnalysis || 'Location signals were too sparse for geographic conclusions.',
        engagement === null ? '' : 'All modelled metrics are labelled.',
    ].filter(Boolean).join(' ');

    const leaderWithRoles = (leader) => (leader ? channels.find((channel) => channel.id === leader.id) : null);

    return {
        hasReport: Boolean(report),
        brand: brandName,
        period: { label: period },

        metrics: {
            mentions,
            reach,
            engagement,
            sentiment,
            sentimentSignal: sentimentPoints > 0 ? `+${sentimentPoints}` : `${sentimentPoints}`,
            sentimentLabel,
        },
        channels,
        channelMentions: mentionTotal,
        reachTotal,
        reachKnown,
        leaders: { volume: leaderWithRoles(volumeLeader), reach: leaderWithRoles(reachLeader) },
        engagementNote,

        score,
        status,
        statuses,
        tagline,
        signal: {
            headline: str(exec.headline) || assessment.headline,
            body: str(exec.headline) ? str(exec.overall_reputation_assessment) : assessment.body,
        },

        readout: {
            position: splitLead(overview.narrative),
            moved: pressures.slice(0, 3).map((item) => item.title),
            helped: assets.slice(0, 3).map((item) => item.title),
            watch: strings(drivers.emerging_topics, 3),
            findings: strings(exec.key_findings, 6),
        },

        interpretation: { headline: measuredInterpretation, body: str(sentimentNode.sentiment_interpretation) },
        trustCards,

        assets,
        pressures,
        emergingTopics: strings(drivers.emerging_topics, 6),
        strengths,

        risks,
        opportunities,
        riskSummary: sectionText('strengths and risks'),

        recommendations,
        watchpoints: strings(outlookNode.key_watchpoints, 6),

        conclusion: { headline: assessment.headline, body: str(exec.summary) },
        outlook: { headline: outlook, body: str(outlookNode.next_period_expectation), confidence: statuses.confidence },
        definitions: definitionsFor({ channelNames, engagement }),
        analyticalNote,
    };
};

export default buildReputationModel;
