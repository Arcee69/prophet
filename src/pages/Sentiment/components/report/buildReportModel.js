import { COLORS, channelColor, formatCompact, formatFull } from './reportTheme';

// Turns the board's raw API payloads into the shape the exported PDF renders.
//
// The export used to be a screenshot of the live dashboard, so it inherited the
// dashboard's layout, its interactive controls and its single-brand toggles. This
// builder recomputes every figure for every brand instead, so the document can be
// laid out for print and can say something about brands that are not currently
// selected on screen.

const POSITIVE_THRESHOLD = 0.1;
const NEGATIVE_THRESHOLD = -0.1;

const CHANNELS = [
    { key: 'news_sentiment', type: 'News', label: 'News' },
    { key: 'twitter_sentiment', type: 'Twitter', label: 'Twitter/X' },
    { key: 'youtube_sentiment', type: 'Youtube', label: 'YouTube' },
];

// Words that top the keyword lists but carry no narrative meaning.
const STOP_WORDS = new Set([
    'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'has', 'had', 'was', 'were', 'are',
    'you', 'your', 'they', 'their', 'there', 'about', 'into', 'than', 'then', 'them', 'will', 'would',
    'been', 'being', 'said', 'says', 'more', 'most', 'some', 'such', 'over', 'after', 'also', 'when',
    'what', 'which', 'who', 'how', 'its', 'his', 'her', 'our', 'out', 'not', 'but', 'all', 'can',
    'new', 'one', 'two', 'now', 'get', 'got', 'just', 'like', 'make', 'made', 'via', 'amp', 'https',
]);

const toneOf = (score) => {
    if (typeof score !== 'number') return 'neutral';
    if (score > POSITIVE_THRESHOLD) return 'positive';
    if (score < NEGATIVE_THRESHOLD) return 'negative';
    return 'neutral';
};

// Fallback split when per-item scores are too sparse to classify directly: the same
// derivation the dashboard uses, so the PDF and the screen never disagree.
const splitFromAverage = (source = {}) => {
    const score = source.average_score || 0;
    if (score > POSITIVE_THRESHOLD) {
        const positive = Math.round(((score + 1) / 2) * 100);
        return { positive, neutral: 100 - positive, negative: 0 };
    }
    if (score < NEGATIVE_THRESHOLD) {
        const negative = Math.round(((-score + 1) / 2) * 100);
        return { positive: 0, neutral: 100 - negative, negative };
    }
    return { positive: 0, neutral: 100, negative: 0 };
};

// Per-item classification is exact but not always present (news is fully scored,
// YouTube only partly), so it is only trusted once it covers half the mentions.
const splitFromMentions = (mentions, fallbackSource) => {
    const scored = mentions.filter((m) => m.sentiment !== null && m.sentiment !== undefined);
    const coverage = mentions.length > 0 ? scored.length / mentions.length : 0;

    if (scored.length > 0 && coverage >= 0.5) {
        const counts = { positive: 0, neutral: 0, negative: 0 };
        scored.forEach((m) => { counts[m.tone || toneOf(m.sentiment)] += 1; });
        const pct = (n) => Math.round((n / scored.length) * 100);
        return {
            positive: pct(counts.positive),
            neutral: pct(counts.neutral),
            negative: pct(counts.negative),
            basis: `${formatFull(scored.length)} classified mentions`,
            scoredCount: scored.length,
        };
    }

    return { ...splitFromAverage(fallbackSource), basis: 'channel average score', scoredCount: scored.length };
};

const sumBy = (items, pick) => items.reduce((total, item) => total + (Number(pick(item)) || 0), 0);

const dayKey = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

// ---------------------------------------------------------------------------

