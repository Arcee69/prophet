import React from 'react'
import Chart from 'react-apexcharts'
import { GoGlobe } from 'react-icons/go'
import { IoIosRadio } from 'react-icons/io'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { RiPieChartLine } from 'react-icons/ri';

const BrandMetrics = ({ 
    reportRef,
    loading,
    mentionsData,
    engagementData,
    reachData,
    sentimentChartData,
    summary1,
    barChartData,
    lineChartData,
    selectedMetric,
    setSelectedMetric,
    regionSentimentData,
    donutChartOptions,
    donutChartSeries,
    state,
    setActiveBrandView,
    topWordsData,
    mentionTab,
    setMentionTab,
    filteredMentions
}) => {


    const formatter = new Intl.NumberFormat('en-US');

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num;
    }
  };

    const SkeletonCard = () => (
        <div className="animate-pulse flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl h-[362px] w-full">
            <div className="h-6 bg-[#E5E7EB] rounded w-1/4 mb-4"></div>
            <div className="h-full bg-[#E5E7EB] rounded"></div>
        </div>
    );

    const labelFormatter = (val) => val > 0 ? `${val}%` : '';

    return (
        <>
            <div ref={reportRef}>
                <div className='grid grid-cols-3 gap-4'>
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        <>
                            <div className='flex flex-col justify-between p-4 bg-white rounded-lg h-[200px] shadow-md'>
                                <p className='font-jost text-2xl font-semibold text-[#252F3D]'>Total Mentions</p>
                                <div className='flex items-center justify-between'>
                                    {mentionsData?.map((item, index) => (
                                        <div key={index} className='flex flex-col gap-1.5'>
                                            <p className={`font-jost font-medium text-xl`} style={{ color: item.color }}>{formatter.format(item.value)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='flex flex-col justify-between p-4 bg-white rounded-lg h-[200px] shadow-md'>
                                <p className='font-jost text-2xl font-semibold text-[#252F3D]'>Total Engagement</p>
                                <div className='flex items-center justify-between'>
                                    {engagementData?.map((item, index) => (
                                        <div key={index} className='flex flex-col gap-1.5'>
                                            <p className={`font-jost font-medium text-xl`} style={{ color: item.color }}>{formatter.format(item.value)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='flex flex-col justify-between p-4 bg-white rounded-lg h-[200px] shadow-md'>
                                <p className='font-jost text-2xl font-semibold text-[#252F3D]'>Estimated  Reach</p>
                                <div className='flex items-center justify-between'>
                                    {reachData?.map((item, index) => (
                                        <div key={index} className='flex flex-col gap-1.5'>
                                            <p className={`font-jost font-medium text-xl`} style={{ color: item.color }}>{formatter.format(item.value)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                </div>

                <div className="flex flex-col mt-5 gap-4">
                    <div className="flex items-center gap-4">
                        {loading ? (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        ) : (
                            <>
                                <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Total Mentions</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={mentionsData}
                                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                                            >
                                                <XAxis type="category" dataKey="name" />
                                                <YAxis type="number" domain={[0, 'dataMax']} tickFormatter={formatNumber} />
                                                <Tooltip formatter={formatNumber} />
                                                <Bar dataKey="value" fill="#FF4E4C">
                                                    <LabelList dataKey="value" position="top" formatter={formatNumber} />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Engagement</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={engagementData}
                                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                                            >
                                                <XAxis type="category" dataKey="name" />
                                                <YAxis type="number" domain={[0, 'dataMax']} tickFormatter={formatNumber} />
                                                <Tooltip formatter={formatNumber} />
                                                <Bar dataKey="value">
                                                    {engagementData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill="#F97316" />
                                                    ))}
                                                    <LabelList dataKey="value" position="top" formatter={formatNumber} />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {loading ? (
                            <SkeletonCard />
                        ) : (
                            <div className="h-[362px] w-full flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <RiPieChartLine className='w-5 h-5 text-[#F48A1F]' />
                                        <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Sentiment</p>
                                    </div>
                                    <div className='flex items-center gap-2'>

                                        <div className='flex items-center gap-1'>
                                            <div className='bg-[#1E5631] w-2 h-2 rounded-full'></div>
                                            <p className='font-jost text-black text-xs leading-[100%]'>Positive</p>
                                        </div>

                                        <div className='flex items-center gap-1'>
                                            <div className='bg-[#DEDEDE] w-2 h-2 rounded-full'></div>
                                            <p className='font-jost text-black text-xs leading-[100%]'>Neutral</p>
                                        </div>

                                        <div className='flex items-center gap-1'>
                                            <div className='bg-[#FF4E4C] w-2 h-2 rounded-full'></div>
                                            <p className='font-jost text-black text-xs leading-[100%]'>Negative</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="w-full h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            // layout="vertical"
                                            data={sentimentChartData}
                                            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                                        >
                                            {/* <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                                              <YAxis type="category" dataKey="name" width={100} /> */}
                                            <XAxis type="category" dataKey="name" position="top" />
                                            <YAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                                            <Tooltip formatter={(value) => `${value}%`} />
                                            <Bar dataKey="positive" stackId="a" fill="#1E5631">
                                                <LabelList dataKey="positive" fill='#fff' position="center" formatter={labelFormatter} />
                                            </Bar>
                                            <Bar dataKey="neutral" stackId="a" fill="#DEDEDE">
                                                <LabelList dataKey="neutral" fill='#fff' position="center" formatter={labelFormatter} />
                                            </Bar>
                                            <Bar dataKey="negative" stackId="a" fill="#FF4E4C">
                                                <LabelList dataKey="negative" fill='#fff' position="center" formatter={labelFormatter} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                {/* Charts Row */}
                <div className='flex gap-4 mt-4'>
                    {/* Potent Reach Chart */}
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        <>
                            <div className="h-full w-1/2 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Potential Reach</p>
                                    </div>
                                </div>
                                <div className="w-full h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={reachData}
                                            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                                        >
                                            <XAxis type="category" dataKey="name" />
                                            <YAxis type="number" domain={[0, 'dataMax']} tickFormatter={formatNumber} />
                                            <Tooltip formatter={formatNumber} />
                                            <Bar dataKey="value">
                                                {reachData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill="#4D9EFF" />
                                                ))}
                                                <LabelList dataKey="value" position="top" formatter={formatNumber} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>


                            {/* Channel Sentiment Distribution (Bar Chart) */}
                            <div className='bg-white rounded-[18px] w-1/2 p-4 shadow-sm'>
                                <div className='flex items-start justify-between'>
                                    <p className='font-jost font-medium text-[20px] mb-4 text-[#4B5563]'>
                                        Channel Sentiment Distribution
                                    </p>
                                    <p className='text-[#6B7280] font-jost text-sm'>Total Mentions: {summary1.summary?.total_mentions || 0}</p>
                                </div>
                                <Chart
                                    options={barChartData.options}
                                    series={barChartData.series}
                                    type='bar'
                                    height={300}
                                />
                            </div>
                        </>
                    )}
                </div>

                {loading ? (
                    <div className="animate-pulse bg-[#BFBFBF] h-[362px] w-full rounded-xl"></div>
                ) : (
                    <div className='bg-white rounded-[18px] mt-4 w-full p-4 shadow-sm'>
                        <div className='flex justify-between items-start mb-4'>
                            <p className='font-jost font-medium text-[20px] text-[#4B5563]'>
                                Results Over Time
                            </p>
                            <select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className='font-jost text-[#252F3D] text-sm cursor-pointer bg-transparent border border-gray-300 rounded px-3 py-1 outline-none'
                            >
                                <option value="mentions">Total Mentions</option>
                                {/* <option value="youtube">YouTube Mentions</option>
                                        <option value="twitter">Twitter Mentions</option>
                                        <option value="news">News Mentions</option> */}
                                {/* <option value="reach">Potential Reach</option> */}
                            </select>
                        </div>
                        <Chart
                            options={lineChartData.options}
                            series={lineChartData.series}
                            type='line'
                            height={300}
                        />
                    </div>
                )}

                {/* Sentiment Demographics */}
                <p className='font-jost text-[#101828] my-5 leading-[30px] text-[20px]'>Demographics</p>
                <div className="flex items-center gap-4 mt-4">
                    {loading ? (
                        <div className="animate-pulse bg-[#BFBFBF] h-[362px] w-full rounded-xl"></div>
                    ) : (
                        <div className="h-auto w-full flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold font-jost text-[#6B7280] text-[20px]">Sentiment by Region</p>
                                </div>

                                {/* Brand Toggle */}
                                <div className="flex items-center gap-2 bg-GREY-_300 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveBrandView('primary')}
                                        className={
                                            `px-4 py-2 rounded-md text-sm font-medium transition-all bg-white shadow-sm text-[#1F2937]`
                                        }
                                    >
                                        {state?.brand !== null ? state?.brand?.name : state?.keyword}
                                    </button>

                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                                        <span className="font-jost text-[#6B7280]">Positive</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#D1D5DB]"></div>
                                        <span className="font-jost text-[#6B7280]">Neutral</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                                        <span className="font-jost text-[#6B7280]">Negative</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-[250px] flex items-center justify-center">
                                {regionSentimentData?.length > 0 ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Chart
                                            options={donutChartOptions}
                                            series={donutChartSeries}
                                            type="donut"
                                            height="100%"
                                            width="100%"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <GoGlobe className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <p className="font-jost text-[#6B7280] text-lg">
                                            No regional data available for {state?.brand !== null ? state?.brand?.name : state?.keyword}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Country names with mentions */}
                            {regionSentimentData?.length > 0 && (
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {regionSentimentData.slice(0, 10).map((region, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: region.color }}
                                                ></div>
                                                <span className="font-jost font-medium text-sm text-[#1F2937]">
                                                    {region.name}
                                                </span>
                                            </div>
                                            <span className="font-jost font-semibold text-sm text-[#6B7280]">
                                                {region.mentions.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Top Words */}
                <p className='font-jost text-[#101828] my-5 leading-[30px] text-[20px]'>Top Words</p>
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    <div className="flex items-center gap-4 mt-4">
                        <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center text-white text-xs font-bold">↑</span>
                                    <p className="font-semibold font-jost text-[#6B7280] text-[20px]">Positive Mentions</p>
                                </div>
                                {/* Brand Toggle */}
                                {/* <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveBrandView('primary')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${activeBrandView === 'primary'
                                    ? 'bg-white shadow-sm text-[#1F2937]'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {search}
                        </button>
                        {hasCompare && (
                            <button
                                onClick={() => setActiveBrandView('secondary')}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${activeBrandView === 'secondary'
                                        ? 'bg-white shadow-sm text-[#1F2937]'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {compareBrand}
                            </button>
                        )}
                    </div> */}
                            </div>
                            <div className="w-full h-[300px] overflow-auto flex flex-wrap justify-center items-center gap-4 p-6">
                                {topWordsData.positive.length > 0 ? (
                                    topWordsData.positive.slice(0, 15).map((word, index) => (
                                        <span
                                            key={word}
                                            className="font-jost font-bold text-[#10B981] inline-block px-3 py-2 "
                                            style={{
                                                fontSize: `${Math.max(14, 28 - index * 1)}px`,
                                                opacity: 1 - (index * 0.05)
                                            }}
                                        >
                                            {word}
                                        </span>
                                    ))
                                ) : (
                                    <p className="font-jost text-[#6B7280] text-lg">
                                        No positive words found for  {state?.brand !== null ? state?.brand?.name : state?.keyword}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center text-white text-xs font-bold">↓</span>
                                    <p className="font-semibold font-jost text-[#6B7280] text-[20px]">Negative Mentions</p>
                                </div>
                                {/* Brand Toggle - same as above */}
                                {/* <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                            <button
                                                onClick={() => setActiveBrandView('primary')}
                                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${activeBrandView === 'primary'
                                                        ? 'bg-white shadow-sm text-[#1F2937]'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {search}
                                            </button>
                                            {hasCompare && (
                                                <button
                                                    onClick={() => setActiveBrandView('secondary')}
                                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${activeBrandView === 'secondary'
                                                            ? 'bg-white shadow-sm text-[#1F2937]'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {compareBrand}
                                                </button>
                                            )}
                                        </div> */}
                            </div>
                            <div className="w-full h-[300px] overflow-auto flex flex-wrap justify-center items-center gap-4 p-6">
                                {topWordsData.negative?.length > 0 ? (
                                    topWordsData.negative?.slice(0, 15)?.map((word, index) => (
                                        <span
                                            key={word}
                                            className="font-jost font-bold text-[#EF4444] inline-block px-3 py-2"
                                            style={{
                                                fontSize: `${Math.max(14, 28 - index * 1)}px`,
                                                opacity: 1 - (index * 0.05)
                                            }}
                                        >
                                            {word}
                                        </span>
                                    ))
                                ) : (
                                    <p className="font-jost text-[#6B7280] text-lg">
                                        No negative words found for {state?.brand !== null ? state?.brand?.name : state?.keyword}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Mentions */}
                <div className='flex flex-col mt-10 gap-[11px]'>
                    <div className='flex items-center gap-5'>
                        <p className='font-jost font-semibold text-[18px]  text-[#6B7280]'>
                            Top Conversations
                        </p>

                        {/* Toggle for all, youtube and news */}
                        <div className='flex gap-2'>
                            <button
                                className={`px-4 py-2 rounded ${mentionTab === 'All' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setMentionTab('All')}
                            >
                                All
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${mentionTab === 'Youtube' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setMentionTab('Youtube')}
                            >
                                Youtube
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${mentionTab === 'Twitter' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setMentionTab('Twitter')}
                            >
                                Twitter
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${mentionTab === 'News' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setMentionTab('News')}
                            >
                                News
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

                        filteredMentions?.length > 0 ? (
                            <div className='grid grid-cols-2 gap-4'>
                                {filteredMentions?.map((mention, index) => (
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
                </div>

            </div>
        </>
    )
}

export default BrandMetrics