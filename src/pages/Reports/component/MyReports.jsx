import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MyReports = () => {
    const [allReports, setAllReports] = useState([])
    const [search, setSearch] = useState('')


    const navigate = useNavigate()
    
    return (
        <div>
            <div className='flex mb-4'>
                <button
                    type='button'
                    className='w-[100px] h-[40px] bg-[#111827] rounded-[8px] p-2'
                    onClick={() => navigate(-1)}
                >
                    <p className='font-jost text-white text-base font-medium'>Back</p>
                </button>
            </div>
            <div className='bg-white rounded-3xl flex flex-col gap-6 w-full p-5'>
                <div className='flex items-center gap-4'>
                    <p className='font-jost font-semibold text-[#6B7280] text-[18px] leading-6'>My Reports</p>
                </div>
                <div className="flex flex-col">
                    <div className='flex mb-5 justify-end'>
                        <input
                            name='search'
                            value={search}
                            placeholder='Search Report'
                            className='appearance-none w-[350px] outline-none border border-[#D1D5DB] p-2 rounded-lg bg-transparent font-jost text-base text-[#111827]'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-5 bg-[#F1F3F9] px-4 py-2 font-jost text-[#667185] text-sm">
                        <p>Title</p>
                        <p>Type</p>
                        <p>Region</p>
                        <p>Status</p>
                        <p>Action</p>
                    </div>
                    {allReports?.length > 0 ? allReports?.map((item) => (
                        <div key={item.id} className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 items-center">
                            <p className="text-[#101928] font-jost capitalize text-sm">{item.name}</p>
                            <p className="text-[#101928] font-jost capitalize text-sm">{item.user.name}</p>
                            <p className="text-[#101928] font-jost text-sm">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                    )) :
                        <div className='flex items-center mt-5 justify-center'>
                            <p className='text-[#101928] font-jost text-sm font-medium'>No Reports Available</p>
                        </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default MyReports