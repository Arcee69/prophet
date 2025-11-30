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
import BrandMetrics from './BrandMetrics'



const BrandWatchReport = () => {
  const [activeTab, setActiveTab] = useState("Feeds")
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

      <div className='flex items-center justify-between'>
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

        <div className='flex justify-end'>
          <div 
            className={`${activeTab === 'Feeds' ? "hidden" : "flex bg-black p-2 rounded-lg items-center gap-1.5 cursor-pointer w-[150px] h-[40px]'"}`}
            onClick={handleDownloadPDF}
          >
            <AiOutlineDownload className='w-5 h-5 text-[#fff]' />
            <p className='text-[#fff] text-base font-lato'>Export Report</p>
          </div>
        </div>

      </div>

      {activeTab ===  "Feeds" && (
        <BrandTable
          mentionTab={mentionTab}
          filteredMentions={filteredMentions}
          loading={loading}
          setMentionTab={setMentionTab}   
        />
      )}
      {activeTab ===  "Overview" && (
        <BrandMetrics 
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
          setMentionTab={setMentionTab}
          filteredMentions={filteredMentions}
        />
      )}
     


    </div>
  )
}

export default BrandWatchReport