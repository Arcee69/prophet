import React from 'react'
import { useNavigate } from 'react-router-dom'

import SuitePic from "../../assets/png/suite_pic.png"
import Content from "../../assets/png/content.png"

const Suite = () => {

    const navigate = useNavigate()
  return (
    <div className='w-full'>
        <div className='flex flex-col h-[388px] pt-[150px]  bg-[#F2F2F2] gap-6 items-center'>
            <div className='flex flex-col items-center gap-3'>
                <p className='text-[#E57E46] font-jost text-base font-semibold leading-6'>Our Suite</p>
                <p className='text-GREY-_900 text-[48px] font-semibold leading-[60px]'>Our Intelligence Suite</p>
            </div>
            <p className='text-[#667085] w-[768px] text-center font-jost text-[18px] leading-[28px]'>
               ARA delivers intelligence through different suites of solutions, 
               tailored for brands, agencies, consultancies, governments, and professionals.
            </p>
        </div>
        <div className='bg-white pb-[123px] pt-[95px] px-[80px] flex flex-col gap-[43px]'>
            <p className='text-GREY-_900 font-jost font-semibold leading-[60px] text-[48px]'>Tailored Intelligence Solutions</p>
            <div className='flex items-start gap-[88px]'>
                <div className='flex flex-col w-6/12'>
                    <div className='flex flex-col border-b border-[#2026332B] bg-[#F48A1F0D] p-2.5 border-dashed'>
                        <p className='text-[#F48A1F] font-jost font-semibold text-[24px] leading-[32px]'>Cultural Intelligence Suite</p>
                    </div>
                    <div className='flex flex-col border-b border-[#2026332B] p-2.5 border-dashed'>
                        <p className='text-[#737B8C] font-jost text-[24px] leading-[32px]'>Sentiment & Crisis Suite</p>
                    </div>
                    <div className='flex flex-col border-b border-[#2026332B] p-2.5 border-dashed'>
                        <p className='text-[#737B8C] font-jost text-[24px] leading-[32px]'>Market & Business Intelligence Suite</p>
                    </div>
                    <div className='flex flex-col border-b border-[#2026332B] p-2.5 border-dashed'>
                        <p className='text-[#737B8C] font-jost text-[24px] leading-[32px]'>Engagement & Experience Suite</p>
                    </div>
                </div>
                <div className='flex flex-col w-6/12 gap-[51px]'>
                    <img src={SuitePic} alt='SuitePic' className='w-[582px] h-[341px]' />
                    <div className='flex flex-col gap-[13px]'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-[#2B303B] font-medium font-jost text-[32px] leading-[32px]'>Cultural Intelligence Suite</p>
                            <p className='text-[#737B8C] font-jost leading-6 text-[18px]'>Decode cultural shifts and subcultures with deep AI-powered analysis</p>
                        </div>
                        <ul className='list-disc font-jost text-[#737B8C] text-[18px] leading-[26px] pl-5'>
                           <li>Decode cultural shifts and subcultures</li>
                           <li>Track emerging trends and consumer behaviours</li>
                           <li>Map out generational and regional insights</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className='bg-[#111827] py-[80px] px-[144px] flex flex-col items-center gap-[64px]'>
            <div className='flex flex-col items-center gap-6'>
                <p className='font-jost font-medium text-[48px] leading-[48px] text-[#D1D5DB]'>How ARA Works</p>
                <p className='font-jost text-white text-[20px] leading-7'>Seamless integration of AI intelligence across all your strategic needs</p>
            </div>
            <div className='flex gap-8 items-start'>
                <div className='flex flex-col items-center justify-center gap-4 w-[362.67px] h-[212px]'>
                    <div 
                        className='w-[80px] h-[80px] rounded-full flex items-center justify-center shadow-2xl'
                        style={{
                            background: "linear-gradient(90deg,#1B2232,#3D578D)"
                        }}
                    >
                        <p className='text-white font-jost leading-8 text-[24px]'>1</p>
                    </div>
                    <p className='text-[#D1D5DB] text-[20px] leading-[28px] font-jost'>Data Collection</p>
                    <p className='text-white font-jost text-base leading-6 text-center'>
                        ARA continuously monitors and collects data from
                        multiple sources across digital and traditional <br />
                        media.
                    </p>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 w-[362.67px] h-[212px]'>
                    <div 
                        className='w-[80px] h-[80px] rounded-full flex items-center justify-center shadow-2xl'
                        style={{
                            background: "linear-gradient(90deg,#1B2232,#3D578D)"
                        }}
                    >
                        <p className='text-white font-jost leading-8 text-[24px]'>2</p>
                    </div>
                    <p className='text-[#D1D5DB] text-[20px] leading-[28px] font-jost'>AI Analysis</p>
                    <p className='text-white font-jost text-base leading-6 text-center'>
                        Prophet's advanced AI engine processes and
                        analyzes the data to extract meaningful insights
                        and patterns.
                    </p>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 w-[362.67px] h-[212px]'>
                    <div 
                        className='w-[80px] h-[80px] rounded-full bg-[#F48A1F] flex items-center justify-center shadow-2xl'
                    >
                        <p className='text-white font-jost leading-8 text-[24px]'>3</p>
                    </div>
                    <p className='text-[#D1D5DB] text-[20px] leading-[28px] font-jost'>Actionable Intelligence</p>
                    <p className='text-white font-jost text-base leading-6 text-center'>
                        Receive clear, actionable recommendations and
                        insights tailored to your specific needs and
                        objectives.
                    </p>
                </div>
            </div>
        </div>

        <div className='mt-[96px] flex items-center px-[80px] justify-between'>
            <div className='flex flex-col gap-10'>
                <div className='flex flex-col gap-6'>
                    <p className='font-jost text-[#101828] text-[48px] leading-[60px] font-semibold'>No long-term contracts. <br /> No catches.</p>
                    <p className='text-GREY-_500 font-jost text-[20px] leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <button onClick={() => {navigate("/about"),  window.scrollTo(0, 0)}} className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
                        <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                    </button>
                    <button onClick={() => {navigate("/login"),  window.scrollTo(0, 0)}} className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
                        <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                    </button>
                </div>
            </div>
            <img src={Content} alt='Content' className='w-[576px] h-[496px]' />
        </div>

        <div className='bg-[#1D2939] h-[207px] mt-[226px] relative'>
            <div className='bg-GREY-_50 rounded-[16px] p-16 flex justify-between w-10/12 mx-auto absolute bottom-28 right-0 left-0'>
                <div className='flex flex-col items-start gap-4'>
                    <p className='text-GREY-_900 font-jost font-semibold text-[30px] leading-[38px]'>Start your 14-day free trial</p>
                    <p className='text-GREY-_500 text-[20px] font-jost leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <button onClick={() => {navigate("/about"),  window.scrollTo(0, 0)}} className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
                        <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                    </button>
                    <button onClick={() => {navigate("/login"),  window.scrollTo(0, 0)}} className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
                        <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                    </button>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Suite