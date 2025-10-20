import React, { useState, useEffect, useMemo, useRef } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { FaListUl } from 'react-icons/fa'
import { IoDocumentTextOutline, IoLocationOutline, IoTimeOutline } from 'react-icons/io5'
import Chart from 'react-apexcharts'
import { FiCheckCircle } from 'react-icons/fi'
import { GoGlobe, GoTag } from 'react-icons/go'
import { LuArchive, LuCalendarDays, LuShare2 } from 'react-icons/lu'
import { CiMenuKebab } from 'react-icons/ci'
import { IoIosRadio } from 'react-icons/io'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { api } from '../../../services/api'
import { appUrls } from '../../../services/urls'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RiPieChartLine } from 'react-icons/ri';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Logo from '../../../assets/png/logo.png';


//svgs
import Facebook from "../../../assets/svg/facebook.svg"
import Twitter from "../../../assets/svg/twitter.svg"
import Pinterest from "../../../assets/svg/pinterest.svg"
import Happy from "../../../assets/svg/happy.svg"
import Sad from "../../../assets/svg/sad.svg"
import Normal from "../../../assets/svg/normal.svg"
import { useNavigate } from 'react-router-dom'



const Compare = ({ search, setSearchList }) => {
    const [activeTab, setActiveTab] = useState(1)
    const [compareBrand, setCompareBrand] = useState("")
    const [compareBrandInput, setCompareBrandInput] = useState("");
    const [selectedTime, setSelectedTime] = useState("This Week")
    const [dateChange, setDateChange] = useState(1)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sentimentData, setSentimentData] = useState(null)
    const [sentimentData2, setSentimentData2] = useState(null)
    const [loading, setLoading] = useState(false)
    const [mentionTab, setMentionTab] = useState('All')
    const [selectedMetric, setSelectedMetric] = useState('mentions');

    console.log(sentimentData, "sentimentData")
    console.log(sentimentData2, "sentimentData2")


    const navigate = useNavigate()

    useEffect(() => {
        const fetchSentiment = async (keyword, isSecond = false) => {
            if (!keyword) return;
            const data = { "keyword1": keyword }
            setLoading(true)
            try {
                const res = await api.post(appUrls?.SENTIMENT_URL, data)
                console.log(res, "pick")
                if (isSecond) {
                    setSentimentData2(res?.data)
                } else {
                    setSentimentData(res?.data)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        if (search) {
            fetchSentiment(search)
        }
        if (compareBrand) {
            fetchSentiment(compareBrand, true)
        } else {
            setSentimentData2(null);
        }
    }, [search, compareBrand])

    const summary1 = sentimentData ? Object.values(sentimentData)[0] || {} : {}
    const summary2 = sentimentData2 ? Object.values(sentimentData2)[0] || {} : {}
    const hasCompare = !!compareBrand && !!sentimentData2

    console.log(summary1, "summarypopo")

    const brandColors = {
        primary: '#1E5631', // Green for main brand
        secondary: '#FF4E4C', // Red for comparison brand
        default: '#1E5631' // Default color
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


    const sent1 = getSentimentPercentages(summary1.summary || {})
    const sent2 = getSentimentPercentages(summary2.summary || {})

    const mentionsData = hasCompare ? [
        { name: search, value: summary1.summary?.total_mentions || 0, color: brandColors.primary },
        { name: compareBrand, value: summary2.summary?.total_mentions || 0, color: brandColors.secondary }
    ] : [
        { name: search, value: summary1.summary?.total_mentions || 0, color: brandColors.primary }
    ];

    const engagementData = hasCompare ? [
        { name: search, value: summary1.summary?.total_mentions || 0, color: "#F97316" },
        { name: compareBrand, value: summary2.summary?.total_mentions || 0, color: "#3B82F6" }
    ] : [
        { name: search, value: summary1.summary?.total_mentions || 0, color: "#F97316" }
    ];

    const reachData = hasCompare ? [
        { name: search, value: summary1.summary?.estimated_reach || 0, color: "#A855F7" },
        { name: compareBrand, value: summary2.summary?.estimated_reach || 0, color: "#22C55E" }
    ] : [
        { name: search, value: summary1.summary?.estimated_reach || 0, color: "#A855F7" }
    ];

    const sentimentChartData = hasCompare ? [
        { name: search, positive: sent1.positive, negative: sent1.negative, neutral: sent1.neutral },
        { name: compareBrand, positive: sent2.positive, negative: sent2.negative, neutral: sent2.neutral }
    ] : [
        { name: search, positive: sent1.positive, negative: sent1.negative, neutral: sent1.neutral }
    ];

    const hasPositive = sentimentChartData.some(d => d.positive > 0);
    const hasNeutral = sentimentChartData.some(d => d.neutral > 0);
    const hasNegative = sentimentChartData.some(d => d.negative > 0);

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        } else {
            return num;
        }
    };

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    const handleDateChange = (value) => {
        setDateChange(value)
    }


    // Result Over time Chart
    const generateEnhancedTimeSeriesData = (summary, brandName, days = 30) => {
        const totalMentions = summary?.total_mentions || 0;
        const youtubeMentions = summary?.youtube_sentiment?.mentions || 0;
        const twitterMentions = summary?.twitter_sentiment?.mentions || 0;
        const newsMentions = summary?.news_sentiment?.mentions || 0;
        const totalReach = summary?.estimated_reach || 0;

        console.log(youtubeMentions, "youtubeMentions")
        console.log(newsMentions, "newsMentions")

        const data = [];
        const baseDate = new Date();

        // Distribute totals across the time period
        const dailyBaseMentions = totalMentions / days;
        const dailyYoutube = youtubeMentions / days;
        const dailyTwitter = twitterMentions / days;
        const dailyNews = newsMentions / days;
        const dailyReach = totalReach / days;

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() - i);

            // Realistic daily variations
            const randomFactor = 0.4 + Math.random() * 0.6;

            data.push({
                date: date.toISOString().split('T')[0],
                mentions: Math.max(0, Math.round(dailyBaseMentions * randomFactor)),
                youtube: Math.max(0, Math.round(dailyYoutube * randomFactor)),
                twitter: Math.max(0, Math.round(dailyTwitter * randomFactor)),
                news: Math.max(0, Math.round(dailyNews * randomFactor)),
                reach: Math.max(0, Math.round(dailyReach * randomFactor)),
                brand: brandName
            });
        }

        return data;
    };


    // Line Chart Data - Updated with real time series data
    const lineChartData = useMemo(() => {
        const timeSeries1 = generateEnhancedTimeSeriesData(summary1.summary, search, 30);
        const timeSeries2 = hasCompare ? generateEnhancedTimeSeriesData(summary2.summary, compareBrand, 30) : [];

        const dates = timeSeries1.map(item => {
            const date = new Date(item.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        const series = [];

        // Primary brand
        series.push({
            name: search,
            data: timeSeries1.map(item => item[selectedMetric])
        });

        // Comparison brand
        if (hasCompare && timeSeries2.length > 0) {
            series.push({
                name: compareBrand,
                data: timeSeries2.map(item => item[selectedMetric])
            });
        }

        const metricLabels = {
            mentions: 'Total Mentions',
            youtube: 'YouTube Mentions',
            twitter: 'Twitter Mentions',
            news: 'News Mentions',
            reach: 'Potential Reach'
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
                colors: hasCompare ? ['#1E5631', '#FF4E4C'] : ['#1E5631'],
                tooltip: {
                    y: {
                        formatter: function (value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        };
    }, [summary1, summary2, hasCompare, search, compareBrand, selectedMetric]);

    // const lineChartData = useMemo(() => ({
    //     series: hasCompare ? [
    //         {
    //             name: search,
    //             data: [10, 20, 15, 25, 20, 30]
    //         },
    //         {
    //             name: compareBrand,
    //             data: [5, 10, 8, 12, 10, 15]
    //         },
    //     ] : [
    //         {
    //             name: search,
    //             data: [10, 20, 15, 25, 20, 30]
    //         }
    //     ],
    //     options: {
    //         chart: {
    //             type: 'line',
    //             toolbar: { show: false },
    //         },
    //         stroke: {
    //             curve: 'smooth'
    //         },
    //         dataLabels: {
    //             enabled: false
    //         },
    //         legend: {
    //             show: true,
    //             position: 'top',
    //         },
    //         xaxis: {
    //             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //         },
    //         colors: hasCompare ? ['#1E5631', '#FF4E4C'] : ['#1E5631'],
    //     }
    // }), [hasCompare, search, compareBrand]);


    //Barchart
    const barChartData = useMemo(() => {
        const youTube1 = summary1.summary?.youtube_sentiment?.mentions || 0;
        const twitter1 = summary1.summary?.twitter_sentiment?.mentions || 0;
        const news1 = summary1.summary?.news_sentiment?.mentions || 0;
        const youTube2 = summary2.summary?.youtube_sentiment?.mentions || 0;
        const twitter2 = summary2.summary?.twitter_sentiment?.mentions || 0;
        const news2 = summary2.summary?.news_sentiment?.mentions || 0;

        let series = hasCompare ? [
            {
                name: 'YouTube',
                data: [youTube1, youTube2]
            },
            {
                name: 'Twitter/X',
                data: [twitter1, twitter2]
            },
            {
                name: 'News',
                data: [news1, news2]
            },
        ] : [
            {
                name: 'YouTube',
                data: [youTube1]
            },
            {
                name: 'Twitter/X',
                data: [twitter1]
            },
            {
                name: 'News',
                data: [news1]
            }
        ];

        series = series.filter(s => s.data.reduce((a, b) => a + b, 0) > 0);

        const channelColors = {
            'YouTube': '#FF4E4C',
            'Twitter/X': '#F48A1F',
            'News': '#1E5631',
        };

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
                    categories: hasCompare ? [search, compareBrand] : [search],
                },
                colors: series.map(s => channelColors[s.name]),
            }
        };
    }, [summary1, summary2, hasCompare, search, compareBrand]);

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

    const sources = summary1.sources || { youtube: [], news: [] }
    const allUrls = [...sources.youtube, ...sources.news];
    const uniqueUrls = [...new Set(allUrls)];

    const topMentions = uniqueUrls?.map(url => ({
        url,
        type: url.includes('youtube') ? 'Youtube' : 'News',
        ...(urlInfo[url] || { title: new URL(url).pathname, snippet: 'No description available', sentiment: 'neutral' })
    }))

    const filteredMentions = topMentions?.filter(m => mentionTab === 'All' || m.type === mentionTab)


    const reportRef = useRef(null);

    const handleDownloadPDF = async () => {
        const input = reportRef.current;

        // Capture the report content as a canvas
        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        // Create a new jsPDF instance
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Logo details (replace with your logo URL or base64 string)
        const logoUrl = Logo; // Replace with your logo URL
        const logoWidth = 50; // Width of the logo in mm
        const logoHeight = 30; // Height of the logo in mm
        const logoX = 10; // X-coordinate for top-left corner
        const logoY = 10; // Y-coordinate for top-left corner

        // Add the logo to the first page
        pdf.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

        // Adjust the report content to avoid overlapping with the logo
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentMarginTop = logoHeight + 20; // Adjust margin to account for logo height and some spacing

        let heightLeft = imgHeight;
        let position = contentMarginTop;

        // Add the captured report content
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - contentMarginTop);

        // Handle additional pages if the content exceeds one page
        while (heightLeft > 0) {
            position = heightLeft - imgHeight + contentMarginTop;
            pdf.addPage();
            // Add the logo to subsequent pages
            pdf.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save('report.pdf');
    };

    // const handleDownloadPDF = async () => {
    //     const input = reportRef.current;

    //     const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    //     const imgData = canvas.toDataURL('image/png');

    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const pageHeight = pdf.internal.pageSize.getHeight();
    //     const pageWidth = pdf.internal.pageSize.getWidth();

    //     const imgWidth = pageWidth;
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //     let heightLeft = imgHeight;
    //     let position = 0;

    //     // First page
    //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;

    //     while (heightLeft > 0) {
    //         position = heightLeft - imgHeight;
    //         pdf.addPage();
    //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //         heightLeft -= pageHeight;
    //     }

    //     pdf.save('report.pdf');
    // };

    const SkeletonCard = () => (
        <div className="animate-pulse flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl h-[362px] w-full">
            <div className="h-6 bg-[#BFBFBF] rounded w-1/4 mb-4"></div>
            <div className="h-full bg-[#BFBFBF] rounded"></div>
        </div>
    );

    const labelFormatter = (val) => val > 0 ? `${val}%` : '';

    console.log(compareBrand, "compareBrandcompareBrand")

    return (
        <div className='w-full flex flex-col gap-[32px]'>
            <div className='flex items-center justify-between'>
                <div onClick={() => setSearchList([])} className='w-[100px] flex cursor-pointer items-center justify-center p-3 rounded-lg bg-black'>
                    <p className='text-white text-lg font-jost'>Back</p>
                </div>

            </div>
            <div className='bg-[#fff] h-[88px] rounded-[8px] flex justify-between p-[25px]'>
                <p className='font-jost font-semibold text-[#1F2937] leading-[32px] text-[24px]'>{search} : {compareBrand || null}</p>
                <div className='flex gap-2 items-center'>
                    <div className='flex bg-black p-2 rounded-lg items-center gap-1.5 cursor-pointer w-[160px] h-[40px]' onClick={handleDownloadPDF}>
                        <AiOutlineDownload className='w-5 h-5 text-[#fff]' />
                        <p className='text-[#fff] text-base font-lato'>Export Analysis</p>
                    </div>
                    <div className='border border-[#BFBFBF] rounded-[8px] flex items-center'>
                        <div className={`${activeTab === 1 ? "bg-[#FFF4EE]" : ""} p-1 w-[36px] h-[36px] flex items-center justify-center cursor-pointer`} onClick={() => handleTabChange(1)}>
                            <FaListUl className={`${activeTab === 1 ? "text-[#E57E46]" : " text-[#9CA3AF]"} w-5 h-5`} />
                        </div>
                        <div className={`${activeTab === 2 ? "bg-[#FFF4EE]" : ""} p-1 w-[36px] h-[36px] flex items-center justify-center cursor-pointer`} onClick={() => handleTabChange(2)}>
                            <IoTimeOutline className={`${activeTab === 2 ? "text-[#E57E46]" : " text-[#9CA3AF]"} w-5 h-5`} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex items-center w-full gap-[15px]'>
                <div className='bg-[#fff] w-6/12 rounded-[8px] py-[14px] px-[17px] flex items-center justify-between'>
                    <p className='text-[18px] font-lato text-[#263238]'>{search}</p>
                    {/* <CiMenuKebab className='text-[#98A2B3] w-5 h-5' /> */}
                </div>
                <div
                    className='bg-[#fff] w-6/12 rounded-[8px] py-[14px] px-[17px] flex items-center'
                >
                    <input
                        type='text'
                        placeholder='Compare with another brand'
                        className='w-full  outline-none font-lato text-[#F48A1F] text-[18px]'
                        value={compareBrandInput}
                        onChange={(e) => setCompareBrandInput(e.target.value)}
                    />
                    <button
                        type='button'
                        className='bg-[#F48A1F] w-[116px] h-[41px] rounded-[5px] flex items-center justify-center py-2.5'
                        onClick={() => setCompareBrand(compareBrandInput)}
                    >
                        <p className='font-lato text-[18px] text-[#FFFFFF]'>Compare</p>
                    </button>
                </div>
            </div>

            <div className='bg-[#fff] rounded-[8px] flex flex-col p-6 gap-2 w-full'>
                <div className='flex items-center justify-between'>
                    <p className='font-lato text-base font-semibold text-[#1F2937]'>Filters</p>
                    <p className='font-lato text-[#E57E46] text-sm'>Clear All</p>
                </div>
                <div className='flex gap-4 justify-between items-center'>
                    <div className='bg-[#F9FAFB] w-[181px] h-[36px] rounded-[8px] p-2 flex items-center gap-2'>
                        <GoGlobe className='w-5 h-5 text-[#374151]' />
                        <p className='text-sm text-[#374151] font-lato'>All sources</p>
                    </div>
                    {/* <div className='bg-[#F9FAFB] w-[90px] h-[36px] rounded-[8px] p-2 flex items-center gap-1'>
                        <img src={Happy} className='w-[18px] h-[18px]' />
                        <img src={Normal} className='w-[18px] h-[18px]' />
                        <img src={Sad} className='w-[18px] h-[18px]' />
                    </div> */}

                    <div className="bg-[#F9FAFB] w-[472px] h-[36px] rounded-[8px] px-[26px] py-2 flex items-center gap-1">
                        {/* Date Range Options */}
                        <div className="flex items-center w-5/12 gap-[5px]">
                            {["1D", "7D", "30D", "3M", "6M", "13M"].map((label, index) => (
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
                        <div className="w-6/12 flex items-center ml-10 justify-end gap-2">
                            <FaRegCalendarAlt className="text-[#546E7A]" />
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="dd/MM/yy"
                                className="bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none"
                            />
                            <span className="text-[#546E7A]">-</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="dd/MM/yy"
                                className="bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none"
                            />
                        </div>
                    </div>


                </div>
            </div>

            <div ref={reportRef}>
                <div className="flex flex-col gap-4">
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
                                                <Bar dataKey="value">
                                                    {mentionsData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
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
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                                        {/* {hasPositive && ( */}
                                        <div className='flex items-center gap-1'>
                                            <div className='bg-[#1E5631] w-2 h-2 rounded-full'></div>
                                            <p className='font-jost text-black text-xs leading-[100%]'>Positive</p>
                                        </div>
                                        {/* )} */}
                                        {/* {hasNeutral && ( */}
                                        <div className='flex items-center gap-1'>
                                            <div className='bg-[#DEDEDE] w-2 h-2 rounded-full'></div>
                                            <p className='font-jost text-black text-xs leading-[100%]'>Neutral</p>
                                        </div>
                                        {/* )} */}
                                        {/* {hasNegative && ( */}
                                        <div className='flex items-center gap-1'>
                                            <div className='bg-[#FF4E4C] w-2 h-2 rounded-full'></div>
                                            <p className='font-jost text-black text-xs leading-[100%]'>Negative</p>
                                        </div>
                                        {/*  )} */}
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
                                                <LabelList dataKey="positive" fill="#fff" position="center" formatter={labelFormatter} />
                                            </Bar>
                                            <Bar dataKey="neutral" stackId="a" fill="#BFBFBF">
                                                <LabelList dataKey="neutral" fill="#fff" position="center" formatter={labelFormatter} />
                                            </Bar>
                                            <Bar dataKey="negative" stackId="a" fill="#FF4E4C">
                                                <LabelList dataKey="negative" fill="#fff" position="center" formatter={labelFormatter} />
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
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
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

                {/*  Results Over Time (Line Chart) */}
                {/* {loading ? (
                    <div className="animate-pulse bg-[#BFBFBF] h-[362px] w-full rounded-xl"></div>
                ) : (
                    <div className='bg-white rounded-[18px] mt-4 w-full p-4 shadow-sm'>
                        <div className='flex justify-between items-start'>
                            <p className='font-jost font-medium text-[20px] mb-4 text-[#4B5563]'>
                                Results Over Time
                            </p>
                            {/* <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className='font-jost text-[#252F3D]  text-xs cursor-pointer bg-transparent border-none outline-none'
                        >
                            {["This Week", "This Month"].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select> 
                        </div>
                        <Chart
                            options={lineChartData.options}
                            series={lineChartData.series}
                            type='line'
                            height={300}
                        />
                    </div>
                )} */}

                {/* Results Over Time (Line Chart) */}
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

                    {/* <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold font-jost text-[#6B7280] text-[20px]">Sentiment by Gender</p>
                            </div>
                        </div>
                        <div className="w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Female - Negative", value: 10 }, // Example values, replace with actual data
                                            { name: "Female - Neutral", value: 20 },
                                            { name: "Female - Positive", value: 40 },
                                            { name: "Male - Negative", value: 15 },
                                            { name: "Male - Neutral", value: 10 },
                                            { name: "Male - Positive", value: 25 },
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40} // This makes it a donut chart
                                        outerRadius={80}
                                        label
                                    >
                                        {[
                                            { name: "Female - Negative", fill: "#FF4E4C" },
                                            { name: "Female - Neutral", fill: "#BFBFBF" },
                                            { name: "Female - Positive", fill: "#1E5631" },
                                            { name: "Male - Negative", fill: "#FF4E4C" },
                                            { name: "Male - Neutral", fill: "#BFBFBF" },
                                            { name: "Male - Positive", fill: "#1E5631" },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center justify-center gap-3'>
                                <div className='flex items-center gap-1'>
                                    <div className='bg-[#FF4E4C] w-3 h-3 rounded' />
                                    <p className='text-[#FF4E4C] font-jost text-base leading-6'>Female - Negative</p>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <div className='bg-[#BFBFBF] w-3 h-3 rounded' />
                                    <p className='text-[#BFBFBF] font-jost text-base leading-6'>Female - Neutral</p>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <div className='bg-[#1E5631] w-3 h-3 rounded' />
                                    <p className='text-[#1E5631] font-jost text-base leading-6'>Female - Positive</p>
                                </div>
                            </div>
                            <div className='flex items-center justify-center gap-3'>
                                <div className='flex items-center gap-1'>
                                    <div className='bg-[#FF4E4C] w-3 h-3 rounded' />
                                    <p className='text-[#FF4E4C] font-jost text-base leading-6'>Male - Negative</p>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <div className='bg-[#BFBFBF] w-3 h-3 rounded' />
                                    <p className='text-[#BFBFBF] font-jost text-base leading-6'>Male - Neutral</p>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <div className='bg-[#1E5631] w-3 h-3 rounded' />
                                    <p className='text-[#1E5631] font-jost text-base leading-6'>Male - Positive</p>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="h-[362px] w-full flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold font-jost text-[#6B7280] text-[20px]">Sentiment by Region</p>
                            </div>
                        </div>
                        <div className="w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: "UK", negative: 20, neutral: 30, positive: 50 },
                                    { name: "USA", negative: 25, neutral: 25, positive: 50 },
                                    { name: "Europe", negative: 15, neutral: 35, positive: 50 },
                                    { name: "Asia", negative: 10, neutral: 40, positive: 50 },
                                    { name: "Africa", negative: 30, neutral: 20, positive: 50 },
                                    { name: "Australia", negative: 20, neutral: 30, positive: 50 },
                                ]}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip className="text-white" />
                                    <Bar dataKey="negative" stackId="a" fill="#FF4E4C">
                                        <LabelList dataKey="negative" position="center" fill="#fff" formatter={(val) => `${val}%`} />
                                    </Bar>
                                    <Bar dataKey="neutral" stackId="a" fill="#BFBFBF">
                                        <LabelList dataKey="neutral" position="center" fill="#fff" formatter={(val) => `${val}%`} />
                                    </Bar>
                                    <Bar dataKey="positive" stackId="a" fill="#1E5631">
                                        <LabelList dataKey="positive" position="center" fill="#fff" formatter={(val) => `${val}%`} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Words */}
                <p className='font-jost text-[#101828] my-5 leading-[30px] text-[20px]'>Top Words</p>
                <div className="flex items-center gap-4 mt-4">
                    <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold font-jost text-[#6B7280] text-[20px]">Positive Mentions</p>
                            </div>
                        </div>
                        <div className="w-full h-[250px] flex flex-wrap justify-center gap-3">
                            <p className="text-[#1E5631] font-jost text-[42px] font-bold">excellentamazing</p>
                            <p className="text-[#1E5631] font-jost text-[36px] font-bold">victory fantastic love</p>
                            <p className="text-[#1E5631] font-jost opacity-80 text-[28px] font-bold">brilliant impressive exciting</p>
                            <p className="text-[#1E5631] font-jost opacity-60 text-[22px] font-bold">superb wonderful outstanding great</p>
                            <p className="text-[#1E5631] font-jost opacity-40 text-[18px] font-bold">beautiful proud quality</p>
                        </div>
                    </div>
                    <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold font-jost text-[#6B7280] text-[20px]">Negative Mentions</p>
                            </div>
                        </div>
                        <div className="w-full h-[250px] flex flex-wrap justify-center gap-3">
                            <p className="text-[#FF0000] font-jost text-[42px] font-bold">disappointedexpensive</p>
                            <p className="text-[#FF0000] font-jost text-[36px] font-bold">poor frustratings low terrible</p>
                            <p className="text-[#FF0000] font-jost opacity-80 text-[28px] font-bold">awful broken delayed unhappy lacking</p>
                            <p className="text-[#FF0000] font-jost opacity-60 text-[22px] font-bold">overpriced confusing</p>
                        </div>
                    </div>
                </div>

                {/* Top Mentions */}
                <div className='flex flex-col mt-10 gap-[11px]'>
                    <div className='flex items-center gap-5'>
                        <p className='font-jost font-semibold text-[18px]  text-[#6B7280]'>
                            Top Mentions
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
                                                <iframe
                                                    width="100%"
                                                    height="200"
                                                    src={`https://www.youtube.com/embed/${new URL(mention.url).searchParams.get("v")}`}
                                                    title="YouTube video"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
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


        </div>
    )
}

export default Compare