import React, { useEffect, useState } from 'react'
import BasicDetails from './components/BasicDetails'
import Password from './components/Password'
import Subscription from './components/Subscription'
import Billing from './components/Billing'
import { useDispatch } from 'react-redux'
import { fetchProfile } from '../../features/profile/getProfileSlice'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Basic')

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile())
  }, [])

  return (
    <div className='flex flex-col gap-7 px-3 w-full'>
      <div className='flex flex-col gap-1'>
        <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Setting</p>
        <p className='text-[#667185] text-sm font-jost'>Manage your account settings and details here. Ensure all information is accurate to enhance user experience.</p>
      </div>

      <div className='border-b border-[#9CA3AF] w-full flex gap-3 items-center'>
        <div onClick={() => handleTabChange("Basic")} className={`${activeTab === "Basic" ? "border-b border-[#E57E46]" : ""} cursor-pointer px-5 py-2.5`}>
          <p className={`${activeTab === "Basic" ? "text-[#F48A1F]" : "text-GREY-1000"} font-lato text-[15px] leading-[22px]`}>Basic Details</p>
        </div>
        <div onClick={() => handleTabChange("Password")} className={`${activeTab === "Password" ? "border-b border-[#E57E46]" : ""} cursor-pointer px-5 py-2.5`}>
          <p className={`${activeTab === "Password" ? "text-[#F48A1F]" : "text-GREY-1000"} font-lato text-[15px] leading-[22px]`}>Password</p>
        </div>
        <div onClick={() => handleTabChange("Subscription")} className={`${activeTab === "Subscription" ? "border-b border-[#E57E46]" : ""} cursor-pointer px-5 py-2.5`}>
          <p className={`${activeTab === "Subscription" ? "text-[#F48A1F]" : "text-GREY-1000"} font-lato text-[15px] leading-[22px]`}>Subscription</p>
        </div>
        <div onClick={() => handleTabChange("Billing")} className={`${activeTab === "Billing" ? "border-b border-[#E57E46]" : ""} cursor-pointer px-5 py-2.5`}>
          <p className={`${activeTab === "Billing" ? "text-[#F48A1F]" : "text-GREY-1000"} font-lato text-[15px] leading-[22px]`}>Billing</p>
        </div>
      </div>

        {activeTab === "Basic" && <BasicDetails />}
        {activeTab === "Password" && <Password />}
        {activeTab === "Subscription" && <Subscription />}
        {activeTab === "Billing" && <Billing />}
    </div>
  )
}

export default Settings