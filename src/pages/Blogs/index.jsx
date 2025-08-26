import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci'

import Card from "../../assets/png/card.jpg"
import Content from "../../assets/png/content.png"


import { MdArrowOutward } from 'react-icons/md'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

const Blogs = () => {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)


    const blogPost = [
        {
            img: Card,
            name: "John Doe",
            date: "20 Jan 2022",
            title: "Building a Strong Brand Reputation: Best Practices and Case Studies from Nigeria",
            content: "A strong brand reputation is essential for business success, particularly in Nigeria’s competitive market."
        }
    ]

  return (
    <div className='w-full'>
        <div className='flex flex-col h-[340px] pt-[150px] bg-[#F2F2F2] gap-6 items-center'>
            <div className='flex flex-col items-center gap-3'>
                <p className='text-[#E57E46] font-jost text-base font-semibold leading-6'>Resources</p>
                <p className='text-GREY-_900 text-[48px] leading-[60px]'>Insights into the Future</p>
            </div>
            <p className='text-[#667085] font-jost text-[18px] leading-[28px]'>The latest industry news, interviews, technologies, and resources.</p>
        </div>
        <div className='bg-white flex flex-col'>
            <div className=' px-[112px] py-[96px] flex flex-col gap-[32px]'>
                <div className='flex flex-col lg:flex-row gap-5 lg:gap-0 items-center justify-between'>
                    <div className='flex items-center p-2 gap-1.5 w-[320px] rounded-lg border border-[#D0D5DD]'>
                        <CiSearch  className='w-4 h-4 text-[#D0D5DD]'/>
                        <input 
                            className='text-[#667085] font-jost text-base leading-6 outline-none'
                            placeholder='Search'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex items-center justify-between font-jost p-2 w-[320px] border border-[#D0D5DD] rounded-lg"
                    >
                        {/* <option value="">Status</option> */}
                        <option value="true">Newest First</option>
                    </select>
                </div>

                <div className={`${blogPost.length > 0 ? 'grid grid-cols-2 gap-[32px]' : "flex items-center justify-center"}`}>
                    {
                        blogPost.length > 0 ?
                        blogPost.map((item, index) => (
                        <div className='rounded-3xl overflow-hidden bg-white shadow-md' key={index}>
                                <div className='relative'>
                                    <img src={item.img} alt="Blog cover" className='w-full h-64 object-cover' />
                                    <div className='absolute inset-0 bg-gradient-to-t from-gray-800/60 to-transparent'></div>
                                    <div className='absolute bottom-0 left-0 bg-[#FFFFFF4D] right-0 p-4 text-white text-center'>
                                        <p className='font-jost text-base font-medium'>{item.name}</p>
                                        <p className='font-jost text-sm'>{item.date}</p>
                                    </div>
                                </div>
                                <div className='p-6'>
                                    <h2 className='text-2xl font-medium text-GREY-_900 font-jost leading-tight'>{item.title}</h2>
                                    <p className='text-[#667085] font-jost text-base mt-2'>{item.content}</p>
                                    <div className='flex items-center relative mt-[56px] gap-3'>
                                        <a href="#" className='text-[#E57E46] font-jost text-baseinline-block'>Read Post </a>
                                        <MdArrowOutward className='text-[#E57E46] w-5 h-5' />
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <p className='font-jost text-GREY-_900 font-medium text-xl'>No Blog Available</p>
                    }
                </div>
                <div className='flex justify-between items-center p-4 mt-4'>
                    <button
                        className='flex items-center gap-3 cursor-pointer'
                        // onClick={handlePrevious}
                        // disabled={!pagination?.prevPageUrl}
                    >
                        <FaArrowLeft className='w-4 h-4 text-GREY-_700' />
                        <p className='text-GREY-_700 font-medium font-jost'>Previous</p>
                    </button>
                    <span className='px-4 py-2 text-GREY-_500 rounded-lg'>
                        {currentPage}
                    </span>
                    <button
                        className='flex items-center gap-3 cursor-pointer'
                        // onClick={handleNext}
                        // disabled={!pagination?.nextPageUrl}
                    >
                        <p className='text-GREY-_700 font-medium font-jost'>Next</p>
                        <FaArrowRight className='w-4 h-4 text-GREY-_700' />
                    </button>
                </div>

                <div className='mt-[64px] flex items-center justify-between'>
                    <div className='flex flex-col gap-10'>
                        <div className='flex flex-col gap-6'>
                              <p className='font-jost text-[#101828] text-[48px] leading-[60px] font-semibold'>No long-term contracts. <br /> No catches.</p>
                            <p className='text-GREY-_500 font-jost text-[20px] leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
                        </div>
                        <div className='flex gap-3 items-center'>
                            <button className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
                                <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                            </button>
                            <button className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
                                <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                            </button>
                        </div>
                    </div>
                    <img src={Content} alt='Content' className='w-[576px] h-[496px]' />
                </div>
            </div>
            <div className='bg-[#1D2939] h-[207px] mt-[101px] relative'>
                <div className='bg-GREY-_50 rounded-[16px] p-16 flex justify-between w-10/12 mx-auto absolute bottom-28 right-0 left-0'>
                    <div className='flex flex-col items-start gap-4'>
                        <p className='text-GREY-_900 font-jost font-semibold text-[30px] leading-[38px]'>Start your 30-day free trial</p>
                        <p className='text-GREY-_500 text-[20px] font-jost leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <button className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
                            <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
                        </button>
                        <button className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
                            <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Blogs