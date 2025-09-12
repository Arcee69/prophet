import { useEffect, useState } from 'react'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AvatarGroup from '../../assets/png/avatar_group.png'
import Monthly from './components/Monthly'
import Annual from './components/Annual'
import OneTime from './components/OneTime'
import { fetchPricing } from '../../features/pricing/getPricingSlice'
import { fetchFaqs } from '../../features/faqs/getFaqsSlice'

const Pricing = () => {
    const [activeTab, setActiveTab] = useState("monthly")
    const [openFaqIds, setOpenFaqIds] = useState([])

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { faqs } = useSelector((state) => state.allFaqs)


    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    const toggleFaq = (id) => {
        setOpenFaqIds(prev =>
            prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
        )
    }

    useEffect(() => {
        dispatch(fetchPricing())
    }, [])

    useEffect(() => {
        dispatch(fetchFaqs())
    }, [])

    // Default first FAQ to open once data is available
    useEffect(() => {
        if (faqs.data?.length > 0 && openFaqIds.length === 0) {
            setOpenFaqIds([faqs?.data[0].id])
        }
    }, [faqs.data])

    return (
        <div className='w-full pt-[80px] md:pt-[150px] bg-white'>
            <div className='flex flex-col gap-6 md:gap-[48px]'>
                <div className='flex justify-center flex-col items-center px-4 md:px-0'>
                    <p className='text-ORANGE-_100 font-jost text-sm md:text-base leading-6 font-semibold'>Pricing</p>
                    <p className='mt-3 text-GREY-_900 font-jost leading-[40px] md:leading-[60px] text-[32px] md:text-[48px] tracking-[-2%] font-semibold text-center'> Simple, transparent pricing</p>
                    <p className='mt-4 md:mt-6 text-GREY-_500 text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] font-jost text-center'>Ara by Prophet offers flexible pricing models to fit your needs.</p>
                    <div className='mt-6 md:mt-10 rounded-[8px] w-full max-w-[444px] overflow-x-auto flex gap-2 p-[6px] bg-GREY-_300 mx-4'>
                        <div onClick={() => handleTabChange("monthly")} className={`${activeTab === "monthly" ? "bg-white" : ""} py-2.5 px-[14px] cursor-pointer rounded flex items-center justify-center flex-1`}>
                            <p className={`${activeTab === "monthly" ? "text-GREY-_700" : "text-GREY-_500"} font-jost text-sm md:text-base whitespace-nowrap leading-6`}>Monthly billing</p>
                        </div>
                        <div onClick={() => handleTabChange("annual")} className={`${activeTab === "annual" ? "bg-white" : ""} py-2.5 px-[14px] cursor-pointer flex rounded items-center justify-center flex-1`}>
                            <p className={`${activeTab === "annual" ? "text-GREY-_700" : "text-GREY-_500"} font-jost text-sm md:text-base whitespace-nowrap leading-6`}>Annual billing</p>
                        </div>
                        <div onClick={() => handleTabChange("oneTime")} className={`${activeTab === "oneTime" ? "bg-white" : ""} py-2.5 px-[14px] cursor-pointer flex rounded items-center justify-center flex-1`}>
                            <p className={`${activeTab === "oneTime" ? "text-GREY-_700" : "text-GREY-_500"} font-jost text-sm md:text-base whitespace-nowrap leading-6`}>One time Services</p>
                        </div>
                    </div>
                </div>
                <div className='bg-white px-4 md:px-20'>
                    {activeTab === "monthly" && <Monthly />}
                    {activeTab === "annual" && <Annual />}
                    {activeTab === "oneTime" && <OneTime />}
                </div>

                <div className='flex flex-col items-center justify-center mt-8 md:mt-[48px] gap-10 md:gap-16 px-4'>
                    <div className='flex flex-col items-center gap-4 md:gap-5'>
                        <p className='text-GREY-_900 text-[28px] md:text-[36px] leading-[36px] md:leading-[44px] font-semibold font-jost text-center'>Frequently asked questions</p>
                        <p className='text-GREY-_500 font-jost text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] text-center'>Everything you need to know about the product and billing.</p>
                    </div>
                    <div className='flex flex-col gap-6 w-full max-w-[768px] mx-auto'>
                        {faqs.data?.map((faq, index) => (
                            <div
                                key={faq.id}
                                className={`flex flex-col gap-2 pb-6 md:pb-8 cursor-pointer ${index < faqs.length - 1 ? 'border-b border-[#EAECF0]' : ''}`}
                                onClick={() => toggleFaq(faq.id)}
                            >
                                <div className='flex items-center justify-between'>
                                    <p className='text-GREY-_900 font-medium font-jost text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] pr-4'>{faq.question}</p>
                                    {openFaqIds.includes(faq.id) ? <FiMinusCircle className='text-[#111827] w-4 h-4 flex-shrink-0' /> : <FiPlusCircle className='text-[#111827] w-4 h-4 flex-shrink-0' />}
                                </div>
                                {openFaqIds.includes(faq.id) && (
                                    <p className='text-GREY-_500 font-jost leading-6 text-[14px] md:text-base mt-2'>
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className='w-full md:w-10/12 h-auto md:h-[294px] flex flex-col rounded-lg items-center py-6 md:py-8 justify-center gap-6 md:gap-8 bg-GREY-_50 mx-auto px-4 md:px-0'>
                    <img src={AvatarGroup} alt='AvatarGroup' className='w-[80px] md:w-[120px]' />
                    <div className='flex flex-col gap-2 items-center justify-center text-center'>
                        <p className='text-GREY-_900 font-jost font-medium text-[18px] md:text-[20px] leading-[26px] md:leading-[30px]'>Still have questions?</p>
                        <p className='text-GREY-_500 font-jost text-[14px] md:text-[18px] leading-[20px] md:leading-[28px] max-w-[600px]'>Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    </div>
                    <button
                        className='w-[130px] h-[44px] flex items-center justify-center p-2 rounded-lg bg-[#111827]'
                        onClick={() => { navigate("/contact"), window.scrollTo(0, 0) }}
                    >
                        <p className='font-jost font-medium text-[#F2F2F2] text-base leading-6'>Get in touch</p>
                    </button>
                </div>

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
        </div>
    )
}

export default Pricing