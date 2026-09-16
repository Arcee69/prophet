import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { IoLocationOutline } from 'react-icons/io5';

// Pages either side of the current one kept visible in the pager.
const PAGE_WINDOW = 1;

const SentimentTable = ({
    mentionTab,
    filteredMentions = [],
    loading,
    setMentionTab
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const listTopRef = useRef(null);

    // Reset to page 1 whenever the tab changes (different filtered data)
    useEffect(() => {
        setCurrentPage(1);
    }, [mentionTab]);

    const totalItems = filteredMentions.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // A new search can return fewer results than the page we were sitting on, which
    // used to leave the list rendering an empty slice with no way back.
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const safePage = Math.min(currentPage, totalPages);
    const firstItemIndex = (safePage - 1) * itemsPerPage;

    const currentData = filteredMentions.slice(firstItemIndex, firstItemIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === safePage) return;
        setCurrentPage(newPage);
        // Cards are tall, so a page change from the bottom would otherwise land the
        // user in the middle of the new page.
        listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Condensed page list: first, last, and a window around the current page, with
    // gaps collapsed. Rendering one button per page overflowed the row entirely once
    // a search returned a few hundred mentions.
    const pageItems = useMemo(() => {
        const items = [];
        for (let page = 1; page <= totalPages; page += 1) {
            const isEdge = page === 1 || page === totalPages;
            const isNearCurrent = page >= safePage - PAGE_WINDOW && page <= safePage + PAGE_WINDOW;
            if (isEdge || isNearCurrent) {
                items.push(page);
            } else if (items[items.length - 1] !== 'gap') {
                items.push('gap');
            }
        }
        return items;
    }, [safePage, totalPages]);

    const formatNumber = (num) => {
        const value = Number(num) || 0;
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
        return `${Math.round(value)}`;
    };

    const formatDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? null
            : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleExportCSV = () => {
        if (filteredMentions?.length === 0) return;

        const header = 'Type,Published,Location,URL,Title,Description,Sentiment,Score,Views,Likes,Comments\n';
        const rows = filteredMentions
            .map(item => {
                const clean = (value) => String(value ?? '').replace(/"/g, '""');
                return [
                    item.type,
                    item.publishedAt || '',
                    item.location || '',
                    item.url,
                    clean(item.title),
                    clean(item.description),
                    item.tone,
                    item.sentiment ?? '',
                    item.views,
                    item.likes,
                    item.comments
                ].map(value => `"${clean(value)}"`).join(',');
            })
            .join('\n');

        const csvContent = header + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'brand_mentions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Top Mentions */}
            <div className='flex flex-col  overflow-x-hidden gap-[11px]'>
                <div className='flex items-center justify-between gap-5'>

                    {/* Toggle for all, youtube and news */}
                    <div className='flex gap-2'>
                        <button
                            className={`px-4 py-2 border border-[#E2E8F0]  rounded-[10px] ${mentionTab === 'All' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setMentionTab('All')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 border border-[#E2E8F0] rounded-[10px] ${mentionTab === 'News' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setMentionTab('News')}
                        >
                            News
                        </button>
                        <button
                            className={`px-4 py-2 border border-[#E2E8F0]  rounded-[10px] ${mentionTab === 'Twitter' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setMentionTab('Twitter')}
                        >
                            Twitter
                        </button>
                        <button
                            className={`px-4 py-2 border border-[#E2E8F0] rounded-[10px] ${mentionTab === 'Youtube' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setMentionTab('Youtube')}
                        >
                            Youtube
                        </button>
                    </div>


                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none"
                        >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                            <option value={200}>200 per page</option>
                        </select>

                        <button
                            onClick={handleExportCSV}
                            disabled={totalItems === 0}
                            className="flex items-center gap-2 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg transition-colors"
                        >
                            <AiOutlineDownload className="w-5 h-5" />
                            <span className="text-base font-medium">Export CSV</span>
                        </button>
                    </div>

                </div>

                <div ref={listTopRef} className="scroll-mt-6"></div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-[#BFBFBF] h-[300px] rounded-lg"></div>
                        ))}
                    </div>
                ) : (

                    currentData?.length > 0 ? (
                        <div className='grid grid-cols-2 gap-4'>
                            {currentData?.map((mention, index) => (
                                <div key={index} className='bg-[#fff] h-auto flex items-start gap-3 px-[22px] py-[22px] rounded-lg'>
                                    {
                                        mention.type === 'Youtube' ?
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt={mention.type} className='w-[32px] h-[32px]' />
                                            :
                                            mention.type === 'Twitter' ?
                                                <img width="48" height="48" src="https://img.icons8.com/fluency/48/twitterx--v1.png" alt="twitterx--v1" />
                                                :
                                                <div className='w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#10B981] p-2'>
                                                    <p className='text-white font-jost font-semibold'>N</p>
                                                </div>
                                    }
                                    <div className='flex gap-3 flex-col w-full'>
                                        <div className='flex flex-col mt-1 gap-1'>
                                            <div className='flex items-center justify-between gap-2'>
                                                <p className='font-jost text-sm text-[#000000]'>{mention.type}</p>
                                                {formatDate(mention.publishedAt) && (
                                                    <p className='font-jost text-xs text-[#9CA3AF]'>
                                                        {formatDate(mention.publishedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {mention.type === "Youtube" && (
                                            <a href={mention.url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={`https://img.youtube.com/vi/${mention.id || new URL(mention.url).searchParams.get("v")}/hqdefault.jpg`}
                                                    alt={mention.title || "YouTube Thumbnail"}
                                                    className="w-full h-[200px] object-cover rounded-md"
                                                />
                                            </a>
                                        )}

                                        <a
                                            href={mention.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='font-jost font-semibold text-base text-[#1F2937] hover:text-[#F48A1F] leading-snug'
                                        >
                                            {mention.title || mention.url}
                                        </a>

                                        {mention.description && (
                                            <p className='font-jost text-sm text-[#6B7280] leading-relaxed'>
                                                {mention.description}
                                            </p>
                                        )}

                                        {(mention.views > 0 || mention.likes > 0 || mention.comments > 0) && (
                                            <div className='flex items-center gap-4 font-jost text-xs text-[#9CA3AF]'>
                                                {mention.views > 0 && <span>{formatNumber(mention.views)} views</span>}
                                                {mention.likes > 0 && <span>{formatNumber(mention.likes)} likes</span>}
                                                {mention.comments > 0 && <span>{formatNumber(mention.comments)} comments</span>}
                                            </div>
                                        )}

                                        <div className='flex items-center gap-3 flex-wrap'>
                                            {mention.sentiment !== null && mention.sentiment !== undefined && (
                                                <div className={`rounded-full px-3 py-1 ${mention.tone === 'positive' ? 'bg-[#DCFCE7]' : mention.tone === 'negative' ? 'bg-[#FFA8A8]' : 'bg-[#E5E7EB]'}`}>
                                                    <p className={`text-xs text-center font-inter capitalize ${mention.tone === 'positive' ? 'text-[#1E5631]' : mention.tone === 'negative' ? 'text-[#B91C1C]' : 'text-[#4B5563]'}`}>
                                                        {mention.tone} ({mention.sentiment.toFixed(2)})
                                                    </p>
                                                </div>
                                            )}
                                            {mention.location && (
                                                <span className='flex items-center gap-1 font-jost text-xs text-[#4B5563] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1'>
                                                    <IoLocationOutline className='w-3.5 h-3.5 text-[#F48A1F]' />
                                                    {mention.location}
                                                </span>
                                            )}
                                            {mention.brands?.length > 1 && (
                                                <span className='font-jost text-xs text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1'>
                                                    {mention.brands.join(' & ')}
                                                </span>
                                            )}
                                            <a href={mention.url} target="_blank" rel="noopener noreferrer" className='font-jost text-[#F48A1F] text-sm'>Details</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex items-center mt-5 justify-center'>
                            <p className='font-jost text-2xl text-[#6B7280] font-medium'>No Conversation Available</p>
                        </div>
                    )
                )}

                {/* Pagination - only show when needed */}
                {totalItems > 0 && (
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-8">
                        <p className="text-sm text-gray-600 whitespace-nowrap">
                            Showing {(firstItemIndex + 1).toLocaleString()} to{' '}
                            {Math.min(firstItemIndex + itemsPerPage, totalItems).toLocaleString()} of{' '}
                            {totalItems.toLocaleString()} mentions
                        </p>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-2 flex-wrap justify-center">
                                <button
                                    onClick={() => handlePageChange(safePage - 1)}
                                    disabled={safePage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {pageItems.map((item, index) => (
                                        item === 'gap' ? (
                                            <span
                                                key={`gap-${index}`}
                                                className="w-8 h-10 flex items-end justify-center text-gray-400 select-none"
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={item}
                                                onClick={() => handlePageChange(item)}
                                                aria-current={safePage === item ? 'page' : undefined}
                                                className={`min-w-10 h-10 px-2 rounded-lg transition-colors ${
                                                    safePage === item
                                                        ? 'bg-[#F48A1F] text-white'
                                                        : 'hover:bg-gray-100 border border-gray-300'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(safePage + 1)}
                                    disabled={safePage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Next
                                </button>

                                {/* Direct jump: with hundreds of pages, stepping through the
                                    window one click at a time is not practical. */}
                                {totalPages > 10 && (
                                    <div className="flex items-center gap-2 ml-2">
                                        <span className="text-sm text-gray-600 whitespace-nowrap">Go to</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={totalPages}
                                            value={safePage}
                                            onChange={(e) => handlePageChange(Number(e.target.value))}
                                            className="w-20 border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none"
                                        />
                                        <span className="text-sm text-gray-600 whitespace-nowrap">of {totalPages}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default SentimentTable;