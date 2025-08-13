import React, { useState } from 'react'
import Chart from 'react-apexcharts'
import { LuArchive, LuCalendarDays, LuShare2 } from 'react-icons/lu'
import { GoTag } from 'react-icons/go'
import { FiCheckCircle } from 'react-icons/fi'
import { IoDocumentTextOutline } from 'react-icons/io5'

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


const Test = () => {
  const [selectedYear, setSelectedYear] = useState("Last 30 days")
  const [selectedTime, setSelectedTime] = useState("This Week")

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

export default Test