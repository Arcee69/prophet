import React, { useState, useEffect, useMemo, useRef } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { IoLocationOutline } from 'react-icons/io5'
import Chart from 'react-apexcharts'

import { GoGlobe } from 'react-icons/go'

import { IoIosRadio } from 'react-icons/io'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { api } from '../../../services/api'
import { appUrls } from '../../../services/urls'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { RiPieChartLine } from 'react-icons/ri';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

//svgs
import Facebook from "../../../assets/svg/facebook.svg"
import Pinterest from "../../../assets/svg/pinterest.svg"
import Happy from "../../../assets/svg/happy.svg"
import Sad from "../../../assets/svg/sad.svg"
import Normal from "../../../assets/svg/normal.svg"
import { useLocation, useNavigate } from 'react-router-dom'



const BrandWatchReport = () => {
  const [activeTab, setActiveTab] = useState(1)
  const [compareBrand, setCompareBrand] = useState("")
  const [compareBrandInput, setCompareBrandInput] = useState("");
  const [selectedTime, setSelectedTime] = useState("This Week")
  const [dateChange, setDateChange] = useState(1)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sentimentData, setSentimentData] = useState(null)
  const [sentimentData2, setSentimentData2] = useState(null)
  
      console.log(sentimentData, "sentimentData")
      console.log(sentimentData2, "sentimentData2")
  
      const navigate = useNavigate()
  
      const {state} = useLocation()
  
      useEffect(() => {
          const fetchSentiment = async (keyword, isSecond = false) => {
              if (!keyword) return;
              const data = { "keyword1": keyword }
              try {
                  const res = await api.get(appUrls?.BRANDWATCH_URL + `/data/${state.id}`)
                  if (isSecond) {
                      setSentimentData2(res?.data?.aggregated_brand_watch_data)
                  } else {
                      setSentimentData(res?.data?.aggregated_brand_watch_data)
                  }
              } catch (err) {
                  console.log(err)
              }
          }
  
          if (state) {
              fetchSentiment(state?.brand?.name)
          }
          if (compareBrand) {
              fetchSentiment(compareBrand, true)
          } else {
              setSentimentData2(null); 
          }
      }, [state, compareBrand])
  
      const summary1 = sentimentData ? Object.values(sentimentData)[0] || {} : {}
      const summary2 = sentimentData2 ? Object.values(sentimentData2)[0] || {} : {}
      const hasCompare = !!compareBrand && !!sentimentData2
  
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
      const sent2 = getSentimentPercentages(summary2.summary || {})
  
      const mentionsData = hasCompare ? [
          { name: state?.brand?.name, value: summary1.summary?.total_mentions || 0 },
          { name: compareBrand, value: summary2.summary?.total_mentions || 0 }
      ] : [
          { name: state?.brand?.name, value: summary1.summary?.total_mentions || 0 }
      ];
  
      const engagementData = hasCompare ? [
          { name: state?.brand?.name, value: summary1.summary?.total_mentions  || 0 },
          { name: compareBrand, value: summary2.summary?.total_mentions  || 0 }
      ] : [
          { name: state?.brand?.name, value: summary1.summary?.total_mentions || 0 }
      ];
  
      const reachData = hasCompare ? [
          { name: state?.brand?.name, value: summary1.summary?.estimated_reach || 0 },
          { name: compareBrand, value: summary2.summary?.estimated_reach || 0 }
      ] : [
          { name: state?.brand?.name, value: summary1.summary?.estimated_reach || 0 }
      ];
  
      const sentimentChartData = hasCompare ? [
          { name: state?.brand?.name, positive: sent1.positive, negative: sent1.negative, neutral: sent1.neutral },
          { name: compareBrand, positive: sent2.positive, negative: sent2.negative, neutral: sent2.neutral }
      ] : [
          { name: state?.brand?.name, positive: sent1.positive, negative: sent1.negative, neutral: sent1.neutral }
      ];
  
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
  
  
      // Line Chart Data
      const lineChartData = useMemo(() => ({
          series: hasCompare ? [
            {
              name: state?.brand?.name,
              data: [10, 20, 15, 25, 20, 30]
            },
            {
              name: compareBrand,
              data: [5, 10, 8, 12, 10, 15]
            },
          ] : [
            {
              name: state?.brand?.name,
              data: [10, 20, 15, 25, 20, 30]
            }
          ],
          options: {
            chart: {
              type: 'line',
              toolbar: { show: false },
            },
            stroke: {
              curve: 'smooth'
            },
            dataLabels: {
              enabled: false
            },
            legend: {
              show: true,
              position: 'top',
            },
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',]
            },
            colors: hasCompare ? ['#BDDAFF', '#F2E5FF' ] : ['#BDDAFF'],
          }
      }), [hasCompare, state, compareBrand]);
      
  
      //Barchart
      const barChartData = useMemo(() => {
          const socialMedia1 = summary1.summary?.social_media_sentiment?.mentions || 0;
          const news1 = summary1.summary?.news_sentiment?.mentions || 0;
          const socialMedia2 = summary2.summary?.social_media_sentiment?.mentions || 0;
          const news2 = summary2.summary?.news_sentiment?.mentions || 0;
  
          return {
              series: hasCompare ? [
                  {
                      name: state?.brand?.name,
                      data: [socialMedia1, news1]
                  },
                  {
                      name: compareBrand,
                      data: [socialMedia2, news2]
                  },
              ] : [
                  {
                      name: state?.brand?.name,
                      data: [socialMedia1, news1]
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
                      categories: ['Social Media', 'News'],
                  },
                  colors: hasCompare ? ['#BDDAFF', '#F48A1F'] : ['#F48A1F', '#BDDAFF'],
              }
          };
      }, [summary1, summary2, hasCompare, state, compareBrand]);
  
      const urlInfo = {
          "https://www.youtube.com/watch?v=ZYgkg-GYvp0": {title: "Ethiopia, Dangote Industries sign $2.5 billion deal for mega fertilizer plant", snippet: "The deal paves the way for a $2.5 billion fertilizer plant in Ethiopia's Somali region, powered by natural gas, with an annual production capacity of 3 million tons of urea, aiming to boost food security and position Ethiopia as a regional fertilizer powerhouse.", sentiment: "positive"},
          "https://www.youtube.com/watch?v=ygVvdTb9eis": {title: "Rewane Speaks On Dangote Refinery's First Gasoline Export To U.S.", snippet: "The video discusses Dangote Refinery's achievement of exporting its first gasoline cargo of 300,000 barrels to the United States, as reported by S&P Global, amidst Nigeria's challenges with fuel import dependence and foreign exchange shortages.", sentiment: "positive"},
          "https://www.youtube.com/watch?v=krYLjJMcEzU": {title: "US & Europe vs Dangote, Oil War: They Fear Africa's Big Win", snippet: "Lynient Akotonou reports on the growing clash between the U.S. and Europe and Aliko Dangote’s oil ambitions, unpacking why Western powers fear what could become Africa’s biggest win in the global energy market.", sentiment: "negative"},
          "https://tribuneonlineng.com/fuel-scarcity-imminent-as-nupeng-dangote-face-off-festers/": {title: "Fuel scarcity imminent as NUPENG, Dangote face-off festers", snippet: "Fuel scarcity imminent as the face-off between NUPENG and Dangote festers.", sentiment: "negative"},
          "https://www.jeuneafrique.com/1718701/economie-entreprises/qui-est-huaxin-cement-le-chinois-qui-veut-se-faire-une-place-parmi-les-rois-nigerians-du-ciment/": {title: "Qui est Huaxin Cement, le chinois qui veut se faire une place parmi les rois nigérians du ciment ?", snippet: "Huaxin Cement frappe un grand coup au Nigeria en reprenant la participation du Suisse Holcim in Lafarge Africa. L’opération, budgétée à 1 milliard de dollars, marque l’arrivée en force du cimentier chinois sur le premier marché du continent, terrain privilégié des rois de l’or gris, les deux milliardaires nigérians Aliko Dangote et Abdul Samad Rabiu.", sentiment: "neutral"},
          "https://businessday.ng/companies/article/whos-mairawani-business-tycoon-planning-600m-cement-plant-to-rival-dangote-bua/": {title: "Who’s Mairawani? Business tycoon planning $600m cement plant to rival Dangote, BUA", snippet: "Nigeria’s cement industry is set to have a new force with the announcement of a $600 million plant in Kebbi State by business tycoon Muazzam Mairawani, chairman of MSM Group, a move that’s considered to challenge market leaders such as Dangote and BUA Cement.", sentiment: "neutral"},
          "https://www.informationng.com/2025/09/phynas-late-sisters-remains-evacuated-by-dangote-group.html": {title: "Phyna’s Late Sister’s Remains Evacuated By Dangote Group", snippet: "The Dangote Group on Sunday sent representatives to collect the remains of Ruth Otabor, the younger sister of Big Brother Naija Season 7 winner Phyna, from the hospital where she passed on, as reported by PUNCH Metro.", sentiment: "negative"},
          "https://www.informationng.com/2025/09/dangote-tinubu-social-media-influencers-failed-ruth-otabor-verydarkman.html": {title: "Dangote, Tinubu, Social Media Influencers Failed Ruth Otabor – VeryDarkMan", snippet: "Nigerian social media commentator VeryDarkMan, has criticised key figures and institutions he believes failed Ruth Otabor, sister of former Big Brother Naija winner Phyna, who tragically died on Sunday after a road accident involving a Dangote truck.", sentiment: "negative"},
          "https://www.informationng.com/2025/09/dangote-group-mourns-death-of-phynas-sister-says-she-was-to-be-flown-to-india-for-treatment.html": {title: "Dangote Group Mourns Death Of Phyna's Sister, Says She Was To Be Flown To India For Treatment", snippet: "The Dangote Group has expressed grief over the death of Ruth Otabor, sister of Big Brother Naija Season 7 winner Phyna. Ruth died on Sunday after being involved in an accident with a Dangote truck in Auchi, Edo State.", sentiment: "negative"},
          "https://www.informationng.com/2025/08/phyna-loses-sister-ruth-otabor-weeks-after-dangotes-truck-accident.html": {title: "Phyna Loses Sister Ruth Otabor Weeks After Dangote’s Truck Accident", snippet: "Ruth Otabor, sister of Big Brother Naija Season 7 winner Phyna, has passed away. The family confirmed her passing on Sunday in a statement released by Eko Solicitors & Advocates, stating that Ruth departed for glory around 6:30 a.m.", sentiment: "negative"},
          "https://www.informationng.com/2025/08/were-ready-to-consider-all-options-dangote-group-assures-phyna-over-sisters-treatment.html": {title: "“We're Ready To Consider All Options” – Dangote Group Assures Phyna Over Sister’s Treatment", snippet: "Big Brother Naija season 7 winner, Phyna, has given a fresh update on her ongoing issue with the Dangote Group regarding her sister’s medical treatment. The reality TV star has been in the spotlight after her younger sister was struck by a truck belonging to the company on August 13, 2025, an accident that sadly led to the amputation of her left leg.", sentiment: "neutral"},
          "http://www.hiiraan.com/news4/2025/Aug/202705/ethiopia_dangote_group_ink_2_5_billion_deal_to_build_fertilizer_complex_in_gode_somali_region.aspx": {title: "Ethiopia, Dangote Group ink $2.5 billion deal to build fertilizer complex in Gode, Somali region", snippet: "Ethiopian Investment Holdings (EIH), the government’s strategic investment arm, and Dangote Group have signed a landmark shareholders’ agreement to develop and operate a $2.5 billion urea fertilizer production complex in Gode, Somali Regional State.", sentiment: "positive"},
          "https://www.thisdaylive.com/2025/08/29/dangote-group-ethiopia-strike-deal-to-build-2-5-billion-fertiliser-plant/": {title: "Dangote Group, Ethiopia Strike Deal to Build $2.5 Billion Fertiliser Plant", snippet: "The Dangote Group and Ethiopia government yesterday signed an agreement to build a $2.5 billion fertiliser manufacturing plant in the North-eastern African country, part of Nigerian billionaire Aliko Dangote’s efforts to end the continent’s fertiliser imports.", sentiment: "positive"}
      }
  
      const sources = summary1.sources || {youtube: [], news: []}
      const allUrls = [...sources.youtube, ...sources.news];
      const uniqueUrls = [...new Set(allUrls)]; 
  
      const topMentions = uniqueUrls?.map(url => ({
          url,
          type: url.includes('youtube') ? 'Youtube' : 'News',
          ... ({title: new URL(url).pathname, snippet: 'No description available', sentiment: 'neutral'} || [])
      }))


   const reportRef = useRef(null);
  // const handleDownloadPDF = async () => {
  //   const input = reportRef.current;
  //   const canvas = await html2canvas(input, { scale: 2 });
  //   const imgData = canvas.toDataURL('image/png');

  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save('report.pdf');
  // };

  const handleDownloadPDF = async () => {
    const input = reportRef.current;

    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('report.pdf');
  };
     

  return (
    <div className='w-full flex flex-col gap-[32px]'>
      <div onClick={() => navigate(-1)} className='w-[100px] flex items-center justify-center p-3 rounded-lg bg-black'>
        <p className='text-white text-lg font-jost'>Back</p>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Brand Watch Report</p>
        <p className='text-[#667185] text-sm font-jost'>This report provides a comprehensive overview of brand sentiment and engagement.</p>
      </div>
      <div className='flex justify-end'>       
          <div className='flex bg-black p-2 rounded-lg items-center gap-1.5 cursor-pointer w-[101px] h-[40px]' onClick={handleDownloadPDF}>
            <AiOutlineDownload className='w-5 h-5 text-[#fff]' />
            <p className='text-[#fff] text-base font-lato'>Export</p>
          </div>
      </div>

  

      <div className="flex flex-col gap-4" ref={reportRef}>
        <div className="flex items-center gap-4">
          <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Total Mentions</p>
              </div>
            </div>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={mentionsData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={formatNumber} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={formatNumber} />
                  <Bar dataKey="value" fill="#F2E5FF">
                    <LabelList dataKey="value" position="center" formatter={formatNumber} />
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
                  layout="vertical"
                  data={engagementData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={formatNumber} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={formatNumber} />
                  <Bar dataKey="value" fill="#BDDAFF">
                    <LabelList dataKey="value" position="center" formatter={formatNumber} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <RiPieChartLine className='w-5 h-5 text-[#F48A1F]' />
                <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Sentiment</p>
              </div>
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1'>
                  <div className='bg-[#D8FDE5] w-2 h-2 rounded-full'></div>
                  <p className='font-jost text-black text-xs leading-[100%]'>Positive</p>
                </div>
                <div className='flex items-center gap-1'>
                  <div className='bg-[#DEDEDE] w-2 h-2 rounded-full'></div>
                  <p className='font-jost text-black text-xs leading-[100%]'>Neutral</p>
                </div>
                <div className='flex items-center gap-1'>
                  <div className='bg-[#FFDCDB] w-2 h-2 rounded-full'></div>
                  <p className='font-jost text-black text-xs leading-[100%]'>Negative</p>
                </div>
              </div>
            </div>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={sentimentChartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="positive" stackId="a" fill="#D8FDE5">
                    <LabelList dataKey="positive" position="center" formatter={(val) => `${val}%`} />
                  </Bar>
                  <Bar dataKey="neutral" stackId="a" fill="#E5E7EB">
                    <LabelList dataKey="neutral" position="center" formatter={(val) => `${val}%`} />
                  </Bar>
                  <Bar dataKey="negative" stackId="a" fill="#FFDCDB">
                    <LabelList dataKey="negative" position="center" formatter={(val) => `${val}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl">
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Potential Reach</p>
              </div>
            </div>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={reachData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={formatNumber} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={formatNumber} />
                  <Bar dataKey="value" fill="#DEDEDE">
                    <LabelList dataKey="value" position="center" formatter={formatNumber} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>


      {/* Charts Row */}
      <div className='flex gap-4'>
        {/* Sentiment Analysis Overview (Line Chart) */}
        <div className='bg-white rounded-[18px] w-1/2 p-4 shadow-sm'>
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
                          </select> */}
          </div>
          <Chart
            options={lineChartData.options}
            series={lineChartData.series}
            type='line'
            height={300}
          />
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
      </div>

      {/* Top Mentions */}
      <div className='flex flex-col gap-[11px] '>
        <p className='font-jost font-semibold text-[18px]  text-[#6B7280]'>
          Top Mentions
        </p>

        <div className='grid grid-cols-2 gap-4'>
          {topMentions.map((mention, index) => (
            <div key={index} className='bg-[#fff] h-auto flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
              {/* <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' /> */}
              <img src={mention.type === 'Youtube' ? Pinterest : Facebook} alt={mention.type} className='w-[32px] h-[32px] ' />
              <div className='flex gap-5 flex-col w-full'>
                <div className='flex flex-col mt-1 gap-1'>
                  <div className='flex items-center gap-1'>
                    {/* <img src={mention.type === 'Youtube' ? Pinterest : Facebook} alt={mention.type} className='w-5 h-5' /> */}
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
                {/* <p className='font-jost text-[#4B5563] text-sm'>
                                {mention.snippet.substring(0, 100) + '...'}
                                </p> */}
                {/* <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
                                    <div className='flex flex-col gap-1'>
                                        <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                                        <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Comments</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                                        <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Likes</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                                        <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Reposts</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                                        <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Impressions</p>
                                    </div>
                                </div> */}
                <div className='flex gap-5'>
                  <div className={`w-[57px] h-[24px] rounded-full p-1 ${mention.sentiment === 'positive' ? 'bg-[#DCFCE7]' : mention.sentiment === 'negative' ? 'bg-[#FFA8A8]' : 'bg-[#D3D3D3]'}`}>
                    <p className={`text-xs text-center font-inter ${mention.sentiment === 'positive' ? 'text-[#166534]' : mention.sentiment === 'negative' ? 'text-[#FF0000]' : 'text-[#808080]'}`}>{mention.sentiment}</p>
                  </div>
                  {/* <div className='flex items-center gap-4'>
                                        <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                                        <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                                        <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                                        <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                                        <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                                    </div> */}
                  <a href={mention.url} target="_blank" rel="noopener noreferrer" className='font-jost text-[#F48A1F] text-sm'>Details</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default BrandWatchReport