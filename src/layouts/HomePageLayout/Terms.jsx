import React from 'react'
import { MdClose } from 'react-icons/md'

const Terms = ({ handleClose }) => {
  return (
    <div className='bg-[#fff] w-[600px] h-[500px] flex flex-col gap-4 overflow-y-scroll  mt-[100px] rounded-lg p-4'>
        <div className='flex items-center justify-between'>
            <p className='font-medium font-jost  text-[24px] text-[#000]'>Terms of Service (ToS)</p>
            <button className="flex justify-center items-center" onClick={handleClose}>
                <MdClose className='w-5 h-5 ' />
            </button>
        </div>
        <div className='mt-[15px]'>
            <p className='font-jost text-[#000] text-base'>
                September 10, 2025
                <span className='block'>
                    1. Acceptance of Terms By creating an account, accessing, or using the 
                    Arabyprophet platform (“Service”), you agree to be bound by these Terms of Service (“Terms”). 
                    If you do not agree to these Terms, please do not use the Service.
                </span>
                <span className='block'>
                    2. User Eligibility You must be legally competent to enter into a binding contract in your 
                    jurisdiction to use this Service. You represent and warrant that all registration information 
                    you submit is accurate and truthful.
                </span>
                <span className='block'>
                    3. Account Responsibilities You are responsible for maintaining the confidentiality of your 
                    login credentials and for all activities that occur under your account. 
                    You agree to notify us immediately of any unauthorized use of your account.
                </span>
                <span className='block'>
                    4. Acceptable Use You agree to use the Service lawfully and ethically. You shall not:
                    • Upload malicious content (viruses, malware, etc.).
                    • Attempt to gain unauthorized access to our systems or user accounts.
                    • Use the Service to infringe on the intellectual property rights of others.
                    • Interfere with or disrupt the integrity or performance of the Service.
                </span>
                <span className='block'>
                    5. Intellectual Property
                    • Our Property: Arabyprophet and its licensors own all rights, title, and interest in and to the Service, including all related intellectual property rights. You may not copy, modify, or reproduce our content without our explicit permission.
                    • Your Property: You retain ownership of the data you upload to the Service ("Your Data"). You grant us a worldwide, royalty-free license to use, reproduce, and process Your Data solely for the purpose of providing and improving the Service for you.
                </span>
                <span className='block'>
                    6. Subscription and Fees Certain features of the Service may be subject to payments. 
                    All applicable subscription terms, including fees, billing cycles, and cancellation policies, 
                    will be clearly communicated to you at the time of purchase. You agree to pay all fees and 
                    applicable taxes in a timely manner.
                </span>
                <span className='block'>
                    7. Disclaimers and Limitation of Liability The Service is provided on an “as is” 
                    and “as available” basis. We disclaim all warranties, express or implied. 
                    To the maximum extent permitted by law, Arabyprophet shall not be liable for any indirect, 
                    incidental, special, or consequential damages arising out of or in connection with your use 
                    of the Service. Our total liability to you for any claim arising out of these Terms shall not 
                    exceed the amount you paid us, if any, in the 12 months preceding the claim.
                </span>
                <span className='block'>
                    8. Termination We reserve the right to suspend or terminate your account and access to the Service, 
                    without prior notice, if you breach these Terms. You may terminate your account at any time 
                    by contacting us.
                </span>
                <span className='block'>
                    9. Governing Law These Terms shall be governed by and construed in accordance with the 
                    laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. 
                    Any legal action or proceeding arising under these Terms will be brought exclusively in the 
                    courts located in Nigeria.
                </span>
                <span className='block'>
                    10. Amendments We may update these Terms at any time. 
                    We will notify you of any material changes by posting the new Terms on our website. 
                    Your continued use of the Service after such changes become effective constitutes your 
                    acceptance of the new Terms.
                </span>
            </p>
        </div>
    </div>
  )
}

export default Terms




