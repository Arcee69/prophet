import React from 'react'
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import People from "../../assets/png/people.png";
import BrainBg from "../../assets/png/brain_bg.png";
import Brain from "../../assets/png/brain.png";
import Sentiments from "../../assets/png/sentiments.png";
import Trends from "../../assets/png/trends.png";
import Predictive from "../../assets/png/predictive.png";
import Meta from "../../assets/png/meta.png";
import Etisalat from "../../assets/png/9mobile.png";
import Spotify from "../../assets/png/spotify.png";
import Cell from "../../assets/png/cell.png";
import Cities from "../../assets/png/cities.png";
import Electric from "../../assets/png/electric.png";
import Indomie from "../../assets/png/indomie.png";
import Power from "../../assets/png/power.png";
import World from "../../assets/png/world.png";
import Analysis from "../../assets/png/analysis.png";
import Bell from "../../assets/png/bell.png";
import BlackBrain from "../../assets/png/black_brain.png";
import Man from "../../assets/png/man.png";
import Woman from "../../assets/png/woman.png";

import Shield from "../../assets/svg/shield.svg";
import Target from "../../assets/svg/target.svg";
import Arrow from "../../assets/svg/arrow_down.svg";


const Home = () => {

    const navigate = useNavigate()

  return (
    <div className='w-full mt-[100px] sm:mt-[100px] md:mt-[140px]'>

        <section className='w-full max-w-[773px] flex flex-col gap-4 sm:gap-[26px] items-center mx-auto px-4 sm:px-0'>
            <div className='w-full max-w-[600px] bg-[#FFFFFF] rounded-full px-3 sm:px-4 py-1 h-[44px] flex items-center gap-2 sm:gap-4 justify-center flex-wrap text-center'>
                <img src={People} alt="People" className='hidden md:block md:h-[32px]' />
                <p className='font-jost text-[#4B5563] text-xs sm:text-sm text-center'>Trusted by marketing teams at <span className='font-semibold'>9Mobile,</span> <span className='font-semibold'>HP,</span> and <span className='font-semibold'>Meta</span></p>
            </div>
            <div className='flex flex-col gap-2 sm:gap-4'>
                <p className='text-center font-medium font-jost uppercase text-[28px] sm:text-[40px] md:text-[54px] leading-[36px] sm:leading-[52px] md:leading-[76px] text-[#000000] px-2'>
                    Turn Brand Intelligence Into Business Impact
                </p>
                <p className='font-jost text-[#000000] text-[16px] sm:text-[18px] md:text-[22px] leading-[24px] sm:leading-[26px] md:leading-[29px] text-center px-2'>
                    AI-powered real-time media monitoring, sentiment analysis, 
                    and predictive insights across TV, radio, print, and online.
                </p>
            </div>
            <button onClick={() => navigate("/register")} className='w-full sm:w-[210px] bg-[#202633] h-[50px] group hover:bg-[#F48A1F] rounded-[8px] py-2 flex items-center justify-center'>
                <p className='font-jost font-bold text-base text-[#fff]'>Get started for free</p>
            </button>
        </section>

        <section
            style={{
                backgroundImage: `url(${BrainBg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                position: "relative"
            }}
            className='flex items-center justify-center mt-[28px] h-auto py-8 sm:py-0'
        >
            <div
                className="absolute inset-0 rounded-xl"
                style={{
                    backgroundColor: "rgb(244 245 246 / 75%)",
                }}
            />
            
            <div className='w-full max-w-[1094px] relative z-10 mx-auto px-4'>
                <img src={Brain} alt="Brain" className="w-full sm:w-10/12 mx-auto max-w-[800px]" />
                <img src={Sentiments} alt='Sentiments' className='absolute hidden md:block left-1/4 sm:left-1/3 md:left-52 bottom-8 sm:bottom-16 md:bottom-32 w-[120px] sm:w-[150px] md:w-[171px]' />
                <img src={Trends} alt='Trends' className='absolute hidden lg:block right-8 sm:right-20 lg:right-44 top-1/4 sm:top-1/3 lg:top-52 w-[100px] sm:w-[120px] lg:w-[128px]' />
                <img src={Predictive} alt='Predictive' className='absolute hidden lg:block right-12 sm:right-24 lg:right-56 bottom-1/4 sm:bottom-1/3 lg:bottom-52 w-[140px] sm:w-[160px] lg:w-[186px]' />
            </div>

        </section>

        <section className='bg-[#FFFFFF] w-full h-auto sm:h-[208px] flex items-center py-4 sm:py-[31px] flex-col justify-center'>
            <p className='font-jost text-xs sm:text-base leading-[24px] sm:leading-[29px] tracking-[1px] sm:tracking-[2.3px] text-[#000] mb-4 px-4 text-center'>Trusted by Leading Brands</p>
            <div className='w-full overflow-hidden px-4'>
                <div className='flex items-center gap-2 sm:gap-[55px] w-[200%] animate-scroll'>
                    {/* Original Images */}
                    <img src={Meta} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Cities} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Spotify} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Cell} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Power} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Electric} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Indomie} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Etisalat} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    
                    {/* Duplicated Images */}
                    <img src={Meta} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Cities} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Spotify} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Cell} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Power} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Electric} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Indomie} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                    <img src={Etisalat} alt='Brand' className='w-[60px] sm:w-[105px] flex-shrink-0' />
                </div>
            </div>
        </section>

        <section
            className='bg-[#F1F1F1] flex flex-col py-8 sm:py-[48px] px-4 sm:px-[70px] items-center justify-center gap-6 sm:gap-[44px]'
        >
            <div className='flex flex-col gap-4 items-center text-center'>
                <p className='font-jost text-[#F48A1F] font-bold text-[24px] sm:text-[32px] md:text-[40px] leading-[28px] sm:leading-[32px] md:leading-[36px] uppercase'>Why Choose Prophet?</p>
                <p className='font-jost text-[#1F2733] text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[26px] md:leading-[28px]'>
                    Powerful features to transform your brand monitoring
                </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-6xl'>
                <div className='flex flex-col items-start py-[15px] gap-[19px] w-full  sm:w-3/12 border-dashed border border-x-0 border-b-0 border-[#2026332B]'>
                    <p className='text-sm sm:text-base text-[#1F2733] font-medium font-jost leading-[20px] sm:leading-[23px]'>Sentiment Analysis</p>
                    <img src={BlackBrain} alt='BlackBrain' className='w-full md:max-w-[200px]' />
                </div>
                <div className='flex flex-col items-start py-[15px] gap-[19px] w-full sm:w-3/12 border-dashed border border-x-0 border-b-0 border-[#2026332B]'>
                    <p className='text-sm sm:text-base text-[#1F2733] font-medium font-jost leading-[20px] sm:leading-[23px]'>AI Multi Channel Monitoring</p>
                    <img src={World} alt='World' className='w-full md:max-w-[200px]' />
                </div>
                <div className='flex flex-col items-start py-[15px] gap-[19px] w-full sm:w-3/12 border-dashed border border-x-0 border-b-0 border-[#2026332B]'>
                    <p className='text-sm sm:text-base text-[#1F2733] font-medium font-jost leading-[20px] sm:leading-[23px]'>Predictive Alerts</p>
                    <img src={Bell} alt='Bell' className='w-full md:max-w-[200px]' />
                </div>
                <div className='flex flex-col items-start py-[15px] gap-[19px] w-full sm:w-3/12 border-dashed border border-x-0 border-b-0 border-[#2026332B]'>
                    <p className='text-sm sm:text-base text-[#1F2733] font-medium font-jost leading-[20px] sm:leading-[23px]'>On Demand Report</p>
                    <img src={Analysis} alt='Analysis' className='w-full md:max-w-[200px]' />
                </div>
            </div>
        </section>

        <section
            className='bg-[#1F2733] flex flex-col items-center justify-center py-8 sm:py-[64px] gap-8 sm:gap-[64px] px-4 sm:px-[148px]'
        >
            <div className='flex items-center flex-col gap-4 text-center'>
                <p className='font-jost font-semibold uppercase text-[#F48A1F] leading-[36px] sm:leading-[48px] text-[28px] sm:text-[40px]'>How Prophet Solves Your Challenges</p>
                <p className='font-jost text-[#F1F1F1] text-[18px] sm:text-[24px] leading-[24px] sm:leading-[28px]'>Real solutions for real-world brand challenges</p>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-[32px] w-full max-w-6xl'>
                <div className='bg-[#252F3D] rounded-[8px] p-6 sm:p-[32px] flex flex-col gap-4 sm:gap-6'>
                    <img src={Shield} alt='Shield' className='w-[24px] h-[30px] sm:w-[32px] sm:h-[40px]' />
                    <p className='font-jost font-semibold text-[#FFFFFF] text-[16px] sm:text-[20px] leading-[24px] sm:leading-[28px]'>Crisis Management</p>
                    <p className='font-jost text-sm sm:text-base text-[#F5F5F5] leading-5 sm:leading-6'>Detect reputation risks before they escalate</p>
                    <div className='flex items-center gap-1'>
                        <p className='text-[#F48A1F] text-sm sm:text-base font-jost leading-5 sm:leading-6'>Learn more</p>
                        <IoIosArrowForward className='w-4 h-4 sm:w-5 sm:h-5 text-[#F48A1F]' />
                    </div>
                </div>
                <div className='bg-[#252F3D] rounded-[8px] p-6 sm:p-[32px] flex flex-col gap-4 sm:gap-6'>
                    <img src={Target} alt='Target' className='w-[24px] h-[30px] sm:w-[32px] sm:h-[40px]' />
                    <p className='font-jost font-semibold text-[#FFFFFF] text-[16px] sm:text-[20px] leading-[24px] sm:leading-[28px]'>Campaign Tracking</p>
                    <p className='font-jost text-sm sm:text-base text-[#F5F5F5] leading-5 sm:leading-6'>Measure ROI of marketing efforts in real-time</p>
                    <div className='flex items-center gap-1'>
                        <p className='text-[#F48A1F] text-sm sm:text-base font-jost leading-5 sm:leading-6'>Learn more</p>
                        <IoIosArrowForward className='w-4 h-4 sm:w-5 sm:h-5 text-[#F48A1F]' />
                    </div>
                </div>
                <div className='bg-[#252F3D] rounded-[8px] p-6 sm:p-[32px] flex flex-col gap-4 sm:gap-6'>
                    <img src={Arrow} alt='Arrow' className='w-[24px] h-[30px] sm:w-[32px] sm:h-[40px]' />
                    <p className='font-jost font-semibold text-[#FFFFFF] text-[16px] sm:text-[20px] leading-[24px] sm:leading-[28px]'>Competitor Analysis</p>
                    <p className='font-jost text-sm sm:text-base text-[#F5F5F5] leading-5 sm:leading-6'>Benchmark your brand against industry leaders</p>
                    <div className='flex items-center gap-1'>
                        <p className='text-[#F48A1F] text-sm sm:text-base font-jost leading-5 sm:leading-6'>Learn more</p>
                        <IoIosArrowForward className='w-4 h-4 sm:w-5 sm:h-5 text-[#F48A1F]' />
                    </div>
                </div>

            </div>
            <button onClick={() => window.open("https://calendly.com/craprophet/30min", "_blank")} className='w-full sm:w-[210px] bg-[#F48A1F] h-[50px] rounded-[8px] py-2 flex items-center justify-center'>
                <p className='font-jost font-bold text-base text-[#fff]'>Request Demo</p>
            </button>
        </section>

        {/* <section className='bg-[#F1F1F1] px-4 sm:px-[118px] py-8 sm:py-[64px] flex-col items-center gap-8 sm:gap-[64px]'>
            <div className='flex flex-col items-center gap-4 text-center'>
                <p className='font-jost font-semibold text-[28px] sm:text-[40px] leading-[32px] sm:leading-[36px] text-[#000000]'>What Our Clients Say</p>
                <p className='text-[#4B5563] font-jost text-[18px] sm:text-[24px] leading-[24px] sm:leading-[28px]'>Success stories from industry leaders</p>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-[32px] w-full max-w-4xl'>
                <div className='bg-[#fff] drop-shadow-md flex flex-col rounded-[8px] p-6 sm:p-[32px] gap-4 sm:gap-6'>
                    <div className='flex items-center gap-3 sm:gap-4'>
                        <img src={Man} alt='Man' className='w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]' />
                        <div className='flex flex-col gap-1'>
                            <p className='text-[#000000] font-jost text-sm sm:text-base font-semibold '>John Smith</p>
                            <p className='font-jost text-[#4B5563] text-xs sm:text-base leading-5 sm:leading-6'>Brand Manager, TechCorp</p>
                        </div>
                    </div>
                    <p className='italic font-jost text-[#4B5563] text-sm sm:text-base leading-5 sm:leading-6'>
                        "Prophet helped us reduce crisis response time by 60%. The real-time alerts
                        and predictive analytics have transformed how we manage our brand
                        reputation."
                    </p>
                </div>
                <div className='bg-[#fff] flex flex-col drop-shadow-md rounded-[8px] p-6 sm:p-[32px] gap-4 sm:gap-6'>
                    <div className='flex items-center gap-3 sm:gap-4'>
                        <img src={Woman} alt='Woman' className='w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]' />
                        <div className='flex flex-col gap-1'>
                            <p className='text-[#000000] font-jost text-sm sm:text-base font-semibold '>Sarah Johnson</p>
                            <p className='font-jost text-[#4B5563] text-xs sm:text-base leading-5 sm:leading-6'>CMO, Global Retail</p>
                        </div>
                    </div>
                    <p className='italic font-jost text-[#4B5563] text-sm sm:text-base leading-5 sm:leading-6'>
                        "The predictive analytics transformed our marketing strategy. We're now
                        able to identify and capitalize on trends before our competitors."
                    </p>
                </div>
            </div>
        </section> */}

        <section
            className='bg-[#FFFFFF] flex flex-col px-4 sm:px-[116px] py-8 sm:py-[64px] items-center gap-8 sm:gap-[58px]'
        >
            <div className='flex flex-col items-center justify-center gap-4 text-center'>
                <p className='font-jost text-[28px] sm:text-[40px] font-semibold uppercase leading-[32px] sm:leading-[36px] text-[#000000]'>Get Started in Minutes</p>
                <p className='font-jost text-[#4B5563] text-[18px] sm:text-[24px] leading-6 sm:leading-7'>Choose the perfect plan for your needs</p>
            </div>
            <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-[22px] w-full max-w-5xl'>
                <div className='bg-[#F9FAFB] w-full sm:w-[384px] h-auto sm:h-[204px] flex flex-col items-center gap-4 rounded-[8px] p-6 sm:p-[32px]'>
                    <p className='font-jost text-[#000000] text-[16px] sm:text-[20px] font-semibold leading-6 sm:leading-7'>Free Trial</p>
                    <p className='text-[#4B5563] font-jost text-sm sm:text-base leading-5 sm:leading-6 text-center'>14-day trial, no credit card required</p>
                    <button
                        className='w-full bg-[#1F2733] h-[48px] rounded-[6px] p-2'
                        onClick={() => {navigate("/login"), window.scrollTo(0, 0)}}
                    >
                        <p className='font-jost text-[#FFFFFF] text-sm sm:text-base leading-5 sm:leading-6'>Start Free Trial</p>
                    </button>
                </div>
                <div className='bg-[#D46E08] w-full sm:w-[403px] h-auto sm:h-[204px] flex flex-col items-center gap-4 rounded-[8px] p-6 sm:p-[32px]'>
                    <p className='font-jost text-[#FFFFFF] text-[16px] sm:text-[20px] font-semibold leading-6 sm:leading-7'>Pro</p>
                    <p className='text-[#F3E8FF] font-jost whitespace-nowrap text-sm sm:text-base leading-5 sm:leading-6 text-center'>Choose a plan tailored to your needs</p>
                    <button
                        className='w-full bg-[#FFFFFF] h-[48px] rounded-[6px] p-2'
                        onClick={() => {navigate("/pricing"), window.scrollTo(0, 0)}}
                    >
                        <p className='font-jost text-[#1F2733] text-sm sm:text-base leading-5 sm:leading-6'>View Plans</p>
                    </button>
                </div>
                <div className='bg-[#F9FAFB] w-full sm:w-[384px] h-auto sm:h-[204px] flex flex-col items-center gap-4 rounded-[8px] p-6 sm:p-[32px]'>
                    <p className='font-jost text-[#000000] text-[16px] sm:text-[20px] font-semibold leading-6 sm:leading-7'>Enterprise</p>
                    <p className='text-[#4B5563] font-jost text-sm sm:text-base leading-5 sm:leading-6 text-center'>Custom solutions for large teams</p>
                    <button
                        className='w-full bg-[#1F2733] h-[48px] rounded-[6px] p-2'
                        onClick={() => {navigate("/contact"), window.scrollTo(0, 0)}}
                    >
                        <p className='font-jost text-[#FFFFFF] text-sm sm:text-base leading-5 sm:leading-6'>Contact Sales</p>
                    </button>
                </div>
            </div>
        </section>

    </div>
  )
}

export default Home