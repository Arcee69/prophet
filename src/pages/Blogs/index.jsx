// import React, { useEffect, useState } from 'react'
// import { CiSearch } from 'react-icons/ci'

// import Card from "../../assets/png/card.jpg" 
// import Content from "../../assets/png/content.png"

// import { MdArrowOutward } from 'react-icons/md'
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchBlogs } from '../../features/blogs/getBlogsSlice'

// const Blogs = () => {
//     const [search, setSearch] = useState("")
//     const [statusFilter, setStatusFilter] = useState("Newest First") 
//     const [currentPage, setCurrentPage] = useState(1)

//     const navigate = useNavigate()
//     const dispatch = useDispatch()

//     const { blogs } = useSelector((state) => state.allBlogs)
//     console.log(blogs?.data, "blogs") 

//     useEffect(() => {
//         // Dispatch fetch with params for search, filter, and pagination
//         dispatch(fetchBlogs({
//             search,
//             sort: statusFilter === "Newest First" ? "desc" : "asc",
//             page: currentPage
//         }))
//     }, [search, statusFilter, currentPage, dispatch])

//     // Helper to strip HTML tags from body for plain text content preview
//     const stripHtml = (html) => {
//         return html.replace(/<[^>]*>/g, '').trim()
//     }

//     // Helper to format date (e.g., "20 Jan 2022")
//     const formatDate = (dateString) => {
//         const date = new Date(dateString)
//         return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//     }

//     const handlePrevious = () => {
//         if (blogs?.pagination?.prev_page_url) {
//             setCurrentPage((prev) => prev - 1)
//         }
//     }

//     const handleNext = () => {
//         if (blogs?.pagination?.next_page_url) {
//             setCurrentPage((prev) => prev + 1)
//         }
//     }

//     return (
//         <div className='w-full'>
//             <div className='flex flex-col h-[340px] pt-[150px] bg-[#F2F2F2] gap-6 items-center'>
//                 <div className='flex flex-col items-center gap-3'>
//                     <p className='text-[#E57E46] font-jost text-base font-semibold leading-6'>Resources</p>
//                     <p className='text-GREY-_900 text-[48px] font-semibold leading-[60px]'>Insights into the Future</p>
//                 </div>
//                 <p className='text-[#667085] font-jost text-[18px] leading-[28px]'>The latest industry news, interviews, technologies, and resources.</p>
//             </div>
//             <div className='bg-white flex flex-col'>
//                 <div className=' px-[112px] py-[96px] flex flex-col gap-[32px]'>
//                     <div className='flex flex-col lg:flex-row gap-5 lg:gap-0 items-center justify-between'>
//                         <div className='flex items-center p-2 gap-1.5 w-[320px] rounded-lg border border-[#D0D5DD]'>
//                             <CiSearch  className='w-4 h-4 text-[#D0D5DD]'/>
//                             <input 
//                                 className='text-[#667085] font-jost text-base leading-6 outline-none'
//                                 placeholder='Search'
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 value={search}
//                             />
//                         </div>

//                         <select
//                             value={statusFilter}
//                             onChange={(e) => setStatusFilter(e.target.value)}
//                             className="flex items-center justify-between font-jost p-2 w-[320px] border border-[#D0D5DD] rounded-lg"
//                         >
//                             <option value="Newest First">Newest First</option>
//                         </select>
//                     </div>

//                     <div className={`${(blogs?.data?.length || 0) > 0 ? 'grid grid-cols-2 gap-[32px]' : "flex items-center justify-center"}`}>
//                         {
//                             (blogs?.data?.length || 0) > 0 ?
//                             blogs.data.map((item, index) => (
//                                 <div className='rounded-3xl overflow-hidden bg-white shadow-md' key={index}>
//                                     <div className='relative'>
//                                         <img src={item.image || Card} alt="Blog cover" className='w-full h-64 object-cover' /> {/* Fallback to imported Card if no image */}
//                                         <div className='absolute inset-0 bg-gradient-to-t from-gray-800/60 to-transparent'></div>
//                                         <div className='absolute bottom-0 left-0 bg-[#FFFFFF4D] right-0 p-4 text-white text-center'>
//                                             <p className='font-jost text-base font-medium'>{item.name || "Anonymous"}</p> {/* Use item.name if added to API, else fallback */}
//                                             <p className='font-jost text-sm'>{formatDate(item.created_at)}</p>
//                                         </div>
//                                     </div>
//                                     <div className='p-6'>
//                                         <h2 className='text-2xl font-medium text-GREY-_900 font-jost leading-tight'>{item.title}</h2>
//                                         <p className='text-[#667085] font-jost text-base mt-2'>{stripHtml(item.body)}</p>
//                                         <div className='flex items-center relative mt-[56px] gap-3'>
//                                             <button onClick={() => navigate(`/blog/${item.slug}`)} className='text-[#E57E46] font-jost text-base inline-block'>Read Post </button> {/* Changed to button with navigate for SPA routing */}
//                                             <MdArrowOutward className='text-[#E57E46] w-5 h-5' />
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                             :
//                             <p className='font-jost text-GREY-_900 font-medium text-xl'>No Blog Available</p>
//                         }
//                     </div>
//                     <div className='flex justify-between items-center p-4 mt-4'>
//                         <button
//                             className='flex items-center gap-3 cursor-pointer'
//                             onClick={handlePrevious}
//                             disabled={!blogs?.pagination?.prev_page_url}
//                         >
//                             <FaArrowLeft className='w-4 h-4 text-GREY-_700' />
//                             <p className='text-GREY-_700 font-medium font-jost'>Previous</p>
//                         </button>
//                         <span className='px-4 py-2 text-GREY-_500 rounded-lg'>
//                             {blogs?.pagination?.current_page || currentPage}
//                         </span>
//                         <button
//                             className='flex items-center gap-3 cursor-pointer'
//                             onClick={handleNext}
//                             disabled={!blogs?.pagination?.next_page_url}
//                         >
//                             <p className='text-GREY-_700 font-medium font-jost'>Next</p>
//                             <FaArrowRight className='w-4 h-4 text-GREY-_700' />
//                         </button>
//                     </div>

