import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PiUsersThree } from 'react-icons/pi'
import Cookies from 'js-cookie'

import Gift from "../../assets/svg/gift.svg"
import Headset from "../../assets/svg/headset.svg"
import Home from "../../assets/svg/home.svg"
import Lightning from "../../assets/svg/lightning_white.svg"
import Settings from "../../assets/svg/settings.svg"
import Speaker from "../../assets/svg/speaker.svg"
import Voice from "../../assets/svg/voice_ai.svg"
import LogoWhite from "../../assets/png/logo_white.jpg"

import Jane from "../../assets/png/jane.png"
import { logout } from '../../features/auth/loginSlice'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegCircleUser } from 'react-icons/fa6'

// import { logout } from '../../features/auth/loginSlice'

const Sidebar = ({ closeSidebar }) => {
    const [showLogout, setShowLogout] = useState(false)
    const logoutRef = useRef(null)


  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userLogin);
  console.log(user, "user in sidebar")


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (logoutRef.current && !logoutRef.current.contains(event.target)) {
                setShowLogout(false);
            }
        };

        if (showLogout) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLogout]);


    const handleLogout = () => {
        dispatch(logout());
        Cookies.remove("userProps");
        Cookies.remove("token");
        navigate("/"); 
    };

  return (
    <div className='border w-full flex flex-col items-center bg-[#111827]  py-[18px] px-[14px] h-full border-l-0 overflow-y-auto overflow-x-hidden border-t-0 border-r-[#E5E5EA]'>
        <div className={`lg:flex hidden flex-col -ml-[10%] gap-1`}>
            <img src={LogoWhite} alt='LogoWhite' className='w-[132px] h-[55px]' />
        </div>
        <div className={`mt-[80px] lg:mt-[49px] flex flex-col gap-2 h-screen relative`}>
            <div 
                className={`${location.pathname === "/ara" ? "bg-[#F48A1F]" : ""} flex items-center gap-3 group hover:bg-[#F48A1F] p-2  cursor-pointer rounded-lg h-auto`} 
                onClick={() => { if (user?.data?.is_subscribed) { navigate("/ara"); closeSidebar(); } }} 
            >
                <img src={Voice} className={`${location.pathname === "/ara" ? "text-[#fff]" : ""} w-4 h-4 text-[#E4E7EC] group-hover:text-[#fff]`}/>
                <p className={`${location.pathname === "/ara" ? "text-[#fff]" : ""} font-inter text-[#E4E7EC] group-hover:text-[#fff] font-medium text-sm`}>Ara-PR Bot</p>
            </div>

            <div className='bg-[#E1E5F3] w-[150px] h-[1px] my-5'></div>

            <div 
                className={`${location.pathname === "/dashboard"  ? "bg-[#F48A1F]" : ""} flex items-center gap-3 group hover:bg-[#F48A1F] p-2  cursor-pointer rounded-lg h-auto`} 
                onClick={() => {if (user?.data?.is_subscribed) navigate("/dashboard"); closeSidebar()}}
            >
                <img src={Home} className={`${location.pathname === "/dashboard" ? "text-[#fff]" : ""} w-4 h-4 text-[#E4E7EC] group-hover:text-[#fff]`}  />
                <p className={`${location.pathname === "/dashboard" ? "text-[#fff]" : ""} font-inter text-[#E4E7EC] group-hover:text-[#fff] font-medium text-sm`}>Dashboard</p>
            </div> 

            <div 
                className={`${location.pathname === "/sentiment-analysis" ? "bg-[#F48A1F]" : ""} flex items-center gap-3 group hover:bg-[#F48A1F] p-2  cursor-pointer rounded-lg h-auto`} 
                onClick={() => {if (user?.data?.is_subscribed) navigate("/sentiment-analysis"); closeSidebar()}}
            >
                <img src={Speaker} className={`${location.pathname === "/sentiment-analysis" ? "text-[#fff]" : ""} w-4 h-4 text-[#E4E7EC] group-hover:text-[#fff]`} />
                <p className={`${location.pathname === "/sentiment-analysis" ? "text-[#fff]" : ""} font-inter text-[#E4E7EC] group-hover:text-[#fff] font-medium text-sm`}>Sentiment Analysis</p>
            </div>

            <div 
                className={`${location.pathname === "/brandwatch" ? "bg-[#F48A1F]" : ""} flex items-center gap-3 group hover:bg-[#F48A1F] p-2  cursor-pointer rounded-lg h-auto`} 
                onClick={() => {if (user?.data?.is_subscribed) navigate("/brandwatch"); closeSidebar()}}
            >
                <PiUsersThree  className={`${location.pathname === "/brandwatch" ? "text-[#fff]" : ""} w-4 h-4 text-[#E4E7EC] group-hover:text-[#fff]`} />
                <p className={`${location.pathname === "/brandwatch" ? "text-[#fff]" : ""} font-inter text-[#E4E7EC] group-hover:text-[#fff] font-medium text-sm`}>Brand Watch</p>
            </div>

            

            <div 
                className={`${location.pathname === "/reports" ? "bg-[#F48A1F]" : ""} flex items-center gap-3 group hover:bg-[#F48A1F] p-2  cursor-pointer rounded-lg h-auto`} 
                onClick={() => {navigate("/reports"); closeSidebar()}}
            >
                <img src={Lightning} className={`${location.pathname === "/reports" ? "text-[#fff]" : ""} w-4 h-4 text-[#E4E7EC] group-hover:text-[#fff]`} />
                <p className={`${location.pathname === "/reports" ? "text-[#fff]" : ""} font-inter text-[#E4E7EC] group-hover:text-[#fff] font-medium text-sm`}>Reports</p>
            </div>

            <div className='bg-[#E1E5F3] w-[150px] h-[1px] my-5'></div>


            <div className='gap-2 flex flex-col absolute bottom-0'>
                <div 
                    className={`${location.pathname === "/settings"  ? "bg-[#F48A1F]" : ""} flex items-center gap-3 group hover:bg-[#F48A1F] p-2  cursor-pointer rounded-lg h-auto`} 
                    onClick={() => {navigate("/settings"); closeSidebar()}}
                >
                    <img src={Settings} className={`${location.pathname === "/settings" ? "text-[#fff]" : ""} w-4 h-4 text-[#E4E7EC] group-hover:text-[#fff]`} />
                    <p className={`${location.pathname === "/settings" ? "text-[#fff]" : ""} font-inter text-[#E4E7EC] group-hover:text-[#fff] font-medium text-sm`}>Settings</p>
                </div>

                <div 
                    className={`${location.pathname === "/contact"  ? "bg-[#F48A1F]" : ""} flex items-center gap-3 group hover:bg-[#F48A1F] p-2  cursor-pointer rounded-lg h-auto`} 
                    onClick={() => {navigate("/contact"); closeSidebar()}}
                >
                    <img src={Headset} className={`${location.pathname === "/contact" ? "text-[#fff]" : ""} w-4 h-4 text-[#E4E7EC] group-hover:text-[#fff]`} />
                    <p className={`${location.pathname === "/contact" ? "text-[#fff]" : ""} font-inter text-[#E4E7EC] group-hover:text-[#fff] font-medium text-sm`}>Contact</p>
                </div>

                {/* <div 
                    className={`${location.pathname === "/refer"  ? "bg-[#F48A1F]" : ""} flex items-center gap-3 group hover:bg-[#F48A1F] p-2  cursor-pointer rounded-lg h-auto`} 
                    onClick={() => {navigate("/refer"); closeSidebar()}}
                >
                    <img src={Gift} className={`${location.pathname === "/refer" ? "text-[#fff]" : ""} w-4 h-4 text-[#E4E7EC] group-hover:text-[#fff]`} />
                    <p className={`${location.pathname === "/refer" ? "text-[#fff]" : ""} font-inter text-[#E4E7EC] group-hover:text-[#fff] font-medium text-sm`}>Refer family and friends</p>
                </div> */}

                <div ref={logoutRef} className='relative flex items-center gap-2 cursor-pointer' onClick={() => setShowLogout(!showLogout)}>
                    <FaRegCircleUser className="w-8 h-8 text-[#fff]"/>
                    <div className='flex flex-col gap-1'>
                        <p className='font-inter text-[#FFF] text-sm font-medium'>{`${user?.data?.name}`}</p>
                    </div>
                    {showLogout && (
                        <div className='absolute w-[100px] bottom-full right-0 mt-2 bg-white border border-gray-200 flex justify-center rounded shadow-lg p-2 z-10'>
                            <button onClick={handleLogout} type='button' className='text-RED-_100 cursor-pointer hover:text-RED-_100'>Logout</button>
                        </div>
                    )}
                </div>

            </div>

        </div>

    </div>
  )
}

export default Sidebar