const buildBrand = (name, index, summaryPayload, mentions, colorAt) => {
    const summary = summaryPayload?.summary || {};
    const totalMentions = summary.total_mentions || mentions.length;
    const reach = summary.total_reach ?? summary.estimated_reach ?? sumBy(mentions, (m) => m.views);
    const engagement = sumBy(mentions, (m) => m.engagement);
    const split = splitFromMentions(mentions, summary);

    const channels = CHANNELS
        .map((channel) => {
            const items = mentions.filter((m) => m.type === channel.type);
            const count = summary?.[channel.key]?.mentions || items.length;
            if (count === 0) return null;
            const channelSplit = splitFromMentions(items, summary?.[channel.key] || {});
            return {
                label: channel.label,
                color: channelColor(channel.label),
                mentions: count,
                reach: sumBy(items, (m) => m.views),
                engagement: sumBy(items, (m) => m.engagement),
                ...channelSplit,
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.mentions - a.mentions);

    return {
        name,
        color: colorAt(index),
        mentions: totalMentions,
        reach,
        engagement,
        views: sumBy(mentions, (m) => m.views),
        likes: sumBy(mentions, (m) => m.likes),
        comments: sumBy(mentions, (m) => m.comments),
        // Engagement as a share of the audience the coverage reached.
        engagementRate: reach > 0 ? (engagement / reach) * 100 : 0,
        // Reach delivered per mention - how far the average piece of coverage travelled.
        amplification: totalMentions > 0 ? reach / totalMentions : 0,
        positive: split.positive,
        neutral: split.neutral,
        negative: split.negative,
        netSentiment: split.positive - split.negative,
        basis: split.basis,
        scoredCount: split.scoredCount,
        channels,
        mentionCount: mentions.length,
    };
};

const buildTimeline = (brands, mentionsByBrand) => {
    const days = [...new Set(
        mentionsByBrand.flat().map((m) => dayKey(m.publishedAt)).filter(Boolean)
    )].sort();

    if (days.length === 0) return { days: [], series: [], markers: [], peaks: [] };

    const series = brands.map((brand, index) => {
        const totals = new Map(days.map((day) => [day, 0]));
        (mentionsByBrand[index] || []).forEach((mention) => {
            const day = dayKey(mention.publishedAt);
            if (day && totals.has(day)) totals.set(day, totals.get(day) + 1);
        });
        return { name: brand.name, color: brand.color, data: days.map((day) => totals.get(day)) };
    });

    // Peak attribution: the busiest days for the lead brand, each labelled with the
    // mention that pulled the most interaction that day.
    const lead = series[0];
    const leadMentions = mentionsByBrand[0] || [];
    const peaks = days
        .map((day, index) => ({ day, index, value: lead ? lead.data[index] : 0 }))
        .filter((entry) => entry.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .sort((a, b) => a.index - b.index)
        .map((entry) => {
            const sameDay = leadMentions.filter((m) => dayKey(m.publishedAt) === entry.day);
            const driver = [...sameDay].sort((a, b) => b.engagement - a.engagement)[0];
            const scored = sameDay.filter((m) => m.sentiment !== null && m.sentiment !== undefined);
            const average = scored.length > 0 ? sumBy(scored, (m) => m.sentiment) / scored.length : 0;
            const tone = toneOf(average);
            return {
                ...entry,
                tone,
                color: tone === 'positive' ? COLORS.positive : tone === 'negative' ? COLORS.negative : COLORS.violet,
                label: new Date(entry.day).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase(),
                headline: driver?.title || `${formatFull(entry.value)} mentions`,
                channel: driver?.type || '',
            };
        });

    const leadTotals = lead ? lead.data : [];
    const busiestIndex = leadTotals.reduce((best, value, i) => (value > leadTotals[best] ? i : best), 0);
    const quietestIndex = leadTotals.reduce((best, value, i) => (value < leadTotals[best] ? i : best), 0);
    const label = (index) => (days[index]
        ? new Date(days[index]).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        : '—');

    return {
        days,
        series,
        peaks,
        markers: peaks.map((peak) => ({ index: peak.index, value: peak.value, color: peak.color, label: peak.label })),
        stats: {
            activeDays: days.length,
            averagePerDay: days.length > 0 ? sumBy(leadTotals, (v) => v) / days.length : 0,
            busiest: { label: label(busiestIndex), value: leadTotals[busiestIndex] || 0 },
            quietest: { label: label(quietestIndex), value: leadTotals[quietestIndex] || 0 },
        },
    };
};

// Themes are the platform's own top keywords, re-measured against the mention text so
// each one carries a real volume and a real positive share rather than a bare word.
const buildThemes = (topWords = {}, mentions = []) => {
    const words = new Map();
    Object.values(topWords || {}).forEach((channel) => {
        ['positive', 'negative'].forEach((tone) => {
            (channel?.[tone] || []).forEach((word) => {
                const clean = String(word || '').toLowerCase().trim();
                if (clean.length < 4 || STOP_WORDS.has(clean)) return;
                if (!words.has(clean)) words.set(clean, { word: clean, seededTone: tone });
            });
        });
    });

    const corpus = mentions.map((m) => ({
        text: `${m.title || ''} ${m.description || ''}`.toLowerCase(),
        tone: m.tone || toneOf(m.sentiment),
        scored: m.sentiment !== null && m.sentiment !== undefined,
        engagement: m.engagement || 0,
    }));

    const measured = [...words.values()].map(({ word, seededTone }) => {
        const matches = corpus.filter((item) => item.text.includes(word));
        const scored = matches.filter((item) => item.scored);
        const positives = scored.filter((item) => item.tone === 'positive').length;
        const negatives = scored.filter((item) => item.tone === 'negative').length;
        return {
            label: word.replace(/\b\w/g, (c) => c.toUpperCase()),
            mentions: matches.length,
            engagement: sumBy(matches, (item) => item.engagement),
            positivePct: scored.length > 0 ? Math.round((positives / scored.length) * 100) : null,
            negativePct: scored.length > 0 ? Math.round((negatives / scored.length) * 100) : null,
            tone: seededTone,
        };
    });

    const ranked = measured.filter((theme) => theme.mentions > 0).sort((a, b) => b.mentions - a.mentions);
    // Nothing matched the mention text (short feeds, or keywords drawn from bodies we
    // do not hold): fall back to the raw keyword order so the page still has content.
    const themes = ranked.length > 0 ? ranked : measured.slice(0, 7);

    const palette = [COLORS.positive, COLORS.info, '#0EA5E9', COLORS.accent, COLORS.violet, COLORS.negative, '#14B8A6'];

    return themes.slice(0, 7).map((theme, index) => ({ ...theme, color: palette[index % palette.length] }));
};

const buildPhrases = (topWords = {}) => {
    const seen = new Map();
    Object.values(topWords || {}).forEach((channel) => {
        (channel?.positive || []).forEach((word) => seen.set(String(word).toLowerCase(), 'positive'));
        (channel?.negative || []).forEach((word) => {
            const key = String(word).toLowerCase();
            // A word claimed by both sides reads as contested, not positive.
            seen.set(key, seen.has(key) ? 'mixed' : 'negative');
        });
    });

    const toneColor = { positive: COLORS.positive, negative: COLORS.negative, mixed: COLORS.accent };
    const sizes = [30, 26, 23, 21, 19, 18, 17, 16, 15, 14, 14, 13];

    return [...seen.entries()]
        .filter(([word]) => word.length >= 3 && !STOP_WORDS.has(word))
        .slice(0, 12)
        .map(([word, tone], index) => ({
            text: word,
            tone,
            color: toneColor[tone],
            size: sizes[index] || 13,
        }));
};

const buildTopContent = (brands, mentionsByBrand) => {
    const all = [];
    mentionsByBrand.forEach((mentions, index) => {
        mentions.forEach((mention) => {
            all.push({ ...mention, brand: brands[index]?.name, brandColor: brands[index]?.color });
        });
    });

    return all
        .sort((a, b) => (b.engagement - a.engagement) || (b.views - a.views))
        .slice(0, 7)
        .map((mention, index) => ({
            rank: index + 1,
            channel: mention.type === 'Twitter' ? 'Twitter/X' : mention.type,
            channelColor: channelColor(mention.type === 'Twitter' ? 'Twitter/X' : mention.type),
            title: mention.title,
            brand: mention.brand,
            brandColor: mention.brandColor,
            reach: mention.views,
            engagement: mention.engagement,
            tone: mention.tone || toneOf(mention.sentiment),
            publishedAt: mention.publishedAt,
        }));
};

const buildRegions = (summaryPayload, getLocationName) => {
    const regions = summaryPayload?.location_sentiments?.news || summaryPayload?.country_sentiments?.news || {};
    const entries = Array.isArray(regions) ? [] : Object.entries(regions);

    return entries
        .map(([name, data]) => {
            const tone = toneOf(data?.average_score);
            return {
                name: getLocationName ? getLocationName(name) : name,
                mentions: data?.mentions || 0,
                score: data?.average_score || 0,
                tone,
                color: tone === 'positive' ? COLORS.positive : tone === 'negative' ? COLORS.negative : COLORS.neutral,
            };
        })
        .sort((a, b) => b.mentions - a.mentions)
        .slice(0, 6);
};

// ---------------------------------------------------------------------------
// Narrative: short, factual sentences derived from the numbers above, so the
// document reads as a briefing rather than a dump of charts.
// ---------------------------------------------------------------------------

const buildNarrative = (lead, brands, timeline, themes, topContent) => {
    const net = lead.netSentiment;
    const verdict =
        net >= 25 ? 'Positive momentum with a contained risk pocket.'
            : net >= 5 ? 'Net-positive conversation with pressure worth watching.'
                : net <= -25 ? 'Negative conversation that needs an active response.'
                    : net <= -5 ? 'Sentiment is tilting negative and needs correction.'
                        : 'A largely neutral conversation with room to set the narrative.';

    const strongestChannel = [...lead.channels].sort((a, b) => b.positive - a.positive)[0];
    const riskChannel = [...lead.channels].sort((a, b) => b.negative - a.negative)[0];
    const loudestChannel = lead.channels[0];
    const riskTheme = [...themes].filter((t) => t.positivePct !== null).sort((a, b) => a.positivePct - b.positivePct)[0];
    const strongTheme = [...themes].filter((t) => t.positivePct !== null).sort((a, b) => b.positivePct - a.positivePct)[0];

    // The loudest channel is often also the most negative one, so the clause has to
    // read as one statement about one channel rather than naming it twice.
    const riskClause = !riskChannel || riskChannel.negative <= 0
        ? ''
        : riskChannel.label === loudestChannel?.label
            ? ` and also carries the highest negative share at ${riskChannel.negative}%`
            : `, while ${riskChannel.label} carries the highest negative share at ${riskChannel.negative}%`;

    const singleBrandExecutive = lead.channels.length > 0
        ? `${loudestChannel.label} owns the volume at ${formatFull(loudestChannel.mentions)} mentions${riskClause}.`
        : `${formatFull(lead.mentions)} mentions captured across the monitored channels.`;

    // On a comparison board the cover summarises every brand, so its signal line has
    // to name who leads on what rather than describing the lead brand's channels.
    const volumeLeader = [...brands].sort((a, b) => b.mentions - a.mentions)[0];
    const sentimentLeader = [...brands].sort((a, b) => b.netSentiment - a.netSentiment)[0];
    const netLabel = (brand) => `${brand.netSentiment > 0 ? '+' : ''}${brand.netSentiment}`;

    const executive = brands.length < 2
        ? singleBrandExecutive
        : volumeLeader.name === sentimentLeader.name
            ? `${volumeLeader.name} leads on both volume, with ${formatFull(volumeLeader.mentions)} mentions and ${volumeLeader.shareOfVoice.toFixed(1)}% share of voice, and sentiment at ${netLabel(volumeLeader)}.`
            : `${volumeLeader.name} leads volume with ${formatFull(volumeLeader.mentions)} mentions and ${volumeLeader.shareOfVoice.toFixed(1)}% share of voice; ${sentimentLeader.name} leads sentiment at ${netLabel(sentimentLeader)}.`;

    const channelSignal = !strongestChannel || !riskChannel
        ? {
            headline: 'Coverage is concentrated in a single channel.',
            body: 'Widening the channel mix would reduce exposure to a single platform’s swing.',
        }
        : strongestChannel.label === riskChannel.label
            ? {
                headline: `${strongestChannel.label} is the most polarised channel.`,
                body: `It carries both the strongest positive share at ${strongestChannel.positive}% and the highest negative share at ${riskChannel.negative}%, so it rewards engagement and punishes silence in equal measure.`,
            }
            : {
                headline: `${strongestChannel.label} carries the most favourable coverage.`,
                body: `${riskChannel.label} holds the highest negative share at ${riskChannel.negative}% and is where a response will move the number fastest.`,
            };

    const narrativeSignal = riskTheme && strongTheme
        ? `“${strongTheme.label}” is the strongest positive driver at ${strongTheme.positivePct}% positive; “${riskTheme.label}” is the weakest at ${riskTheme.positivePct}% and needs more evidence in messaging.`
        : 'Themes are evenly balanced across the period; no single narrative dominates the conversation.';

    const contentSignal = topContent.length > 0
        ? {
            headline: `${topContent[0].channel} content drives the highest interaction.`,
            body: `The top item alone carries ${formatCompact(topContent[0].engagement)} interactions across ${formatCompact(topContent[0].reach)} reach.`,
        }
        : { headline: 'No interaction data in this period.', body: 'Widen the date range to surface top-performing content.' };

    const peakLine = timeline.peaks.length > 0
        ? `Attention peaked on ${timeline.peaks.map((p) => p.label).join(', ')}; the strongest day carried ${formatFull(Math.max(...timeline.peaks.map((p) => p.value)))} mentions.`
        : 'Volume held steady across the period with no pronounced spike.';

    // Prioritised actions, each tied to a figure elsewhere in the document.
    const actions = [];
    if (riskChannel && riskChannel.negative >= 15) {
        actions.push({
            title: `Respond on ${riskChannel.label}`,
            body: `${riskChannel.negative}% of ${riskChannel.label} mentions are negative. Deploy the rapid-response playbook.`,
            owner: 'Issues',
            due: 'Immediate',
            color: COLORS.negative,
            background: COLORS.negativeSoft,
        });
    }
    if (strongestChannel) {
        actions.push({
            title: `Own momentum on ${strongestChannel.label}`,
            body: `${strongestChannel.positive}% positive share. Publish proof points on the channel already working.`,
            owner: 'Comms',
            due: '7 days',
            color: COLORS.positive,
            background: COLORS.positiveSoft,
        });
    }
    if (riskTheme) {
        actions.push({
            title: `Close the “${riskTheme.label}” gap`,
            body: `${formatFull(riskTheme.mentions)} mentions at ${riskTheme.positivePct}% positive. Answer with local, verifiable evidence.`,
            owner: 'CSR',
            due: '72 hrs',
            color: COLORS.accent,
            background: COLORS.accentSoft,
        });
    }
    if (topContent.length > 0) {
        actions.push({
            title: `Repurpose the top ${topContent[0].channel} asset`,
            body: 'The highest-performing format should be cut down and pushed across the remaining channels.',
            owner: 'Digital',
            due: '14 days',
            color: COLORS.violet,
            background: COLORS.violetSoft,
        });
    }
    if (brands.length > 1) {
        const ranked = [...brands].sort((a, b) => b.netSentiment - a.netSentiment);
        const position = ranked.findIndex((b) => b.name === lead.name) + 1;
        actions.push({
            title: position === 1 ? 'Defend the sentiment lead' : `Close the gap on ${ranked[0].name}`,
            body: position === 1
                ? `${lead.name} leads the set on net sentiment. Hold the position with consistent publishing cadence.`
                : `${ranked[0].name} leads at ${ranked[0].netSentiment > 0 ? '+' : ''}${ranked[0].netSentiment} net sentiment against ${lead.netSentiment > 0 ? '+' : ''}${lead.netSentiment}.`,
            owner: 'Strategy',
            due: '30 days',
            color: COLORS.info,
            background: COLORS.infoSoft,
        });
    }

    const conclusion = brands.length > 1
        ? `${[...brands].sort((a, b) => b.netSentiment - a.netSentiment)[0].name} leads the compared set on net sentiment.`
        : verdict;

    return {
        verdict,
        executive,
        channelSignal,
        narrativeSignal,
        contentSignal,
        peakLine,
        actions: actions.slice(0, 4),
        conclusion,
    };
};

// ---------------------------------------------------------------------------

export const buildReportModel = ({
    brands: brandNames = [],
    summaries = [],
    mentionsByBrand = [],
    startDate,
    endDate,
    colorAt = () => COLORS.positive,
    getLocationName,
    reportType = 'Sentiment intelligence',
}) => {
    const brands = brandNames.map((name, index) =>
        buildBrand(name, index, summaries[index], mentionsByBrand[index] || [], colorAt)
    );

    const lead = brands[0] || buildBrand('—', 0, {}, [], colorAt);
    const totalMentions = brands.reduce((sum, brand) => sum + brand.mentions, 0);
    const totalReach = brands.reduce((sum, brand) => sum + brand.reach, 0);

    const withShare = brands.map((brand) => ({
        ...brand,
        shareOfVoice: totalMentions > 0 ? (brand.mentions / totalMentions) * 100 : 0,
        shareOfReach: totalReach > 0 ? (brand.reach / totalReach) * 100 : 0,
    }));

    const timeline = buildTimeline(withShare, mentionsByBrand);
    const themes = buildThemes(summaries[0]?.top_words, mentionsByBrand[0] || []);
    const phrases = buildPhrases(summaries[0]?.top_words);
    const topContent = buildTopContent(withShare, mentionsByBrand);
    const regions = buildRegions(summaries[0], getLocationName);

    const leadWithShare = withShare[0] || lead;
    const narrative = buildNarrative(leadWithShare, withShare, timeline, themes, topContent);

    // Set-wide figures. A comparison report's cover reports on every brand on the
    // board, so the sentiment split is weighted by each brand's volume rather than
    // taken from the lead brand alone.
    const totalEngagement = brands.reduce((sum, brand) => sum + brand.engagement, 0);
    const weightedTone = (tone) => (totalMentions > 0
        ? Math.round(brands.reduce((sum, brand) => sum + brand[tone] * brand.mentions, 0) / totalMentions)
        : 0);
    const combined = {
        mentions: totalMentions,
        reach: totalReach,
        engagement: totalEngagement,
        engagementRate: totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0,
        amplification: totalMentions > 0 ? totalReach / totalMentions : 0,
        positive: weightedTone('positive'),
        neutral: weightedTone('neutral'),
        negative: weightedTone('negative'),
        netSentiment: weightedTone('positive') - weightedTone('negative'),
        scoredCount: brands.reduce((sum, brand) => sum + brand.scoredCount, 0),
    };

    const days = startDate && endDate
        ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86_400_000))
        : timeline.days.length;

    return {
        reportType,
        generatedOn: new Date(),
        period: { start: startDate, end: endDate, days },
        title: brandNames.join('  vs  ') || '—',
        isComparison: brandNames.length > 1,
        brands: withShare,
        lead: leadWithShare,
        totals: combined,
        timeline,
        themes,
        phrases,
        topContent,
        regions,
        narrative,
    };
};

export default buildReportModel;
