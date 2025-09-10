import React from 'react'
import { MdClose } from 'react-icons/md'

const Cookies = ({ handleClose }) => {
  return (
    <div className='bg-[#fff] w-[600px] h-[500px] flex flex-col gap-4 overflow-y-scroll  mt-[100px] rounded-lg p-4'>
        <div className='flex items-center justify-between'>
            <p className='font-medium font-jost  text-[24px] text-[#000]'>Cookie Policy</p>
            <button className="flex justify-center items-center" onClick={handleClose}>
                <MdClose className='w-5 h-5 ' />
            </button>
        </div>
        <div className='mt-[15px]'>
            <p className='font-jost text-[#000] text-base'>
                September 10, 2025
                <span className='block'>
                    1. What Are Cookies? Cookies are small text files placed on your device 
                    (computer, phone, tablet) when you visit a website. They help the website 
                    recognize your device and remember information about your visit.
                </span>
                <span className='block'>
                    2. Types of Cookies We Use
                        • Essential Cookies: These are necessary for the basic functionality of our platform, 
                        such as keeping you logged in and ensuring security. The platform cannot function 
                        properly without them.
                        • Analytics Cookies: These cookies help us understand how users interact with our 
                        website by collecting and reporting information anonymously. This allows us to improve 
                        our service.
                        • Optional/Marketing Cookies: These cookies may be used to track your 
                        activity across websites to deliver more relevant advertising. We will only 
                        use these cookies with your explicit consent.
                </span>
                <span className='block'>
                    3. How We Use Cookies We use cookies to ensure site functionality, 
                    analyze performance, improve our services, and secure your account. 
                    Where applicable and with your consent, we may also use them to deliver tailored content.
                </span>
                <span className='block'>
                    4. Consent and Management When you first visit our site, you will see a cookie banner 
                    asking for your consent to use non-essential cookies. You can accept all cookies or manage 
                    your preferences. You can also change your preferences or disable cookies at any time through 
                    your browser settings, though this may affect the functionality of some parts of our website.
                </span>
                <span className='block'>
                    5. Third-Party Cookies Some cookies may be placed by third-party services we use 
                    for analytics or embedded content. We ensure that our contracts with these third parties 
                    require them to be NDPA-compliant.
                </span>
                <span className='block'>
                    6. Updates to This Policy We may update this Cookie Policy as our use of cookies changes. 
                    The latest version will always be available on our website.
                </span>
            </p>

        </div>
    </div>
  )
}

export default Cookies
 