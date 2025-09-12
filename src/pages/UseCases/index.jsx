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
            {/* Hero Section */}
            <div className='flex flex-col pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-[150px] lg:h-[388px] bg-[#F2F2F2] gap-4 md:gap-6 items-center px-4'>
                <div className='flex flex-col items-center gap-2 md:gap-3'>
                    <p className='text-[#E57E46] font-jost text-sm md:text-base font-semibold leading-5 md:leading-6'>Industry Applications</p>
                    <p className='text-GREY-_900 text-2xl md:text-3xl lg:text-[48px] font-semibold leading-8 md:leading-10 lg:leading-[60px] text-center'>Use Cases Across Industries</p>
                </div>
                <p className='text-[#667085] w-full md:w-4/5 lg:w-[768px] text-center font-jost text-base md:text-[18px] leading-6 md:leading-[28px]'>
                    ARA by Prophet is built to serve across industries, delivering tailored intelligence
                    solutions for every sector's unique challenges and opportunities.
                </p>
            </div>

            {/* Use Cases Sections */}
            <div className='flex flex-col gap-12 md:gap-16 lg:gap-[96px] px-4 md:px-8 lg:px-[80px] pt-8 md:pt-12 lg:pt-[63px]'>
                {/* Case 1 */}
                <div className='flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-[96px]'>
                    <div className='flex flex-col gap-4 w-full lg:w-[560px] order-2 lg:order-1'>
                        <p className='font-jost text-[#111827] font-semibold text-xl md:text-2xl lg:text-[30px] leading-7 md:leading-8 lg:leading-[38px]'>Brands & Corporates</p>
                        <p className='font-jost text-[#667085] text-base md:text-[18px] leading-6 md:leading-[28px]'>
                            Understand your audience through deep cultural insights,
                            anticipate market movements, benchmark against competitors,
                            and protect your brand reputation with comprehensive sentiment analysis.
                        </p>
                        <button className='w-full sm:w-[176px] flex items-center justify-center py-3 md:py-4 px-2 rounded-xl bg-[#111827] mt-2'>
                            <p className='text-white font-medium font-jost leading-6 text-sm md:text-base'>Get started for free</p>
                        </button>
                    </div>
                    <div className='bg-[#F2F4F7] w-full lg:w-[560px] rounded-[16px] md:rounded-[24px] p-6 md:p-[40px] flex items-center justify-center order-1 lg:order-2'>
                        <img src={Meeting} alt='Meeting' className='w-full h-auto' />
                    </div>
                </div>

                {/* Case 2 */}
                <div className='flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-[96px]'>
                    <div className='bg-[#F2F4F7] w-full lg:w-[560px] rounded-[16px] md:rounded-[24px] p-6 md:p-[40px] flex items-center justify-center'>
                        <img src={MeetingB} alt='Meeting' className='w-full h-auto' />
                    </div>
                    <div className='flex flex-col gap-4 w-full lg:w-[560px]'>
                        <p className='font-jost text-[#111827] font-semibold text-xl md:text-2xl lg:text-[30px] leading-7 md:leading-8 lg:leading-[38px]'>PR & Communication Agencies</p>
                        <p className='font-jost text-[#667085] text-base md:text-[18px] leading-6 md:leading-[28px]'>
                            Monitor conversations in real-time, predict crises before they hit,
                            optimize campaigns with cultural insights, and gain competitive
                            intelligence—all in one platform.
                        </p>
                        <button className='w-full sm:w-[176px] flex items-center justify-center py-3 md:py-4 px-2 rounded-xl bg-[#111827] mt-2'>
                            <p className='text-white font-medium font-jost leading-6 text-sm md:text-base'>Get started for free</p>
                        </button>
                    </div>
                </div>

                {/* Case 3 */}
                <div className='flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-[96px]'>
                    <div className='flex flex-col gap-4 w-full lg:w-[560px] order-2 lg:order-1'>
                        <p className='font-jost text-[#111827] font-semibold text-xl md:text-2xl lg:text-[30px] leading-7 md:leading-8 lg:leading-[38px]'>Government & Policy Makers</p>
                        <p className='font-jost text-[#667085] text-base md:text-[18px] leading-6 md:leading-[28px]'>
                            Gauge public sentiment, forecast risks, and design responsive policies.
                        </p>
                        <ul className='pl-5 font-jost text-base md:text-[18px] text-[#667085] list-disc'>
                            <li>Public sentiment analysis and policy impact assessment</li>
                            <li>Evidence-based policy design and implementation tracking</li>
                            <li>Risk forecasting and scenario planning tools</li>
                            <li>Crisis communication and public engagement strategies</li>
                        </ul>
                        <button className='w-full sm:w-[176px] flex items-center justify-center py-3 md:py-4 px-2 rounded-xl bg-[#111827] mt-2'>
                            <p className='text-white font-medium font-jost leading-6 text-sm md:text-base'>Get started for free</p>
                        </button>
                    </div>
                    <div className='bg-[#F2F4F7] w-full lg:w-[560px] rounded-[16px] md:rounded-[24px] p-6 md:p-[40px] flex items-center justify-center order-1 lg:order-2'>
                        <img src={MeetingC} alt='Meeting' className='w-full h-auto' />
                    </div>
                </div>

                {/* Case 4 */}
                <div className='flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-[96px]'>
                    <div className='bg-[#F2F4F7] w-full lg:w-[560px] rounded-[16px] md:rounded-[24px] p-6 md:p-[40px] flex items-center justify-center'>
                        <img src={MeetingD} alt='Meeting' className='w-full h-auto' />
                    </div>
                    <div className='flex flex-col gap-4 w-full lg:w-[560px]'>
                        <p className='font-jost text-[#111827] font-semibold text-xl md:text-2xl lg:text-[30px] leading-7 md:leading-8 lg:leading-[38px]'>Development Agencies & NGOs</p>
                        <p className='font-jost text-[#667085] text-base md:text-[18px] leading-6 md:leading-[28px]'>
                            Map cultural behaviors within communities, measure real-world impact,
                            design evidence-backed programs, and craft targeted stakeholder engagement
                            strategies that drive meaningful change.
                        </p>
                        <button onClick={() => navigate('/register')} className='w-full sm:w-[176px] flex items-center justify-center py-3 md:py-4 px-2 rounded-xl bg-[#111827] mt-2'>
                            <p className='text-white font-medium font-jost leading-6 text-sm md:text-base'>Get started for free</p>
                        </button>
                    </div>
                </div>

                {/* Case 5 */}
                <div className='flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-[96px]'>
                    <div className='flex flex-col gap-4 w-full lg:w-[560px] order-2 lg:order-1'>
                        <p className='font-jost text-[#111827] font-semibold text-xl md:text-2xl lg:text-[30px] leading-7 md:leading-8 lg:leading-[38px]'>Startups & Innovators</p>
                        <p className='font-jost text-[#667085] text-base md:text-[18px] leading-6 md:leading-[28px]'>
                            Monitor conversations in real-time, predict crises before they hit,
                            optimize campaigns with cultural insights,
                            and gain competitive intelligence—all in one platform.
                        </p>
                        <button onClick={() => navigate('/register')} className='w-full sm:w-[176px] flex items-center justify-center py-3 md:py-4 px-2 rounded-xl bg-[#111827] mt-2'>
                            <p className='text-white font-medium font-jost leading-6 text-sm md:text-base'>Get started for free</p>
                        </button>
                    </div>
                    <div className='bg-[#F2F4F7] w-full lg:w-[560px] rounded-[16px] md:rounded-[24px] p-6 md:p-[40px] flex items-center justify-center order-1 lg:order-2'>
                        <img src={MeetingE} alt='Meeting' className='w-full h-auto' />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className='mt-12 md:mt-16 lg:mt-[96px] flex flex-col lg:flex-row items-center px-4 md:px-8 lg:px-[80px] justify-between gap-8 md:gap-12'>
                <div className='flex flex-col gap-6 md:gap-8 lg:gap-10 order-2 lg:order-1'>
                    <div className='flex flex-col gap-4 md:gap-6'>
                        <p className='font-jost text-[#101828] text-2xl md:text-3xl lg:text-[48px] leading-8 md:leading-10 lg:leading-[60px] font-semibold text-center lg:text-left'>
                            No long-term contracts. <br /> No catches.
                        </p>
                        <p className='text-GREY-_500 font-jost text-base md:text-lg lg:text-[20px] leading-6 md:leading-7 lg:leading-[30px] text-center lg:text-left'>
                            Join over 4,000+ companies already growing with Prophet.
                        </p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start'>
                        <button onClick={() => { navigate("/about"); window.scrollTo(0, 0) }} className='bg-[#F2F2F2] w-full sm:w-[127px] rounded-lg flex items-center justify-center py-3 px-5'>
                            <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                        </button>
                        <button onClick={() => { navigate("/login"); window.scrollTo(0, 0) }} className='bg-[#111827] w-full sm:w-[128px] rounded-lg flex items-center justify-center py-3 px-5'>
                            <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                        </button>
                    </div>
                </div>
                <img src={Content} alt='Content' className='w-full lg:w-[576px] h-auto lg:h-[496px] order-1 lg:order-2' />
            </div>

            {/* Free Trial Section */}
            <div className="bg-[#1D2939] min-h-[207px] mt-32 lg:mt-[226px] relative px-6">
                <div className="bg-GREY-_50 rounded-[16px] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row justify-between gap-8 lg:gap-0 w-full lg:w-10/12 mx-auto -translate-y-20">
                    <div className="flex flex-col items-start gap-4">
                        <p className="text-GREY-_900 font-jost font-semibold text-2xl md:text-[30px] leading-snug">
                            Start your 14-day free trial
                        </p>
                        <p className="text-GREY-_500 text-base md:text-[20px] font-jost leading-relaxed">
                            Join over 4,000+ companies already growing with Prophet.
                        </p>
                    </div>
                    <div className="flex gap-3 items-center flex-wrap">
                        <button
                            onClick={() => navigate("/about")}
                            className="bg-[#F2F2F2] rounded-lg flex items-center py-3 px-5"
                        >
                            <p className="font-jost font-medium text-base leading-6 text-GREY-_700">Learn more</p>
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-[#111827] rounded-lg flex items-center py-3 px-5"
                        >
                            <p className="font-jost font-medium text-base leading-6 text-[#F2F2F2]">Get started</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UseCases