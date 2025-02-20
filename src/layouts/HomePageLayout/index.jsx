import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const HomePageLayout = () => {
  return (
    <div className='w-full bg-[#F1F1F1] overflow-x-hidden'>
        <div className='w-full '>
            <Header />
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