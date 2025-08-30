import React from 'react'
import { useNavigate } from 'react-router-dom'

import Meeting from "../../assets/png/meeting.png"
import MeetingB from "../../assets/png/meetingB.png"
import MeetingC from "../../assets/png/meetingC.png"
import MeetingD from "../../assets/png/meetingD.png"
import MeetingE from "../../assets/png/meetingE.png"
import Content from "../../assets/png/content.png"

const UseCases = () => {

    const navigate = useNavigate()

    return (
        <div className='w-full bg-white'>
            <div className='flex flex-col h-[388px] pt-[150px]  bg-[#F2F2F2] gap-6 items-center'>
                <div className='flex flex-col items-center gap-3'>
                    <p className='text-[#E57E46] font-jost text-base font-semibold leading-6'>Industry Applications</p>
                    <p className='text-GREY-_900 text-[48px] font-semibold leading-[60px]'>Use Cases Across Industries</p>
                </div>
                <p className='text-[#667085] w-[768px] text-center font-jost text-[18px] leading-[28px]'>
                    ARA by Prophet is built to serve across industries, delivering tailored intelligence
                    solutions for every sector's unique challenges and opportunities.
                </p>
            </div>
            <div className='flex flex-col  gap-[96px] px-[80px] pt-[63px]'>
                <div className='flex items-center gap-[96px]'>
                    <div className='flex flex-col gap-4 w-[560px]'>
                        <p className='font-jost text-[#111827] font-semibold text-[30px] leading-[38px]'>Brands & Corporates</p>
                        <p className='font-jost text-[#667085] text-[18px] leading-[28px]'>
                            Understand your audience through deep cultural insights,
                            anticipate market movements, benchmark against competitors,
                            and protect your brand reputation with comprehensive sentiment analysis.
                        </p>
                        <button className='w-[176px] flex items-center justify-center py-4 px-2 rounded-xl bg-[#111827]'>
                            <p className='text-white font-medium font-jost leading-6 text-base'>Get started for free</p>
                        </button>
                    </div>
                    <div className='bg-[#F2F4F7] w-[560px] rounded-[24px] p-[40px] flex items-center justify-center'>
                        <img src={Meeting} alt='Meeting' className='' />
                    </div>
                </div>
                <div className='flex items-center gap-[96px]'>
                    <div className='bg-[#F2F4F7] w-[560px] rounded-[24px] p-[40px] flex items-center justify-center'>
                        <img src={MeetingB} alt='Meeting' className='' />
                    </div>
                    <div className='flex flex-col gap-4 w-[560px]'>
                        <p className='font-jost text-[#111827] font-semibold text-[30px] leading-[38px]'>PR & Communication Agencies</p>
                        <p className='font-jost text-[#667085] text-[18px] leading-[28px]'>
                            Monitor conversations in real-time, predict crises before they hit,
                            optimize campaigns with cultural insights, and gain competitive
                            intelligence—all in one platform.
                        </p>
                        <button className='w-[176px] flex items-center justify-center py-4 px-2 rounded-xl bg-[#111827]'>
                            <p className='text-white font-medium font-jost leading-6 text-base'>Get started for free</p>
                        </button>
                    </div>
                </div>
                <div className='flex items-center gap-[96px]'>
                    <div className='flex flex-col gap-4 w-[560px]'>
                        <p className='font-jost text-[#111827] font-semibold text-[30px] leading-[38px]'>Government & Policy Makers</p>
                        <p className='font-jost text-[#667085] text-[18px] leading-[28px]'>
                            Gauge public sentiment, forecast risks, and design responsive policies.
                        </p>
                        <ul className='pl-5 font-jost text-[18px] text-[#667085] list-disc'>
                            <li>Public sentiment analysis and policy impact assessment</li>
                            <li>Evidence-based policy design and implementation tracking</li>
                            <li>Risk forecasting and scenario planning tools</li>
                            <li>Crisis communication and public engagement strategies</li>
                        </ul>
                        <button className='w-[176px] flex items-center justify-center py-4 px-2 rounded-xl bg-[#111827]'>
                            <p className='text-white font-medium font-jost leading-6 text-base'>Get started for free</p>
                        </button>
                    </div>
                    <div className='bg-[#F2F4F7] w-[560px] rounded-[24px] p-[40px] flex items-center justify-center'>
                        <img src={MeetingC} alt='Meeting' className='' />
                    </div>
                </div>
                <div className='flex items-center gap-[96px]'>
                    <div className='bg-[#F2F4F7] w-[560px] rounded-[24px] p-[40px] flex items-center justify-center'>
                        <img src={MeetingD} alt='Meeting' className='' />
                    </div>
                    <div className='flex flex-col gap-4 w-[560px]'>
                        <p className='font-jost text-[#111827] font-semibold text-[30px] leading-[38px]'>Development Agencies & NGOs</p>
                        <p className='font-jost text-[#667085] text-[18px] leading-[28px]'>
                            Map cultural behaviors within communities, measure real-world impact,
                            design evidence-backed programs, and craft targeted stakeholder engagement
                            strategies that drive meaningful change.
                        </p>
                        <button onClick={() => navigate('/register')} className='w-[176px] flex items-center justify-center py-4 px-2 rounded-xl bg-[#111827]'>
                            <p className='text-white font-medium font-jost leading-6 text-base'>Get started for free</p>
                        </button>
                    </div>
                </div>
                <div className='flex items-center gap-[96px]'>
                    <div className='flex flex-col gap-4 w-[560px]'>
                        <p className='font-jost text-[#111827] font-semibold text-[30px] leading-[38px]'>Startups & Innovators</p>
                        <p className='font-jost text-[#667085] text-[18px] leading-[28px]'>
                            Monitor conversations in real-time, predict crises before they hit,
                            optimize campaigns with cultural insights,
                            and gain competitive intelligence—all in one platform.
                        </p>
                        <button onClick={() => navigate('/register')} className='w-[176px] flex items-center justify-center py-4 px-2 rounded-xl bg-[#111827]'>
                            <p className='text-white font-medium font-jost leading-6 text-base'>Get started for free</p>
                        </button>
                    </div>
                    <div className='bg-[#F2F4F7] w-[560px] rounded-[24px] p-[40px] flex items-center justify-center'>
                        <img src={MeetingE} alt='Meeting' className='' />
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
                        <button onClick={() => {navigate("/about"), window.scrollTo(0, 0)}} className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
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

export default UseCases