import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { AiOutlineDownload } from 'react-icons/ai'
import { IoIosArrowDown } from 'react-icons/io'
import { api } from '../../../services/api'
import { appUrls } from '../../../services/urls'
import "react-datepicker/dist/react-datepicker.css";
import { GoGlobe } from 'react-icons/go';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import Logo from '../../../assets/png/logo.png';


import { CUSTOM_RANGE, getLocationName, getSentimentColor, normaliseSource, rangeForPreset } from '../../../utils/sentimentHelpers'
import SentimentBrand from './SentimentBrand'
import SentimentTable from './SentimentTable'
import AnalysisLoader from '../../../components/AnalysisLoader'
import SentimentReportDocument from './report/SentimentReportDocument'
import buildReportModel from './report/buildReportModel'
import ReputationReportDocument from './report/ReputationReportDocument'
import buildReputationModel from './report/buildReputationModel'
import buildReputationPayload, { REPUTATION_REPORT_TYPE } from './report/reputationPayload'
import { slugify } from './report/reportTheme'
import exportReportPdf from '../../../utils/exportReportPdf'



// The board holds the searched brand plus this many competitors.
const MAX_COMPARE_BRANDS = 3;

// The reports offered by the Generate Report dropdown.
const REPORT_TYPES = [
    { label: 'Reputation Intelligence', value: REPUTATION_REPORT_TYPE, available: true },
    { label: 'Competitive Intelligence', value: 'competitive_intelligence', available: false },
];

const IDLE_EXPORT = { active: false, kind: null, page: 0, total: 0 };

const BRAND_COLORS = ['#1E5631', '#FF4E4C', '#F48A1F', '#3B82F6'];
const colorAt = (index) => BRAND_COLORS[index % BRAND_COLORS.length];

// Channels shared by the volume chart and the per-channel sentiment breakdown.
const CHANNELS = [
    { key: 'youtube_sentiment', label: 'YouTube', color: '#FF4E4C' },
    { key: 'twitter_sentiment', label: 'Twitter/X', color: '#1DA1F2' },
    { key: 'news_sentiment', label: 'News', color: '#F48A1F' },
];

// Channel order on the Feeds "All" tab: News, then Twitter/X, then YouTube.
const typeOrder = { News: 0, Twitter: 1, Youtube: 2 };

const CHANNEL_TYPES = [
    { key: 'news', type: 'News' },
    { key: 'twitter', type: 'Twitter' },
    { key: 'youtube', type: 'Youtube' },
];

