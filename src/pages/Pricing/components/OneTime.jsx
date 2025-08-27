import React from 'react'
import { FaCheck } from 'react-icons/fa6'

const OneTime = () => {
  return (
    <div className='flex flex-col w-full gap-[64px]'>
        <div className='py-[80px] px-[66px] flex flex-col gap-[47px]'>
            <div className='flex flex-col items-center justify-center gap-3'>
                <p className='font-jost text-[#303A4E] font-bold leading-10 text-[36px]'>On-Demand Reports</p>
                <p className='text-[#737B8C] font-jost leading-[28px] text-[18px]'>Custom intelligence reports tailored to your specific needs</p>
            </div>
            <div className='grid grid-cols-4 gap-4'>
                <div className='shadow flex flex-col items-center justify-center p-[24.8px] gap-4'>
                    <div className='flex flex-col items-center gap-2'>
                        <p className='font-jost text-[#2B303B] text-[20px] leading-[28px] font-semibold'>Industry Reports</p>
                        <p className='font-jost text-sm text-[#737B8C] text-center'>Comprehensive industry analysis and market intelligence</p>
                    </div>
                    <p className='text-[#404040] font-jost font-semibold text-base leading-4'>$1,000 - $3,000</p>
                    <button className='flex items-center justify-center group border border-[#2F394E] rounded-lg hover:bg-[#303A4F] w-full py-[11px]'>
                        <p className='text-[#333D51] group-hover:text-white font-jost leading-5 text-sm font-semibold'>Request Quote</p>
                    </button>
                </div>
                <div className='shadow flex flex-col items-center justify-center p-[24.8px] gap-4'>
                    <div className='flex flex-col items-center gap-2'>
                        <p className='font-jost text-[#2B303B] text-[20px] leading-[28px] font-semibold'>Cultural Audits</p>
                        <p className='font-jost text-sm text-[#737B8C] text-center'>Deep-dive cultural behavior mapping and insightse</p>
                    </div>
                    <p className='text-[#404040] font-jost font-semibold text-base leading-4'>$1,000 - $3,000</p>
                    <button className='flex items-center justify-center group border border-[#2F394E] rounded-lg hover:bg-[#303A4F] w-full py-[11px]'>
                        <p className='text-[#333D51] group-hover:text-white font-jost leading-5 text-sm font-semibold'>Request Quote</p>
                    </button>
                </div>
                <div className='shadow flex flex-col items-center justify-center p-[24.8px] gap-4'>
                    <div className='flex flex-col items-center gap-2'>
                        <p className='font-jost text-[#2B303B] text-[20px] leading-[28px] font-semibold'>Political Pulse Reports</p>
                        <p className='font-jost text-sm text-[#737B8C] text-center'>Political sentiment and policy impact analysis</p>
                    </div>
                    <p className='text-[#404040] font-jost font-semibold text-base leading-4'>$1,000 - $3,000</p>
                    <button className='flex items-center justify-center group border border-[#2F394E] rounded-lg hover:bg-[#303A4F] w-full py-[11px]'>
                        <p className='text-[#333D51] group-hover:text-white font-jost leading-5 text-sm font-semibold'>Request Quote</p>
                    </button>
                </div>
                <div className='shadow flex flex-col items-center justify-center p-[24.8px] gap-4'>
                    <div className='flex flex-col items-center gap-2'>
                        <p className='font-jost text-[#2B303B] text-[20px] leading-[28px] font-semibold'>Crisis Playbooks</p>
                        <p className='font-jost text-sm text-[#737B8C] text-center'>Custom crisis management strategies and protocols</p>
                    </div>
                    <p className='text-[#404040] font-jost font-semibold text-base leading-4'>$1,000 - $3,000</p>
                    <button className='flex items-center justify-center group border border-[#2F394E] rounded-lg hover:bg-[#303A4F] w-full py-[11px]'>
                        <p className='text-[#333D51] group-hover:text-white font-jost leading-5 text-sm font-semibold'>Request Quote</p>
                    </button>
                </div>
            </div>
        </div>

        <div className='flex items-start px-[158.5px] gap-[92px]'>
            <div className='flex flex-col gap-3 w-[415px] h-[662.8px]'>
                <div className='flex flex-col gap-3'>
                    <p className='font-jost text-[#1B2232] font-bold leading-10 text-[36px]'>Enterprise Solutions</p>
                    <p className='font-jost text-[#737B8C] text-base leading-[28px]'>
                        White-label dashboards, API integration, and advisory retainers 
                        with custom pricing tailored to your enterprise needs.
                    </p>
                </div>
                <div className='flex flex-col gap-10'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center gap-3'>
                            <FaCheck className='text-[#3399FF] w-5 h-5'/>
                            <p className='font-jost leading-6 text-base text-[#2B303B]'>White-label dashboards</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <FaCheck className='text-[#3399FF] w-5 h-5'/>
                            <p className='font-jost leading-6 text-base text-[#2B303B]'>Full API integration</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <FaCheck className='text-[#3399FF] w-5 h-5'/>
                            <p className='font-jost leading-6 text-base text-[#2B303B]'>Advisory retainers</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <FaCheck className='text-[#3399FF] w-5 h-5'/>
                            <p className='font-jost leading-6 text-base text-[#2B303B]'>Custom pricing models</p>
                        </div>
                    </div>
                    <button 
                        className='w-[217px] rounded-lg h-[42px] flex items-center justify-center'
                        style={{
                            background: "linear-gradient(90deg, #1B2232, #303A50)"
                        }}
                    >
                        <p className='font-jost text-white text-sm font-semibold'>Contact Enterprise Sales</p>
                    </button>
                </div>
            </div>
            <div className='w-[596px] h-[662.8px] gap-6 flex flex-col '>
                <p className='font-jost font-bold leading-10 text-[36px] text-[#2B303B]'><span className=' text-[#F48A1F]'>ARA</span> On-Site Engagement</p>
                <p className='font-jost text-[#737B8C] text-base leading-[28px]'>
                    Bring ARA directly to your events, workshops, and strategic sessions
                    for immersive intelligence experiences.
                </p>
                <div className='bg-[#EEEEEE69] rounded-lg p-4 flex flex-col gap-6'>
                    <div className='bg-white rounded-xl p-6 flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                            <p className='font-jost font-semibold text-[#2B303B] leading-7 text-[18px]'>Corporate Workshops</p>
                            <p className='text-xs font-jost text-[#8C8C8C] leading-4'>$5,000/day</p>
                        </div>
                        <p className='font-jost text-[#737B8C] text-sm leading-5'>
                            Interactive ARA-powered workshops for your team
                        </p>
                    </div>
                    <div className='bg-white rounded-xl p-6 flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                            <p className='font-jost font-semibold text-[#2B303B] leading-7 text-[18px]'>Policy Briefings</p>
                            <p className='text-xs font-jost text-[#8C8C8C] leading-4'>$10,000/day</p>
                        </div>
                        <p className='font-jost text-[#737B8C] text-sm leading-5'>
                            Strategic intelligence briefings for policy makers
                        </p>
                    </div>
                    <div className='bg-white rounded-xl p-6 flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                            <p className='font-jost font-semibold text-[#2B303B] leading-7 text-[18px]'>Global Events</p>
                            <p className='text-xs font-jost text-[#8C8C8C] leading-4'>From $15,000/day</p>
                        </div>
                        <p className='font-jost text-[#737B8C] text-sm leading-5'>
                            Premium ARA activations at major conferences and summits
                        </p>
                    </div>
                </div>
                <button
                    className='border border-[#2F394F] w-full py-[11px] group hover:bg-[#303A4F] rounded-lg flex items-center justify-center'
                >
                    <p className='font-jost font-semibold text-sm leading-5 group-hover:text-white text-[#2F384E]'>Book ARA Experience</p>
                </button>
            </div>
        </div>
    </div>
  )
}

export default OneTime