import React, { useState } from 'react'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'

import AvatarGroup from '../../assets/png/avatar_group.png'

import Monthly from './components/Monthly'
import Annual from './components/Annual'
import OneTime from './components/OneTime'
import Onsite from './components/Onsite'
import Enterprise from './components/Enterprise'
import { useNavigate } from 'react-router-dom'

const Pricing = () => {
    const [activeTab, setActiveTab] = useState("monthly")
    const [openFaqOne, setOpenFaqOne] = useState(true)
    const [openFaqTwo, setOpenFaqTwo] = useState(false)
    const [openFaqThree, setOpenFaqThree] = useState(false)
    const [openFaqFour, setOpenFaqFour] = useState(false)
    const [openFaqFive, setOpenFaqFive] = useState(false)
    const [openFaqSix, setOpenFaqSix] = useState(false)

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    const handleOpenFaqOne = () => {
        setOpenFaqOne(prev => !prev)
    }

    const handleOpenFaqTwo = () => {
        setOpenFaqTwo(prev => !prev)
    }

    const handleOpenFaqThree = () => {
        setOpenFaqThree(prev => !prev)
    }

    const handleOpenFaqFour = () => {
        setOpenFaqFour(prev => !prev)
    }

    const handleOpenFaqFive = () => {
        setOpenFaqFive(prev => !prev)
    }

    const handleOpenFaqSix = () => {
        setOpenFaqSix(prev => !prev)
    }

    const navigate = useNavigate()

  return (
    <div className='w-full pt-[150px] bg-white'>
        <div className='flex flex-col gap-[48px]'>
            <div className='flex justify-center flex-col items-center'>
                <p className='text-ORANGE-_100 font-jost text-base leading-6 font-semibold'>Pricing</p>
                <p className='mt-3 text-GREY-_900 font-jost leading-[60px] text-[48px] tracking-[-2%] font-semibold'> Simple, transparent pricing</p>
                <p className='mt-6 text-GREY-_500 text-[20px] leading-[30px] font-jost'>Ara by Prophet offers flexible pricing models to fit your needs.</p>
                <div className='mt-10 rounded-[8px] w-[794px] flex gap-2 p-[6px] bg-GREY-_300'>
                    <div onClick={() => handleTabChange("monthly")} className={`${activeTab === "monthly" ? "bg-white" : ""} py-2.5 px-[14px] cursor-pointer rounded flex items-center justify-center`}>
                        <p className={`${activeTab === "monthly" ? "text-GREY-_700" : "text-GREY-_500"} font-jost text-base leading-6`}>Monthly billing</p>
                    </div>
                    <div onClick={() => handleTabChange("annual")} className={`${activeTab === "annual" ? "bg-white" : ""} py-2.5 px-[14px] cursor-pointer flex rounded items-center justify-center`}>
                        <p className={`${activeTab === "annual" ? "text-GREY-_700" : "text-GREY-_500"} font-jost text-base leading-6`}>Annual billing</p>
                    </div>
                    <div className={`${activeTab === "oneTime" ? "bg-white" : ""} py-2.5 px-[14px] cursor-pointer flex rounded items-center justify-center`}>
                        <p className={`${activeTab === "oneTime" ? "text-GREY-_700" : "text-GREY-_500"} font-jost text-base leading-6`}>One Demand Report</p>
                    </div>
                    <div className={`${activeTab === "enterprise" ? "bg-white" : ""} py-2.5 px-[14px] cursor-pointer flex rounded items-center justify-center`}>
                        <p className={`${activeTab === "enterprise" ? "text-GREY-_700" : "text-GREY-_500"} font-jost text-base leading-6`}>Enterprise Solutions</p>
                    </div>
                    <div className={`${activeTab === "onSite" ? "bg-white" : ""} py-2.5 px-[14px] cursor-pointer flex rounded items-center justify-center`}>
                        <p className={`${activeTab === "onSite" ? "text-GREY-_700" : "text-GREY-_500"} font-jost text-base leading-6`}>On Site Engagement</p>
                    </div>
                </div>
            </div>
            <div className='bg-white px-20'>
                {activeTab === "monthly" && <Monthly />}
                {activeTab === "annual" && <Annual />}
                {activeTab === "oneTime" && <OneTime />}
                {activeTab === "enterprise" && <Enterprise />}
                {activeTab === "onSite" && <Onsite />}
            </div>

            <div className='flex flex-col items-center justify-center mt-[48px] gap-16'>
                <div className='flex flex-col items-center gap-5'>
                    <p className='text-GREY-_900 text-[36px] leading-[44px] font-semibold font-jost'>Frequently asked questions</p>
                    <p className='text-GREY-_500 font-jost text-[20px] leading-[30px]'>Everything you need to know about the product and billing.</p>
                </div>
                <div className='flex flex-col gap-6 w-[768px] mx-auto'>
                    <div className='flex flex-col gap-2 border-b pb-8 cursor-pointer border-[#EAECF0]' onClick={handleOpenFaqOne}>
                        <div className='flex items-center justify-between'>
                            <p className='text-GREY-_900 font-medium font-jost text-[18px] leading-[28px]'>Is there a free trial available?</p>
                            {openFaqOne ? <FiMinusCircle className='text-[#111827] w-4 h-4'/> : <FiPlusCircle className='text-[#111827] w-4 h-4'/>}    
                        </div>
                        {openFaqOne && (
                            <p className='text-GREY-_500 font-jost leading-6 text-base'>
                                Yes, you can try us for free for 30 days. If you want, 
                                we’ll provide you with a free, personalized 30-minute onboarding 
                                call to get you up and running as soon as possible.
                            </p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2 border-b pb-8 cursor-pointer border-[#EAECF0]' onClick={handleOpenFaqTwo}>
                        <div className='flex items-center justify-between'>
                            <p className='text-GREY-_900 font-medium font-jost text-[18px] leading-[28px]'>Can I change my plan later?</p>
                            {openFaqTwo ? <FiMinusCircle className='text-[#111827] w-4 h-4'/> : <FiPlusCircle className='text-[#111827] w-4 h-4'/>}    
                        </div>
                        {openFaqTwo && (
                            <p className='text-GREY-_500 font-jost leading-6 text-base'>
                                Yes, you can try us for free for 30 days. If you want, 
                                we’ll provide you with a free, personalized 30-minute onboarding 
                                call to get you up and running as soon as possible.
                            </p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2 border-b pb-8 cursor-pointer border-[#EAECF0]' onClick={handleOpenFaqThree}>
                        <div className='flex items-center justify-between'>
                            <p className='text-GREY-_900 font-medium font-jost text-[18px] leading-[28px]'>What is your cancellation policy?</p>
                            {openFaqThree ? <FiMinusCircle className='text-[#111827] w-4 h-4'/> : <FiPlusCircle className='text-[#111827] w-4 h-4'/>}    
                        </div>
                        {openFaqThree && (
                            <p className='text-GREY-_500 font-jost leading-6 text-base'>
                                Yes, you can try us for free for 30 days. If you want, 
                                we’ll provide you with a free, personalized 30-minute onboarding 
                                call to get you up and running as soon as possible.
                            </p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2 border-b pb-8 cursor-pointer border-[#EAECF0]' onClick={handleOpenFaqFour}>
                        <div className='flex items-center justify-between'>
                            <p className='text-GREY-_900 font-medium font-jost text-[18px] leading-[28px]'>Can other info be added to an invoice?</p>
                            {openFaqFour ? <FiMinusCircle className='text-[#111827] w-4 h-4'/> : <FiPlusCircle className='text-[#111827] w-4 h-4'/>}    
                        </div>
                        {openFaqFour && (
                            <p className='text-GREY-_500 font-jost leading-6 text-base'>
                                Yes, you can try us for free for 30 days. If you want, 
                                we’ll provide you with a free, personalized 30-minute onboarding 
                                call to get you up and running as soon as possible.
                            </p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2 border-b pb-8 cursor-pointer border-[#EAECF0]' onClick={handleOpenFaqFive}>
                        <div className='flex items-center justify-between'>
                            <p className='text-GREY-_900 font-medium font-jost text-[18px] leading-[28px]'>How does billing work?</p>
                            {openFaqFive ? <FiMinusCircle className='text-[#111827] w-4 h-4'/> : <FiPlusCircle className='text-[#111827] w-4 h-4'/>}    
                        </div>
                        {openFaqFive && (
                            <p className='text-GREY-_500 font-jost leading-6 text-base'>
                                Yes, you can try us for free for 30 days. If you want, 
                                we’ll provide you with a free, personalized 30-minute onboarding 
                                call to get you up and running as soon as possible.
                            </p>
                        )}
                    </div>
                    <div className='flex flex-col gap-2 pb-8 cursor-pointer ' onClick={handleOpenFaqSix}>
                        <div className='flex items-center justify-between'>
                            <p className='text-GREY-_900 font-medium font-jost text-[18px] leading-[28px]'>How do I change my account email?</p>
                            {openFaqSix ? <FiMinusCircle className='text-[#111827] w-4 h-4'/> : <FiPlusCircle className='text-[#111827] w-4 h-4'/>}    
                        </div>
                        {openFaqSix && (
                            <p className='text-GREY-_500 font-jost leading-6 text-base'>
                                Yes, you can try us for free for 30 days. If you want, 
                                we’ll provide you with a free, personalized 30-minute onboarding 
                                call to get you up and running as soon as possible.
                            </p>
                        )}
                    </div>

                </div>
            </div>

            <div className='w-10/12 h-[294px] flex flex-col rounded-lg items-center py-8 justify-center gap-8 bg-GREY-_50 mx-auto'>
                <img src={AvatarGroup} alt='AvatarGroup' className='w-[120px]' />
                <div className='flex flex-col gap-2 items-center justify-center'>
                    <p className='text-GREY-_900 font-jost font-medium text-[20px] leading-[30px]'>Still have questions?</p>
                    <p className='text-GREY-_500 font-jost text-[18px] leading-[28px]'>Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
                </div>
                <button
                    className='w-[130px] h-[44px] flex items-center justify-center p-2 rounded-lg bg-[#111827]'
                >
                    <p className='font-jost font-medium text-[#F2F2F2] text-base leading-6'>Get in touch</p>
                </button>
            </div>
            <div className='bg-[#1D2939] h-[207px] mt-[207px] relative'>
                <div className='bg-GREY-_50 rounded-[16px] p-16 flex justify-between w-10/12 mx-auto absolute bottom-28 right-0 left-0'>
                    <div className='flex flex-col items-start gap-4'>
                        <p className='text-GREY-_900 font-jost font-semibold text-[30px] leading-[38px]'>Start your 30-day free trial</p>
                        <p className='text-GREY-_500 text-[20px] font-jost leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <button onClick={() => navigate("/about")} className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
                            <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                        </button>
                        <button onClick={() => navigate("/login")} className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
                            <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Pricing