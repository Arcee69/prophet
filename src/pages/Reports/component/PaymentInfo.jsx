import React from 'react'
import { CgSpinner } from 'react-icons/cg'
import { MdClose } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const PaymentInfo = ({ handleClose, loading }) => {

    const navigate = useNavigate()
    
    return (
        <div className='bg-[#fff] w-[600px] h-[450px] flex flex-col gap-4 overflow-y-scroll  mt-[100px] rounded-lg p-4'>
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
            <div className='flex items-center justify-center'>
                <button 
                    disabled={loading} 
                    onClick={() => {handleClose(), navigate("/reports/my-reports")}} 
                    className='flex bg-black p-2 rounded-lg items-center justify-center gap-1.5 cursor-pointer w-[100px] h-[40px]'
                >
                    <p className='text-[#fff] text-base font-lato text-center'>{loading ? <CgSpinner className='w-5 h-5 animate-spin' /> : "Close"}</p>
                </button>
            </div>

        </div>
    )
}

export default PaymentInfo