import React, { useState, useEffect } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';

const SentimentTable = ({
    mentionTab,
    filteredMentions = [],
    loading,
    setMentionTab
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    // Reset to page 1 whenever the tab changes (different filtered data)
    useEffect(() => {
        setCurrentPage(1);
    }, [mentionTab]);

    const totalItems = filteredMentions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const currentData = filteredMentions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleExportCSV = () => {
        if (filteredMentions?.length === 0) return;

        const header = 'Type,URL,Title,Snippet,Sentiment\n';
        const rows = filteredMentions
            .map(item => {
                const title = (item.title || '').replace(/"/g, '""');
                const snippet = (item.snippet || '').replace(/"/g, '""');
                return `"${item.type}","${item.url}","${title}","${snippet}","${item.sentiment}"`;
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
                            className={`px-4 py-2 border border-[#E2E8F0] rounded-[10px] ${mentionTab === 'Youtube' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setMentionTab('Youtube')}
                        >
                            Youtube
                        </button>
                        <button
                            className={`px-4 py-2 border border-[#E2E8F0]  rounded-[10px] ${mentionTab === 'Twitter' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setMentionTab('Twitter')}
                        >
                            Twitter
                        </button>
                        <button
                            className={`px-4 py-2 border border-[#E2E8F0] rounded-[10px] ${mentionTab === 'News' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setMentionTab('News')}
                        >
                            News
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
                                <div key={index} className='bg-[#fff] h-auto flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
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
                                    <div className='flex gap-5 flex-col w-full'>
                                        <div className='flex flex-col mt-1 gap-1'>
                                            <div className='flex items-center gap-1'>
                                                <p className='font-jost text-sm text-[#000000]'>{mention.type}</p>
                                            </div>
                                        </div>
                                        {mention.type === "Youtube" ? (
                                            <a href={mention.url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={`https://img.youtube.com/vi/${new URL(mention.url).searchParams.get("v")}/hqdefault.jpg`}
                                                    alt="YouTube Thumbnail"
                                                    className="w-full h-[200px] object-cover rounded-md"
                                                />
                                            </a>
                                        ) : mention.type === "Twitter" ? (
                                            <a
                                                href={mention.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline break-words"
                                            >
                                                {mention.url}
                                            </a>
                                        ) : (
                                            <a
                                                href={mention.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline break-words"
                                            >
                                                {mention.url}
                                            </a>
                                        )}
                                        <div className='flex gap-5'>
                                            <div className={`w-[57px] h-[24px] rounded-full p-1 ${mention.sentiment === 'positive' ? 'bg-[#DCFCE7]' : mention.sentiment === 'negative' ? 'bg-[#FFA8A8]' : 'bg-[#D3D3D3]'}`}>
                                                <p className={`text-xs text-center font-inter ${mention.sentiment === 'positive' ? 'text-[#1E5631]' : mention.sentiment === 'negative' ? 'text-[#FF0000]' : 'text-[#808080]'}`}>{mention.sentiment}</p>
                                            </div>
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
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        <p className="text-sm text-gray-600">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-10 h-10 rounded-lg transition-colors ${
                                            currentPage === i + 1
                                                ? 'bg-[#F48A1F] text-white'
                                                : 'hover:bg-gray-100 border border-gray-300'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default SentimentTable;