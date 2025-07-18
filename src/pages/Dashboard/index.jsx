import React, { useState } from 'react'
import Chart from 'react-apexcharts'
import { LuArchive, LuCalendarDays, LuClipboardList, LuShare2 } from 'react-icons/lu'
import { GoTag } from 'react-icons/go'
import { FiCheckCircle, FiPlus, FiThumbsUp } from 'react-icons/fi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

//Svgs
import ArrowUp from "../../assets/svg/arrow_up.svg"
import Chat from "../../assets/svg/chat.svg"
import Pie from "../../assets/svg/pie.svg"
import Alert from "../../assets/svg/alert.svg"
import Facebook from "../../assets/svg/facebook.svg"
import Twitter from "../../assets/svg/twitter.svg"
import Pinterest from "../../assets/svg/pinterest.svg"

// Images
import Voice from "../../assets/png/voice.png"
import Line from "../../assets/png/line.png"
import AnalysisBig from "../../assets/png/analysis_big.png"
import ReportBig from "../../assets/png/report_big.png"
import GlobeBig from "../../assets/png/globe_big.png"
import AnalysisSmall from "../../assets/png/analysis_small.png"
import ReportSmall from "../../assets/png/report_small.png"
import GlobeSmall from "../../assets/png/globe_small.png"
import Girl from "../../assets/png/girl.png"
import { useSelector } from 'react-redux'
import { MdCalendarToday, MdOutlineFileDownload } from 'react-icons/md'
import DatePicker from 'react-datepicker'
import { AiOutlinePlus, AiOutlineWarning } from 'react-icons/ai'



