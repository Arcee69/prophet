import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdClose } from 'react-icons/md'
import Logo from "../../assets/png/logo.png"

const MobileNavBar = ({ handleClose }) => {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
    window.scrollTo(0, 0)
    handleClose()
  }

  return (
    <div className='fixed inset-0 z-50'>
      {/* Overlay */}
      <div 
        className='absolute inset-0 bg-black bg-opacity-50'
        onClick={handleClose}
      />
      
      {/* Navigation drawer */}
      <div className='absolute right-0 top-0 h-full w-full bg-white shadow-lg'>
        {/* Header with close button */}
        <div className='flex justify-between items-center p-4 '>
            <img src={Logo} alt='logo' className='w-[111px] lg:h-[50px]' onClick={() => navigate("/")} />

          <MdClose 
            className='w-6 h-6 cursor-pointer'
            onClick={handleClose}
          />
       
        </div>

        {/* Navigation items */}
        <div className='flex flex-col p-6 space-y-6'>
          <p 
            className='font-jost text-lg cursor-pointer'
            onClick={() => handleNavigation("/about")}
          >
            About
          </p>
          <p 
            className='font-jost text-lg cursor-pointer'
            onClick={() => handleNavigation("/our-suite")}
          >
            Our Suite
          </p>
          <p 
            className='font-jost text-lg cursor-pointer'
            onClick={() => handleNavigation("/use-cases")}
          >
            Use Cases
          </p>
          <p 
            className='font-jost text-lg cursor-pointer'
            onClick={() => handleNavigation("/pricing")}
          >
            Pricing
          </p>
          <p 
            className='font-jost text-lg cursor-pointer'
            onClick={() => handleNavigation("/blogs")}
          >
            Blog
          </p>
          <p 
            className='font-jost text-lg cursor-pointer'
            onClick={() => handleNavigation("/contact")}
          >
            Contact
          </p>
        </div>

        {/* Buttons */}
        <div className='absolute bottom-8 left-0 right-0 px-6 space-y-4'>
          <button 
            onClick={() => handleNavigation("/register")}
            className='w-full py-3 bg-[#202633] text-white rounded-lg font-jost font-semibold hover:bg-[#F48A1F] transition-colors'
          >
            Start Free
          </button>
          <button 
            onClick={() => handleNavigation("/login")}
            className='w-full py-3 bg-white border border-gray-300 rounded-lg font-jost font-semibold'
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileNavBar