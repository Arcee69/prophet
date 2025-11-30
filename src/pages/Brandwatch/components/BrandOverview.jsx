import React from 'react'
import Chart from 'react-apexcharts'
import { GoGlobe } from 'react-icons/go'
import { IoIosRadio } from 'react-icons/io'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { RiPieChartLine } from 'react-icons/ri';

const BrandOverview = ({ 
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
    mentionTab
}) => {

    const urlInfo = {
        "https://www.youtube.com/watch?v=ZYgkg-GYvp0": { title: "Ethiopia, Dangote Industries sign $2.5 billion deal for mega fertilizer plant", snippet: "The deal paves the way for a $2.5 billion fertilizer plant in Ethiopia's Somali region, powered by natural gas, with an annual production capacity of 3 million tons of urea, aiming to boost food security and position Ethiopia as a regional fertilizer powerhouse.", sentiment: "positive" },
        "https://www.youtube.com/watch?v=ygVvdTb9eis": { title: "Rewane Speaks On Dangote Refinery's First Gasoline Export To U.S.", snippet: "The video discusses Dangote Refinery's achievement of exporting its first gasoline cargo of 300,000 barrels to the United States, as reported by S&P Global, amidst Nigeria's challenges with fuel import dependence and foreign exchange shortages.", sentiment: "positive" },
        "https://www.youtube.com/watch?v=krYLjJMcEzU": { title: "US & Europe vs Dangote, Oil War: They Fear Africa's Big Win", snippet: "Lynient Akotonou reports on the growing clash between the U.S. and Europe and Aliko Dangote’s oil ambitions, unpacking why Western powers fear what could become Africa’s biggest win in the global energy market.", sentiment: "negative" },
        "https://tribuneonlineng.com/fuel-scarcity-imminent-as-nupeng-dangote-face-off-festers/": { title: "Fuel scarcity imminent as NUPENG, Dangote face-off festers", snippet: "Fuel scarcity imminent as the face-off between NUPENG and Dangote festers.", sentiment: "negative" },
        "https://www.jeuneafrique.com/1718701/economie-entreprises/qui-est-huaxin-cement-le-chinois-qui-veut-se-faire-une-place-parmi-les-rois-nigerians-du-ciment/": { title: "Qui est Huaxin Cement, le chinois qui veut se faire une place parmi les rois nigérians du ciment ?", snippet: "Huaxin Cement frappe un grand coup au Nigeria en reprenant la participation du Suisse Holcim in Lafarge Africa. L’opération, budgétée à 1 milliard de dollars, marque l’arrivée en force du cimentier chinois sur le premier marché du continent, terrain privilégié des rois de l’or gris, les deux milliardaires nigérians Aliko Dangote et Abdul Samad Rabiu.", sentiment: "neutral" },
        "https://businessday.ng/companies/article/whos-mairawani-business-tycoon-planning-600m-cement-plant-to-rival-dangote-bua/": { title: "Who’s Mairawani? Business tycoon planning $600m cement plant to rival Dangote, BUA", snippet: "Nigeria’s cement industry is set to have a new force with the announcement of a $600 million plant in Kebbi State by business tycoon Muazzam Mairawani, chairman of MSM Group, a move that’s considered to challenge market leaders such as Dangote and BUA Cement.", sentiment: "neutral" },
        "https://www.informationng.com/2025/09/phynas-late-sisters-remains-evacuated-by-dangote-group.html": { title: "Phyna’s Late Sister’s Remains Evacuated By Dangote Group", snippet: "The Dangote Group on Sunday sent representatives to collect the remains of Ruth Otabor, the younger sister of Big Brother Naija Season 7 winner Phyna, from the hospital where she passed on, as reported by PUNCH Metro.", sentiment: "negative" },
        "https://www.informationng.com/2025/09/dangote-tinubu-social-media-influencers-failed-ruth-otabor-verydarkman.html": { title: "Dangote, Tinubu, Social Media Influencers Failed Ruth Otabor – VeryDarkMan", snippet: "Nigerian social media commentator VeryDarkMan, has criticised key figures and institutions he believes failed Ruth Otabor, sister of former Big Brother Naija winner Phyna, who tragically died on Sunday after a road accident involving a Dangote truck.", sentiment: "negative" },
        "https://www.informationng.com/2025/09/dangote-group-mourns-death-of-phynas-sister-says-she-was-to-be-flown-to-india-for-treatment.html": { title: "Dangote Group Mourns Death Of Phyna's Sister, Says She Was To Be Flown To India For Treatment", snippet: "The Dangote Group has expressed grief over the death of Ruth Otabor, sister of Big Brother Naija Season 7 winner Phyna. Ruth died on Sunday after being involved in an accident with a Dangote truck in Auchi, Edo State.", sentiment: "negative" },
        "https://www.informationng.com/2025/08/phyna-loses-sister-ruth-otabor-weeks-after-dangotes-truck-accident.html": { title: "Phyna Loses Sister Ruth Otabor Weeks After Dangote’s Truck Accident", snippet: "Ruth Otabor, sister of Big Brother Naija Season 7 winner Phyna, has passed away. The family confirmed her passing on Sunday in a statement released by Eko Solicitors & Advocates, stating that Ruth departed for glory around 6:30 a.m.", sentiment: "negative" },
        "https://www.informationng.com/2025/08/were-ready-to-consider-all-options-dangote-group-assures-phyna-over-sisters-treatment.html": { title: "“We're Ready To Consider All Options” – Dangote Group Assures Phyna Over Sister’s Treatment", snippet: "Big Brother Naija season 7 winner, Phyna, has given a fresh update on her ongoing issue with the Dangote Group regarding her sister’s medical treatment. The reality TV star has been in the spotlight after her younger sister was struck by a truck belonging to the company on August 13, 2025, an accident that sadly led to the amputation of her left leg.", sentiment: "neutral" },
        "http://www.hiiraan.com/news4/2025/Aug/202705/ethiopia_dangote_group_ink_2_5_billion_deal_to_build_fertilizer_complex_in_gode_somali_region.aspx": { title: "Ethiopia, Dangote Group ink $2.5 billion deal to build fertilizer complex in Gode, Somali region", snippet: "Ethiopian Investment Holdings (EIH), the government’s strategic investment arm, and Dangote Group have signed a landmark shareholders’ agreement to develop and operate a $2.5 billion urea fertilizer production complex in Gode, Somali Regional State.", sentiment: "positive" },
        "https://www.thisdaylive.com/2025/08/29/dangote-group-ethiopia-strike-deal-to-build-2-5-billion-fertiliser-plant/": { title: "Dangote Group, Ethiopia Strike Deal to Build $2.5 Billion Fertiliser Plant", snippet: "The Dangote Group and Ethiopia government yesterday signed an agreement to build a $2.5 billion fertiliser manufacturing plant in the North-eastern African country, part of Nigerian billionaire Aliko Dangote’s efforts to end the continent’s fertiliser imports.", sentiment: "positive" }
      }
    
      const sources = summary1.sources || { youtube: [], twitter: [], news: [] }
      const allUrls = [...sources.youtube, ...sources.twitter, ...sources.news];
      const uniqueUrls = [...new Set(allUrls)];
    
      const topMentions = uniqueUrls?.map(url => ({
        url,
        type: url.includes('youtube') ? 'Youtube' : url.includes('twitter') ? 'Twitter' : 'News',
        ...(urlInfo[url] || { title: new URL(url).pathname, snippet: 'No description available', sentiment: 'neutral' })
      }))
    
    
    
      const filteredMentions = topMentions?.filter(m => mentionTab === 'All' || m.type === mentionTab)

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

export default BrandOverview