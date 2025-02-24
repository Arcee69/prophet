import React, { useState } from 'react'
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
import StackedBarChart from '../../../components/StackedBarChart'

//Images
import Girl from "../../../assets/png/girl.png"

//svgs
import Facebook from "../../../assets/svg/facebook.svg"
import Twitter from "../../../assets/svg/twitter.svg"
import Pinterest from "../../../assets/svg/pinterest.svg"
import Happy from "../../../assets/svg/happy.svg"
import Sad from "../../../assets/svg/sad.svg"
import Normal from "../../../assets/svg/normal.svg"


const Compare = ({ search }) => {
    const [activeTab, setActiveTab] = useState(1)
    const [selectedBrand, setSelectedBrand] = useState("")
    const [selectedTime, setSelectedTime] = useState("This Week")
    const [dateChange, setDateChange] = useState(1)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const brands = [
        "Cadbury", "Unilever", "MTN"
    ]

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    const handleDateChange = (value) => {
        setDateChange(value)
    }

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
          colors: ['#1E5631', '#FF4E4C'],
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
          colors: ['#1E5631', '#FF4E4C'],
        }
      })

  return (
    <div className='w-full flex flex-col gap-[32px]'>
        <div className='bg-[#fff] h-[88px] rounded-[8px] flex justify-between p-[25px]'>
            <p className='font-jost font-semibold text-[#1F2937] leading-[32px] text-[24px]'>{search} : {selectedBrand || null}</p>
            <div className='flex items-center'>
                <div className='flex items-center gap-1 w-[101px] h-[40px]'>
                    <AiOutlineDownload className='w-5 h-5 text-[#374151]'/>
                    <p className='text-[#374151] text-base font-lato'>Export</p>
                </div>
                <div className='border border-[#E5E7EB] rounded-[8px] flex items-center'>
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
                <CiMenuKebab className='text-[#98A2B3] w-5 h-5' />
            </div>
            <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className='bg-[#fff] w-6/12 rounded-[8px] py-[14px] px-[17px] text-[18px] font-lato text-[#F48A1F] flex items-center outline-none'
            >
                <option value="">Compare with another Search</option>
                {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>
        </div>

        <div className='bg-[#fff] rounded-[8px] flex flex-col p-6 gap-2 w-full'>
            <div className='flex items-center justify-between'>
                <p className='font-lato text-base font-semibold text-[#1F2937]'>Filters</p>
                <p className='font-lato text-[#E57E46] text-sm'>Clear All</p>
            </div>
            <div className='flex gap-4 items-center'>
                <div className='bg-[#F9FAFB] w-[181px] h-[36px] rounded-[8px] p-2 flex items-center gap-2'>
                    <IoIosRadio className='w-5 h-5 text-[#374151]' />
                    <p className='text-sm text-[#374151] font-lato'>All Media</p>
                </div>
                <div className='bg-[#F9FAFB] w-[181px] h-[36px] rounded-[8px] p-2 flex items-center gap-2'>
                    <GoGlobe className='w-5 h-5 text-[#374151]' />
                    <p className='text-sm text-[#374151] font-lato'>All sources</p>
                </div>
                <div className='bg-[#F9FAFB] w-[181px] h-[36px] rounded-[8px] p-2 flex items-center gap-2'>
                    <IoLocationOutline className='w-5 h-5 text-[#374151]' />
                    <p className='text-sm text-[#374151] font-lato'>Worldwide</p>
                </div>
                <div className='bg-[#F9FAFB] w-[90px] h-[36px] rounded-[8px] p-2 flex items-center gap-1'>
                    <img src={Happy} className='w-[18px] h-[18px]' />
                    <img src={Normal} className='w-[18px] h-[18px]' />
                    <img src={Sad} className='w-[18px] h-[18px]' />
                </div>

                {/* <div className='bg-[#F9FAFB] w-[472px] h-[36px] rounded-[8px] px-[26px] py-2 flex items-center gap-1'>
                    <div className='flex items-center w-6/12 gap-[5px]'>
                        <div className={`${dateChange === 1 ? "bg-[#F48A1F]" : ""} cursor-pointer rounded-full p-1 flex items-center justify-center`} onClick={() => handleDateChange(1)}>
                            <p className={`${dateChange === 1 ? "text-[#FFFFFF]" : "text-[#546E7A]"} text-sm font-lato`}>1D</p>
                        </div>
                        <div className={`${dateChange === 2 ? "bg-[#F48A1F]" : ""} cursor-pointer rounded-full p-1 flex items-center justify-center`} onClick={() => handleDateChange(2)}>
                            <p className={`${dateChange === 2 ? "text-[#FFFFFF]" : "text-[#546E7A]"} text-sm font-lato`}>7D</p>
                        </div>
                        <div className={`${dateChange === 3 ? "bg-[#F48A1F]" : ""} cursor-pointer rounded-full p-1 flex items-center justify-center`} onClick={() => handleDateChange(3)}>
                            <p className={`${dateChange === 3 ? "text-[#FFFFFF]" : "text-[#546E7A]"} text-sm font-lato`}>30D</p>
                        </div>
                        <div className={`${dateChange === 4 ? "bg-[#F48A1F]" : ""} cursor-pointer rounded-full p-1 flex items-center justify-center`} onClick={() => handleDateChange(4)}>
                            <p className={`${dateChange === 4 ? "text-[#FFFFFF]" : "text-[#546E7A]"} text-sm font-lato`}>3M</p>
                        </div>
                        <div className={`${dateChange === 5 ? "bg-[#F48A1F]" : ""} cursor-pointer rounded-full p-1 flex items-center justify-center`} onClick={() => handleDateChange(5)}>
                            <p className={`${dateChange === 5 ? "text-[#FFFFFF]" : "text-[#546E7A]"} text-sm font-lato`}>6M</p>
                        </div>
                        <div className={`${dateChange === 6 ? "bg-[#F48A1F]" : ""} cursor-pointer rounded-full p-1 flex items-center justify-center`} onClick={() => handleDateChange(6)}>
                            <p className={`${dateChange === 6 ? "text-[#FFFFFF]" : "text-[#546E7A]"} text-sm font-lato`}>13M</p>
                        </div>
                    </div>
                    <div className='w-6/12'>

                    </div>
                </div> */}
                <div className="bg-[#F9FAFB] w-[472px] h-[36px] rounded-[8px] px-[26px] py-2 flex items-center gap-1">
                    {/* Date Range Options */}
                    <div className="flex items-center w-5/12 gap-[5px]">
                        {["1D", "7D", "30D", "3M", "6M", "13M"].map((label, index) => (
                            <div
                                key={index}
                                className={`cursor-pointer rounded-full p-1 flex items-center justify-center ${
                                    dateChange === index + 1 ? "bg-[#F48A1F]" : ""
                                }`}
                                onClick={() => handleDateChange(index + 1)}
                            >
                                <p
                                    className={`text-sm font-lato ${
                                        dateChange === index + 1 ? "text-[#FFFFFF]" : "text-[#546E7A]"
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

        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <StackedBarChart
                    title="Total Mentions"
                    series={[{ name: `${search}`, data: [300000] }]}
                    colors={["#BDDAFF"]}
                    labels={[`${search}`]}
                    max={300000}
                />
                <StackedBarChart
                    title="Engagement"
                    series={[{ name: `${search}`, data: [300000] }]}
                    colors={["#BDDAFF"]}
                    labels={[`${search}`]}
                    max={300000}
                />
            </div>
            <div className="flex items-center gap-4">
                <StackedBarChart
                    title="Sentiment"
                    series={[
                        { name: "Positive", data: [40] },
                        { name: "Negative", data: [41] },
                        { name: "Neutral", data: [19] },
                      ]}
                    colors={["#BDDAFF", "#FFA8A8", "#D3D3D3"]}
                    labels={[`${search}`]}
                    max={100}
                />
                <StackedBarChart
                    title="Potential Reach"
                    series={[{ name: `${search}`, data: [1000000] }]}
                    colors={["#BDDAFF"]}
                    labels={[`${search}`]}
                    max={1000000}
                />
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
                <p className='font-jost font-medium text-[20px] mb-4 text-[#4B5563]'>
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

export default Compare