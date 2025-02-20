import React from 'react'

import Logo from "../../assets/svg/logo_black.svg"

const Header = () => {
  return (
    <div className='fixed z-50 w-full top-0 py-[20.5px] bg-[#F1F1F1]'>
        <div className='w-[754px] h-[67px] flex items-center gap-[40px] mx-auto'>
            <img src={Logo} alt='Logo' className='w-[114px] h-[67px]' />
            <div className='flex items-center gap-6'>
                <p className='font-jost text-base leading-[23px]'>About</p>
                <p className='font-jost text-base leading-[23px]'>Our Suite</p>
                <p className='font-jost text-base leading-[23px]'>Use Cases</p>
                <p className='font-jost text-base leading-[23px]'>Pricing</p>
                <p className='font-jost text-base leading-[23px]'>Contact</p>
            </div>
            <div className='flex items-center gap-4'>
                <button className='w-[99px] rounded-[8px] h-[45px] flex items-center bg-[#202633] p-2 justify-center'>
                    <p className='font-jost text-[#fff] font-semibold text-base leading-[23px]'>Start Free</p>
                </button>
                <button className='w-[73px] rounded-[8px] h-[45px] flex items-center bg-[#FFFFFF] p-2 justify-center'>
                    <p className='font-jost text-[#000] font-semibold text-base leading-[23px]'>Login</p>
                </button>
            </div>
        </div>
    </div>
  )
}

export default Header