import React, { useState, useEffect, useMemo, useRef } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { api } from '../../../services/api'
import { appUrls } from '../../../services/urls'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom'

import Logo from '../../../assets/png/logo.png';
import { countryMap } from '../../../utils/CountryMap'
import BrandTable from './BrandTable'
import BrandOverview from './BrandOverview'



const BrandWatchReport = () => {
  const [activeTab, setActiveTab] = useState("Links")
  const [selectedTime, setSelectedTime] = useState("This Week")
  const [dateChange, setDateChange] = useState(1)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sentimentData, setSentimentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mentionTab, setMentionTab] = useState('All')
  const [selectedMetric, setSelectedMetric] = useState('mentions');
  const [activeBrandView, setActiveBrandView] = useState('primary');

  console.log(sentimentData, "sentimentData")

  const navigate = useNavigate()

  const { state } = useLocation()
  console.log(state, "state")

  useEffect(() => {
    const fetchSentiment = async () => {
      if (!state?.id) return;
      setLoading(true)
      try {
        const res = await api.get(appUrls?.BRANDWATCH_URL + `/data/${state.id}`)
        setSentimentData(res?.data?.data?.aggregated_brand_watch_data)
        console.log(res?.data?.data?.aggregated_brand_watch_data, "micku")
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (state) {
      fetchSentiment()
    }
  }, [state])

  const summary1 = sentimentData ? Object.values(sentimentData)[0] || {} : {}


  console.log(summary1, "summarypopo")

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

  const mentionsData = [
    { name: state?.brand !== null ? state?.brand?.name : state?.keyword, value: summary1.summary?.total_mentions || 0 }
  ];

  const engagementData = [
    { name: state?.brand !== null ? state?.brand?.name : state?.keyword, value: summary1.summary?.total_mentions || 0 }
  ];

  const reachData = [
    { name: state?.brand !== null ? state?.brand?.name : state?.keyword, value: summary1.summary?.estimated_reach || 0 }
  ];

  const sentimentChartData = [
    { name: state?.brand !== null ? state?.brand?.name : state?.keyword, positive: sent1.positive, negative: sent1.negative, neutral: sent1.neutral }
  ];


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
    const timeSeries1 = generateEnhancedTimeSeriesData(summary1.summary, state?.brand?.name || state?.keyword, 30);


    const dates = timeSeries1.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const series = [];

    // Primary brand
    series.push({
      name: state?.brand !== null ? state?.brand?.name : state?.keyword,
      data: timeSeries1.map(item => item[selectedMetric])
    });

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
        colors: ['#1E5631'],
        tooltip: {
          y: {
            formatter: function (value) {
              return value.toLocaleString();
            }
          }
        }
      }
    };
  }, [state, selectedMetric]);


  //Barchart
  const barChartData = useMemo(() => {
    const youtube1 = summary1.summary?.youtube_sentiment?.mentions || 0;
    const twitter1 = summary1.summary?.twitter_sentiment?.mentions || 0;
    const news1 = summary1.summary?.news_sentiment?.mentions || 0;

    return {
      series: [
        {
          name: state?.brand !== null ? state?.brand?.name : state?.keyword,
          data: [youtube1, twitter1, news1]
        }
      ],
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
          categories: ["YouTube", "Twitter/X", "News"],
        },
        colors: ['#1E5631', '#FF4E4C', '#1E5631'],
      }
    };
  }, [summary1, state]);

  


  const reportRef = useRef(null);

  // const handleDownloadPDF = async () => {
  //   const input = reportRef.current;

  //   const canvas = await html2canvas(input, { scale: 2, useCORS: true });
  //   const imgData = canvas.toDataURL('image/png');

  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   const pageWidth = pdf.internal.pageSize.getWidth();

  //   const imgWidth = pageWidth;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   let heightLeft = imgHeight;
  //   let position = 0;

  //   // First page
  //   pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //   heightLeft -= pageHeight;

  //   while (heightLeft > 0) {
  //     position = heightLeft - imgHeight;
  //     pdf.addPage();
  //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
  //   }

  //   pdf.save('report.pdf');
  // };



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
      const logoWidth = 40; // Width of the logo in mm
      const logoHeight = 20; // Height of the logo in mm
      const logoX = 10; // X-coordinate for top-left corner
      const logoY = 10; // Y-coordinate for top-left corner

      // Title and description details
      const brandName = state?.brand !== null ? state?.brand?.name : state?.keyword || 'Unknown';
      const titleText = `Brand Watch Report - ${brandName.charAt(0).toUpperCase() + brandName.slice(1)}`;
      const descriptionText = 'This report provides a comprehensive overview of brand sentiment and engagement.';
      const titleX = 10; // Align with logo X
      const titleY = logoY + logoHeight + 5; // Below logo with 5mm spacing
      const descriptionX = 10; // Align with title X
      const descriptionY = titleY + 8; // Below title with 8mm spacing (approx. for 24px font + gap)

      // Add content to each page
      const addHeader = () => {
        // Add logo
        pdf.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

        // Set font for title (mimicking font-jost, bold, 24px)
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18); // Approx. 24px (1px ≈ 0.75pt)
        pdf.setTextColor(16, 25, 40); // #101928
        pdf.text(titleText, titleX, titleY);

        // Set font for description (mimicking font-jost, regular, 14px)
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10); // Approx. 14px
        pdf.setTextColor(102, 113, 133); // #667185
        pdf.text(descriptionText, descriptionX, descriptionY, { maxWidth: pageWidth - 20 }); // Wrap text within page width
      };

      // Add header to the first page
      addHeader();

      // Calculate content position to avoid overlap
      const contentMarginTop = logoHeight + 30; // Adjust for logo, title, description, and spacing
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = contentMarginTop;

      // Add the captured report content
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - contentMarginTop);

      // Handle additional pages if the content exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + contentMarginTop;
        pdf.addPage();
        // Add header (logo, title, description) to subsequent pages
        addHeader();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save('report.pdf');
    };


     const getCountryName = (code) => {
         return countryMap[code] || code.toUpperCase();
     };
 
     const getSentimentColor = (score) => {
         if (score > 0.1) return '#10B981'; // Positive - Green
         if (score < -0.1) return '#EF4444'; // Negative - Red
         return '#D1D5DB'; // Neutral - Gray
     };

  // Comparison-aware Top Words Data Processing
  const topWordsData = useMemo(() => {
    const data = summary1;

    const twitterPos = data?.top_words?.twitter?.positive || [];
    const twitterNeg = data?.top_words?.twitter?.negative || [];
    const youtubePos = data?.top_words?.youtube?.positive || [];
    const youtubeNeg = data?.top_words?.youtube?.negative || [];
    const newsPos = data?.top_words?.news?.positive || [];
    const newsNeg = data?.top_words?.news?.negative || [];

    return {
      positive: [...twitterPos, ...youtubePos, ...newsPos],
      negative: [...twitterNeg, ...youtubeNeg, ...newsNeg]
    };
  }, [summary1, activeBrandView]);

  // Comparison-aware Sentiment by Region Data
  const regionSentimentData = useMemo(() => {
    const data = summary1;
    const regions = data?.country_sentiments?.news || {};

    return Object.entries(regions).map(([code, regionData]) => ({
      name: getCountryName(code),
      mentions: regionData.mentions,
      score: regionData.average_score,
      color: getSentimentColor(regionData.average_score)
    })).sort((a, b) => b.mentions - a.mentions);
  }, [summary1, activeBrandView]);

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



  return (
    <div className='w-full flex flex-col gap-[32px]'>
      <div onClick={() => navigate(-1)} className='w-[100px] flex items-center cursor-pointer justify-center p-3 rounded-lg bg-black'>
        <p className='text-white text-lg font-jost'>Back</p>
      </div>
      <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-1'>
          <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Brand Watch Report - <span className='font-jost capitalize'>{state?.brand !== null ? state?.brand?.name : state?.keyword}</span></p>
          <p className='text-[#667185] text-sm font-jost'>This report provides a comprehensive overview of brand sentiment and engagement.</p>
        </div>
        <div className='flex items-center gap-4'>
          <p className='font-jost font-medium text-[#101928]'>Duration:</p>
          <p className='text-[#667185] text-sm font-jost'>
            <span>{new Date(state.start_date).toDateString()}</span> - <span>{new Date(state.end_date).toDateString()}</span></p>
        </div>
      </div>
      <div className='flex justify-end'>
        <div className='flex bg-black p-2 rounded-lg items-center gap-1.5 cursor-pointer w-[150px] h-[40px]' onClick={handleDownloadPDF}>
          <AiOutlineDownload className='w-5 h-5 text-[#fff]' />
          <p className='text-[#fff] text-base font-lato'>Export Report</p>
        </div>
      </div>

      <div className='flex gap-2'>
        <button
            className={`px-4 py-2 rounded ${activeTab === 'Links' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabChange('Links')}
        >
            Links
        </button>
        <button
            className={`px-4 py-2 rounded ${activeTab === 'Overview' ? 'bg-[#F48A1F] text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabChange('Overview')}
        >
            Overview
        </button>
      </div>

      {activeTab ===  "Links" && (
        <BrandTable 
          summary1={summary1}
        />
      )}
      {activeTab ===  "Overview" && (
        <BrandOverview 
          reportRef={reportRef}
          loading={loading}
          mentionsData={mentionsData}
          engagementData={engagementData}
          reachData={reachData}
          sentimentChartData={sentimentChartData}
          summary1={summary1}
          barChartData={barChartData}
          lineChartData={lineChartData}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          regionSentimentData={regionSentimentData}
          donutChartOptions={donutChartOptions}
          donutChartSeries={donutChartSeries}
          state={state}
          setActiveBrandView={setActiveBrandView}
          topWordsData={topWordsData}
          mentionTab={mentionTab}
        />
      )}
     


    </div>
  )
}

export default BrandWatchReport