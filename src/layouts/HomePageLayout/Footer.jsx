import React, { useState } from 'react'
import LogoBig from '../../assets/svg/logo_big.svg'
import Manual from '../../assets/pdf/User_Manual.pdf'

import { BsTwitterX } from 'react-icons/bs'
import { HiOutlinePhone } from 'react-icons/hi'
import { MdMailOutline } from 'react-icons/md'
import { SiInstagram } from 'react-icons/si'
import { SlSocialLinkedin } from 'react-icons/sl'
import { TbBrandFacebook } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import ModalPop from '../../components/modalPop'
import Terms from './Terms'
import Cookies from './Cookies'
import Privacy from './Privacy'

const Footer = () => {
  const [openTermsModal, setOpenTermsModal] = useState(false)
  const [openCookiesModal, setOpenCookiesModal] = useState(false)
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false)

  const navigate = useNavigate()

  return (
    <div className="bg-[#111827] px-6 sm:px-10 md:px-16 lg:px-[116px] py-10 md:py-16 flex flex-col">
      <div className="flex flex-col gap-10 md:gap-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-bold font-jost text-lg md:text-xl leading-7">ArabyProphet</p>
            <p className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6">
              AI-powered media monitoring and brand analytics platform.
            </p>
            <div className="flex gap-4">
              <BsTwitterX
                className="w-5 h-5 text-[#9CA3AF] cursor-pointer"
                onClick={() => window.open("https://x.com/arabyprophet?s=21", "_blank")}
              />
              <SlSocialLinkedin
                className="w-5 h-5 text-[#9CA3AF] cursor-pointer"
                onClick={() => window.open("https://www.linkedin.com/company/arabyprophet/about/", "_blank")}
              />
              <TbBrandFacebook
                className="w-5 h-5 text-[#9CA3AF] cursor-pointer"
                onClick={() => window.open("https://www.facebook.com/profile.php?id=61576820370395", "_blank")}
              />
              <SiInstagram
                className="w-5 h-5 text-[#9CA3AF] cursor-pointer"
                onClick={() =>
                  window.open("https://www.instagram.com/arabyprophet?igsh=MW90ZTg0bng3bTRIYQ==", "_blank")
                }
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-bold font-jost text-lg md:text-xl leading-7">Products</p>
            <p
              className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6 cursor-pointer"
              onClick={() => {
                navigate("/our-suite")
                window.scrollTo(0, 0)
              }}
            >
              Our Suite
            </p>
            <p
              className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6 cursor-pointer"
              onClick={() => {
                navigate("/use-cases")
                window.scrollTo(0, 0)
              }}
            >
              Use Cases
            </p>
            <p
              className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6 cursor-pointer"
              onClick={() => {
                navigate("/pricing")
                window.scrollTo(0, 0)
              }}
            >
              Pricing
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-bold font-jost text-lg md:text-xl leading-7">Resources</p>
            <p
              className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6 cursor-pointer"
              onClick={() => {
                navigate("/blogs")
                window.scrollTo(0, 0)
              }}
            >
              Blog
            </p>
            <p
              className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6 cursor-pointer"
              onClick={() => {
                window.open(`${Manual}`, "_blank")
              }}
            >
              User Manual
            </p>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-bold font-jost text-lg md:text-xl leading-7">Contact</p>
            <div className="flex items-center gap-2">
              <MdMailOutline className="w-5 h-5 text-[#9CA3AF]" />
              <p className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6">info@arabyprophet.com</p>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlinePhone className="w-5 h-5 text-[#9CA3AF]" />
              <p className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6">+2349040177777</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="bg-[#1F2937] w-full h-px"></div> */}

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-jost text-[#9CA3AF] text-sm md:text-base leading-6 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Prophet by Chain Reactions Media. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <p
              onClick={() => setOpenPrivacyModal(true)}
              className="font-jost cursor-pointer text-sm md:text-base leading-6 text-[#9CA3AF]"
            >
              Privacy Policy
            </p>
            <p
              onClick={() => setOpenTermsModal(true)}
              className="font-jost cursor-pointer text-sm md:text-base leading-6 text-[#9CA3AF]"
            >
              Terms of Service
            </p>
            <p
              onClick={() => setOpenCookiesModal(true)}
              className="font-jost cursor-pointer text-sm md:text-base leading-6 text-[#9CA3AF]"
            >
              Cookie Policy
            </p>
          </div>
        </div>

        {/* Logo */}
        {/* <div className="w-full h-auto">
          <img src={LogoBig} alt="LogoBig" className="w-full max-h-[400px] object-contain" />
        </div> */}
      </div>

      {/* Modals */}
      <ModalPop isOpen={openTermsModal}>
        <Terms handleClose={() => setOpenTermsModal(false)} />
      </ModalPop>

      <ModalPop isOpen={openCookiesModal}>
        <Cookies handleClose={() => setOpenCookiesModal(false)} />
      </ModalPop>

      <ModalPop isOpen={openPrivacyModal}>
        <Privacy handleClose={() => setOpenPrivacyModal(false)} />
      </ModalPop>
    </div>
  )
}

export default Footer
