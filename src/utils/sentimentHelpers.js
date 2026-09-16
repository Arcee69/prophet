import { countryMap } from './CountryMap';

// Sentiment score thresholds, shared by every per-item classification below.
export const POSITIVE_THRESHOLD = 0.1;
export const NEGATIVE_THRESHOLD = -0.1;

export const toneOf = (score) => {
    if (typeof score !== 'number') return 'neutral';
    if (score > POSITIVE_THRESHOLD) return 'positive';
    if (score < NEGATIVE_THRESHOLD) return 'negative';
    return 'neutral';
};

export const getSentimentColor = (score) => {
    if (score > POSITIVE_THRESHOLD) return '#10B981'; // Positive - Green
    if (score < NEGATIVE_THRESHOLD) return '#EF4444'; // Negative - Red
    return '#D1D5DB'; // Neutral - Gray
};

// The API sends counts as strings on YouTube and numbers on news.
export const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

// News items arrive as a wall of article text with no title, so derive a headline
// from the opening sentence rather than showing a bare URL.
export const deriveTitle = (text, url) => {
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    if (clean) {
        const firstSentence = clean.split(/(?<=[.!?])\s/)[0] || clean;
        return firstSentence.length > 110 ? `${firstSentence.slice(0, 110).trim()}…` : firstSentence;
    }
    try {
        return decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop() || url)
            .replace(/[-_]+/g, ' ');
    } catch {
        return url;
    }
};

export const summarise = (text, limit = 260) => {
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean;
};

// Locations now arrive as names; fall back to the ISO map for older payloads.
export const getLocationName = (value) => {
    if (!value) return 'Unknown';
    if (countryMap[value]) return countryMap[value];
    if (value.length <= 3) return value.toUpperCase();
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Only some sources carry a location in their statistics. It may be a plain place
// name, an ISO code, or an object of place parts, so flatten it to one readable label.
export const formatLocation = (value) => {
    if (!value) return null;
    if (typeof value === 'object') {
        const parts = [value.city, value.region || value.state, value.country || value.name]
            .map(part => (typeof part === 'string' ? part.trim() : ''))
            .filter(Boolean);
        return parts.length ? formatLocation(parts.join(', ')) : null;
    }
    const clean = String(value).trim();
    if (!clean || clean.toLowerCase() === 'unknown') return null;
    return getLocationName(clean);
};

// A source is either the old bare URL string or the new object payload.
export const normaliseSource = (item, type) => {
    if (typeof item === 'string') {
        return {
            id: null,
            url: item,
            type,
            title: deriveTitle('', item),
            description: '',
            publishedAt: null,
            location: null,
            sentiment: null,
            tone: 'neutral',
            views: 0,
            likes: 0,
            comments: 0,
            engagement: 0
        };
    }

    const stats = item?.statistics || {};
    const sentiment = typeof stats.sentiment === 'number' ? stats.sentiment : null;
    const likes = toNumber(stats.likeCount);
    const comments = toNumber(stats.commentCount);

    return {
        id: item?.id || null,
        url: item?.url,
        type,
        title: item?.title || deriveTitle(item?.text, item?.url),
        description: summarise(item?.description || item?.text),
        publishedAt: item?.published_at || null,
        location: formatLocation(stats.location),
        sentiment,
        tone: toneOf(sentiment),
        views: toNumber(stats.viewCount),
        likes,
        comments,
        // News carries no likes or comments, so interactions are YouTube-driven.
        engagement: likes + comments
    };
};

// ---------------------------------------------------------------------------
// Date range presets
//
// Shared by the Sentiment landing page's duration picker and the board itself, so a
// range chosen before the search produces exactly the same window as the equivalent
// preset chosen once the board is open.
// ---------------------------------------------------------------------------

// dateChange holds the 1-based preset index, or this when the range was typed by hand.
export const CUSTOM_RANGE = 0;

export const DATE_PRESETS = [
    { value: 1, label: '1 Day', key: '1D' },
    { value: 2, label: '7 Days', key: '7D' },
    { value: 3, label: '30 Days', key: '30D' },
];

// Every preset ends today and counts backwards. An unknown index falls back to a day,
// which is the range the board has always opened on.
export const rangeForPreset = (preset) => {
    const endDate = new Date();
    const startDate = new Date(endDate);

    switch (preset) {
        case 2:
            startDate.setDate(endDate.getDate() - 7);
            break;
        case 3:
            startDate.setDate(endDate.getDate() - 30);
            break;
        default:
            startDate.setDate(endDate.getDate() - 1);
            break;
    }

    return { startDate, endDate };
};
