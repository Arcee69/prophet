import React from 'react'
import { CiLocationOn, CiMail } from 'react-icons/ci'
import { FiMessageCircle } from 'react-icons/fi'
import { LiaPhoneSolid } from 'react-icons/lia'

import ContactBig from "../../assets/png/contactBig.png"
import Curve from "../../assets/png/curve_top_right.png"
import Content from "../../assets/png/content.png"
import { useNavigate } from 'react-router-dom'

const Contact = () => {

  const navigate = useNavigate()
  return (
    <div className='w-full bg-white'>
      <div className='flex flex-col h-[388px] pt-[150px]  bg-[#F2F2F2] gap-6 items-center'>
        <div className='flex flex-col items-center gap-3'>
          <p className='text-[#E57E46] font-jost text-base font-semibold leading-6'>Contact Us</p>
          <p className='text-GREY-_900 text-[48px] font-semibold leading-[60px]'>We’d love to hear from you</p>
        </div>
        <p className='text-[#667085] w-[768px] text-center font-jost text-[18px] leading-[28px]'>
          Our friendly team is always here to chat.
        </p>
      </div>

      <div className='w-full'>
        <img src={ContactBig} alt='ContactBig' className='' />
      </div>

      <div className='px-[80px] pt-[64px] pb-[96px]'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='h-[314px] bg-[#111827] rounded-[10px] overflow-hidden relative p-6'>
            <img src={Curve} alt="Curve" className='absolute -right-2 w-[77px] h-[66px] -top-1 rounded-tr-[2rem]' />
            <div className='w-[48px] h-[48px] rounded-[10px] bg-[#233657] p-2 flex items-center justify-center'>
              <CiMail className='w-5 h-5 text-[#fff]' />
            </div>
            <div className='flex flex-col gap-5  mt-[64px]'>
              <div className='flex flex-col gap-2'>
                <p className='font-jost font-semibold text-[#FFFFFF] text-[20px] leading-[30px]'>Get instant response</p>
                <p className='font-jost text-[#FFFFFF] text-base leading-6'>Speak to our friendly team.</p>
              </div>
              <p className='font-jost text-[#FFFFFF] font-medium text-base leading-6'>Use our Chatbot</p>
            </div>
          </div>
          <div className='h-[314px] bg-[#111827] rounded-[10px] overflow-hidden relative p-6'>
            <img src={Curve} alt="Curve" className='absolute -right-2 w-[77px] h-[66px] -top-1 rounded-tr-[2rem]' />
            <div className='w-[48px] h-[48px] rounded-[10px] bg-[#233657] p-2 flex items-center justify-center'>
              <FiMessageCircle className='w-5 h-5 text-[#fff]' />
            </div>
            <div className='flex flex-col gap-5  mt-[64px]'>
              <div className='flex flex-col gap-2'>
                <p className='font-jost font-semibold text-[#FFFFFF] text-[20px] leading-[30px]'>Chat to support</p>
                <p className='font-jost text-[#FFFFFF] text-base leading-6'>We’re here to help.</p>
              </div>
              <p className='font-jost text-[#FFFFFF] font-medium text-base leading-6'>info@arabyprophet.com</p>
            </div>
          </div>
          <div className='h-[314px] bg-[#111827] rounded-[10px] overflow-hidden relative p-6'>
            <img src={Curve} alt="Curve" className='absolute -right-2 w-[77px] h-[66px] -top-1 rounded-tr-[2rem]' />
            <div className='w-[48px] h-[48px] rounded-[10px] bg-[#233657] p-2 flex items-center justify-center'>
              <CiLocationOn className='w-5 h-5 text-[#fff]' />
            </div>
            <div className='flex flex-col gap-5  mt-[64px]'>
              <div className='flex flex-col gap-2'>
                <p className='font-jost font-semibold text-[#FFFFFF] text-[20px] leading-[30px]'>Head Office</p>
                <p className='font-jost text-[#FFFFFF] text-base leading-6'>Visit our office HQ.</p>
              </div>
              <p className='font-jost text-[#FFFFFF] font-medium text-base leading-6'>
                2c, Eso Close, off Oduduwa Crescent, GRA, Ikeja, Lagos, Nigeria
              </p>
            </div>
          </div>
          <div className='h-[314px] bg-[#111827] rounded-[10px] overflow-hidden relative p-6'>
            <img src={Curve} alt="Curve" className='absolute -right-2 w-[77px] h-[66px] -top-1 rounded-tr-[2rem]' />
            <div className='w-[48px] h-[48px] rounded-[10px] bg-[#233657] p-2 flex items-center justify-center'>
              <LiaPhoneSolid className='w-5 h-5 text-[#fff]' />
            </div>
            <div className='flex flex-col gap-5  mt-[64px]'>
              <div className='flex flex-col gap-2'>
                <p className='font-jost font-semibold text-[#FFFFFF] text-[20px] leading-[30px]'>Call us</p>
                <p className='font-jost text-[#FFFFFF] text-base leading-6'>Mon-Fri from 8am to 5pm.</p>
              </div>
              <p className='font-jost text-[#FFFFFF] font-medium text-base leading-6'> +234 904 017 7777</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-[96px] flex items-center px-[80px] justify-between'>
        <div className='flex flex-col gap-10'>
          <div className='flex flex-col gap-6'>
            <p className='font-jost text-[#101828] text-[48px] leading-[60px] font-semibold'>No long-term contracts. <br /> No catches.</p>
            <p className='text-GREY-_500 font-jost text-[20px] leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
          </div>
          <div className='flex gap-3 items-center'>
            <button onClick={() => {navigate("/about"), window.scrollTo(0, 0)}} className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
              <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
            </button>
            <button onClick={() => {navigate("/login"), window.scrollTo(0, 0)}} className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
              <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
            </button>
          </div>
        </div>
        <img src={Content} alt='Content' className='w-[576px] h-[496px]' />
      </div>

      <div className='bg-[#1D2939] h-[207px] mt-[226px] relative'>
        <div className='bg-GREY-_50 rounded-[16px] p-16 flex justify-between w-10/12 mx-auto absolute bottom-28 right-0 left-0'>
          <div className='flex flex-col items-start gap-4'>
            <p className='text-GREY-_900 font-jost font-semibold text-[30px] leading-[38px]'>Start your 14-day free trial</p>
            <p className='text-GREY-_500 text-[20px] font-jost leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
          </div>
          <div className='flex gap-3 items-center'>
            <button onClick={() => {navigate("/about"), window.scrollTo(0, 0)}} className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
              <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
            </button>
            <button onClick={() => {navigate("/login"), window.scrollTo(0, 0)}} className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
              <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
            </button>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Contact