import { useEffect, useRef, useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { MdKeyboardArrowDown, MdCalendarToday } from 'react-icons/md'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

import Compare from './components/Compare'
import { CUSTOM_RANGE, DATE_PRESETS, rangeForPreset } from '../../utils/sentimentHelpers'

// The duration is picked before the search so the board opens on the range the user
// wants. Choosing it here rather than inside the board saves a second sentiment run:
// each call takes ~20s, and the board would otherwise load a default day first.
const DURATION_OPTIONS = [...DATE_PRESETS, { value: CUSTOM_RANGE, label: 'Custom', key: 'Custom' }]

const DEFAULT_PRESET = 1

const Sentiment = () => {
    const [search, setSearch] = useState("")
    const [searchList, setSearchList] = useState([])
    const [preset, setPreset] = useState(DEFAULT_PRESET)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
    const [startDate, setStartDate] = useState(() => rangeForPreset(DEFAULT_PRESET).startDate)
    const [endDate, setEndDate] = useState(() => rangeForPreset(DEFAULT_PRESET).endDate)

    const dropdownRef = useRef(null)

    useEffect(() => {
        if (!isDropdownOpen) return

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isDropdownOpen])

    const handleSearch = (value) => {
        if (value.trim()) {
            setSearchList(prev => [...prev, value]) // Proper state update
        }
    }

    const handlePresetChange = (value) => {
        setPreset(value)
        setIsDropdownOpen(false)

        if (value === CUSTOM_RANGE) {
            // Custom - the dates already on screen become the range to edit.
            setShowCustomDatePicker(true)
            return
        }

        setShowCustomDatePicker(false)
        const range = rangeForPreset(value)
        setStartDate(range.startDate)
        setEndDate(range.endDate)
    }

    // Picking a date by hand drops out of the presets.
    const handleCustomStartDate = (date) => {
        setStartDate(date)
        setPreset(CUSTOM_RANGE)
        if (date > endDate) setEndDate(date)
    }

    const handleCustomEndDate = (date) => {
        setEndDate(date)
        setPreset(CUSTOM_RANGE)
    }

    const selectedOption = DURATION_OPTIONS.find(option => option.value === preset)

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
                    <Compare
                        search={search}
                        setSearchList={setSearchList}
                        initialRange={{ preset, startDate, endDate }}
                    />
                    :
                    <div className='w-full flex items-start flex-col px-3 pt-[35px] gap-8'>
                        <div className='w-[991px]  bg-[#FFFFFF] h-[64px] shadow flex  py-[18px] px-[13px] items-center justify-between rounded-[16px]'>
                            <div className='flex items-center gap-[8px]'>
                                <IoMdSearch className='w-6 h-6 text-[#B0BEC5]' />
                                <input
                                    className='font-lato text-[#98A2B3] text-[18px] outline-none w-[420px]'
                                    placeholder='Enter your brand, keywords or hashtag'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
                                />
                            </div>

                            <div className='flex items-center gap-3'>
                                {/* Duration Dropdown */}
                                <div className='relative w-[150px]' ref={dropdownRef}>
                                    <div
                                        className={`w-full border rounded-md px-3 py-2 flex items-center justify-between cursor-pointer bg-white transition-colors duration-150 hover:border-[#F48A1F] hover:bg-[#FFF7ED] ${isDropdownOpen ? 'border-[#F48A1F]' : 'border-[#E2E8F0]'}`}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span className='text-sm font-lato text-[#546E7A] truncate'>
                                            {selectedOption?.label}
                                        </span>
                                        <MdKeyboardArrowDown
                                            className={`w-4 h-4 text-[#546E7A] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className='absolute z-10 w-full mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-lg max-h-48 overflow-y-auto'>
                                            {DURATION_OPTIONS.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className={`px-3 py-2 cursor-pointer text-sm font-lato transition-colors duration-150 ${preset === option.value
                                                        ? 'bg-[#F48A1F] text-white hover:bg-[#DB7A15]'
                                                        : 'text-[#546E7A] hover:bg-[#FFF7ED] hover:text-[#F48A1F]'
                                                        }`}
                                                    onClick={() => handlePresetChange(option.value)}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type='button'
                                    className='bg-[#F48A1F] w-[116px] h-[41px] rounded-[5px] flex items-center justify-center py-2.5'
                                    onClick={() => handleSearch(search)}
                                >
                                    <p className='font-lato text-[18px] text-[#FFFFFF]'>Search</p>
                                </button>
                            </div>
                        </div>

                        {/* Custom Date Picker - only shown when Custom is selected */}
                        {showCustomDatePicker && (
                            <div className='flex items-center gap-2 bg-[#FFFFFF] shadow rounded-[16px] px-[13px] py-3'>
                                <MdCalendarToday className='text-[#546E7A]' />
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleCustomStartDate}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    maxDate={new Date()}
                                    dateFormat='dd/MM/yy'
                                    className='bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none'
                                />
                                <span className='text-[#546E7A]'>-</span>
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleCustomEndDate}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    maxDate={new Date()}
                                    dateFormat='dd/MM/yy'
                                    className='bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none'
                                />
                            </div>
                        )}
                    </div>
            }
        </>
    )
}

export default Sentiment
