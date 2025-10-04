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
  const [selectedTime, setSelectedTime] = useState("This Week")
  const [dateChange, setDateChange] = useState(1)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sentimentData, setSentimentData] = useState(null)
  
      console.log(sentimentData, "sentimentData")
  
      const navigate = useNavigate()
  
      const {state} = useLocation()
      console.log(state, "state")
  
      useEffect(() => {
          const fetchSentiment = async () => {
              if (!state?.id) return;
              try {
                  const res = await api.get(appUrls?.BRANDWATCH_URL + `/data/${state.id}`)
                  setSentimentData(res?.data?.data?.aggregated_brand_watch_data)
                  console.log(res?.data?.data?.aggregated_brand_watch_data, "micku")
              } catch (err) {
                  console.log(err)
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
          series: [
            {
              name: state?.brand !== null ? state?.brand?.name : state?.keyword,
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
            colors: ['#BDDAFF'],
          }
      }), [state]);
      
  
      //Barchart
      const barChartData = useMemo(() => {
          const socialMedia1 = summary1.summary?.social_media_sentiment?.mentions || 0;
          const news1 = summary1.summary?.news_sentiment?.mentions || 0;
  
          return {
              series: [
                  {
                      name: state?.brand !== null ? state?.brand?.name : state?.keyword,
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
                  colors: ['#F48A1F'],
              }
          };
      }, [summary1, state]);
  
      const sources = summary1.sources || {youtube: [], news: []}
      const allUrls = [...sources.youtube, ...sources.news];
      const uniqueUrls = [...new Set(allUrls)]; 
  
      const topMentions = uniqueUrls.slice(0, 8).map(url => {
          const isYoutube = url.includes('youtube.com');
          const defaultInfo = {
              title: new URL(url).pathname.split('/').pop() || url.split('/').pop() || 'Link',
              snippet: 'No description available',
              sentiment: 'neutral'
          };
          return {
              url,
              type: isYoutube ? 'Youtube' : 'News',
              ...defaultInfo
          };
      })


   const reportRef = useRef(null);

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

  
      <div ref={reportRef}>
        <div className="flex flex-col gap-4">
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
                    data={mentionsData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  >
                    <XAxis type="category" dataKey="name" />
                    <YAxis type="number" domain={[0, 'dataMax']} tickFormatter={formatNumber} />
                    <Tooltip formatter={formatNumber} />
                    <Bar dataKey="value" fill="#F2E5FF">
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
                    <Bar dataKey="value" fill="#BDDAFF">
                      <LabelList dataKey="value" position="top" formatter={formatNumber} />
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
                    data={reachData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  >
                    <XAxis type="category" dataKey="name" />
                    <YAxis type="number" domain={[0, 'dataMax']} tickFormatter={formatNumber} />
                    <Tooltip formatter={formatNumber} />
                    <Bar dataKey="value" fill="#DEDEDE">
                      <LabelList dataKey="value" position="top" formatter={formatNumber} />
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
                  <div className='flex gap-5'>
                    <div className={`w-[57px] h-[24px] rounded-full p-1 ${mention.sentiment === 'positive' ? 'bg-[#DCFCE7]' : mention.sentiment === 'negative' ? 'bg-[#FFA8A8]' : 'bg-[#D3D3D3]'}`}>
                      <p className={`text-xs text-center font-inter ${mention.sentiment === 'positive' ? 'text-[#166534]' : mention.sentiment === 'negative' ? 'text-[#FF0000]' : 'text-[#808080]'}`}>{mention.sentiment}</p>
                    </div>
                
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