const Compare = ({ search, setSearchList, initialRange }) => {
    const [compareBrands, setCompareBrands] = useState([])
    const [compareBrandInput, setCompareBrandInput] = useState("");
    // Seeded from the duration picked on the landing page, so the board's first fetch
    // already covers the range the user asked for. Resetting these after mount would
    // fire a second request for the default day before the chosen range loaded.
    const [dateChange, setDateChange] = useState(initialRange?.preset ?? 1)
    const [startDate, setStartDate] = useState(() => initialRange?.startDate ?? rangeForPreset(1).startDate);
    const [endDate, setEndDate] = useState(() => initialRange?.endDate ?? rangeForPreset(1).endDate);
    const [summaries, setSummaries] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedMetric, setSelectedMetric] = useState('mentions');
    const [activeBrandIndex, setActiveBrandIndex] = useState(0);
    const [selectedSources, setSelectedSources] = useState(["youtube", "news", "twitter"]);
    const [activeTab, setActiveTab] = useState('Feeds');
    const [mentionTab, setMentionTab] = useState('All')
    const [showReportMenu, setShowReportMenu] = useState(false)

    // The main brand plus up to MAX_COMPARE_BRANDS competitors on the board.
    const brands = useMemo(
        () => [search, ...compareBrands].filter(Boolean),
        [search, compareBrands]
    );

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowReportMenu(false);
    };


    // A sentiment call takes ~20s, so results are cached per brand + filter combination.
    // Without this, adding a fourth brand would re-run the three already on the board.
    const resultCache = useRef(new Map());

    // The key each brand came back under in the sentiment response (e.g. "nnpc"). The
    // report API is sent the payload under that same key.
    const responseKeys = useRef(new Map());

    const reportMenuRef = useRef(null);

    useEffect(() => {
        if (!showReportMenu) return;

        const handleClickOutside = (event) => {
            if (reportMenuRef.current && !reportMenuRef.current.contains(event.target)) {
                setShowReportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showReportMenu]);

    useEffect(() => {
        if (brands.length === 0) return;

        // One request per brand: the API takes a single keyword1 per call, so the
        // board fans out and waits for the whole set before dropping the skeletons.
        let cancelled = false;
        const formatDate = (date) => date.toISOString().split('T')[0];
        const filterKey = `${[...selectedSources].sort().join(',')}|${formatDate(startDate)}|${formatDate(endDate)}`;

        const fetchSentiment = async (keyword) => {
            const cacheKey = `${keyword.toLowerCase()}|${filterKey}`;
            if (resultCache.current.has(cacheKey)) {
                return resultCache.current.get(cacheKey);
            }

            try {
                const res = await api.post(appUrls?.SENTIMENT_URL, {
                    "keyword1": keyword,
                    "sources": selectedSources ? selectedSources : "",
                    "start_date": formatDate(startDate),
                    "end_date": formatDate(endDate)
                })
                const [responseKey, summary = {}] = Object.entries(res?.data || {})[0] || []
                if (responseKey) responseKeys.current.set(keyword.toLowerCase(), responseKey)
                resultCache.current.set(cacheKey, summary)
                return summary
            } catch (err) {
                console.log(err)
                // Not cached: a failed brand should be retried, not stuck empty.
                return {}
            }
        }

        const run = async () => {
            setLoading(true)
            const results = await Promise.all(brands.map(fetchSentiment))
            if (cancelled) return;
            setSummaries(results)
            setLoading(false)
        }

        run()

        return () => { cancelled = true }
    }, [brands, selectedSources, startDate, endDate])

    // Keep the brand toggles pointing at a brand that still exists.
    useEffect(() => {
        if (activeBrandIndex > brands.length - 1) setActiveBrandIndex(0)
    }, [brands, activeBrandIndex])

    const summaryAt = useCallback((index) => summaries[index] || {}, [summaries])
    const summary1 = summaryAt(0)
    const hasCompare = brands.length > 1

    const addCompareBrand = () => {
        const value = compareBrandInput.trim();
        if (!value) return;
        if (compareBrands.length >= MAX_COMPARE_BRANDS) return;
        // Ignore a brand already on the board (case-insensitive).
        if (brands.some(b => b.toLowerCase() === value.toLowerCase())) {
            setCompareBrandInput("");
            return;
        }
        setCompareBrands(prev => [...prev, value]);
        setCompareBrandInput("");
    };

    const removeCompareBrand = (name) => {
        setCompareBrands(prev => prev.filter(b => b !== name));
    };

    const getSentimentPercentages = (summary) => {
        const score = summary.average_score || 0;
        let positive = 0;
        let negative = 0;
        let neutral = 100;
        if (score > 0.1) {
            positive = Math.round((score + 1) / 2 * 100);
            neutral = 100 - positive;
            negative = 0;
        } else if (score < -0.1) {
            negative = Math.round((-score + 1) / 2 * 100);
            neutral = 100 - negative;
            positive = 0;
        } else {
            neutral = 100;
        }
        return { positive, negative, neutral };
    }




    const mentionsData = brands.map((name, index) => ({
        name,
        value: summaryAt(index).summary?.total_mentions || 0,
        color: colorAt(index)
    }));

    const reachData = brands.map((name, index) => ({
        name,
        value: summaryAt(index).summary?.total_reach ?? summaryAt(index).summary?.estimated_reach ?? 0,
        color: colorAt(index)
    }));

    const sentimentChartData = brands.map((name, index) => {
        const sent = getSentimentPercentages(summaryAt(index).summary || {});
        return { name, positive: sent.positive, negative: sent.negative, neutral: sent.neutral };
    });



    // Add date range presets
    const handleDateChange = (presetIndex) => {
        const { startDate: newStart, endDate: newEnd } = rangeForPreset(presetIndex);

        setStartDate(newStart);
        setEndDate(newEnd);
        setDateChange(presetIndex);
    };

    // Picking a date by hand drops out of the presets, so the highlight moves
    // off the D/M pills and onto the custom range itself.
    const handleCustomStartDate = (date) => {
        setStartDate(date);
        setDateChange(CUSTOM_RANGE);
    };

    const handleCustomEndDate = (date) => {
        setEndDate(date);
        setDateChange(CUSTOM_RANGE);
    };

    const isCustomRange = dateChange === CUSTOM_RANGE;

    // const handleDateChange = (value) => {
    //     setDateChange(value)
    // }


    const metricOptions = [
        { value: 'mentions', label: 'Total Mentions' },
        { value: 'engagement', label: 'Engagement' },
        { value: 'reach', label: 'Potential Reach' },
        { value: 'news', label: 'News Mentions' },
        { value: 'youtube', label: 'YouTube Mentions' },
        { value: 'twitter', label: 'Twitter Mentions' },
    ];

    // Every source the API returned, per brand, in one normalised shape.
    const mentionsByBrand = useMemo(
        () => brands.map((_, index) => {
            const sources = summaryAt(index).sources || {};
            return CHANNEL_TYPES.flatMap(({ key, type }) =>
                (sources[key] || []).map(item => normaliseSource(item, type))
            ).filter(mention => mention.url);
        }),
        [brands, summaryAt]
    );

    // Line Chart Data - built from each mention's published_at date. This used to be
    // fabricated by spreading the totals across 30 days with a random factor; the API
    // now returns real per-item dates, so the curve reflects actual activity.
    const lineChartData = useMemo(() => {
        const dayKey = (value) => {
            if (!value) return null;
            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
        };

        // Union of every day any brand was mentioned, ascending.
        const allDays = [...new Set(
            mentionsByBrand.flat().map(mention => dayKey(mention.publishedAt)).filter(Boolean)
        )].sort();

        const metricValue = (mention) => {
            if (selectedMetric === 'reach') return mention.views;
            if (selectedMetric === 'engagement') return mention.engagement;
            if (selectedMetric === 'mentions') return 1;
            // Per-channel metrics: count only that channel's mentions.
            const channel = { youtube: 'Youtube', twitter: 'Twitter', news: 'News' }[selectedMetric];
            return mention.type === channel ? 1 : 0;
        };

        const series = brands.map((name, index) => {
            const totals = new Map(allDays.map(day => [day, 0]));
            (mentionsByBrand[index] || []).forEach(mention => {
                const day = dayKey(mention.publishedAt);
                if (day === null || !totals.has(day)) return;
                totals.set(day, totals.get(day) + metricValue(mention));
            });
            return { name, data: allDays.map(day => Math.round(totals.get(day))) };
        });

        const dates = allDays.map(day => {
            const date = new Date(day);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        const metricLabels = {
            mentions: 'Total Mentions',
            youtube: 'YouTube Mentions',
            twitter: 'Twitter Mentions',
            news: 'News Mentions',
            reach: 'Potential Reach',
            engagement: 'Engagement'
        };

        return {
            series,
            options: {
                chart: {
                    type: 'line',
                    toolbar: { show: false },
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: true,
                    position: 'top',
                },
                xaxis: {
                    categories: dates,
                    labels: {
                        rotate: -45,
                    }
                },
                yaxis: {
                    title: {
                        text: metricLabels[selectedMetric]
                    },
                    min: 0
                },
                colors: brands.map((_, index) => colorAt(index)),
                tooltip: {
                    y: {
                        formatter: function (value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        };
    }, [mentionsByBrand, brands, selectedMetric]);



    //Barchart - mention volume per channel, one bar group per brand
    const barChartData = useMemo(() => {
        let series = CHANNELS.map(channel => ({
            name: channel.label,
            data: brands.map((_, index) => summaryAt(index).summary?.[channel.key]?.mentions || 0)
        }));

        series = series.filter(s => s.data.reduce((a, b) => a + b, 0) > 0);

        const channelColors = CHANNELS.reduce((acc, c) => ({ ...acc, [c.label]: c.color }), {});

        return {
            series,
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: false,
                    toolbar: { show: false },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: true,
                    position: 'top',
                },
                xaxis: {
                    categories: brands,
                },
                colors: series.map(s => channelColors[s.name]),
            }
        };
    }, [summaryAt, brands]);


    // Sentiment breakdown per channel for the brand currently selected in the toggle.
    // The API returns an average score per channel (not raw positive/negative counts),
    // so the split is derived with the same formula used for the overall sentiment bar.
    const channelSentimentData = useMemo(() => {
        const summary = summaryAt(activeBrandIndex).summary || {};
        const mentions = mentionsByBrand[activeBrandIndex] || [];

        const channels = CHANNELS
            .map(channel => {
                const total = summary?.[channel.key]?.mentions || 0;
                if (total === 0) return null;

                // Per-item scores are exact but not always present (news is fully
                // scored, YouTube only partly). Use them when they cover enough of the
                // channel, otherwise fall back to the channel's average score.
                const items = mentions.filter(m => m.type === channel.type);
                const scored = items.filter(m => m.sentiment !== null);
                const coverage = items.length > 0 ? scored.length / items.length : 0;

                if (scored.length > 0 && coverage >= 0.5) {
                    const counts = { positive: 0, neutral: 0, negative: 0 };
                    scored.forEach(m => { counts[m.tone] += 1 });
                    const toPct = (n) => Math.round((n / scored.length) * 100);
                    return {
                        label: channel.label,
                        mentions: total,
                        basis: `${scored.length.toLocaleString()} scored mentions`,
                        positive: toPct(counts.positive),
                        neutral: toPct(counts.neutral),
                        negative: toPct(counts.negative)
                    };
                }

                return {
                    label: channel.label,
                    mentions: total,
                    basis: 'channel average score',
                    ...getSentimentPercentages(summary?.[channel.key] || {})
                };
            })
            .filter(Boolean);

        return {
            channels,
            series: [
                { name: 'Positive', data: channels.map(c => c.positive) },
                { name: 'Neutral', data: channels.map(c => c.neutral) },
                { name: 'Negative', data: channels.map(c => c.negative) },
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 300,
                    stacked: true,
                    stackType: '100%',
                    toolbar: { show: false },
                    fontFamily: 'Jost, sans-serif'
                },
                plotOptions: {
                    bar: { horizontal: true, barHeight: '55%' },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val) => (val > 8 ? `${Math.round(val)}%` : ''),
                    style: { fontSize: '12px', colors: ['#fff'] }
                },
                legend: { show: true, position: 'top' },
                xaxis: {
                    categories: channels.map(c => c.label),
                    labels: { formatter: (val) => `${Math.round(val)}%` },
                    max: 100
                },
                colors: ['#1E5631', '#BFBFBF', '#FF4E4C'],
                tooltip: {
                    y: {
                        formatter: (val, { dataPointIndex }) =>
                            `${Math.round(val)}%  (${(channels[dataPointIndex]?.mentions || 0).toLocaleString()} mentions)`
                    }
                }
            }
        };
    }, [summaryAt, mentionsByBrand, activeBrandIndex]);


    // Engagement totals per brand, from the per-item statistics the API now returns.
    const engagementTotals = useMemo(
        () => brands.map((name, index) => {
            const mentions = mentionsByBrand[index] || [];
            return {
                name,
                color: colorAt(index),
                views: mentions.reduce((sum, m) => sum + m.views, 0),
                likes: mentions.reduce((sum, m) => sum + m.likes, 0),
                comments: mentions.reduce((sum, m) => sum + m.comments, 0),
                value: mentions.reduce((sum, m) => sum + m.engagement, 0)
            };
        }),
        [brands, mentionsByBrand]
    );

    // Engagement tonality: how the audience's likes and comments split across
    // positive, neutral and negative coverage. Volume alone says a brand was talked
    // about; this says what tone the interaction actually landed on.
    const engagementTonality = useMemo(() => {
        const mentions = mentionsByBrand[activeBrandIndex] || [];
        const scored = mentions.filter(m => m.sentiment !== null);

        const buckets = { positive: 0, neutral: 0, negative: 0 };
        const mentionBuckets = { positive: 0, neutral: 0, negative: 0 };
        scored.forEach(m => {
            buckets[m.tone] += m.engagement;
            mentionBuckets[m.tone] += 1;
        });

        const totalEngagement = buckets.positive + buckets.neutral + buckets.negative;
        const tones = ['positive', 'neutral', 'negative'].map(tone => ({
            tone,
            engagement: buckets[tone],
            mentions: mentionBuckets[tone],
            share: totalEngagement > 0 ? Math.round((buckets[tone] / totalEngagement) * 100) : 0
        }));

        // Average interactions per mention, by tone - shows which tone actually pulls
        // a reaction rather than which one simply appears most often.
        const perMention = tones.map(t => ({
            ...t,
            intensity: t.mentions > 0 ? t.engagement / t.mentions : 0
        }));

        return {
            tones: perMention,
            totalEngagement,
            scoredCount: scored.length,
            totalCount: mentions.length,
            hasEngagement: totalEngagement > 0
        };
    }, [mentionsByBrand, activeBrandIndex]);




    // Word cloud is always the main brand. It used to follow activeBrandView, which is
    // owned by the Sentiment-by-Region toggle, so switching regions silently swapped the
    // cloud to a competitor's words with no visible control.
    const topWordsData = useMemo(() => {
        const data = summaryAt(0);

        const twitterPos = data?.top_words?.twitter?.positive || [];
        const twitterNeg = data?.top_words?.twitter?.negative || [];
        const youtubePos = data?.top_words?.youtube?.positive || [];
        const youtubeNeg = data?.top_words?.youtube?.negative || [];
        const newsPos = data?.top_words?.news?.positive || [];
        const newsNeg = data?.top_words?.news?.negative || [];

        // De-duplicate: the same word often tops more than one channel.
        const unique = (words) => [...new Set(words)];

        return {
            positive: unique([...twitterPos, ...youtubePos, ...newsPos]),
            negative: unique([...twitterNeg, ...youtubeNeg, ...newsNeg])
        };
    }, [summaryAt]);

    // Keywords driving the conversation, split by channel, for the main brand.
    const keywordsData = useMemo(() => {
        const topWords = summaryAt(0)?.top_words || {};

        return [
            { key: 'twitter', label: 'Twitter/X' },
            { key: 'youtube', label: 'YouTube' },
            { key: 'news', label: 'News' },
        ]
            .map(channel => ({
                label: channel.label,
                positive: topWords?.[channel.key]?.positive || [],
                negative: topWords?.[channel.key]?.negative || []
            }))
            .filter(channel => channel.positive.length > 0 || channel.negative.length > 0);
    }, [summaryAt]);

    // Sentiment by Region for the brand currently selected in the toggle
    const regionSentimentData = useMemo(() => {
        const data = summaryAt(activeBrandIndex);
        // Renamed from country_sentiments, and now keyed by readable place names
        // ("nigeria", "abu dhabi") instead of ISO codes. Comes back as an empty array
        // rather than an empty object when there is nothing to report.
        const regions = data?.location_sentiments?.news || data?.country_sentiments?.news || {};
        const entries = Array.isArray(regions) ? [] : Object.entries(regions);

        return entries.map(([name, regionData]) => ({
            name: getLocationName(name),
            mentions: regionData.mentions,
            score: regionData.average_score,
            color: getSentimentColor(regionData.average_score)
        })).sort((a, b) => b.mentions - a.mentions);
    }, [summaryAt, activeBrandIndex]);

    // Update donut chart options to use dynamic data
    const donutChartOptions = useMemo(() => ({
        chart: {
            type: 'donut',
            fontFamily: 'Jost, sans-serif'
        },
        labels: regionSentimentData.map(item => item.name),
        colors: regionSentimentData.map(item => item.color),
        legend: { show: false },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        name: { show: false },
                        value: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#1F2937',
                            formatter: function (val) {
                                return val.toLocaleString();
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#6B7280',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString();
                            }
                        }
                    }
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { width: 200 },
                legend: { position: 'bottom' }
            }
        }]
    }), [regionSentimentData]);

    const donutChartSeries = regionSentimentData.map(item => item.mentions);


    // Mentions across every brand on the board, de-duplicated by URL. The hardcoded
    // title/snippet lookup that used to live here is gone: the API now returns the
    // title, body text, publish date, statistics and per-item sentiment directly.
    const topMentions = useMemo(() => {
        const seen = new Map();

        mentionsByBrand.forEach((mentions, index) => {
            mentions.forEach(mention => {
                const existing = seen.get(mention.url);
                if (existing) {
                    // Same URL surfaced for more than one brand - record both.
                    if (!existing.brands.includes(brands[index])) existing.brands.push(brands[index]);
                    return;
                }
                seen.set(mention.url, { ...mention, brands: [brands[index]] });
            });
        });

        return [...seen.values()];
    }, [mentionsByBrand, brands]);

    const filteredMentions = useMemo(() => {
        const timeOf = (mention) => (mention.publishedAt ? new Date(mention.publishedAt).getTime() : 0);
        const hasSentiment = (mention) => typeof mention.sentiment === 'number';

        return topMentions
            ?.filter(m => mentionTab === 'All' || m.type === mentionTab)
            ?.slice()
            ?.sort((a, b) => {
                // Group by channel first so All reads News -> Twitter/X -> YouTube,
                // then scored mentions ahead of unscored ones, then newest first.
                const byChannel = (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
                if (byChannel !== 0) return byChannel;
                const bySentiment = Number(hasSentiment(b)) - Number(hasSentiment(a));
                if (bySentiment !== 0) return bySentiment;
                return timeOf(b) - timeOf(a);
            });
    }, [topMentions, mentionTab]);


    // ----------------------------------------------------------------------
    // PDF export
    //
    // The document is a purpose-built, print-laid-out deck rather than a capture of
    // this screen: the dashboard is interactive, its charts are sized for a browser
    // viewport, and its single-brand toggles hide half the board from anyone reading
    // the file. buildReportModel recomputes every figure for every brand so the deck
    // can stand on its own.
    // ----------------------------------------------------------------------

    // `kind` is 'analysis' for Export Analysis or 'reputation' for a generated report.
    const [exportState, setExportState] = useState(IDLE_EXPORT);
    const [reputationModel, setReputationModel] = useState(null);
    // The report type whose API request is in flight, if any.
    const [reportRequest, setReportRequest] = useState(null);
    const reportBusy = Boolean(reportRequest) || exportState.active;
    const reportDocRef = useRef(null);
    // Guards the capture against the progress updates below re-entering the effect.
    const exportRunning = useRef(false);

    const reportModel = useMemo(() => buildReportModel({
        brands,
        summaries,
        mentionsByBrand,
        startDate,
        endDate,
        colorAt,
        getLocationName,
    }), [brands, summaries, mentionsByBrand, startDate, endDate]);

    const handleDownloadPDF = () => {
        if (reportBusy || loading || brands.length === 0) return;
        // Mounting the off-screen document and capturing it are two separate commits:
        // the node has to exist and be laid out before html2canvas can read it.
        setExportState({ active: true, kind: 'analysis', page: 0, total: 0 });
    };

    // Reputation Intelligence covers the main brand only. The report service writes
    // the narrative from the brand's sentiment payload; the PDF is then laid out and
    // captured here, the same way as Export Analysis.
    const handleGenerateReport = async (reportType) => {
        if (!reportType.available || reportBusy || loading) return;

        const summary = summaryAt(0);
        if (Object.keys(summary).length === 0) {
            toast.error(`No sentiment data for ${search} yet. Run the analysis before generating a report.`);
            return;
        }

        setShowReportMenu(false);
        setReportRequest(reportType.value);

        // Captured now so a filter change mid-request cannot relabel the period.
        const period = { startDate, endDate };
        const brandKey = responseKeys.current.get(search.toLowerCase()) || search.toLowerCase();

        try {
            const res = await api.post(appUrls?.REPORTS_URL, buildReputationPayload(brandKey, summary));
            const model = buildReputationModel({ brand: search, summary, response: res?.data, ...period });

            if (!model.hasReport) {
                toast.error(res?.data?.message || 'The report service returned no report content. Please try again.');
                return;
            }

            setReputationModel(model);
            setExportState({ active: true, kind: 'reputation', page: 0, total: 0 });
        } catch (error) {
            console.error('Reputation report request failed', error);
            toast.error(error?.data?.message || 'Could not generate the report. Please try again.');
        } finally {
            setReportRequest(null);
        }
    };

    // Only `active` is a dependency: the per-page progress updates keep `active` true,
    // so this runs once per export rather than restarting on every page captured.
    useEffect(() => {
        if (!exportState.active || exportRunning.current) return;

        exportRunning.current = true;
        let mounted = true;

        const isReputation = exportState.kind === 'reputation';

        const run = async () => {
            try {
                await exportReportPdf(reportDocRef.current, {
                    fileName: isReputation
                        ? `${slugify(search)}-reputation-intelligence-report.pdf`
                        : `${slugify(brands.join(' vs '))}-sentiment-report.pdf`,
                    onProgress: ({ page, total }) => {
                        if (mounted) setExportState((prev) => ({ ...prev, page, total }));
                    }
                });
            } catch (error) {
                console.error(`${isReputation ? 'Reputation' : 'Sentiment'} report export failed`, error);
                if (isReputation) toast.error('The report was generated but the PDF could not be built. Please try again.');
            } finally {
                exportRunning.current = false;
                if (mounted) setExportState(IDLE_EXPORT);
            }
        };

        run();

        return () => { mounted = false };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exportState.active]);




    return (
        <div className='w-full flex flex-col gap-[32px]'>
            <div className='flex items-center justify-between'>
                <div onClick={() => setSearchList([])} className='w-[100px] flex cursor-pointer items-center justify-center p-3 rounded-lg bg-black'>
                    <p className='text-white text-lg font-jost'>Back</p>
                </div>

            </div>
            <div className='bg-[#fff] h-[88px] rounded-[8px] flex justify-between p-[25px]'>
                <p className='font-jost font-semibold text-[#1F2937] leading-[32px] text-[24px]'>{brands.join('  vs  ')}</p>
                <div className='flex gap-2 items-center'>
                    <button
                        type='button'
                        disabled={reportBusy || loading}
                        className={`${activeTab === 'Feeds' ? "hidden" : "flex bg-black disabled:bg-[#4B5563] disabled:cursor-wait p-2 rounded-lg items-center justify-center gap-1.5 cursor-pointer w-[185px] h-[40px]"}`}
                        onClick={handleDownloadPDF}
                    >
                        <AiOutlineDownload className='w-5 h-5 text-[#fff]' />
                        <p className='text-[#fff] text-base font-lato whitespace-nowrap'>
                            {exportState.kind === 'analysis'
                                ? `Building PDF${exportState.total ? ` ${exportState.page}/${exportState.total}` : '…'}`
                                : 'Export Analysis'}
                        </p>
                    </button>

                    <div className={`${activeTab === 'Feeds' ? 'hidden' : 'relative'}`} ref={reportMenuRef}>
                        <button
                            type='button'
                            disabled={reportBusy || loading}
                            className='flex bg-[#F48A1F] hover:bg-[#DB7A15] disabled:bg-[#F6B26B] disabled:cursor-wait p-2 rounded-lg items-center justify-center gap-1.5 cursor-pointer w-[180px] h-[40px]'
                            onClick={() => setShowReportMenu(prev => !prev)}
                        >
                            <p className='text-[#fff] text-base font-lato whitespace-nowrap'>
                                {reportRequest
                                    ? 'Generating…'
                                    : exportState.kind === 'reputation'
                                        ? `Building PDF${exportState.total ? ` ${exportState.page}/${exportState.total}` : '…'}`
                                        : 'Generate Report'}
                            </p>
                            {!reportBusy && (
                                <IoIosArrowDown className={`w-5 h-5 text-[#fff] transition-transform ${showReportMenu ? 'rotate-180' : ''}`} />
                            )}
                        </button>

                        {showReportMenu && (
                            <div className='absolute right-0 top-[46px] z-20 w-[240px] bg-[#fff] rounded-lg border border-[#E5E7EB] shadow-lg py-1'>
                                {REPORT_TYPES.map((reportType) => reportType.available ? (
                                    <button
                                        key={reportType.value}
                                        type='button'
                                        disabled={reportBusy || loading}
                                        className='w-full flex items-center justify-between gap-2 text-left px-4 py-2.5 font-lato text-sm text-[#1F2937] hover:bg-[#FDF3E7] disabled:text-[#9CA3AF] disabled:cursor-wait'
                                        onClick={() => handleGenerateReport(reportType)}
                                    >
                                        <span>{reportType.label}</span>
                                    </button>
                                ) : (
                                    <button
                                        key={reportType.value}
                                        type='button'
                                        disabled
                                        aria-disabled='true'
                                        title='Not available yet'
                                        className='w-full flex items-center justify-between gap-2 text-left px-4 py-2.5 font-lato text-sm text-[#9CA3AF] cursor-not-allowed'
                                    >
                                        <span>{reportType.label}</span>
                                        <span className='text-[10px] uppercase tracking-wide text-[#9CA3AF] bg-[#F3F4F6] rounded px-1.5 py-0.5'>Soon</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex items-start w-full gap-[15px]'>
                <div className='bg-[#fff] w-6/12 rounded-[8px] py-[14px] px-[17px] flex flex-col gap-3'>
                    <div className='flex items-center justify-between'>
                        <p className='text-[18px] font-lato text-[#263238]'>{search}</p>
                        <span className='font-lato text-xs text-[#6B7280] bg-[#F9FAFB] rounded-full px-2 py-1'>Main brand</span>
                    </div>
                    {compareBrands.length > 0 && (
                        <div className='flex flex-wrap items-center gap-2'>
                            {compareBrands.map((brand, index) => (
                                <div
                                    key={brand}
                                    className='flex items-center gap-2 rounded-full pl-3 pr-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB]'
                                >
                                    <span
                                        className='w-2 h-2 rounded-full'
                                        style={{ backgroundColor: colorAt(index + 1) }}
                                    ></span>
                                    <p className='font-lato text-sm text-[#263238]'>{brand}</p>
                                    <button
                                        type='button'
                                        aria-label={`Remove ${brand}`}
                                        className='font-lato text-base text-[#9CA3AF] hover:text-[#EF4444] leading-none px-1'
                                        onClick={() => removeCompareBrand(brand)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='bg-[#fff] w-6/12 rounded-[8px] py-[14px] px-[17px] flex flex-col gap-2'>
                    <div className='flex items-center'>
                        <input
                            type='text'
                            placeholder={
                                compareBrands.length >= MAX_COMPARE_BRANDS
                                    ? `Limit of ${MAX_COMPARE_BRANDS} comparison brands reached`
                                    : 'Compare with another brand'
                            }
                            disabled={compareBrands.length >= MAX_COMPARE_BRANDS}
                            className='w-full outline-none font-lato text-[#F48A1F] text-[18px] disabled:text-[#9CA3AF] disabled:cursor-not-allowed'
                            value={compareBrandInput}
                            onChange={(e) => setCompareBrandInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCompareBrand()}
                        />
                        <button
                            type='button'
                            disabled={compareBrands.length >= MAX_COMPARE_BRANDS || !compareBrandInput.trim()}
                            className='bg-[#F48A1F] disabled:bg-[#E5E7EB] w-[116px] h-[41px] rounded-[5px] flex items-center justify-center py-2.5'
                            onClick={addCompareBrand}
                        >
                            <p className='font-lato text-[18px] text-[#FFFFFF]'>Compare</p>
                        </button>
                    </div>
                    <p className='font-lato text-xs text-[#6B7280]'>
                        {compareBrands.length} of {MAX_COMPARE_BRANDS} comparison brands added
                    </p>
                </div>
            </div>

            <div className='bg-[#fff] rounded-[8px] flex flex-col p-6 gap-2 w-full'>
                <div className='flex items-center justify-between'>
                    <p className='font-lato text-base font-semibold text-[#1F2937]'>Filters</p>
                    <p className='font-lato invisible text-[#E57E46] text-sm'>Clear All</p>
                </div>
                <div className='flex gap-4 justify-between items-center'>
                    <div className='bg-[#F9FAFB] w-[181px] h-[36px] rounded-[8px] p-2 flex items-center gap-2'>
                        <GoGlobe className='w-5 h-5 text-[#374151]' />
                        <select
                            className='outline-none w-full h-auto bg-transparent'
                            value={selectedSources.join(',')} // Display as comma-separated
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setSelectedSources(["youtube", "news", "twitter"]);
                                } else {
                                    setSelectedSources([value]);
                                }
                            }}
                        >
                            <option value="">All sources</option>
                            <option value="youtube">YouTube only</option>
                            <option value="news">News only</option>
                            <option value="twitter">Twitter only</option>
                        </select>
                    </div>

                    <div className="bg-[#F9FAFB] w-[350px] h-[36px] rounded-[8px] px-[26px] py-2 flex items-center gap-1">
                        {/* Date Range Options */}
                        <div className="flex items-center w-5/12 gap-[5px]">
                            {["1D", "7D", "30D"].map((label, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer rounded-full p-1 flex items-center justify-center ${dateChange === index + 1 ? "bg-[#F48A1F]" : ""
                                        }`}
                                    onClick={() => handleDateChange(index + 1)}
                                >
                                    <p
                                        className={`text-sm font-lato ${dateChange === index + 1 ? "text-[#FFFFFF]" : "text-[#546E7A]"
                                            }`}
                                    >
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Date Picker */}
                        <div
                            className={`w-6/12 flex items-center ml-10 justify-end gap-2 rounded-full px-2 py-1 ${isCustomRange ? "bg-[#F48A1F]" : ""
                                }`}
                        >
                            <FaRegCalendarAlt className={isCustomRange ? "text-[#FFFFFF]" : "text-[#546E7A]"} />
                            <DatePicker
                                selected={startDate}
                                onChange={handleCustomStartDate}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="dd/MM/yy"
                                className={`bg-transparent w-[80px] text-sm text-center outline-none ${isCustomRange ? "text-[#000]" : "text-[#546E7A]"
                                    }`}
                            />
                            <span className={isCustomRange ? "text-[#FFFFFF]" : "text-[#546E7A]"}>-</span>
                            <DatePicker
                                selected={endDate}
                                onChange={handleCustomEndDate}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="dd/MM/yy"
                                className={`bg-transparent w-[80px] text-sm text-center outline-none ${isCustomRange ? "text-[#000]" : "text-[#546E7A]"
                                    }`}
                            />
                        </div>
                    </div>


                </div>
            </div>

            <div className='flex gap-2'>
                <button
                    className={`px-4 py-2 border border-[#E2E8F0] text-xl rounded-[10px] ${activeTab === 'Feeds' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => handleTabChange('Feeds')}
                >
                    Feeds
                </button>
                <button
                    className={`px-4 py-2 border border-[#E2E8F0] text-xl rounded-[10px] ${activeTab === 'Overview' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => handleTabChange('Overview')}
                >
                    Metrics
                </button>
            </div>

            {/* One coherent progress view while the request is in flight, rather than
                per-card placeholders - a run can take a couple of minutes. */}
            {loading && <AnalysisLoader brands={brands} context={activeTab === 'Feeds' ? 'the feed' : 'the metrics'} />}

            {!loading && activeTab === 'Feeds' && (
                <SentimentTable 
                    summary1={summary1}
                    mentionTab={mentionTab}
                    filteredMentions={filteredMentions}
                    loading={loading}
                    setMentionTab={setMentionTab}
                />
            )}

            {!loading && activeTab === 'Overview' && (
                <SentimentBrand
                    loading={loading}
                    mentionsData={mentionsData}
                    engagementData={engagementTotals}
                    engagementTonality={engagementTonality}
                    reachData={reachData}
                    sentimentChartData={sentimentChartData}
                    barChartData={barChartData}
                    lineChartData={lineChartData}
                    selectedMetric={selectedMetric}
                    setSelectedMetric={setSelectedMetric}
                    summary1={summary1}
                    donutChartOptions={donutChartOptions}
                    donutChartSeries={donutChartSeries}
                    regionSentimentData={regionSentimentData}
                    activeBrandIndex={activeBrandIndex}
                    setActiveBrandIndex={setActiveBrandIndex}
                    hasCompare={hasCompare}
                    brands={brands}
                    colorAt={colorAt}
                    channelSentimentData={channelSentimentData}
                    selectedMetricOptions={metricOptions}
                    keywordsData={keywordsData}
                    topWordsData={topWordsData}
                    search={search}
                    filteredMentions={filteredMentions}
                    mentionTab={mentionTab}
                    setMentionTab={setMentionTab}
                />
            )}

            {/* Parked off-screen rather than hidden: html2canvas measures a real laid-out
                node, so `display: none` or zero opacity would capture nothing. */}
            {exportState.active && (
                <div
                    aria-hidden='true'
                    style={{ position: 'absolute', left: '-20000px', top: 0, width: 794, pointerEvents: 'none' }}
                >
                    {exportState.kind === 'reputation' ? (
                        <ReputationReportDocument ref={reportDocRef} model={reputationModel} logo={Logo} />
                    ) : (
                        <SentimentReportDocument ref={reportDocRef} model={reportModel} logo={Logo} />
                    )}
                </div>
            )}

        </div>
    )
}

Compare.propTypes = {
    search: PropTypes.string.isRequired,
    setSearchList: PropTypes.func.isRequired,
    initialRange: PropTypes.shape({
        preset: PropTypes.number,
        startDate: PropTypes.instanceOf(Date),
        endDate: PropTypes.instanceOf(Date),
    }),
}

export default Compare