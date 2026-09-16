// Request body for the Reputation Intelligence report.
//
// The report service writes the narrative from the board's sentiment payload. That
// payload can carry thousands of mention objects (news items include the full article
// body), so each channel's source list is capped before it is sent. The summary
// totals, keywords and location splits are left untouched, so the headline figures
// still describe the whole monitored period rather than the sample.

export const REPUTATION_REPORT_TYPE = 'reputation_intelligence';

export const MAX_SOURCES_PER_CHANNEL = 50;

export const capSources = (summary = {}, limit = MAX_SOURCES_PER_CHANNEL) => {
    const sources = summary?.sources;
    if (!sources || typeof sources !== 'object' || Array.isArray(sources)) return summary;

    const capped = Object.fromEntries(
        Object.entries(sources).map(([channel, items]) => [
            channel,
            Array.isArray(items) ? items.slice(0, limit) : items,
        ])
    );

    return { ...summary, sources: capped };
};

// `brandKey` is the key the sentiment API returned the brand under (e.g. "nnpc").
export const buildReputationPayload = (brandKey, summary) => ({
    report_type: REPUTATION_REPORT_TYPE,
    data: {
        [brandKey]: capSources(summary),
    },
});

export default buildReputationPayload;