//                     <div className='mt-[64px] flex items-center justify-between'>
//                         <div className='flex flex-col gap-10'>
//                             <div className='flex flex-col gap-6'>
//                                   <p className='font-jost text-[#101828] text-[48px] leading-[60px] font-semibold'>No long-term contracts. <br /> No catches.</p>
//                                 <p className='text-GREY-_500 font-jost text-[20px] leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
//                             </div>
//                             <div className='flex gap-3 items-center'>
//                                 <button onClick={() => navigate("/about")} className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
//                                     <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
//                                 </button>
//                                 <button onClick={() => navigate("/login")} className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
//                                     <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
//                                 </button>
//                             </div>
//                         </div>
//                         <img src={Content} alt='Content' className='w-[576px] h-[496px]' />
//                     </div>
//                 </div>
//                 <div className='bg-[#1D2939] h-[207px] mt-[101px] relative'>
//                     <div className='bg-GREY-_50 rounded-[16px] p-16 flex justify-between w-10/12 mx-auto absolute bottom-28 right-0 left-0'>
//                         <div className='flex flex-col items-start gap-4'>
//                             <p className='text-GREY-_900 font-jost font-semibold text-[30px] leading-[38px]'>Start your 14-day free trial</p>
//                             <p className='text-GREY-_500 text-[20px] font-jost leading-[30px]'>Join over 4,000+ companies already growing with Prophet.</p>
//                         </div>
//                         <div className='flex gap-3 items-center'>
//                             <button onClick={() => navigate("/about")} className='bg-[#F2F2F2] w-[127px] rounded-lg flex items-center py-3 px-5'>
//                                 <p className='font-jost font-medium text-base leading-6 text-GREY-_700'>Learn more</p>
//                             </button>
//                             <button onClick={() => navigate("/login")} className='bg-[#111827] w-[128px] rounded-lg flex items-center py-3 px-5'>
//                                 <p className='font-jost font-medium text-base leading-6 text-[#F2F2F2]'>Get started</p>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Blogs

import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { MdArrowOutward } from 'react-icons/md'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlogs } from '../../features/blogs/getBlogsSlice'

import Card from "../../assets/png/card.jpg" 
import Content from "../../assets/png/content.png"

