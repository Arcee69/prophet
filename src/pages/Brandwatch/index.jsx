import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import { MdCalendarToday, MdOutlineFileDownload } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

import Bubble from '../../assets/svg/bubble.svg'
import { LuPackage } from 'react-icons/lu';
import { RiPieChartLine } from 'react-icons/ri';
import { FiBarChart2 } from 'react-icons/fi';

const Brandwatch = () => {
    const [selectedTime, setSelectedTime] = useState("This Week")
    const [dateChange, setDateChange] = useState(1)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [search, setSearch] = useState("");

    const handleDateChange = (value) => {
        setDateChange(value)
    }

  return (
    <div className='flex flex-col gap-7 px-3 w-full'>
        <div className='flex flex-col gap-1'>
            <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Brandwatch</p>
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

        {/* Search */}
        <div className='flex items-center gap-2 w-full'>
            <div className='w-10/12 border border-[#E2E8F0] rounded-[10px] py-[9.5px]'>
                <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    placeholder="Search brands, keywords, or hashtags"
                    className="w-full bg-[#fcfcfc] pl-[38px] outline-none font-jost"
                />
            </div>
            <button className='bg-[#F48A1F] w-2/12 text-white px-4 rounded-[10px] py-[12.5px] flex items-center justify-center gap-2'>
                <FaPlus className='text-white w-5 h-5' />
                <p className='font-jost text-[#F8FAFC] whitespace-nowrap text-sm leading-[20px]'>Add Brand to Monitor</p>
            </button>
        </div>

        <div className='h-[450px] w-full  flex flex-col px-[25px] gap-[68px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl'>
            <div className='flex items-center gap-2'>
                <img src={Bubble} alt='Bubble' className='w-6 h-6' />
                <p className='font-jost text-[#6B7280] font-semibold text-lg'>Tracked Brands</p>
            </div>
            <div className='flex items-center justify-center w-[384px] mx-auto'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='bg-[#FFF7EF] rounded-full h-[72px] w-[72px] flex items-center justify-center p-4'>
                        <LuPackage className='w-10 h-10 text-[#F48A1F]' />
                    </div>
                    <p className='font-jost text-[#111827] text-lg leading-7'>No brands tracked yet</p>
                    <p className='font-jost text-[#6B7280] text-lg leading-6 text-center'>
                        Start monitoring brand mentions by searching for a
                        brand name above and adding it to your tracker.
                    </p>
                    <button className='bg-[#F48A1F] text-white px-4 rounded-[10px] py-[12.5px] flex items-center justify-center gap-2'>
                        <FaPlus className='text-white w-5 h-5' />
                        <p className='font-jost text-[#F8FAFC] whitespace-nowrap text-sm leading-[20px]'>Add Brand to Monitor</p>
                    </button>
                    <p className='font-jost text-[#6B7280] text-sm leading-6 text-center'>
                        You can track up to 2 brands on the Free Plan
                    </p>
                </div>
            </div>
        </div>

        <div className='flex items-center gap-[18px] w-full'>
            <div className='h-[362px] w-6/12 flex flex-col px-[25px] gap-[68px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl'>
                <div className='flex items-center gap-2'>
                    <RiPieChartLine className='w-5 h-5 text-[#F48A1F]' />
                    <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Sentiment Breakdown</p>
                </div>
                <div className='flex items-center justify-center w-[384px] mx-auto'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='bg-[#FFF7EF] rounded-full h-[72px] w-[72px] flex items-center justify-center p-4'>
                            <LuPackage className='w-10 h-10 text-[#F48A1F]' />
                        </div>
                        <p className='font-jost text-[#111827] text-lg leading-7'>No data to display</p>
                        <p className='font-jost text-[#6B7280] text-lg leading-6 text-center'>
                            Add a brand to track to see sentiment analysis data.
                        </p>
                    </div>
                </div>
            </div>
            <div className='h-[362px] w-6/12 flex flex-col px-[25px] gap-[68px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl'>
                <div className='flex items-center gap-2'>
                    <FiBarChart2 className='w-5 h-5 text-[#F48A1F]' />
                    <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Channel Performance</p>
                </div>
                <div className='flex items-center justify-center w-[384px] mx-auto'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='bg-[#FFF7EF] rounded-full h-[72px] w-[72px] flex items-center justify-center p-4'>
                            <LuPackage className='w-10 h-10 text-[#F48A1F]' />
                        </div>
                        <p className='font-jost text-[#111827] text-lg leading-7'>No data to display</p>
                        <p className='font-jost text-[#6B7280] text-lg leading-6 text-center'>
                            Add a brand to track to see channel performance data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Brandwatch