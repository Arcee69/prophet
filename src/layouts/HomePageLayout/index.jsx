import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import MiniHeader from './MiniHeader'

const HomePageLayout = () => {
  return (
    <div className='w-full bg-[#F1F1F1] overflow-x-hidden'>
        <div className='w-full hidden lg:block '>
            <Header />
        </div>
        <div className='flex lg:hidden'>
          <MiniHeader />
        </div>
        <div className=''>
            <Outlet />
        </div>
        <div className=''>
            <Footer />
        </div>
    </div>
  )
}

export default HomePageLayout