const Blogs = () => {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Newest First") 
  const [currentPage, setCurrentPage] = useState(1)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { blogs } = useSelector((state) => state.allBlogs)

  useEffect(() => {
    dispatch(fetchBlogs({
      search,
      sort: statusFilter === "Newest First" ? "desc" : "asc",
      page: currentPage
    }))
  }, [search, statusFilter, currentPage, dispatch])

  const stripHtml = (html) => html.replace(/<[^>]*>/g, '').trim()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const handlePrevious = () => {
    if (blogs?.pagination?.prev_page_url) setCurrentPage((prev) => prev - 1)
  }
  const handleNext = () => {
    if (blogs?.pagination?.next_page_url) setCurrentPage((prev) => prev + 1)
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="flex flex-col h-auto min-h-[260px] md:min-h-[340px] pt-24 md:pt-[150px] bg-[#F2F2F2] gap-4 md:gap-6 items-center text-center px-4">
        <div className="flex flex-col items-center gap-2 md:gap-3">
          <p className="text-[#E57E46] font-jost text-sm md:text-base font-semibold">Resources</p>
          <p className="text-GREY-_900 text-2xl md:text-[48px] font-semibold leading-tight md:leading-[60px]">
            Insights into the Future
          </p>
        </div>
        <p className="text-[#667085] font-jost text-sm md:text-lg max-w-2xl">
          The latest industry news, interviews, technologies, and resources.
        </p>
      </div>

      {/* Body */}
      <div className="bg-white flex flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-[112px] py-10 md:py-[96px] flex flex-col gap-8 md:gap-[32px]">
          
          {/* Search + Filter */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex items-center p-2 gap-1.5 w-full lg:w-[320px] rounded-lg border border-[#D0D5DD]">
              <CiSearch className="w-4 h-4 text-[#D0D5DD]" />
              <input 
                className="flex-1 text-[#667085] font-jost text-sm md:text-base outline-none"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="font-jost p-2 w-full lg:w-[320px] border border-[#D0D5DD] rounded-lg"
            >
              <option value="Newest First">Newest First</option>
            </select>
          </div>

          {/* Blogs List */}
          <div className={`${(blogs?.data?.length || 0) > 0 ? 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[32px]' : "flex items-center justify-center"}`}>
            {blogs?.data?.length > 0 ? (
              blogs.data.map((item, index) => (
                <div className="rounded-2xl overflow-hidden bg-white shadow-md" key={index}>
                  <div className="relative">
                    <img src={item.image || Card} alt="Blog cover" className="w-full h-48 md:h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 bg-[#FFFFFF4D] right-0 p-2 md:p-4 text-white text-center">
                      <p className="font-jost text-sm md:text-base font-medium">{item.name || "Anonymous"}</p>
                      <p className="font-jost text-xs md:text-sm">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <h2 className="text-lg md:text-2xl font-medium text-GREY-_900 font-jost leading-tight">{item.title}</h2>
                    <p className="text-[#667085] font-jost text-sm md:text-base mt-2 line-clamp-3">{stripHtml(item.body)}</p>
                    <div className="flex items-center mt-6 md:mt-[56px] gap-2 md:gap-3">
                      <button onClick={() => navigate(`/blog/${item.slug}`)} className="text-[#E57E46] font-jost text-sm md:text-base">Read Post</button>
                      <MdArrowOutward className="text-[#E57E46] w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="font-jost text-GREY-_900 font-medium text-lg md:text-xl">No Blog Available</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="flex items-center gap-2 md:gap-3 disabled:opacity-40"
              onClick={handlePrevious}
              disabled={!blogs?.pagination?.prev_page_url}
            >
              <FaArrowLeft className="w-4 h-4 text-GREY-_700" />
              <p className="text-GREY-_700 font-medium font-jost text-sm md:text-base">Previous</p>
            </button>
            <span className="px-3 py-1 md:px-4 md:py-2 text-GREY-_500 rounded-lg text-sm md:text-base">
              {blogs?.pagination?.current_page || currentPage}
            </span>
            <button
              className="flex items-center gap-2 md:gap-3 disabled:opacity-40"
              onClick={handleNext}
              disabled={!blogs?.pagination?.next_page_url}
            >
              <p className="text-GREY-_700 font-medium font-jost text-sm md:text-base">Next</p>
              <FaArrowRight className="w-4 h-4 text-GREY-_700" />
            </button>
          </div>

          {/* CTA Section */}
          <div className="mt-12 md:mt-[64px] flex flex-col lg:flex-row items-center lg:justify-between gap-8">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <p className="font-jost text-[#101828] text-2xl md:text-[48px] leading-snug md:leading-[60px] font-semibold">
                No long-term contracts. <br className="hidden md:block" /> No catches.
              </p>
              <p className="text-GREY-_500 font-jost text-base md:text-lg">
                Join over 4,000+ companies already growing with Prophet.
              </p>
              <div className="flex gap-3 justify-center lg:justify-start">
                <button onClick={() => navigate("/about")} className="bg-[#F2F2F2] rounded-lg py-2 px-4 md:py-3 md:px-5">
                  <p className="font-jost font-medium text-sm md:text-base text-GREY-_700">Learn more</p>
                </button>
                <button onClick={() => navigate("/login")} className="bg-[#111827] rounded-lg py-2 px-4 md:py-3 md:px-5">
                  <p className="font-jost font-medium text-sm md:text-base text-white">Get started</p>
                </button>
              </div>
            </div>
            <img src={Content} alt="Content" className="w-full max-w-md lg:max-w-[576px] h-auto object-contain" />
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-[#1D2939] relative mt-12 md:mt-[101px]">
          <div className="bg-GREY-_50 rounded-xl p-6 md:p-16 flex flex-col md:flex-row justify-between items-center gap-6 w-11/12 mx-auto -translate-y-16">
            <div className="flex flex-col items-center md:items-start gap-2 md:gap-4 text-center md:text-left">
              <p className="text-GREY-_900 font-jost font-semibold text-xl md:text-[30px]">Start your 14-day free trial</p>
              <p className="text-GREY-_500 text-base md:text-lg">Join over 4,000+ companies already growing with Prophet.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate("/about")} className="bg-[#F2F2F2] rounded-lg py-2 px-4 md:py-3 md:px-5">
                <p className="font-jost font-medium text-sm md:text-base text-GREY-_700">Learn more</p>
              </button>
              <button onClick={() => navigate("/login")} className="bg-[#111827] rounded-lg py-2 px-4 md:py-3 md:px-5">
                <p className="font-jost font-medium text-sm md:text-base text-white">Get started</p>
              </button>
            </div>
          </div>
          {/* <div className="h-[0px]"></div> */}
        </div>
      </div>
    </div>
  )
}

export default Blogs
