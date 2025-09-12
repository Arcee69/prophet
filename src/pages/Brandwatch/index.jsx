import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { MdCalendarToday, MdOutlineFileDownload } from "react-icons/md";
import { FaPlus, FaRegHeart } from "react-icons/fa6";
import { LuPackage } from 'react-icons/lu';
import { RiPieChartLine } from 'react-icons/ri';
import { FiBarChart2 } from 'react-icons/fi';
import { IoChatbubbleOutline, IoCloseSharp } from 'react-icons/io5';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, Legend
} from 'recharts';

import Bubble from '../../assets/svg/bubble.svg'
import ModalPop from '../../components/modalPop';
import AddBrandRequest from './components/AddBrandRequest';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../../features/brands/getBrandsSlice';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';
import { toast } from 'react-toastify';
import { CgSpinner } from 'react-icons/cg';
import { fetchBrandWatch } from '../../features/brandWatch/getBrandWatchSlice';
import EndBrandWatch from './components/EndBrandWatch';
import { useNavigate } from 'react-router-dom';


const Brandwatch = () => {
    const [dateChange, setDateChange] = useState(1)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [search, setSearch] = useState("");
    const [openAddBrandRequestModal, setOpenAddBrandRequestModal] = useState(false)
    const [addBrand, setAddBrand] = useState(false)
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([]);
    const [brandId, setBrandId] = useState('')
    const [endBrandWatchData, setEndBrandWatchData] = useState([])
    const [openEndBrandWatchModal, setOpenEndBrandWatchModal] = useState(false)

    const handleDateChange = (value) => {
        setDateChange(value)
    }

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { brands } = useSelector((state) => state.allBrands)
    console.log(brands.data, "brands")


    useEffect(() => {
        if (search.trim()) {
            const filtered = brands?.data?.filter((b) =>
                b.name.toLowerCase().includes(search.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [search, brands]);

    const handleSelectSuggestion = (brand) => {
        console.log(brand, "myself")
        setSearch(brand.name);
        setBrandId(brand.id)
        setSuggestions([]); // close dropdown
    };

    const { brandWatch } = useSelector((state) => state.allBrandWatch)
    console.log(brandWatch, "brandWatch")

 

    const finalEndDate = new Date(endDate);
    finalEndDate.setDate(finalEndDate.getDate() + 14); // add 90 days

    const handleAddBrand = async () => {
        const data = {
            "brand_id": brandId,
            "end_date": new Date(finalEndDate).toISOString().split("T")[0]
        }
        setLoading(true)
        try {
            const res = await api.post(appUrls?.BRANDWATCH_URL, data)
            console.log(res, "sapa")
            toast.success(`${res.data.message}`, {
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            })
            dispatch(fetchBrandWatch())
        } catch (err) {
            console.log(err, "sapa")
            toast.error(`${err.data.message}`, {
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            })
        } finally {
            setLoading(false)
        }
    }


    // setAddBrand(prev => !prev)
    // if(!addBrand) {
    //     setSearch('')
    // }


    useEffect(() => {
        dispatch(fetchBrands())
        dispatch(fetchBrandWatch())
    },[])


  return (
    <div className='flex flex-col gap-7 px-3 w-full'>
        <div className='flex flex-col gap-1'>
            <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Brandwatch</p>
            <p className='text-[#667185] text-sm font-jost'>Monitor your brand performance and sentiment analysis</p>
        </div>
        <div className='flex items-center justify-between'>
            <div className="w-[472px] h-[36px] rounded-[8px] px-[7px] py-2 flex items-center gap-8">
                {/* Date Range Options */}
                <div className="flex items-center w-5/12 gap-[5px]">
                    {["1D", "7D", "30D", "3M", "6M", "12M"].map((label, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer rounded-md w-[40px] py-1.5 px-2 flex items-center justify-center ${dateChange === index + 1 ? "bg-[#F48A1F]" : "border-[0.8px] border-[#E7EDF6]"
                                }`}
                            onClick={() => handleDateChange(index + 1)}
                        >
                            <p
                                className={`text-sm font-lato ${dateChange === index + 1 ? "text-[#FFFFFF]" : "text-[#546E7A]"
                                    }`}
                            >
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Date Picker */}
                <div className="w-6/12 flex items-center ml-10 justify-end gap-2">
                    <MdCalendarToday className="text-[#546E7A]" />
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="dd/MM/yy"
                        className="bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none"
                    />
                    <span className="text-[#546E7A]">-</span>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="dd/MM/yy"
                        className="bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none"
                    />
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <button
                    className='flex items-center px-4 py-2 rounded-lg bg-[#F48A1F] w-[200px] justify-center gap-2'
                    onClick={() => setOpenAddBrandRequestModal(true)}
                >
                    <p className='font-jost font-medium text-base text-[#fff] whitespace-nowrap leading-[145%]'>Request Brand Addition</p>
                    <MdOutlineFileDownload className='text-[#fff] w-5 h-5' />
                </button>
                <button
                    className='flex items-center px-4 py-2 rounded-lg bg-[#111827] w-[138px] justify-center gap-2'
                >
                    <p className='font-jost font-medium text-base text-[#fff] whitespace-nowrap leading-[145%]'>Export Data</p>
                    <MdOutlineFileDownload className='text-[#fff] w-5 h-5' />
                </button>
            </div>
        </div>

        {/* Search */}
        <div className='flex items-start gap-2 w-full'>
            <div className='flex w-full flex-col'>
                <div className='w-full border border-[#E2E8F0] rounded-[10px] py-[9.5px]'>
                    <input
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search brands"
                        className="w-full bg-[#fcfcfc] pl-[38px] outline-none font-jost"
                    />
                </div>
                {/* Suggestions dropdown */}
                {suggestions?.length > 0 && (
                    <div className="bg-white border border-[#E2E8F0] rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                        {suggestions?.length > 0 ? (
                            suggestions?.map((brand, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectSuggestion(brand)}
                                >
                                    {brand.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-500 flex items-center justify-between">
                                <span>No brand found</span>
                                <button
                                    onClick={() => setOpenAddBrandRequestModal(true)}
                                    className="text-[#F48A1F] font-medium hover:underline"
                                >
                                    Request addition
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <button onClick={handleAddBrand} className='bg-[#F48A1F] w-2/12 text-white px-4 rounded-[10px] py-[12.5px] flex items-center justify-center gap-2'>
                {
                    loading ?
                    <CgSpinner className='animate-spin text-white' />
                    :
                    <p className='font-jost text-[#F8FAFC] whitespace-nowrap text-sm leading-[20px]'>Add Brand to Monitor</p>
                }
            </button>
        </div>

        <div className='h-[450px] w-full  flex flex-col px-[25px] gap-[48px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl'>
            <div className='flex items-center gap-2'>
                <img src={Bubble} alt='Bubble' className='w-6 h-6' />
                <p className='font-jost text-[#6B7280] font-semibold text-lg'>Tracked Brands</p>
            </div>
            {
                brandWatch.data?.length > 0 ?
                    <div className='flex flex-wrap gap-[29px]'>
                        {
                            brandWatch.data?.map((item, index) => (
                                <div key={index} className='border w-[200px] h-auto border-[#E4E7EC] rounded-xl flex flex-col gap-1 p-[13px]'>
                                    <div 
                                        className='flex items-center cursor-pointer justify-end' 
                                        onClick={() => {
                                                setEndBrandWatchData(item);
                                                setOpenEndBrandWatchModal(true)
                                            }}
                                        >
                                        <IoCloseSharp className='w-5 h-5 text-[#9CA3AF]' />
                                    </div>
                                    <div className='flex cursor-pointer flex-col gap-6' onClick={() => {navigate("/brandwatch/report", {state: item})}}>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-1'>
                                                    <LuPackage className='w-5 h-5 text-[#10B981]' />
                                                    <p className='font-jost text-[#6B7280] font-semibold text-[20px] capitalize leading-7'>{item.brand.name}</p>
                                                </div>
                                            
                                            </div>
                                          
                                        </div>
                                        {/* <div className='border-y p-3 flex justify-between items-center gap-3 border-[#E2E8F0]'>
                                            <div className='flex flex-col items-start gap-[18px]'>
                                                <div className='flex items-center gap-2'>
                                                    <IoChatbubbleOutline className="w-4 h-4 text-[#64748B]" />
                                                    <p className='font-jost text-base text-[#4B5563]'>Total Mentions</p>
                                                </div>
                                                <p className='font-jost font-semibold text-[20px] leading-6'>{item.mention}</p>
                                            </div>
                                            <div className='flex flex-col items-start gap-[18px]'>
                                                <div className='flex items-center gap-2'>
                                                    <FaRegHeart className="w-4 h-4 text-[#64748B]" />
                                                    <p className='font-jost text-base text-[#4B5563]'>Engagement Rate</p>
                                                </div>
                                                <p className='font-jost font-semibold text-[20px] leading-6'>{item.rate}%</p>
                                            </div>
                                            <div className='flex flex-col items-start gap-[18px]'>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-jost text-base text-[#4B5563]'>Top Platform</p>
                                                </div>
                                                <p className='font-jost font-semibold text-[20px] leading-6'>{item.platform}</p>
                                            </div>
                                        </div> */}
                                        {/* <p className='text-[#64748B] text-sm font-jost'>{item.sub}</p> */}
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                :
                    <div className='flex items-center justify-center w-[384px] mx-auto'>
                        <div className='flex flex-col items-center gap-4'>
                            <div className='bg-[#FFF7EF] rounded-full h-[72px] w-[72px] flex items-center justify-center p-4'>
                                <LuPackage className='w-10 h-10 text-[#F48A1F]' />
                            </div>
                            <p className='font-jost text-[#111827] text-lg leading-7'>No brands tracked yet</p>
                            <p className='font-jost text-[#6B7280] text-lg leading-6 text-center'>
                                Start monitoring brand mentions by searching for a
                                brand name above and adding it to your tracker.
                            </p>
                            <button className='bg-[#F48A1F] text-white px-4 rounded-[10px] py-[12.5px] flex items-center justify-center gap-2'>
                                <FaPlus className='text-white w-5 h-5' />
                                <p className='font-jost text-[#F8FAFC] whitespace-nowrap text-sm leading-[20px]'>Add Brand to Monitor</p>
                            </button>
                            <p className='font-jost text-[#6B7280] text-sm leading-6 text-center'>
                                You can track up to 2 brands on the Free Plan
                            </p>
                        </div>
                    </div>
            }
        </div>

        {/* <div className='flex items-center gap-[18px] w-full'>
            <div className={`${!search ? "gap-[68px]" : "gap-[18px]"} h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl`}>
                <div className='flex items-center gap-2'>
                    <RiPieChartLine className='w-5 h-5 text-[#F48A1F]' />
                    <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Sentiment Breakdown</p>
                </div>
                {
                    !search ?
                    <div className='flex items-center justify-center w-[384px] mx-auto'>
                        <div className='flex flex-col items-center gap-4'>
                            <div className='bg-[#FFF7EF] rounded-full h-[72px] w-[72px] flex items-center justify-center p-4'>
                                <LuPackage className='w-10 h-10 text-[#F48A1F]' />
                            </div>
                            <p className='font-jost text-[#111827] text-lg leading-7'>No data to display</p>
                            <p className='font-jost text-[#6B7280] text-lg leading-6 text-center'>
                                Add a brand to track to see sentiment analysis data.
                            </p>
                        </div>
                    </div>
                    : 
                    <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={sentimentData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                            >
                                <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                                <YAxis type="category" dataKey="name" />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Bar dataKey="positive" stackId="a" fill="#DCFCE7">
                                    <LabelList dataKey="positive" position="center" formatter={(val) => `${val}%`} />
                                </Bar>
                                <Bar dataKey="negative" stackId="a" fill="#FEE2E2">
                                    <LabelList dataKey="negative" position="center" formatter={(val) => `${val}%`} />
                                </Bar>
                                <Bar dataKey="neutral" stackId="a" fill="#E5E7EB" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                }
            </div>
            <div className={`${!addBrand ? "gap-[68px]" : "gap-[18px]"} h-[362px] w-6/12 flex flex-col px-[25px]  py-[28px] shadow bg-white border-[1px] border-white rounded-xl`}>
                <div className='flex items-center gap-2'>
                    <FiBarChart2 className='w-5 h-5 text-[#F48A1F]' />
                    <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Channel Performance</p>
                </div>
                {
                    !search ?
                    <div className='flex items-center justify-center w-[384px] mx-auto'>
                        <div className='flex flex-col items-center gap-4'>
                            <div className='bg-[#FFF7EF] rounded-full h-[72px] w-[72px] flex items-center justify-center p-4'>
                                <LuPackage className='w-10 h-10 text-[#F48A1F]' />
                            </div>
                            <p className='font-jost text-[#111827] text-lg leading-7'>No data to display</p>
                            <p className='font-jost text-[#6B7280] text-lg leading-6 text-center'>
                                Add a brand to track to see channel performance data.
                            </p>
                        </div>
                    </div>
                    :
                    <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={channelData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="samsung" fill="#60A5FA" name="Samsung" />
                                <Bar dataKey="apple" fill="#34D399" name="Apple" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                }
            </div>
        </div> */}

        <ModalPop isOpen={openAddBrandRequestModal}>
            <AddBrandRequest handleClose={() => setOpenAddBrandRequestModal(false)} />
        </ModalPop>

        <ModalPop isOpen={openEndBrandWatchModal}>
            <EndBrandWatch handleClose={() => setOpenEndBrandWatchModal(false)} endBrandWatchData={endBrandWatchData} />
        </ModalPop>
    </div>
  )
}

export default Brandwatch