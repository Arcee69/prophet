import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SuitePic from "../../assets/png/suite_pic.png"
import Content from "../../assets/png/content.png"

const Suite = () => {
    const [activeSuite, setActiveSuite] = useState('Cultural Intelligence Suite');
    const navigate = useNavigate();

    const suiteItems = [
        { id: 'cultural', title: 'Cultural Intelligence Suite', color: '#F48A1F' },
        { id: 'sentiment', title: 'Sentiment & Crisis Suite', color: '#737B8C' },
        { id: 'market', title: 'Market & Business Intelligence Suite', color: '#737B8C' },
        { id: 'engagement', title: 'Engagement & Experience Suite', color: '#737B8C' }
    ];

    const suiteDetails = {
        'Cultural Intelligence Suite': {
            description: 'Decode cultural shifts and subcultures with deep AI-powered analysis',
            features: [
                'Decode cultural shifts and subcultures',
                'Track emerging trends and consumer behaviours',
                'Map out generational and regional insights'
            ]
        },
        'Sentiment & Crisis Suite': {
            description: 'Monitor brand sentiment and manage crisis situations effectively',
            features: [
                'Real-time sentiment analysis',
                'Crisis detection and alerts',
                'Reputation management tools'
            ]
        },
        'Market & Business Intelligence Suite': {
            description: 'Gain comprehensive market insights for strategic decision making',
            features: [
                'Competitive intelligence',
                'Market trend analysis',
                'Business performance metrics'
            ]
        },
        'Engagement & Experience Suite': {
            description: 'Enhance customer engagement and optimize user experiences',
            features: [
                'Customer journey mapping',
                'Engagement metrics tracking',
                'Experience optimization tools'
            ]
        }
    };

    return (
        <div className='w-full'>
            {/* Hero Section */}
            <div className='flex flex-col pt-16 pb-12 md:pt-[100px] md:pb-16 lg:pt-[150px] lg:h-[388px] bg-[#F2F2F2] gap-4 md:gap-6 items-center px-4'>
                <div className='flex flex-col items-center gap-2 md:gap-3'>
                    <p className='text-[#E57E46] font-jost text-sm md:text-base font-semibold leading-5 md:leading-6'>Our Suite</p>
                    <p className='text-GREY-_900 text-2xl md:text-3xl lg:text-[48px] font-semibold leading-8 md:leading-10 lg:leading-[60px] text-center'>Our Intelligence Suite</p>
                </div>
                <p className='text-[#667085] w-full md:w-[90%] lg:w-[768px] text-center font-jost text-base md:text-[18px] leading-6 md:leading-[28px]'>
                    ARA delivers intelligence through different suites of solutions,
                    tailored for brands, agencies, consultancies, governments, and professionals.
                </p>
            </div>

            {/* Suite Selection Section */}
            <div className='bg-white pb-12 md:pb-16 lg:pb-[123px] pt-8 md:pt-12 lg:pt-[95px] px-4 md:px-8 lg:px-[80px] flex flex-col gap-6 md:gap-8 lg:gap-[43px]'>
                <p className='text-GREY-_900 font-jost font-semibold leading-8 md:leading-10 lg:leading-[60px] text-2xl md:text-3xl lg:text-[48px]'>Tailored Intelligence Solutions</p>

                <div className='flex flex-col lg:flex-row items-start gap-6 md:gap-8 lg:gap-[88px]'>
                    {/* Suite List - Mobile as tabs, desktop as list */}
                    <div className='w-full lg:w-6/12 flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar'>
                        {suiteItems.map((item) => (
                            <div
                                key={item.id}
                                className={`flex-shrink-0 lg:w-full border-b border-[#2026332B] p-2.5 border-dashed cursor-pointer
                                    ${activeSuite === item.title ? 'bg-[#F48A1F0D]' : ''}`}
                                onClick={() => setActiveSuite(item.title)}
                            >
                                <p
                                    className={`font-jost font-semibold text-lg md:text-xl lg:text-[24px] leading-6 md:leading-7 lg:leading-[32px]
                                        ${activeSuite === item.title ? 'text-[#F48A1F]' : 'text-[#737B8C]'}`}
                                >
                                    {item.title}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Suite Details */}
                    <div className='flex flex-col w-full lg:w-6/12 gap-6 md:gap-8 lg:gap-[51px]'>
                        <img
                            src={SuitePic}
                            alt='SuitePic'
                            className='w-full h-auto lg:w-[582px] lg:h-[341px] rounded-lg'
                        />
                        <div className='flex flex-col gap-4 md:gap-[13px]'>
                            <div className='flex flex-col gap-2'>
                                <p className='text-[#2B303B] font-medium font-jost text-xl md:text-2xl lg:text-[32px] leading-6 md:leading-7 lg:leading-[32px]'>
                                    {activeSuite}
                                </p>
                                <p className='text-[#737B8C] font-jost leading-5 md:leading-6 text-base md:text-[18px]'>
                                    {suiteDetails[activeSuite].description}
                                </p>
                            </div>
                            <ul className='list-disc font-jost text-[#737B8C] text-base md:text-[18px] leading-5 md:leading-[26px] pl-5'>
                                {suiteDetails[activeSuite].features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className='bg-[#111827] py-12 md:py-16 lg:py-[80px] px-4 md:px-8 lg:px-[144px] flex flex-col items-center gap-8 md:gap-12 lg:gap-[64px]'>
                <div className='flex flex-col items-center gap-4 md:gap-6'>
                    <p className='font-jost font-medium text-2xl md:text-3xl lg:text-[48px] leading-7 md:leading-9 lg:leading-[48px] text-[#D1D5DB] text-center'>
                        How ARA Works
                    </p>
                    <p className='font-jost text-white text-base md:text-lg lg:text-[20px] leading-6 md:leading-7 text-center'>
                        Seamless integration of AI intelligence across all your strategic needs
                    </p>
                </div>
                <div className='flex flex-col md:flex-row gap-8 md:gap-6 lg:gap-8 items-start'>
                    {[1, 2, 3].map((item) => (
                        <div key={item} className='flex flex-col items-center justify-center gap-4 w-full md:w-[30%] lg:w-[362.67px] h-auto md:h-[212px]'>
                            <div
                                className={`w-14 h-14 md:w-16 md:h-16 lg:w-[80px] lg:h-[80px] rounded-full flex items-center justify-center shadow-2xl ${item === 3 ? 'bg-[#F48A1F]' : ''}`}
                                style={item !== 3 ? {
                                    background: "linear-gradient(90deg,#1B2232,#3D578D)"
                                } : {}}
                            >
                                <p className='text-white font-jost leading-6 md:leading-7 lg:leading-8 text-lg md:text-xl lg:text-[24px]'>{item}</p>
                            </div>
                            <p className='text-[#D1D5DB] text-lg md:text-xl lg:text-[20px] leading-6 md:leading-7 lg:leading-[28px] font-jost text-center'>
                                {item === 1 ? 'Data Collection' : item === 2 ? 'AI Analysis' : 'Actionable Intelligence'}
                            </p>
                            <p className='text-white font-jost text-sm md:text-base leading-5 md:leading-6 text-center'>
                                {item === 1 ? 'ARA continuously monitors and collects data from multiple sources across digital and traditional media.' :
                                    item === 2 ? 'Prophet\'s advanced AI engine processes and analyzes the data to extract meaningful insights and patterns.' :
                                        'Receive clear, actionable recommendations and insights tailored to your specific needs and objectives.'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className='mt-12 md:mt-16 lg:mt-[96px] flex flex-col md:flex-row items-center px-4 md:px-8 lg:px-[80px] justify-between gap-8 md:gap-12'>
                <div className='flex flex-col gap-6 md:gap-8 lg:gap-10 order-2 md:order-1'>
                    <div className='flex flex-col gap-4 md:gap-6'>
                        <p className='font-jost text-[#101828] text-2xl md:text-3xl lg:text-[48px] leading-8 md:leading-10 lg:leading-[60px] font-semibold text-center md:text-left'>
                            No long-term contracts. <br /> No catches.
                        </p>
                        <p className='text-GREY-_500 font-jost text-base md:text-lg lg:text-[20px] leading-6 md:leading-7 lg:leading-[30px] text-center md:text-left'>
                            Join over 4,000+ companies already growing with Prophet.
                        </p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start'>
                        <button
                            onClick={() => { navigate("/about"); window.scrollTo(0, 0) }}
                            className='bg-[#F2F2F2] w-full sm:w-[127px] rounded-lg flex items-center justify-center py-3 px-5'
                        >
                            <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                        </button>
                        <button
                            onClick={() => { navigate("/login"); window.scrollTo(0, 0) }}
                            className='bg-[#111827] w-full sm:w-[128px] rounded-lg flex items-center justify-center py-3 px-5'
                        >
                            <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                        </button>
                    </div>
                </div>
                <img
                    src={Content}
                    alt='Content'
                    className='w-full md:w-1/2 lg:w-[576px] h-auto lg:h-[496px] order-1 md:order-2'
                />
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

            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}

export default Suite