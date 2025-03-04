import React, { useState } from 'react'
import Chart from 'react-apexcharts'
import { LuArchive, LuCalendarDays, LuShare2 } from 'react-icons/lu'
import { GoTag } from 'react-icons/go'
import { FiCheckCircle } from 'react-icons/fi'
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



const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("Last 30 days")
  const [selectedTime, setSelectedTime] = useState("This Week")

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

  return (
    <div className='flex flex-col gap-7 px-3 w-full'>

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

        <div className='bg-[#34B6FE] rounded-[18px] w-3/12 h-[220px] p-3 overflow-hidden cursor-pointer relative'  onClick={() => navigate("#")}>
          <img src={GlobeBig} alt='GlobeBig' className='absolute w-[155px] h-[155px] -top-14 -left-3' />
          <div className='absolute bottom-2 right-2 gap-[3px] flex flex-col items-end'>
            <img src={GlobeSmall} alt='GlobeSmall' className='w-[84px] h-[84px]' />
            <p className='font-jost font-medium text-base leading-[23px] text-white'>
              Multi-Channel Monitoring
            </p>
          </div>
        </div>

        <div className='bg-[#EA8B29] rounded-[18px] w-3/12 h-[220px] p-3 overflow-hidden cursor-pointer relative' onClick={() => navigate("#")}>
          <img src={AnalysisBig} alt='AnalysisBig' className='absolute w-[155px] h-[155px] -top-14 -left-3' />
          <div className='absolute bottom-2 right-2 gap-[3px] flex flex-col items-end'>
            <img src={AnalysisSmall} alt='AnalysisSmall' className='w-[84px] h-[84px]' />
            <p className='font-jost font-medium text-base leading-[23px] text-white'>
              Sentiment Analysis
            </p>
          </div>
        </div>

        <div className='bg-[#5BDC93] rounded-[18px] w-3/12 h-[220px] p-3 overflow-hidden cursor-pointer relative' onClick={() => navigate("#")}>
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

      {/* Top Mentions */}
      <div className='flex flex-col gap-[11px] '>
        <p className='font-jost font-semibold text-[18px]  text-[#6B7280]'>
          Top Mentions
        </p>

        <div className='grid grid-cols-2 gap-4'>

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

    </div>
  )
}

export default Dashboard
