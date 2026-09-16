import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import MentionCard from './MentionCard';

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
                                <MentionCard key={index} mention={mention} />
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