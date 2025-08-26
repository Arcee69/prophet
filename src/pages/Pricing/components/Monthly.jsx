import React from 'react'
import { FaCheck } from 'react-icons/fa6'

const Monthly = () => {

    const monthlyPlan = [
        {
            title: "Prophet Lite",
            price: 99,
            target: "For SMEs, startups, students, small PR firms",
            featuresTitle: "Capture early adopters and grassroots innovators",
            features:[
                "Access to limited dashboard features",
                "2 monthly insight snapshots",
                "Basic sentiment analysis",
                "email support"
            ]
        },
        {
            title: "Prophet Starter",
            price: 249,
            target: "For Small consultancies, NGO comms teams",
            featuresTitle: "Everything in our Prophet Lite plus....",
            features:[
                "Access to Standard dashboard features",
                "5 topics/keywords",
                "2 automated reports",
                "cultural mapping lite"
            ]
        },
        {
            title: "Prophet Professional",
            price: 799,
            target: "For PR agencies, mid-sized brands, corporates",
            featuresTitle: "Everything in Prophet Starter plus....",
            features:[
                "Advanced sentiment analysis",
                "Crisis dashboards",
                "Up to 20 individual users",
                "Predictive insights",
                "Competitor tracking",
                "10 reports",
                "Chat support",
            ]
        },
        {
            title: "Prophet Premium",
            price: 2500,
            target: "For Governments, multinationals, large enterprises",
            featuresTitle: "Everything in Prophet Professional plus....",
            features:[
                "Unlimited reports",
                "API integration",
                "Custom datasets",
                "Developer SDK",
                "White-label dashboards",
                "Dedicated account manager",
            ]
        },

    ]


  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 px-[32px]'>
        {monthlyPlan.map((item, index) => (
            <div key={index} className='p-[32px] flex flex-col gap-[32px] rounded-2xl shadow'>
                <div className='flex flex-col gap-4'>
                    <p className='font-jost font-medium text-[18px] leading-7 text-GREY-_500'>{item.title}</p>
                    <p className='text-GREY-_900 font-jost text-[60px] leading-[72px] font-medium'>${item.price} <span className='text-GREY-_500 font-jost text-base font-medium leading-6'>per month</span></p>
                    <p className='text-GREY-_500 font-jost text-base leading-6'>{item.target}</p>
                </div>
                <div className='flex flex-col gap-3'>
                    <button className='bg-[#202633] rounded-lg flex items-center justify-center p-3'>
                        <p className='text-white font-jost text-base leading-6 font-medium'>Get Started</p>
                    </button>
                    <button className='border border-GREY-_400 bg-white rounded-lg flex items-center justify-center p-3'>
                        <p className='text-GREY-_700 font-jost text-base leading-6 font-medium'>Chat with sales</p>
                    </button>
                </div>
                <div className='bg-GREY-_400 h-[1px] w-full'></div>
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-GREY-_900 font-jost font-semibold italic text-base leading-6'>FEATURES</p>
                        <p className='text-GREY-_500 italic font-jost font-semibold text-base leading-6'>{item.featuresTitle}</p>
                    </div>
                    <div className='flex flex-col gap-4'>
                        {item.features.map((item, index) => (
                            <div key={index} className='flex items-center gap-3'>
                                <div className='w-6 h-6 bg-[#FFFAEB] flex flex-col items-center justify-center rounded-full'>
                                    <FaCheck className='text-[#202633] w-4 h-4' />
                                </div>
                                <p className='text-GREY-_500 text-base font-jost leading-6'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default Monthly