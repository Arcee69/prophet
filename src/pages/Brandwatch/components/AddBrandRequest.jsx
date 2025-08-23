import React, { useState } from 'react'
import { CgSpinner } from 'react-icons/cg'

const AddBrandRequest = ({ handleClose }) => {
    const [brandName, setBrandName] = useState("")
    const [loading, setLoading] = useState(false)

    const submitForm = () => { }

    return (
        <div className='bg-[#fff] w-[300px] h-[200px] shadow-md mt-[100px] flex flex-col items-center p-8 gap-8 rounded-lg'>
            <div className='flex gap-5 w-full flex-col'>
                <div className='flex flex-col gap-[5px]'>
                    <p className='font-jost text-base leading-[100%] text-DARK-400'>Brand Name</p>
                    <div className='border-GREY-700 rounded-[8px] border h-[44px] p-2'>
                        <input
                            name='brandName'
                            type='text'
                            placeholder='Enter Brand Name...'
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className='w-full bg-transparent outline-none font-jost text-sm'
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-between gap-8'>
                <button className='border w-[100px] h-[50px] rounded-lg border-[#EB5757] bg-[#fff] text' onClick={handleClose}>
                    <p className='font-jost font-bold text-base text-[#EB5757]'>Cancel</p>
                </button>
                <button onClick={submitForm} className='bg-[#F48A1F] w-[140px] border-none flex items-center justify-center p-2 rounded-lg'>
                    <p className='text-[#fff] text-base  font-jost text-center  font-medium'>{loading ? <CgSpinner className=" animate-spin text-lg  " /> : 'Request'}</p>
                </button>
            </div>
        </div>
    )
}

export default AddBrandRequest