const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("Last 30 days")
  const [selectedTime, setSelectedTime] = useState("This Week")
  const [dateChange, setDateChange] = useState(1)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Brands');
  
  const handleDateChange = (value) => {
      setDateChange(value)
  }

  const navigate = useNavigate()

  const { user } = useSelector(state => state.userLogin)


  // Line Chart Data
  const [lineChartData] = useState({
    series: [
      {
        name: 'Positive',
        data: [10, 20, 15, 25, 20, 30]
      },
      {
        name: 'Negative',
        data: [5, 10, 8, 12, 10, 15]
      },
      {
        name: 'Neutral',
        data: [8, 15, 10, 18, 15, 22]
      },
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      colors: ['#1E5631', '#FF4E4C', '#FFBE00'],
    }
  })

  // Bar Chart Data
  const [barChartData] = useState({
    series: [
      {
        name: 'Positive',
        data: [40, 30, 25, 15,]
      },
      {
        name: 'Negative',
        data: [15, 20, 10, 5]
      },
      {
        name: 'Neutral',
        data: [25, 15, 20, 10]
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
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
        categories: ['Social Media', 'News', 'Blogs', 'Radio' ],
      },
      colors: ['#1E5631', '#FF4E4C', '#FFBE00'],
    }
  })

  const brands = [
    {
      name: 'Dangote',
      role: 'Default Brand',
      initial: 'D',
      sentiment: { 
        positive: 65, 
        neutral: 25, 
        negative: 10 
      },
      totalMentions: 12500,
      growth: 8,
      roleColor: 'bg-[#E57E46]',
    },
    {
      name: 'Cadbury',
      role: 'Competition',
      initial: 'C',
      sentiment: { 
        positive: 65, 
        neutral: 25, 
        negative: 10 
      },
      totalMentions: 12500,
      growth: 8,
      roleColor: 'bg-[#BFBFBF]',
    }
  ];

  return (
    <div className='flex flex-col gap-7 px-3 w-full'>
      
      <div className='flex flex-col gap-1'>
        <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Dashboard</p>
        <p className='text-[#667185] text-sm font-jost'>Monitor your brand performance and sentiment analysis</p>
      </div>
      <div className='flex items-center justify-between'>
        <div className="w-[472px] h-[36px] rounded-[8px] px-[7px] py-2 flex items-center gap-8">
          {/* Date Range Options */}
          <div className="flex items-center w-5/12 gap-[5px]">
            {["1D", "7D", "30D", "3M", "6M", "13M"].map((label, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-md w-[40px] py-1.5 px-2 flex items-center justify-center ${dateChange === index + 1 ? "bg-[#F48A1F]" : "border-[0.8px] border-[#E7EDF6]"
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
            <MdCalendarToday className="text-[#546E7A]" />
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
        <button
          className='flex items-center px-4 py-2 rounded-lg bg-[#111827] w-[138px] justify-center gap-2'
        >
          <p className='font-jost font-medium text-base text-[#fff] whitespace-nowrap leading-[145%]'>Export Data</p>
          <MdOutlineFileDownload className='text-[#fff] w-5 h-5' />
        </button>
      </div>

      {/* Greeting */}
      <p className='font-jost font-semibold text-[18px] leading-[28px] text-[#6B7280]'>
        Hi {`${user?.data?.name}`},
      </p>

      {/* Top Four Colored Boxes */}
      <div className='flex items-center gap-4'>
        <div className='bg-[#FB6B63] rounded-[18px] w-3/12 h-[220px] p-3 overflow-hidden cursor-pointer relative' onClick={() => navigate("/ara")}>
          <img src={Line} alt='Line' className='absolute w-[155px] h-[255px] -top-16 -left-1' />
          <div className='absolute bottom-2 right-2 gap-[3px] flex flex-col'>
            <img src={Voice} alt='Voice' className='w-[84px] h-[84px]' />
            <p className='font-jost font-medium text-base leading-[23px] text-white'>
              Ask Ara AI
            </p>
          </div>
        </div>

        <div className='bg-[#34B6FE] rounded-[18px] w-3/12 h-[220px] p-3 overflow-hidden cursor-pointer relative'  onClick={() => navigate("/brandwatch")}>
          <img src={GlobeBig} alt='GlobeBig' className='absolute w-[155px] h-[155px] -top-14 -left-3' />
          <div className='absolute bottom-2 right-2 gap-[3px] flex flex-col items-end'>
            <img src={GlobeSmall} alt='GlobeSmall' className='w-[84px] h-[84px]' />
            <p className='font-jost font-medium text-base leading-[23px] text-white'>
              Brand Watch
            </p>
          </div>
        </div>

        <div className='bg-[#EA8B29] rounded-[18px] w-3/12 h-[220px] p-3 overflow-hidden cursor-pointer relative' onClick={() => navigate("/sentiment-analysis")}>
          <img src={AnalysisBig} alt='AnalysisBig' className='absolute w-[155px] h-[155px] -top-14 -left-3' />
          <div className='absolute bottom-2 right-2 gap-[3px] flex flex-col items-end'>
            <img src={AnalysisSmall} alt='AnalysisSmall' className='w-[84px] h-[84px]' />
            <p className='font-jost font-medium text-base leading-[23px] text-white'>
              Sentiment Analysis
            </p>
          </div>
        </div>

        <div className='bg-[#5BDC93] rounded-[18px] w-3/12 h-[220px] p-3 overflow-hidden cursor-pointer relative' onClick={() => navigate("/reports")}>
          <img src={ReportBig} alt='ReportBig' className='absolute w-[155px] h-[155px] -top-14 -left-3' />
          <div className='absolute bottom-2 right-2 gap-[3px] flex flex-col items-end'>
            <img src={ReportSmall} alt='ReportSmall' className='w-[84px] h-[84px]' />
            <p className='font-jost font-medium text-base leading-[23px] text-white'>
              Reports
            </p>
          </div>
        </div>
      </div>

      {/* Small Stats Cards (Today Mentions, Total Mentions, etc.) */}
      <div className='flex gap-4'>

        <div className='bg-white rounded-[18px] p-4 w-3/12 shadow-sm flex flex-col gap-[45px]'>
          <div className='flex items-center justify-between'>
            <img src={ArrowUp} alt='ArrowUp' className='w-6 h-6' />
            <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className='font-jost text-[#98A2B3]  text-xs cursor-pointer bg-transparent border-none outline-none'
            >
                {["Last 30 days", "Last 7 days"].map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-[#667185] font-jost text-sm'>Today Sentiments</p>
            <div className='flex items-center gap-[14px]'>
              <h3 className='text-[#101928] font-inter text-[18px]  font-semibold'>5,837</h3>
              <div className='bg-[#E7F6EC] w-[40px] h-[17px] rounded-lg items-center flex justify-center p-2'>
                <p className='text-[#036B26] font-inter text-xs font-medium'>+1.3%</p>
              </div>
            </div>
          </div>

        </div>

        <div className='bg-white rounded-[18px] p-4 w-3/12 shadow-sm flex flex-col gap-[45px]'>
          <div className='flex items-center justify-between'>
            <img src={Chat} alt='Chat' className='w-6 h-6' />
            <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className='font-jost text-[#98A2B3]  text-xs cursor-pointer bg-transparent border-none outline-none'
            >
                {["Last 30 days", "Last 7 days"].map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-[#667185] font-jost text-sm'>Today Mentions</p>
            <div className='flex items-center gap-[14px]'>
              <h3 className='text-[#101928] font-inter text-[18px]  font-semibold'>3,024</h3>
              <div className='bg-[#E7F6EC] w-[40px] h-[17px] rounded-lg items-center flex justify-center p-2'>
                <p className='text-[#036B26] font-inter text-xs font-medium'>+8%</p>
              </div>
            </div>
          </div>

        </div>

        <div className='bg-white rounded-[18px] p-4 w-3/12 shadow-sm flex flex-col gap-[45px]'>
          <div className='flex items-center justify-between'>
            <img src={Pie} alt='Pie' className='w-6 h-6' />
            <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className='font-jost text-[#98A2B3]  text-xs cursor-pointer bg-transparent border-none outline-none'
            >
                {["Last 30 days", "Last 7 days"].map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-[#667185] font-jost text-sm'>Channel Distribution</p>
            <div className='flex items-center gap-[14px]'>
              <h3 className='text-[#101928] font-inter text-[18px]  font-semibold'>8</h3>
              <div className='bg-[#E7F6EC] w-[40px] h-[17px] rounded-lg items-center flex justify-center p-2'>
                <p className='text-[#036B26] font-inter text-xs font-medium'>+2%</p>
              </div>
            </div>
          </div>
        </div>

       <div className='bg-white rounded-[18px] p-4 w-3/12 shadow-sm flex flex-col gap-[45px]'>
          <div className='flex items-center justify-between'>
            <img src={Alert} alt='Alert' className='w-6 h-6' />
            <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className='font-jost text-[#98A2B3]  text-xs cursor-pointer bg-transparent border-none outline-none'
            >
                {["Last 30 days", "Last 7 days"].map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-[#667185] font-jost text-sm'>Active Alerts</p>
            <div className='flex items-center gap-[14px]'>
              <h3 className='text-[#101928] font-inter text-[18px]  font-semibold'>240</h3>
              <div className='bg-[#E7F6EC] w-[40px] h-[17px] rounded-lg items-center flex justify-center p-2'>
                <p className='text-[#036B26] font-inter text-xs font-medium'>+2%</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tracked Brands */}
       <div className='flex flex-col gap-6'>
      <p className='font-jost text-[#6B7280] text-[24px] leading-[28px] font-semibold'>
        Tracked Brands
      </p>

      <div className='flex gap-6'>
        {brands.map((brand, index) => (
          <div
            key={index}
            className='bg-white p-4 rounded-2xl shadow-md w-4/12 h-[321px] flex flex-col gap-6'
          >
            {/* Header */}
            <div className='flex items-center gap-4'>
              <div className='bg-[#F9FAFB] text-[#111827] font-bold text-2xl rounded-full w-[56px] h-[56px] flex items-center justify-center'>
                {brand.initial}
              </div>
              <div className='flex flex-col gap-1'>
                <p className='font-semibold font-jost text-[#111827] text-[20px]'>{brand.name}</p>
                <div className='flex items-center gap-2'>
                  <div className={`${brand.roleColor} w-[10px] h-[10px] rounded-full`}></div>
                  <p className={`text-sm font-jost text-[#98A2B3]`}>{brand.role}</p>
                </div>
              </div>
            </div>

            {/* Sentiment bars */}
            <div className='flex flex-col gap-[37px]'>
            {[
              { label: 'Positive', color: 'bg-[#1E5631]', value: brand.sentiment.positive },
              { label: 'Neutral', color: 'bg-[#75869F]', value: brand.sentiment.neutral },
              { label: 'Negative', color: 'bg-[#FF4E4C]', value: brand.sentiment.negative },
            ].map((item, i) => (
              <div key={i} className='flex items-center justify-between text-sm w-full'>
                <div className='flex items-center gap-2 w-full'>
                  <p className={`${item.label === 'Positive' ? 'text-[#1E5631]' : item.label === 'Neutral' ? 'text-[#75869F]' : 'text-[#FF4E4C]'} font-jost font-medium text-sm min-w-[60px]`}>
                    {item.label}
                  </p>
                  <div className='flex-1'>
                    <div
                      className={`${item.color} h-[8px] rounded`}
                      style={{ width: `${Math.max(1, item.value)}%` }}
                    ></div>
                  </div>
                  <p className='text-[#09101D] font-jost text-sm ml-2 min-w-[40px] text-right'>
                    {item.value}%
                  </p>
                </div>
              </div>
            ))}
            </div>

            {/* Mentions and growth */}
            <div className='flex justify-between items-center pt-2'>
              <div className='flex flex-col gap-1'>
                <p className='font-medium font-jost text-base text-[#667185]'>Total Mentions</p>
                <p className='text-[13px] text-[#09101D] font-medium'>{brand.totalMentions.toLocaleString()}</p>
              </div>
              <div className='bg-[#E7F6EC] font-jost text-[#036B26] text-sm px-2 py-1 rounded-full font-medium flex items-center gap-1'>
                <span className='text-[16px]'>↑</span>
                {brand.growth}%
              </div>
            </div>
          </div>
        ))}

        {/* Add New Brand Card */}
        <div className='w-4/12 h-[321px] rounded-2xl border border-white flex flex-col items-center justify-center px-5 py-8 text-center bg-white shadow-md'>
          <div className='bg-[#F9FAFB] w-10 h-10 flex items-center justify-center rounded-full mb-4'>
            <AiOutlinePlus className='text-gray-500 text-xl' />
          </div>
          <p className='text-[20px] font-jost text-black'>Add a new brand</p>
          <p className='text-[#6B7280] font-jost text-center text-sm mt-1'>
            Upgrade to Pro to track more brands and <br/> competitors
          </p>
          <button className='mt-4 bg-[#F97316] font-jost text-white py-2 px-4 rounded-lg font-medium text-base flex items-center gap-1'>
            Add Brand <AiOutlinePlus />
          </button>
        </div>
      </div>
    </div>

      {/* Charts Row */}
      <div className='flex gap-4'>
        {/* Sentiment Analysis Overview (Line Chart) */}
        <div className='bg-white rounded-[18px] w-1/2 p-4 shadow-sm'>
          <div className='flex justify-between items-start'>
            <p className='font-jost font-semibold text-[16px] mb-4 text-[#374151]'>
              Sentiment Analysis Overview
            </p>
            <select
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

        {/* Channel Sentiment Distribution (Bar Chart) */}
        <div className='bg-white rounded-[18px] w-1/2 p-4 shadow-sm'>
          <div className='flex items-start justify-between'>
            <p className='font-jost font-semibold text-[16px] mb-4 text-[#374151]'>
              Channel Sentiment Distribution
            </p>
            <p className='text-[#6B7280] font-jost text-sm'>Total Mentions: 6,200</p>
          </div>
          <Chart
            options={barChartData.options}
            series={barChartData.series}
            type='bar'
            height={300}
          />
        </div>
      </div>

      <div className='flex items-start w-full gap-6'>
        {/* Top Mentions */}
        <div className='flex flex-col w-7/12 gap-[11px] '>
          <p className='font-jost font-semibold text-[18px]  text-[#6B7280]'>
            Top Mentions
          </p>
          <div className='flex flex-col gap-6'>

            {/* Facebook Card */}
            <div className='bg-[#fff] h-[232px] flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
              <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' />
              <div className='flex gap-5 flex-col w-full'>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                      <img src={Facebook} alt='Facebook' className='w-5 h-5' />
                      <p className='font-jost text-sm text-[#000000]'>Facebook</p>
                    </div>
                    <p className='font-medium font-jost text-[10px] text-[#6B7280]'>@Mary Slessor</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <LuCalendarDays className='w-5 h-5 text-[#9CA3AF]' />
                    <p className='font-jost font-medium text-[#6B7280] text-xs'>14th Feb, 2024 10:05</p>
                  </div>
                </div>
                <p className='font-jost text-[#4B5563] text-sm'>
                  Great experience with the new product launch!#Innovation
                </p>
                <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
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
                </div>
                <div className='flex gap-5'>
                  <div className='bg-[#DCFCE7] w-[57px] h-[24px] rounded-full p-1'>
                    <p className='text-[#166534] text-xs text-center font-inter'>positive</p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                    <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                    <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                    <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                    <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                  </div>
                  <p className='font-jost text-[#F48A1F] text-sm'>Details</p>
                </div>
              </div>
            </div>

            {/* Twitter Card */}
            <div className='bg-[#fff] h-[232px] flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
              <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' />
              <div className='flex gap-5 flex-col w-full'>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                      <img src={Twitter} alt='Twitter' className='w-5 h-5' />
                      <p className='font-jost text-sm text-[#000000]'>Twitter</p>
                    </div>
                    <p className='font-medium font-jost text-[10px] text-[#6B7280]'>@Mary Slessor</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <LuCalendarDays className='w-5 h-5 text-[#9CA3AF]' />
                    <p className='font-jost font-medium text-[#6B7280] text-xs'>14th Feb, 2024 10:05</p>
                  </div>
                </div>
                <p className='font-jost text-[#4B5563] text-sm'>
                  Great experience with the new product launch!#Innovation
                </p>
                <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
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
                </div>
                <div className='flex gap-5'>
                  <div className='bg-[#DCFCE7] w-[57px] h-[24px] rounded-full p-1'>
                    <p className='text-[#166534] text-xs text-center font-inter'>positive</p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                    <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                    <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                    <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                    <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                  </div>
                  <p className='font-jost text-[#F48A1F] text-sm'>Details</p>
                </div>
              </div>
            </div>

            {/* Pinterest Card */}
            <div className='bg-[#fff] h-[232px] flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
              <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' />
              <div className='flex gap-5 flex-col w-full'>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                      <img src={Pinterest} alt='Pinterest' className='w-5 h-5' />
                      <p className='font-jost text-sm text-[#000000]'>Pinterest</p>
                    </div>
                    <p className='font-medium font-jost text-[10px] text-[#6B7280]'>@Mary Slessor</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <LuCalendarDays className='w-5 h-5 text-[#9CA3AF]' />
                    <p className='font-jost font-medium text-[#6B7280] text-xs'>14th Feb, 2024 10:05</p>
                  </div>
                </div>
                <p className='font-jost text-[#4B5563] text-sm'>
                  Great experience with the new product launch!#Innovation
                </p>
                <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
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
                </div>
                <div className='flex gap-5'>
                  <div className='bg-[#DCFCE7] w-[57px] h-[24px] rounded-full p-1'>
                    <p className='text-[#166534] text-xs text-center font-inter'>positive</p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                    <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                    <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                    <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                    <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                  </div>
                  <p className='font-jost text-[#F48A1F] text-sm'>Details</p>
                </div>
              </div>
            </div>

            {/* YouTube Card */}
            <div className='bg-[#fff] h-[232px] flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
              <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' />
              <div className='flex gap-5 flex-col w-full'>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                      <img src={Facebook} alt='Facebook' className='w-5 h-5' />
                      <p className='font-jost text-sm text-[#000000]'>Facebook</p>
                    </div>
                    <p className='font-medium font-jost text-[10px] text-[#6B7280]'>@Mary Slessor</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <LuCalendarDays className='w-5 h-5 text-[#9CA3AF]' />
                    <p className='font-jost font-medium text-[#6B7280] text-xs'>14th Feb, 2024 10:05</p>
                  </div>
                </div>
                <p className='font-jost text-[#4B5563] text-sm'>
                  Great experience with the new product launch!#Innovation
                </p>
                <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
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
                </div>
                <div className='flex gap-5'>
                  <div className='bg-[#DCFCE7] w-[57px] h-[24px] rounded-full p-1'>
                    <p className='text-[#166534] text-xs text-center font-inter'>positive</p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                    <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                    <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                    <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                    <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                  </div>
                  <p className='font-jost text-[#F48A1F] text-sm'>Details</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div className='flex flex-col w-5/12 gap-[11px] '>
          <p className='font-jost font-semibold text-[18px]  text-[#6B7280]'>
            Quick Actions
          </p>

          <div className="bg-white h-[294px] rounded-xl flex flex-col gap-4 p-6">
            <div className="flex item-center justify-between  bg-[#F1F5F9] rounded-[10px] p-1">
              {['Brands', 'Reports', 'Insights'].map((tab) => (
                <button
                  key={tab}
                  className={`text-sm font-medium w-[151px] font-jost p-2.5 text-center ${activeTab === tab
                      ? 'text-[#0F1729] bg-[#F8FAFC] rounded-[8px]'
                      : 'text-[#65758B]'
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button className="flex items-center gap-4 text-sm text-[#000] font-jost border border-[#E5E7EB] px-4 py-2 rounded-[10px] bg-[#F8FAFC]">
                <FiPlus /> Add Brand to Track
              </button>
              <button className="flex items-center gap-4 text-sm text-[#000] font-jost border border-[#E5E7EB] px-4 py-2 rounded-[10px] bg-[#F8FAFC]">
                <LuClipboardList/> Compare Brands
              </button>
              <button className="flex items-center gap-4 text-sm text-[#000] font-jost border border-[#E5E7EB] px-4 py-2 rounded-[10px] bg-[#F8FAFC]">
                <FiThumbsUp /> Brand Health Check
              </button>
            </div>
          </div>

          <div className='bg-white rounded-xl py-[29px] px-[25px] flex flex-col gap-[28px]'>
            <p className="text-[#6B7280] text-[18px] font-jost font-semibold mb-2">Recent Alerts</p>
            <div className="flex flex-col gap-4">
              {[
                {
                  title: 'Sudden Spike',
                  time: '15 minutes ago',
                  desc: 'Unusual increase in mentions for Apple',
                },
                {
                  title: 'Sentiment Shift',
                  time: '2 hours ago',
                  desc: 'Negative sentiment growing for Samsung',
                },
                {
                  title: 'New Trend',
                  time: '5 hours ago',
                  desc: 'New hashtag trending: #AppleEvent',
                },
              ].map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-[#FBFAF9] h-[68px] p-3 rounded-lg"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#D1A3520F] mt-1">
                    <AiOutlineWarning size={20} className='text-[#D1A352]' />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className="font-medium text-sm font-jost text-[#0F1729]">
                      {alert.title}{' '}
                      <span className="font-normal text-[#65758B] text-xs ml-2">
                        {alert.time}
                      </span>
                    </p>
                    <p className="text-sm font-jost leading-5 text-[#0F1729]">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
      

        </div>

      </div>

    </div>
  )
}

export default Dashboard
