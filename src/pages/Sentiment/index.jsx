import React, { useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import Compare from './components/Compare'

const Sentiment = () => {
    const [search, setSearch] = useState("")
    const [searchList, setSearchList] = useState([]) 

    const handleSearch = (value) => {
        if (value.trim()) { 
            setSearchList(prev => [...prev, value]) // Proper state update
        }
    }

    console.log(searchList, "searchList")

  return (
    <>
        <div className='flex items-start px-3 justify-between'>
            <div className='flex flex-col gap-1 mb-5'>
                <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Sentiment Analysis</p>
                <p className='text-[#667185] text-sm font-jost'>Generate instant brand engagement and sentiment reports.</p>
            </div>
        </div>
        {
            searchList.length > 0 ? 
            <Compare search={search} setSearchList={setSearchList} />
            :
            <div className='w-full flex items-start flex-col px-3 pt-[35px] gap-8'>
                <div className='w-[991px]  bg-[#FFFFFF] h-[64px] shadow flex  py-[18px] px-[13px] items-center justify-between rounded-[16px]'>
                    <div className='flex items-center gap-[8px]'>
                        <IoMdSearch className='w-6 h-6 text-[#B0BEC5]' />
                        <input 
                            className='font-lato text-[#98A2B3] text-[18px] outline-none w-[500px]'
                            placeholder='Enter your brand, keywords or hashtag'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
                        />
                    </div>
                    <button
                        type='button' 
                        className='bg-[#F48A1F] w-[116px] h-[41px] rounded-[5px] flex items-center justify-center py-2.5'
                        onClick={() => handleSearch(search)}
                    >
                        <p className='font-lato text-[18px] text-[#FFFFFF]'>Search</p>
                    </button>
                </div>
                {/* <div className='flex items-center gap-1 rounded-[5px] bg-[#F48A1F24] w-[146px] h-[35px] p-2'>
                    <IoList className='w-5 h-5 text-[#111827]' />
                    <p className='font-lato text-[15px] text-[#111827]'>Saved searches</p>
                </div> */}
            </div>
        }
    </>
  )
}

export default Sentiment