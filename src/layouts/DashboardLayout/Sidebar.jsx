import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RxDashboard } from 'react-icons/rx'
import { FiBox } from 'react-icons/fi'
import { MdOutlineCreditCard, MdOutlineInsertChartOutlined, MdOutlineShield } from 'react-icons/md'
import { LiaDonateSolid } from 'react-icons/lia'
import { LuBell } from "react-icons/lu";
import { HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { PiChatCenteredTextBold } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { TbReportAnalytics, TbUserSquare } from 'react-icons/tb'

import LogoWhite from "../../assets/svg/logo_white.svg"


import Jane from "../../assets/png/jane.png"

// import { logout } from '../../features/auth/loginSlice'
import { FaRegUser } from 'react-icons/fa6'

const Sidebar = ({ closeSidebar }) => {

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userLogin)



    const handleLogout = () => {
        // dispatch(logout());
        Cookies.remove("userObj");
        navigate("/"); 
    };

  return (
    <div className='border w-full flex flex-col items-center bg-[#fff]  py-[18px] px-[24px] h-full border-l-0 overflow-y-auto overflow-x-hidden border-t-0 border-r-[#E5E5EA]'>
      <div className={`lg:flex hidden flex-col -ml-[10%] gap-1`}>
        <img src={LogoWhite} alt='LogoWhite' className='w-[132px] h-[38px]' />
      </div>
      <div className={`mt-[80px] lg:mt-[49px] flex flex-col gap-2 h-screen relative`}>
        <div 
            className={` ${location.pathname === "/dashboard" ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/dashboard"); closeSidebar()}} 
        >
          <RxDashboard className={`${location.pathname === "/dashboard" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`}/>
          <p className={`${location.pathname === "/dashboard" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Dashboard</p>
        </div>

        <div 
            className={`${location.pathname === "/users"  ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/users"); closeSidebar()}}
        >
            <FaRegUser className={`${location.pathname === "/users" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`}  />
            <p className={`${location.pathname === "/users" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Users</p>
        </div> 

        <div 
            className={`${location.pathname === "/users/unverified"  ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/users/unverified"); closeSidebar()}}
        >
            <HiOutlineUsers className={`${location.pathname === "/users/unverified" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`}  />
            <p className={`${location.pathname === "/users/unverified" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Unverified Users</p>
        </div>     

        <div 
            className={`${location.pathname === "/transactions" ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/transactions"); closeSidebar()}}
        >
            <MdOutlineInsertChartOutlined className={`${location.pathname === "/transactions" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`} />
            <p className={`${location.pathname === "/transactions" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Transactions</p>
        </div>

        <div 
            className={`${location.pathname === "/cards-creation" ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/cards-creation"); closeSidebar()}}
        >
            <MdOutlineCreditCard className={`${location.pathname === "/cards-creation" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`} />
            <p className={`${location.pathname === "/cards-creation" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Cards Creation</p>
        </div>

        <div 
            className={`${location.pathname === "/cards-funding" ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/cards-funding"); closeSidebar()}}
        >
            <MdOutlineCreditCard className={`${location.pathname === "/cards-funding" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`} />
            <p className={`${location.pathname === "/cards-funding" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Cards Funding</p>
        </div>

        <div 
            className={`${location.pathname === "/notification" ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/notification"); closeSidebar()}}
        >
            <LuBell className={`${location.pathname === "/notification" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`} />
            <p className={`${location.pathname === "/notification" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Notification</p>
        </div>

        
        <div 
            className={`${location.pathname === "/questions"  ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/questions"); closeSidebar()}}
        >
            <IoDocumentTextOutline className={`${location.pathname === "/questions" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`} />
            <p className={`${location.pathname === "/questions" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Questions</p>
        </div>
    

        <div className='gap-2 flex flex-col absolute bottom-0'>

            <div className='bg-[#E1E5F3] w-[150px] h-[1px]'></div>
            <div className='flex items-center gap-2 cursor-pointer' onClick={handleLogout}>
                <img src={user?.img || Jane} alt='Profile' className='w-[40px] h-[40px] rounded-full' />
                <div className='flex flex-col gap-1'>
                    <p className='font-euclid text-[#1C1A3C] text-sm font-medium'>{`Super Admin`}</p>
                </div>
            </div>

        </div>

    </div>

    </div>
  )
}

export default Sidebar
