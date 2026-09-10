import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Progress display for sentiment analysis runs.
 *
 * The API has no progress channel and responses have been measured between ~20s
 * and ~200s depending on how much coverage a brand has, so this cannot report
 * real progress. Instead it reports *elapsed* work against the stages the
 * backend actually goes through, which is honest and keeps the page from
 * reading as frozen. The bar eases toward a ceiling and never reaches 100%
 * until the data lands.
 */

const STAGES = [
    { at: 0, label: 'Connecting to sources', detail: 'Opening news, YouTube and X feeds' },
    { at: 5, label: 'Searching coverage', detail: 'Matching mentions across every channel' },
    { at: 18, label: 'Collecting mentions', detail: 'Pulling articles, videos and posts' },
    { at: 40, label: 'Scoring sentiment', detail: 'Reading tone on each mention' },
    { at: 75, label: 'Extracting keywords', detail: 'Finding the words driving the conversation' },
    { at: 115, label: 'Aggregating channels', detail: 'Rolling up reach, engagement and regions' },
    { at: 155, label: 'Building your report', detail: 'Almost there — larger brands take longer' },
];

const CHANNELS = ['News', 'Twitter/X', 'YouTube'];

const PROGRESS_CEILING = 94;
// Time constant for the easing curve, in seconds. Tuned so a fast run (~20s)
// reads around a third done and a slow run (~200s) sits in the low nineties.
const PROGRESS_TAU = 55;

const formatElapsed = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${String(secs).padStart(2, '0')}s` : `${secs}s`;
};

const AnalysisLoader = ({ brands = [], context = 'report' }) => {
    const [elapsed, setElapsed] = useState(0);
    const startedAt = useRef(Date.now());

    useEffect(() => {
        startedAt.current = Date.now();
        setElapsed(0);

        const timer = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const stageIndex = useMemo(() => {
        const index = STAGES.findIndex((stage, i) => {
            const next = STAGES[i + 1];
            return elapsed >= stage.at && (!next || elapsed < next.at);
        });
        return index === -1 ? STAGES.length - 1 : index;
    }, [elapsed]);

    const progress = Math.min(
        PROGRESS_CEILING,
        PROGRESS_CEILING * (1 - Math.exp(-elapsed / PROGRESS_TAU))
    );

    const stage = STAGES[stageIndex];
    const brandLabel = brands.length > 1 ? brands.join(', ') : brands[0];

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="w-full bg-white rounded-[18px] shadow-sm px-6 py-10 md:px-10 md:py-12 flex flex-col items-center gap-8"
        >
            <span className="sr-only">
                {`Analyzing ${brandLabel || 'your search'}. ${stage.label}. ${formatElapsed(elapsed)} elapsed.`}
            </span>

            {/* Orb */}
            <div className="relative flex items-center justify-center w-[104px] h-[104px]" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-[#F48A1F] opacity-20 motion-safe:animate-pulseRing"></span>
                <span
                    className="absolute inset-0 rounded-full bg-[#F48A1F] opacity-20 motion-safe:animate-pulseRing"
                    style={{ animationDelay: '0.7s' }}
                ></span>
                <span
                    className="absolute inset-0 rounded-full bg-[#F48A1F] opacity-20 motion-safe:animate-pulseRing"
                    style={{ animationDelay: '1.4s' }}
                ></span>
                <span className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full bg-[#F48A1F]">
                    {/* Simple bar-chart mark, drawn rather than imported so the loader
                        has no icon dependency. */}
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 20V13" className="motion-safe:animate-dot" />
                        <path d="M10 20V6" className="motion-safe:animate-dot" style={{ animationDelay: '0.2s' }} />
                        <path d="M16 20V10" className="motion-safe:animate-dot" style={{ animationDelay: '0.4s' }} />
                        <path d="M22 20V4" className="motion-safe:animate-dot" style={{ animationDelay: '0.6s' }} />
                    </svg>
                </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col items-center gap-2 text-center">
                <p className="font-jost font-semibold text-[22px] text-[#101928]">
                    Analyzing {brandLabel || 'your search'}
                </p>
                <p className="font-jost text-sm text-[#667185] max-w-[520px]">
                    We&apos;re gathering every mention across news, YouTube and X, then scoring
                    the tone of each one. This usually takes under a minute, but brands with
                    heavy coverage can take a few.
                </p>
            </div>

            {/* Progress */}
            <div className="w-full max-w-[560px] flex flex-col gap-2">
                <div className="relative h-2 w-full rounded-full bg-[#F2F4F7] overflow-hidden">
                    <div
                        className="relative h-full rounded-full bg-[#F48A1F] transition-[width] duration-1000 ease-out overflow-hidden"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                    </div>
                </div>
                <div className="flex items-center justify-between font-jost text-xs text-[#98A2B3]">
                    <span>{formatElapsed(elapsed)} elapsed</span>
                    <span>Building {context}</span>
                </div>
            </div>

            {/* Stages */}
            <ol className="w-full max-w-[560px] flex flex-col gap-3">
                {STAGES.map((item, index) => {
                    const done = index < stageIndex;
                    const active = index === stageIndex;

                    return (
                        <li key={item.label} className="flex items-start gap-3">
                            <span
                                className={`mt-[3px] flex items-center justify-center w-[18px] h-[18px] rounded-full shrink-0 transition-colors ${
                                    done
                                        ? 'bg-[#1E5631]'
                                        : active
                                            ? 'bg-[#F48A1F]'
                                            : 'bg-[#E6E6E6]'
                                }`}
                            >
                                {done && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                )}
                                {active && <span className="w-[6px] h-[6px] rounded-full bg-white motion-safe:animate-pulse"></span>}
                            </span>

                            <div className="flex flex-col">
                                <span
                                    className={`font-jost text-sm leading-tight ${
                                        active ? 'text-[#101928] font-medium' : done ? 'text-[#667185]' : 'text-[#B0BEC5]'
                                    }`}
                                >
                                    {item.label}
                                    {active && (
                                        <span aria-hidden="true">
                                            <span className="inline-block motion-safe:animate-dot">.</span>
                                            <span className="inline-block motion-safe:animate-dot" style={{ animationDelay: '0.2s' }}>.</span>
                                            <span className="inline-block motion-safe:animate-dot" style={{ animationDelay: '0.4s' }}>.</span>
                                        </span>
                                    )}
                                </span>
                                {active && (
                                    <span className="font-jost text-xs text-[#98A2B3]">{item.detail}</span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>

            {/* Channels */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
                {CHANNELS.map((channel, index) => (
                    <span
                        key={channel}
                        className="font-jost text-xs text-[#667185] bg-[#F9FAFB] border border-[#E6E6E6] rounded-full px-3 py-1 flex items-center gap-2"
                    >
                        <span
                            className="w-[6px] h-[6px] rounded-full bg-[#F48A1F] motion-safe:animate-pulse"
                            style={{ animationDelay: `${index * 0.4}s` }}
                        ></span>
                        {channel}
                    </span>
                ))}
            </div>

            {elapsed >= 90 && (
                <p className="font-jost text-xs text-[#98A2B3] text-center max-w-[460px]">
                    Still working — this brand has a lot of coverage. Leave the tab open and the
                    report will appear as soon as it&apos;s ready.
                </p>
            )}
        </div>
    );
};

export default AnalysisLoader;
