import React from 'react'

import Dash from "../../assets/png/dash.png"
import Robot from "../../assets/png/robot.png"
import Trend from "../../assets/png/trends_chart.png"
import Content from "../../assets/png/content.png"

const About = () => {
  return (
    <div className='w-full bg-white'>
        <div className='px-[80px] flex items-start justify-between pb-[96px] pt-[250px]'>
            <div className='flex flex-col gap-3'>
                <p
                    className='font-jost text-base leading-6 font-semibold'
                    style={{ 
                        backgroundImage: 'linear-gradient(90deg, #FFB400, #FF9208, #FF5418)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-block'
                    }}
                >
                    Nice to meet you
                </p>
                <p className='font-jost font-semibold text-[48px] leading-[60px] text-GREY-_900'>Meet ARA by Prophet</p>
            </div>
            <p className='text-GREY-_500 font-jost w-[384px] text-[24px] leading-[30px]'>
                A living intelligence system, designed to help brands, governments, 
                and organisations make smarter decisions in real time.
            </p>
        </div>

        <img src={Dash} alt='Dash' className='w-11/12 mx-auto' />

        <div className='flex flex-col gap-[96px] my-[96px] items-center'>
            <div className='flex flex-col items-center justify-center gap-3'>
                <p className='font-jost text-base leading-6 font-semibold text-[#F48A1F]'>
                    Introducing Ara
                </p>
                <p className='font-jost font-semibold text-[36px] leading-[44px] text-GREY-_900'>Where Robotics Meets Humanity</p>
            </div>
            <div className='flex items-start px-[54px] gap-10'>
                <div className='flex flex-col gap-[31px] w-[636px]'>
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium font-jost text-[#111827] text-[32px]'>ARA: The Voice & Interface</p>
                        <p className='text-[#0C101F] font-[300] font-jost text-[20px] leading-[33px]'>
                            ARA is the voice and interface: a humanoid robot with the ability to move, 
                            listen, and respond in natural human language.
                        </p>
                    </div>
                    <img src={Robot} alt='Robot' className='h-[457.87px]' />
                </div>
                <div className='flex flex-col gap-[31px] w-[636px]'>
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium font-jost text-[#111827] text-[32px]'>Prophet: The Brain Behind Her</p>
                        <p className='text-[#0C101F] font-[300] font-jost text-[20px] leading-[33px]'>
                            Prophet is the brain behind her: a powerful AI and machine learning engine 
                            trained on cultural data, market trends, and human behaviour.
                        </p>
                    </div>
                    <img src={Trend} alt='Trend' className='h-[553.44px]' />
                </div>
            </div>
        </div>

        <div className='mt-[156px] flex items-center px-[54px] justify-between'>
            <div className='flex flex-col gap-10'>
                <div className='flex flex-col gap-6'>
                    <p className='font-jost text-[#101828] text-[48px] leading-[60px] font-semibold'>No long-term contracts. <br /> No catches.</p>
                    <p className='text-GREY-_500 font-jost text-[20px] leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <button className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
                        <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                    </button>
                    <button className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
                        <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                    </button>
                </div>
            </div>
            <img src={Content} alt='Content' className='w-[576px] h-[496px]' />
        </div>

        <div className='bg-[#1D2939] h-[207px] mt-[226px] relative'>
            <div className='bg-GREY-_50 rounded-[16px] p-16 flex justify-between w-10/12 mx-auto absolute bottom-28 right-0 left-0'>
                <div className='flex flex-col items-start gap-4'>
                    <p className='text-GREY-_900 font-jost font-semibold text-[30px] leading-[38px]'>Start your 30-day free trial</p>
                    <p className='text-GREY-_500 text-[20px] font-jost leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <button className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
                        <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                    </button>
                    <button className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
                        <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default About