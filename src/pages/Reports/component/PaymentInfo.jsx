import React from 'react'
import { MdClose } from 'react-icons/md'

const PaymentInfo = ({ handleClose }) => {
    return (
        <div className='bg-[#fff] w-[600px] h-[400px] flex flex-col gap-4 overflow-y-scroll  mt-[100px] rounded-lg p-4'>
            <div className='flex items-center justify-between'>
                <p className='font-medium font-jost  text-[24px] text-[#000]'>Payment Info</p>
                <button className="flex justify-center items-center" onClick={handleClose}>
                    <MdClose className='w-5 h-5 ' />
                </button>
            </div>

            <div className='flex flex-col gap-4'>
                <p className='font-jost text-[20px] text-[#000] font-medium'>
                    Kindly Make Payment To The Bank Information Below
                </p>
                <div className='flex flex-col  gap-4'>
                    <p className='text-base font-jost '>Amount: <span>$1000</span></p>
                    <p className='text-base font-jost '>Bank: <span>Ara MfB</span></p>
                    <p className='text-base font-jost '>Bank Name: <span>Ara by Prophet</span></p>
                    <p className='text-base font-jost '>Bank Account: <span>0011220430</span></p>
                </div>
                <p className='font-jost text-[20px] text-[#000] font-medium'>
                    Once Payment is Confirmed, your report will be sent to your registered 
                    email and will also be available for download in <span className='font-bold'>My Report</span>
                </p>
            </div>

        </div>
    )
}

export default PaymentInfo