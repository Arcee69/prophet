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
      {/* Hero Section */}
      <div className='flex flex-col pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-[150px] lg:h-[388px] bg-[#F2F2F2] gap-4 md:gap-6 items-center px-4'>
        <div className='flex flex-col items-center gap-2 md:gap-3'>
          <p className='text-[#E57E46] font-jost text-sm md:text-base font-semibold leading-5 md:leading-6'>Contact Us</p>
          <p className='text-GREY-_900 text-2xl md:text-3xl lg:text-[48px] font-semibold leading-8 md:leading-10 lg:leading-[60px] text-center'>
            We'd love to hear from you
          </p>
        </div>
      </div>

      {/* Hidden image (if needed for future use) */}
      <div className='w-full hidden'>
        <img src={ContactBig} alt='ContactBig' className='w-full h-auto' />
      </div>

      {/* Contact Cards Grid */}
      <div className='px-4 md:px-8 lg:px-[80px] pt-8 md:pt-12 lg:pt-[64px] pb-12 md:pb-16 lg:pb-[96px]'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {/* Card 1 */}
          <div className='h-auto md:h-[314px] bg-[#111827] rounded-[10px] overflow-hidden relative p-4 md:p-6'>
            <img src={Curve} alt="Curve" className='absolute -right-2 w-[60px] md:w-[77px] h-[50px] md:h-[66px] -top-1 rounded-tr-[2rem]' />
            <div className='w-10 h-10 md:w-[48px] md:h-[48px] rounded-[10px] bg-[#233657] p-2 flex items-center justify-center'>
              <CiMail className='w-4 h-4 md:w-5 md:h-5 text-[#fff]' />
            </div>
            <div className='flex flex-col gap-4 md:gap-5 mt-8 md:mt-[64px]'>
              <div className='flex flex-col gap-1 md:gap-2'>
                <p className='font-jost font-semibold text-[#FFFFFF] text-lg md:text-[20px] leading-6 md:leading-[30px]'>Get instant response</p>
                <p className='font-jost text-[#FFFFFF] text-sm md:text-base leading-5 md:leading-6'>Speak to our friendly team.</p>
              </div>
              <p className='font-jost text-[#FFFFFF] font-medium text-sm md:text-base leading-5 md:leading-6'>Use our Chatbot</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className='h-auto md:h-[314px] bg-[#111827] rounded-[10px] overflow-hidden relative p-4 md:p-6'>
            <img src={Curve} alt="Curve" className='absolute -right-2 w-[60px] md:w-[77px] h-[50px] md:h-[66px] -top-1 rounded-tr-[2rem]' />
            <div className='w-10 h-10 md:w-[48px] md:h-[48px] rounded-[10px] bg-[#233657] p-2 flex items-center justify-center'>
              <FiMessageCircle className='w-4 h-4 md:w-5 md:h-5 text-[#fff]' />
            </div>
            <div className='flex flex-col gap-4 md:gap-5 mt-8 md:mt-[64px]'>
              <div className='flex flex-col gap-1 md:gap-2'>
                <p className='font-jost font-semibold text-[#FFFFFF] text-lg md:text-[20px] leading-6 md:leading-[30px]'>Chat to support</p>
                <p className='font-jost text-[#FFFFFF] text-sm md:text-base leading-5 md:leading-6'>We're here to help.</p>
              </div>
              <p className='font-jost text-[#FFFFFF] font-medium text-sm md:text-base leading-5 md:leading-6'>info@arabyprophet.com</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className='h-auto md:h-[314px] bg-[#111827] rounded-[10px] overflow-hidden relative p-4 md:p-6'>
            <img src={Curve} alt="Curve" className='absolute -right-2 w-[60px] md:w-[77px] h-[50px] md:h-[66px] -top-1 rounded-tr-[2rem]' />
            <div className='w-10 h-10 md:w-[48px] md:h-[48px] rounded-[10px] bg-[#233657] p-2 flex items-center justify-center'>
              <CiLocationOn className='w-4 h-4 md:w-5 md:h-5 text-[#fff]' />
            </div>
            <div className='flex flex-col gap-4 md:gap-5 mt-8 md:mt-[64px]'>
              <div className='flex flex-col gap-1 md:gap-2'>
                <p className='font-jost font-semibold text-[#FFFFFF] text-lg md:text-[20px] leading-6 md:leading-[30px]'>Head Office</p>
                <p className='font-jost text-[#FFFFFF] text-sm md:text-base leading-5 md:leading-6'>Visit our office HQ.</p>
              </div>
              <p className='font-jost text-[#FFFFFF] font-medium text-sm md:text-base leading-5 md:leading-6'>
                2c, Eso Close, off Oduduwa Crescent, GRA, Ikeja, Lagos, Nigeria
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className='h-auto md:h-[314px] bg-[#111827] rounded-[10px] overflow-hidden relative p-4 md:p-6'>
            <img src={Curve} alt="Curve" className='absolute -right-2 w-[60px] md:w-[77px] h-[50px] md:h-[66px] -top-1 rounded-tr-[2rem]' />
            <div className='w-10 h-10 md:w-[48px] md:h-[48px] rounded-[10px] bg-[#233657] p-2 flex items-center justify-center'>
              <LiaPhoneSolid className='w-4 h-4 md:w-5 md:h-5 text-[#fff]' />
            </div>
            <div className='flex flex-col gap-4 md:gap-5 mt-8 md:mt-[64px]'>
              <div className='flex flex-col gap-1 md:gap-2'>
                <p className='font-jost font-semibold text-[#FFFFFF] text-lg md:text-[20px] leading-6 md:leading-[30px]'>Call us</p>
                <p className='font-jost text-[#FFFFFF] text-sm md:text-base leading-5 md:leading-6'>Mon-Fri from 8am to 5pm.</p>
              </div>
              <p className='font-jost text-[#FFFFFF] font-medium text-sm md:text-base leading-5 md:leading-6'>+234 904 017 7777</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='mt-12 md:mt-16 lg:mt-[96px] flex flex-col lg:flex-row items-center px-4 md:px-8 lg:px-[80px] justify-between gap-8 md:gap-12'>
        <div className='flex flex-col gap-6 md:gap-8 lg:gap-10 order-2 lg:order-1'>
          <div className='flex flex-col gap-4 md:gap-6'>
            <p className='font-jost text-[#101828] text-2xl md:text-3xl lg:text-[48px] leading-8 md:leading-10 lg:leading-[60px] font-semibold text-center lg:text-left'>
              No long-term contracts. <br /> No catches.
            </p>
            <p className='text-GREY-_500 font-jost text-base md:text-lg lg:text-[20px] leading-6 md:leading-7 lg:leading-[30px] text-center lg:text-left'>
              Join over 4,000+ companies already growing with Prophet.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start'>
            <button onClick={() => { navigate("/about"); window.scrollTo(0, 0) }} className='bg-[#F2F2F2] w-full sm:w-[127px] rounded-lg flex items-center justify-center py-3 px-5'>
              <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
            </button>
            <button onClick={() => { navigate("/login"); window.scrollTo(0, 0) }} className='bg-[#111827] w-full sm:w-[128px] rounded-lg flex items-center justify-center py-3 px-5'>
              <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
            </button>
          </div>
        </div>
        <img src={Content} alt='Content' className='w-full lg:w-[576px] h-auto lg:h-[496px] order-1 lg:order-2' />
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
    </div>
  )
}

export default Contact