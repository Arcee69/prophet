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
    <div className='w-full mt-[140px]'>

        <section className='w-[773px] flex flex-col gap-[26px] items-center mx-auto'>
            <div className='w-auto bg-[#FFFFFF] rounded-full px-4 py-1 h-[44px] flex items-center gap-4 justify-center'>
                <img src={People} alt="People" className='h-[32px]' />
                <p className='font-jost text-[#4B5563] text-sm'>Trusted by marketing teams at <span className='font-semibold'>9Mobile,</span> <span className='font-semibold'>HP,</span> and <span className='font-semibold'>Meta</span></p>
            </div>
            <div className='flex flex-col gap-4'>
                <p className='text-center font-medium font-jost uppercase text-[54px] leading-[76px] text-[#000000]'>
                    Turn Brand Intelligence Into Business Impact
                </p>
                <p className='font-jost text-[#000000] font-bold text-[22px] leading-[29px] text-center'>
                    AI-powered real-time media monitoring, sentiment analysis, 
                    and predictive insights across TV, radio, print, and online.
                </p>
            </div>
            <button onClick={() => navigate("/register")} className='w-[210px] bg-[#202633] h-[50px] rounded-[8px] py-2 flex items-center justify-center'>
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
            className='flex items-center justify-center mt-[28px] h-auto'
        >
            <div
                className="absolute inset-0 rounded-xl"
                style={{
                    backgroundColor: "rgb(244 245 246 / 75%)",
                }}
            />
            
            <div className='w-[1094px]  relative z-10 mx-auto'>
                <img src={Brain} alt="Brain" className="w-10/12 mx-auto" />
                <img src={Sentiments} alt='Sentiments' className='absolute left-52 bottom-32 w-[171px]' />
                <img src={Trends} alt='Trends' className='absolute right-44 top-52 w-[128px] ' />
                <img src={Predictive} alt='Predictive' className='absolute right-56 bottom-52 w-[186px] ' />
            </div>

        </section>

        {/* <section className='bg-[#FFFFFF] w-full h-[208px] flex items-center py-[31px] flex-col justify-center'>
            <p className='font-jost text-base leading-[29px] tracking-[2.3px] text-[#000]'>Trusted by Leading Brands</p>
            <div className='flex items-center gap-[55px]'>
                <img src={Meta} alt='Brand' className='w-[105px]' />
                <img src={Cities} alt='Brand' className='w-[105px]' />
                <img src={Spotify} alt='Brand' className='w-[105px]' />
                <img src={Cell} alt='Brand' className='w-[105px]' />
                <img src={Power} alt='Brand' className='w-[105px]' />
                <img src={Electric} alt='Brand' className='w-[105px]' />
                <img src={Indomie} alt='Brand' className='w-[105px]' />
                <img src={Etisalat} alt='Brand' className='w-[105px]' />
            </div>
        </section> */}

        <section className='bg-[#FFFFFF] w-full h-[208px] flex items-center py-[31px] flex-col justify-center'>
            <p className='font-jost text-base leading-[29px] tracking-[2.3px] text-[#000] mb-4'>Trusted by Leading Brands</p>
            <div className='w-full overflow-hidden'>
                <div className='flex items-center gap-[55px] w-[200%] animate-scroll'>
                    {/* Original Images */}
                    <img src={Meta} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Cities} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Spotify} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Cell} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Power} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Electric} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Indomie} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Etisalat} alt='Brand' className='w-[105px] flex-shrink-0' />
                    
                    {/* Duplicated Images */}
                    <img src={Meta} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Cities} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Spotify} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Cell} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Power} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Electric} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Indomie} alt='Brand' className='w-[105px] flex-shrink-0' />
                    <img src={Etisalat} alt='Brand' className='w-[105px] flex-shrink-0' />
                </div>
            </div>
        </section>

        <section
            className='bg-[#F1F1F1] flex flex-col py-[48px] px-[70px] items-center justify-center gap-[44px]'
        >
            <div className='flex flex-col gap-4 items-center'>
                <p className='font-jost text-[#F48A1F] font-bold text-[40px] leading-[36px] uppercase'>Why Choose Prophet?</p>
                <p className='font-jost text-[#1F2733] text-[20px] leading-[28px]'>
                    Powerful features to transform your brand monitoring
                </p>
            </div>
            <div className='flex gap-6'>
                <div className='flex flex-col items-start py-[15px] gap-[19px] w-3/12 border-dashed border border-x-0 border-b-0 border-[#2026332B]'>
                    <p className='text-base text-[#1F2733] font-medium font-jost leading-[23px]'>Sentiment Analysis</p>
                    <img src={BlackBrain} alt='BlackBrain' className='' />
                    <p className='font-jost text-base font-[300] text-[#1F2733]'>
                        <span className='font-medium'>Sentiment Analysis:</span> AI-powered real-time media monitoring, sentiment analysis, 
                        and predictive insights across TV, radio, print, and online.
                    </p>
                </div>
                <div className='flex flex-col items-start py-[15px] gap-[19px] w-3/12 border-dashed border border-x-0 border-b-0 border-[#2026332B]'>
                    <p className='text-base text-[#1F2733] font-medium font-jost leading-[23px]'>AI Multi Channel Monitoring</p>
                    <img src={World} alt='World' className='' />
                    <p className='font-jost text-base font-[300] text-[#1F2733]'>
                        <span className='font-medium'>Sentiment Analysis:</span> AI-powered real-time media monitoring, sentiment analysis, 
                        and predictive insights across TV, radio, print, and online.
                    </p>
                </div>
                <div className='flex flex-col items-start py-[15px] gap-[19px] w-3/12 border-dashed border border-x-0 border-b-0 border-[#2026332B]'>
                    <p className='text-base text-[#1F2733] font-medium font-jost leading-[23px]'>Predictive Alerts</p>
                    <img src={Bell} alt='Bell' className='' />
                    <p className='font-jost text-base font-[300] text-[#1F2733]'>
                        <span className='font-medium'>Sentiment Analysis:</span> AI-powered real-time media monitoring, sentiment analysis, 
                        and predictive insights across TV, radio, print, and online.
                    </p>
                </div>
                <div className='flex flex-col items-start py-[15px] gap-[19px] w-3/12 border-dashed border border-x-0 border-b-0 border-[#2026332B]'>
                    <p className='text-base text-[#1F2733] font-medium font-jost leading-[23px]'>Sentiment Analysis</p>
                    <img src={Analysis} alt='Analysis' className='' />
                    <p className='font-jost text-base font-[300] text-[#1F2733]'>
                        <span className='font-medium'>Sentiment Analysis:</span> AI-powered real-time media monitoring, sentiment analysis, 
                        and predictive insights across TV, radio, print, and online.
                    </p>
                </div>
            </div>
        </section>

        <section
            className='bg-[#1F2733] flex flex-col items-center justify-center py-[64px] gap-[64px] px-[148px]'
        >
            <div className='flex items-center flex-col gap-4'>
                <p className='font-jost font-semibold uppercase text-[#F48A1F] leading-[48px] text-[40px]'>How Prophet Solves Your Challenges</p>
                <p className='font-jost text-[#F1F1F1] text-[24px] leading-[28px]'>Real solutions for real-world brand challenges</p>
            </div>
            <div className='flex gap-[32px]'>
                <div className='bg-[#252F3D] rounded-[8px] p-[32px] flex flex-col gap-6'>
                    <img src={Shield} alt='Shield' className='w-[32px] h-[40px]' />
                    <p className='font-jost font-semibold text-[#FFFFFF] text-[20px] leading-[28px]'>Crisis Management</p>
                    <p className='font-jost text-base text-[#F5F5F5] leading-6'>Detect reputation risks before they escalate</p>
                    <div className='flex items-center gap-1'>
                        <p className='text-[#F48A1F] text-base font-jost leading-6'>Learn more</p>
                        <IoIosArrowForward className='w-5 h-5 text-[#F48A1F]' />
                    </div>
                </div>
                <div className='bg-[#252F3D] rounded-[8px] p-[32px] flex flex-col gap-6'>
                    <img src={Target} alt='Target' className='w-[32px] h-[40px]' />
                    <p className='font-jost font-semibold text-[#FFFFFF] text-[20px] leading-[28px]'>Campaign Tracking</p>
                    <p className='font-jost text-base text-[#F5F5F5] leading-6'>Measure ROI of marketing efforts in real-time</p>
                    <div className='flex items-center gap-1'>
                        <p className='text-[#F48A1F] text-base font-jost leading-6'>Learn more</p>
                        <IoIosArrowForward className='w-5 h-5 text-[#F48A1F]' />
                    </div>
                </div>
                <div className='bg-[#252F3D] rounded-[8px] p-[32px] flex flex-col gap-6'>
                    <img src={Arrow} alt='Arrow' className='w-[32px] h-[40px]' />
                    <p className='font-jost font-semibold text-[#FFFFFF] text-[20px] leading-[28px]'>Competitor Analysis</p>
                    <p className='font-jost text-base text-[#F5F5F5] leading-6'>Benchmark your brand against industry leaders</p>
                    <div className='flex items-center gap-1'>
                        <p className='text-[#F48A1F] text-base font-jost leading-6'>Learn more</p>
                        <IoIosArrowForward className='w-5 h-5 text-[#F48A1F]' />
                    </div>
                </div>

            </div>
            <button onClick={() => window.open("https://calendly.com/craprophet/30min", "_blank")} className='w-[210px] bg-[#F48A1F] h-[50px] rounded-[8px] py-2 flex items-center justify-center'>
                <p className='font-jost font-bold text-base text-[#fff]'>Request Demo</p>
            </button>
        </section>

        <section className='bg-[#F1F1F1] px-[118px] py-[64px] flex flex-col items-center gap-[64px]'>
            <div className='flex flex-col items-center gap-4'>
                <p className='font-jost font-semibold text-[40px] leading-[36px] text-[#000000]'>What Our Clients Say</p>
                <p className='text-[#4B5563] font-jost text-[24px] leading-[28px]'>Success stories from industry leaders</p>
            </div>
            <div className='flex gap-[32px] '>
                <div className='bg-[#fff] drop-shadow-md flex flex-col rounded-[8px] p-[32px] gap-6'>
                    <div className='flex items-center gap-4'>
                        <img src={Man} alt='Man' className='w-[40px] h-[40px]' />
                        <div className='flex flex-col gap-1'>
                            <p className='text-[#000000] font-jost text-base font-semibold '>John Smith</p>
                            <p className='font-jost text-[#4B5563] text-base leading-6'>Brand Manager, TechCorp</p>
                        </div>
                    </div>
                    <p className='italic font-jost text-[#4B5563] text-base leading-6'>
                        "Prophet helped us reduce crisis response time by 60%. The real-time alerts
                        and predictive analytics have transformed how we manage our brand
                        reputation."
                    </p>
                </div>
                <div className='bg-[#fff] flex flex-col drop-shadow-md rounded-[8px] p-[32px] gap-6'>
                    <div className='flex items-center gap-4'>
                        <img src={Woman} alt='Woman' className='w-[40px] h-[40px]' />
                        <div className='flex flex-col gap-1'>
                            <p className='text-[#000000] font-jost text-base font-semibold '>Sarah Johnson</p>
                            <p className='font-jost text-[#4B5563] text-base leading-6'>CMO, Global Retail</p>
                        </div>
                    </div>
                    <p className='italic font-jost text-[#4B5563] text-base leading-6'>
                        "The predictive analytics transformed our marketing strategy. We're now
                        able to identify and capitalize on trends before our competitors."
                    </p>
                </div>
            </div>
        </section>

        <section
            className='bg-[#FFFFFF] flex flex-col px-[116px] py-[64px] items-center gap-[58px]'
        >
            <div className='flex flex-col items-center justify-center gap-4'>
                <p className='font-jost text-[40px] font-semibold uppercase leading-[36px] text-[#000000]'>Get Started in Minutes</p>
                <p className='font-jost text-[#4B5563] text-[24px] leading-7'>Choose the perfect plan for your needs</p>
            </div>
            <div className='flex items-center gap-[22px]'>
                <div className='bg-[#F9FAFB] w-[384px] h-[204px] flex flex-col items-center gap-4 rounded-[8px] p-[32px]'>
                    <p className='font-jost text-[#000000] text-[20px] font-semibold leading-7'>Free Trial</p>
                    <p className='text-[#4B5563] font-jost text-base leading-6'>14-day trial, no credit card required</p>
                    <button
                        className='w-full bg-[#1F2733] h-[48px] rounded-[6px] p-2'
                    >
                        <p className='font-jost text-[#FFFFFF] text-base leading-6'>Start Free Trial</p>
                    </button>
                </div>
                <div className='bg-[#D46E08] w-[403px] h-[204px] flex flex-col items-center gap-4 rounded-[8px] p-[32px]'>
                    <p className='font-jost text-[#FFFFFF] text-[20px] font-semibold leading-7'>Pro</p>
                    <p className='text-[#F3E8FF] font-jost whitespace-nowrap text-base leading-6'>Choose a plan tailored to your needs</p>
                    <button
                        className='w-full bg-[#FFFFFF] h-[48px] rounded-[6px] p-2'
                    >
                        <p className='font-jost text-[#1F2733] text-base leading-6'>View Plans</p>
                    </button>
                </div>
                <div className='bg-[#F9FAFB] w-[384px] h-[204px] flex flex-col items-center gap-4 rounded-[8px] p-[32px]'>
                    <p className='font-jost text-[#000000] text-[20px] font-semibold leading-7'>Enterprise</p>
                    <p className='text-[#4B5563] font-jost text-base leading-6'>Custom solutions for large teams</p>
                    <button
                        className='w-full bg-[#1F2733] h-[48px] rounded-[6px] p-2'
                    >
                        <p className='font-jost text-[#FFFFFF] text-base leading-6'>Contact Sales</p>
                    </button>
                </div>
            </div>
        </section>

    </div>
  )
}

export default Home