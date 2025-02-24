import React from 'react'

import LogoBig from '../../assets/svg/logo_big.svg'

import { BsTwitterX } from 'react-icons/bs'
import { HiOutlinePhone } from 'react-icons/hi'
import { MdMailOutline } from 'react-icons/md'
import { SiInstagram } from 'react-icons/si'
import { SlSocialLinkedin } from 'react-icons/sl'
import { TbBrandFacebook } from 'react-icons/tb'

const Footer = () => {
  return (
    <div className='bg-[#111827] px-[116px] py-[64px] flex flex-col'>
        <div className='flex flex-col gap-[48px]'>
            <div className='flex gap-[48px] items-start'>
                <div className='flex flex-col gap-4 w-[268px] h-[164px]'>
                    <p className='text-[#fff] font-bold font-jost text-[20px] leading-7'>About Prophet</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>
                        AI-powered media monitoring and brand analytics platform.
                    </p>
                    <div className='flex gap-4'>
                        <BsTwitterX className='w-5 h-5 text-[#9CA3AF]' />
                        <SlSocialLinkedin className='w-5 h-5 text-[#9CA3AF]' />
                        <TbBrandFacebook className='w-5 h-5 text-[#9CA3AF]' />
                        <SiInstagram className='w-5 h-5 text-[#9CA3AF]'/>
                    </div>
                </div>
                <div className='flex flex-col gap-4 w-[268px] h-[164px]'>
                    <p className='text-[#fff] font-bold font-jost text-[20px] leading-7'>Products</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>Features</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>Use Cases</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>Pricing</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>API</p>
                </div>
                <div className='flex flex-col gap-4 w-[268px] h-[164px]'>
                    <p className='text-[#fff] font-bold font-jost text-[20px] leading-7'>Resources</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>Blog</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>Knowledge Base</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>Tutorials</p>
                    <p className='font-jost text-[#9CA3AF] text-base leading-6'>Support</p>
                </div>
                <div className='flex flex-col gap-4 w-[268px] h-[164px]'>
                    <p className='text-[#fff] font-bold font-jost text-[20px] leading-7'>Contact</p>
                    <div className='flex items-center gap-2'>
                        <MdMailOutline className='w-5 h-5 text-[#9CA3AF]' />
                        <p className='font-jost text-[#9CA3AF] text-base leading-6'>contact@prophet.com</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <HiOutlinePhone className='w-5 h-5 text-[#9CA3AF]' />
                        <p className='font-jost text-[#9CA3AF] text-base leading-6'>+1 (555) 123-4567</p>
                    </div>
                </div>
            </div>
            <div className='bg-[#1F2937] w-full h-[1px]'></div>
            <div className='flex items-center justify-between'>
                <p className='font-jost text-[#9CA3AF] text-base leading-6'>&copy; {new Date().getFullYear()} Prophet by Chain Media. All rights reserved.</p>
                <div className='flex items-center gap-6'>
                    <p className='font-jost text-base leading-6 text-[#9CA3AF]'>Privacy Policy</p>
                    <p className='font-jost text-base leading-6 text-[#9CA3AF]'>Terms of Service</p>
                    <p className='font-jost text-base leading-6 text-[#9CA3AF]'>Cookie Policy</p>
                </div>
            </div>
            <div className='w-full h-[653px]'>
                <img src={LogoBig} alt='LogoBig' className='w-full h-[653px]' />
            </div>
        </div>
    </div>
  )
}

export default Footer