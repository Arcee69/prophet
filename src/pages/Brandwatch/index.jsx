// import React, { useEffect, useState } from 'react'
// import DatePicker from 'react-datepicker';
// import { MdCalendarToday, MdOutlineFileDownload } from "react-icons/md";
// import { FaPlus, FaRegHeart } from "react-icons/fa6";
// import { LuPackage } from 'react-icons/lu';
// import { RiPieChartLine } from 'react-icons/ri';
// import { FiBarChart2 } from 'react-icons/fi';
// import { IoChatbubbleOutline, IoCloseSharp } from 'react-icons/io5';

// import Bubble from '../../assets/svg/bubble.svg'
// import ModalPop from '../../components/modalPop';
// import AddBrandRequest from './components/AddBrandRequest';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchBrands } from '../../features/brands/getBrandsSlice';
// import { api } from '../../services/api';
// import { appUrls } from '../../services/urls';
// import { toast } from 'react-toastify';
// import { CgSpinner } from 'react-icons/cg';
// import { fetchBrandWatch } from '../../features/brandWatch/getBrandWatchSlice';
// import EndBrandWatch from './components/EndBrandWatch';
// import { useNavigate } from 'react-router-dom';


// const Brandwatch = () => {
//     const [dateChange, setDateChange] = useState(1)
//     const [startDate, setStartDate] = useState(new Date());
//     const [endDate, setEndDate] = useState(new Date());
//     const [search, setSearch] = useState("");
//     const [searchMode, setSearchMode] = useState('brand');
//     const [openAddBrandRequestModal, setOpenAddBrandRequestModal] = useState(false)
//     const [addBrand, setAddBrand] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [suggestions, setSuggestions] = useState([]);
//     const [brandId, setBrandId] = useState('')
//     const [endBrandWatchData, setEndBrandWatchData] = useState([])
//     const [openEndBrandWatchModal, setOpenEndBrandWatchModal] = useState(false)

//     const handleDateChange = (value) => {
//         setDateChange(value);

//         let newEndDate = new Date(startDate);

//         switch (value) {
//             case 1: // 1 Day
//                 newEndDate.setDate(startDate.getDate() + 1);
//                 break;
//             case 2: // 7 Days
//                 newEndDate.setDate(startDate.getDate() + 7);
//                 break;
//             case 3: // 30 Days
//                 newEndDate.setDate(startDate.getDate() + 30);
//                 break;
//             case 4: // 3 Months
//                 newEndDate.setMonth(startDate.getMonth() + 3);
//                 break;
//             case 5: // 6 Months
//                 newEndDate.setMonth(startDate.getMonth() + 6);
//                 break;
//             case 6: // 12 Months
//                 newEndDate.setFullYear(startDate.getFullYear() + 1);
//                 break;
//             default:
//                 break;
//         }

//         setEndDate(newEndDate);
//     };

//     const handleStartDateChange = (date) => {
//         setStartDate(date);
//         handleDateChange(dateChange); // recalc end date automatically
//     };


//     const dispatch = useDispatch()

//     const navigate = useNavigate()

//     const { brands } = useSelector((state) => state.allBrands)
//     console.log(brands.data, "brands")

//     // Reset search and related states when mode changes
//     useEffect(() => {
//         setSearch("");
//         setSuggestions([]);
//         setBrandId('');
//     }, [searchMode]);

//     useEffect(() => {
//         if (searchMode === 'brand' && search.trim()) {
//             const filtered = brands?.data?.filter((b) =>
//                 b.name.toLowerCase().includes(search.toLowerCase())
//             );
//             setSuggestions(filtered);
//         } else {
//             setSuggestions([]);
//         }
//     }, [search, brands, searchMode]);

//     const handleSelectSuggestion = (brand) => {
//         console.log(brand, "myself")
//         setSearch(brand.name);
//         setBrandId(brand.id)
//         setSuggestions([]); // close dropdown
//     };

//     const handleModeChange = (mode) => {
//         setSearchMode(mode);
//     };

//     const { brandWatch } = useSelector((state) => state.allBrandWatch)
//     console.log(brandWatch, "brandWatch")



//     const finalEndDate = new Date(endDate);
//     finalEndDate.setDate(finalEndDate.getDate()); // add 90 days

//     const handleAddBrand = async () => {
//         const data = {
//             "end_date": new Date(finalEndDate).toISOString().split("T")[0],
//         };

//         if (searchMode === 'brand') {
//             if (!brandId) {
//                 toast.error("Oops, this brand is not listed yet, request Brand Addition", {
//                     position: "top-right",
//                     autoClose: 3500,
//                     closeOnClick: true,
//                 });
//                 return;
//             }
//             data.brand_id = brandId;
//         } else {
//             if (!search.trim()) {
//                 toast.error("Please enter a keyword.", {
//                     position: "top-right",
//                     autoClose: 3500,
//                     closeOnClick: true,
//                 });
//                 return;
//             }
//             data.keyword = search;
//         }

//         setLoading(true)
//         try {
//             const res = await api.post(appUrls?.BRANDWATCH_URL, data)
//             console.log(res, "sapa")
//             toast.success(`${res.data.message}`, {
//                 position: "top-right",
//                 autoClose: 3500,
//                 closeOnClick: true,
//             })
//             dispatch(fetchBrandWatch())
//         } catch (err) {
//             console.log(err, "sapa")
//             toast.error(`${err.response?.data?.message || err.message}`, {
//                 position: "top-right",
//                 autoClose: 3500,
//                 closeOnClick: true,
//             })
//         } finally {
//             setLoading(false)
//         }
//     }


//     useEffect(() => {
//         dispatch(fetchBrands())
//         dispatch(fetchBrandWatch())
//     }, [])


//     return (
//         <div className='flex flex-col gap-7 px-3 w-full'>
//             <div className='flex flex-col gap-1'>
//                 <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Brandwatch</p>
//                 <p className='text-[#667185] text-sm font-jost'>Monitor your brand performance and sentiment analysis</p>
//             </div>
//             <div className='flex items-center justify-end'>

//                 <div className='flex items-center gap-4'>
//                     <button
//                         className='flex items-center px-4 py-2 rounded-lg bg-[#F48A1F] w-[200px] justify-center gap-2'
//                         onClick={() => setOpenAddBrandRequestModal(true)}
//                     >
//                         <p className='font-jost font-medium text-base text-[#fff] whitespace-nowrap leading-[145%]'>Request Brand Addition</p>
//                         <MdOutlineFileDownload className='text-[#fff] w-5 h-5' />
//                     </button>
//                     <button
//                         className='flex items-center px-4 py-2 rounded-lg bg-[#111827] w-[138px] justify-center gap-2'
//                     >
//                         <p className='font-jost font-medium text-base text-[#fff] whitespace-nowrap leading-[145%]'>Export Data</p>
//                         <MdOutlineFileDownload className='text-[#fff] w-5 h-5' />
//                     </button>
//                 </div>
//             </div>

//             {/* Search Mode Toggle */}
//             <div className='flex items-center gap-2'>
//                 <button
//                     className={`px-4 py-2 rounded-[10px] font-jost font-medium text-sm ${searchMode === 'brand' ? 'bg-[#F48A1F] text-white' : 'bg-white text-[#6B7280] border border-[#E2E8F0]'}`}
//                     onClick={() => handleModeChange('brand')}
//                 >
//                     Search by Brand
//                 </button>
//                 <button
//                     className={`px-4 py-2 rounded-[10px] font-jost font-medium text-sm ${searchMode === 'keyword' ? 'bg-[#F48A1F] text-white' : 'bg-white text-[#6B7280] border border-[#E2E8F0]'}`}
//                     onClick={() => handleModeChange('keyword')}
//                 >
//                     Search by Keyword
//                 </button>
//             </div>

//             {/* Search */}
//             <div className='flex items-start gap-2 w-full'>
//                 <div className='flex w-full flex-col'>
//                     <div className='w-full border border-[#E2E8F0] rounded-[10px] py-[9.5px]'>
//                         <input
//                             type="text"
//                             onChange={(e) => setSearch(e.target.value)}
//                             value={search}
//                             placeholder={searchMode === 'brand' ? "Search brands" : "Enter keyword"}
//                             className="w-full bg-[#fcfcfc] pl-[38px] outline-none font-jost"
//                         />
//                     </div>
//                     {/* Suggestions dropdown - only for brand mode */}
//                     {searchMode === 'brand' && suggestions?.length > 0 && (
//                         <div className="bg-white border border-[#E2E8F0] rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
//                             {suggestions?.length > 0 ? (
//                                 suggestions?.map((brand, index) => (
//                                     <div
//                                         key={index}
//                                         className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                                         onClick={() => handleSelectSuggestion(brand)}
//                                     >
//                                         {brand.name}
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="px-4 py-2 text-gray-500 flex items-center justify-between">
//                                     <span>No brand found</span>
//                                     <button
//                                         onClick={() => setOpenAddBrandRequestModal(true)}
//                                         className="text-[#F48A1F] font-medium hover:underline"
//                                     >
//                                         Request addition
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 <div className="w-[472px] h-[36px] rounded-[8px] px-[7px] py-2 flex items-center gap-8">
//                     {/* Date Range Options */}
//                     <div className="flex items-center w-5/12 gap-[5px]">
//                         {["1D", "7D", "30D", "3M", "6M", "12M"].map((label, index) => (
//                             <div
//                                 key={index}
//                                 className={`cursor-pointer rounded-md w-[40px] py-1.5 px-2 flex items-center justify-center ${dateChange === index + 1 ? "bg-[#F48A1F]" : "border-[0.8px] border-[#E7EDF6]"
//                                     }`}
//                                 onClick={() => handleDateChange(index + 1)}
//                             >
//                                 <p
//                                     className={`text-sm font-lato ${dateChange === index + 1 ? "text-[#FFFFFF]" : "text-[#546E7A]"
//                                         }`}
//                                 >
//                                     {label}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Date Picker */}
//                     <div className="w-6/12 flex items-center ml-10 justify-end gap-2">
//                         <MdCalendarToday className="text-[#546E7A]" />
//                         <DatePicker
//                             selected={startDate}
//                             onChange={handleStartDateChange}
//                             selectsStart
//                             startDate={startDate}
//                             endDate={endDate}
//                             dateFormat="dd/MM/yy"
//                             className="bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none"
//                         />

//                         <span className="text-[#546E7A]">-</span>
//                         <DatePicker
//                             selected={endDate}
//                             onChange={(date) => setEndDate(date)}
//                             selectsEnd
//                             startDate={startDate}
//                             endDate={endDate}
//                             minDate={startDate}
//                             dateFormat="dd/MM/yy"
//                             className="bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none"
//                         />
//                     </div>
//                 </div>

//                 <button onClick={handleAddBrand} className='bg-[#F48A1F] w-2/12 text-white px-4 rounded-[10px] py-[12.5px] flex items-center justify-center gap-2'>
//                     {
//                         loading ?
//                             <CgSpinner className='animate-spin text-white' />
//                             :
//                             <p className='font-jost text-[#F8FAFC] whitespace-nowrap text-sm leading-[20px]'>
//                                 {searchMode === 'brand' ? 'Add Brand to Monitor' : 'Add Keyword to Monitor'}
//                             </p>
//                     }
//                 </button>
//             </div>

//             <div className='h-[450px] w-full  flex flex-col px-[25px] gap-[48px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl'>
//                 <div className='flex items-center gap-2'>
//                     <img src={Bubble} alt='Bubble' className='w-6 h-6' />
//                     <p className='font-jost text-[#6B7280] font-semibold text-lg'>Tracked Brands</p>
//                 </div>
//                 {
//                     brandWatch.data?.length > 0 ?
//                         <div className='flex flex-wrap gap-[29px]'>
//                             {
//                                 brandWatch.data?.map((item, index) => (
//                                     <div key={index} className='border w-[200px] h-auto border-[#E4E7EC] rounded-xl flex flex-col gap-1 p-[13px]'>
//                                         <div
//                                             className='flex items-center cursor-pointer justify-end'
//                                             onClick={() => {
//                                                 setEndBrandWatchData(item);
//                                                 setOpenEndBrandWatchModal(true)
//                                             }}
//                                         >
//                                             <IoCloseSharp className='w-5 h-5 text-[#9CA3AF]' />
//                                         </div>
//                                         <div className='flex cursor-pointer flex-col gap-6' onClick={() => { navigate("/brandwatch/report", { state: item }) }}>
//                                             <div className='flex flex-col gap-2'>
//                                                 <div className='flex items-center justify-between'>
//                                                     <div className='flex items-center gap-1'>
//                                                         <LuPackage className='w-5 h-5 text-[#10B981]' />
//                                                         <p className='font-jost text-[#6B7280] font-semibold text-[20px] capitalize leading-7'>{item.brand !== null ? item.brand.name : item.keyword}</p>
//                                                     </div>

//                                                 </div>

//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             }

//                         </div>
//                         :
//                         <div className='flex items-center justify-center w-[384px] mx-auto'>
//                             <div className='flex flex-col items-center gap-4'>
//                                 <div className='bg-[#FFF7EF] rounded-full h-[72px] w-[72px] flex items-center justify-center p-4'>
//                                     <LuPackage className='w-10 h-10 text-[#F48A1F]' />
//                                 </div>
//                                 <p className='font-jost text-[#111827] text-lg leading-7'>No brands tracked yet</p>
//                                 <p className='font-jost text-[#6B7280] text-lg leading-6 text-center'>
//                                     Start monitoring brand mentions by searching for a
//                                     brand name above and adding it to your tracker.
//                                 </p>
//                                 <button className='bg-[#F48A1F] text-white px-4 rounded-[10px] py-[12.5px] flex items-center justify-center gap-2'>
//                                     <FaPlus className='text-white w-5 h-5' />
//                                     <p className='font-jost text-[#F8FAFC] whitespace-nowrap text-sm leading-[20px]'>Add Brand to Monitor</p>
//                                 </button>
//                                 <p className='font-jost text-[#6B7280] text-sm leading-6 text-center'>
//                                     You can track up to 2 brands on the Free Plan
//                                 </p>
//                             </div>
//                         </div>
//                 }
//             </div>

//             <ModalPop isOpen={openAddBrandRequestModal}>
//                 <AddBrandRequest handleClose={() => setOpenAddBrandRequestModal(false)} />
//             </ModalPop>

//             <ModalPop isOpen={openEndBrandWatchModal}>
//                 <EndBrandWatch handleClose={() => setOpenEndBrandWatchModal(false)} endBrandWatchData={endBrandWatchData} />
//             </ModalPop>
//         </div>
//     )
// }

// export default Brandwatch

import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { MdCalendarToday, MdOutlineFileDownload, MdKeyboardArrowDown } from "react-icons/md";
import { FaPlus, FaRegHeart } from "react-icons/fa6";
import { LuPackage } from 'react-icons/lu';
import { RiPieChartLine } from 'react-icons/ri';
import { FiBarChart2 } from 'react-icons/fi';
import { IoChatbubbleOutline, IoCloseSharp } from 'react-icons/io5';

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
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Brandwatch = () => {
    const [dateChange, setDateChange] = useState(1)
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [search, setSearch] = useState("");
    const [searchMode, setSearchMode] = useState('brand');
    const [openAddBrandRequestModal, setOpenAddBrandRequestModal] = useState(false)
    const [addBrand, setAddBrand] = useState(false)
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([]);
    const [brandId, setBrandId] = useState('')
    const [endBrandWatchData, setEndBrandWatchData] = useState([])
    const [openEndBrandWatchModal, setOpenEndBrandWatchModal] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8; // assuming 10 items per page

    const dateOptions = [
        { value: 1, label: 'Select Duration', key: 'select' },
        { value: 2, label: '1 Day', key: '1D' },
        { value: 3, label: '7 Days', key: '7D' },
        { value: 4, label: '30 Days', key: '30D' },
        { value: 5, label: '3 Months', key: '3M' },
        { value: 6, label: '6 Months', key: '6M' },
        { value: 7, label: '12 Months', key: '12M' },
        { value: 8, label: 'Custom', key: 'Custom' }
    ]

    const handleDateChange = (value) => {
        setDateChange(value);
        setIsDropdownOpen(false)

        if (value === 7) {
            // Custom - show date picker
            setShowCustomDatePicker(true)
            return
        }

        // Preset periods
        setShowCustomDatePicker(false)
        let newEndDate = new Date(startDate);

        switch (value) {
            case 1: // 1 Day
                newEndDate.setDate(startDate.getDate() + 1);
                break;
            case 2: // 7 Days
                newEndDate.setDate(startDate.getDate() + 7);
                break;
            case 3: // 30 Days
                newEndDate.setDate(startDate.getDate() + 30);
                break;
            case 4: // 3 Months
                newEndDate.setMonth(startDate.getMonth() + 3);
                break;
            case 5: // 6 Months
                newEndDate.setMonth(startDate.getMonth() + 6);
                break;
            case 6: // 12 Months
                newEndDate.setFullYear(startDate.getFullYear() + 1);
                break;
            default:
                break;
        }

        setEndDate(newEndDate);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (dateChange !== 7) {
            handleDateChange(dateChange); // recalc end date automatically for presets
        }
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { brands } = useSelector((state) => state.allBrands)
    console.log(brands.data, "brands")

    // Reset search and related states when mode changes
    useEffect(() => {
        setSearch("");
        setSuggestions([]);
        setBrandId('');
    }, [searchMode]);

    useEffect(() => {
        if (searchMode === 'brand' && search.trim()) {
            const filtered = brands?.data?.filter((b) =>
                b.name.toLowerCase().includes(search.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [search, brands, searchMode]);

    const handleSelectSuggestion = (brand) => {
        console.log(brand, "myself")
        setSearch(brand.name);
        setBrandId(brand.id)
        setSuggestions([]); // close dropdown
    };

    const handleModeChange = (mode) => {
        setSearchMode(mode);
    };

    const { data: brandWatchData, pagination, loading: brandWatchLoading } = useSelector((state) => state.allBrandWatch)
    console.log(brandWatchData, "brandWatch")

    const finalEndDate = new Date(endDate);
    finalEndDate.setDate(finalEndDate.getDate()); // add 90 days

    const handleAddBrand = async () => {
        const data = {
            "end_date": new Date(finalEndDate).toISOString().split("T")[0],
        };

        if (searchMode === 'brand') {
            if (!brandId) {
                toast.error("Oops, this brand is not listed yet, request Brand Addition", {
                    position: "top-right",
                    autoClose: 3500,
                    closeOnClick: true,
                });
                return;
            }
            data.brand_id = brandId;
        } else {
            if (!search.trim()) {
                toast.error("Please enter a keyword.", {
                    position: "top-right",
                    autoClose: 3500,
                    closeOnClick: true,
                });
                return;
            }
            data.keyword = search;
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
            dispatch(fetchBrandWatch(currentPage))
        } catch (err) {
            console.log(err, "sapa")
            toast.error(`${err.response?.data?.message || err.message}`, {
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        dispatch(fetchBrands())
        dispatch(fetchBrandWatch(1))
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchBrandWatch(currentPage));
    }, [currentPage, dispatch]);

    // Get current selected option label
    const selectedOption = dateOptions.find(option => option.value === dateChange)

  // Pagination handlers
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination?.next_page_url || (brandWatchData?.length === itemsPerPage)) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // Calculate total pages (fallback for non-paginated API)
    const totalPages = pagination?.last_page || Math.ceil((brandWatchData?.length || 0) / itemsPerPage);

    return (
        <div className='flex flex-col gap-7 px-3 w-full'>
            <div className='flex flex-col gap-1'>
                <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Brandwatch</p>
                <p className='text-[#667185] text-sm font-jost'>Monitor your brand performance and sentiment analysis</p>
            </div>
            <div className='flex items-center justify-end'>
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

            {/* Search Mode Toggle */}
            <div className='flex items-center gap-2'>
                <button
                    className={`px-4 py-2 rounded-[10px] font-jost font-medium text-sm ${searchMode === 'brand' ? 'bg-[#F48A1F] text-white' : 'bg-white text-[#6B7280] border border-[#E2E8F0]'}`}
                    onClick={() => handleModeChange('brand')}
                >
                    Search by Brand
                </button>
                <button
                    className={`px-4 py-2 rounded-[10px] font-jost font-medium text-sm ${searchMode === 'keyword' ? 'bg-[#F48A1F] text-white' : 'bg-white text-[#6B7280] border border-[#E2E8F0]'}`}
                    onClick={() => handleModeChange('keyword')}
                >
                    Search by Keyword
                </button>
            </div>

            {/* Search */}
            <div className='flex items-start gap-2 w-full'>
                <div className='flex w-full flex-col'>
                    <div className='w-full border border-[#E2E8F0] rounded-[10px] py-[9.5px]'>
                        <input
                            type="text"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder={searchMode === 'brand' ? "Search brands" : "Enter keyword"}
                            className="w-full bg-[#fcfcfc] pl-[38px] outline-none font-jost"
                        />
                    </div>
                    {/* Suggestions dropdown - only for brand mode */}
                    {searchMode === 'brand' && suggestions?.length > 0 && (
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

                <div className="w-[672px] h-[42px] rounded-[8px] px-[7px] py-2 flex items-center gap-8 relative">
                    {/* Date Range Dropdown */}
                    <div className="w-5/12 relative">
                        <div
                            className={`w-full border border-[#E2E8F0] rounded-md px-3 py-2 flex items-center justify-between cursor-pointer bg-white ${dateChange === 7 ? 'ring-2 ring-[#F48A1F] ring-offset-1' : ''
                                }`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="text-sm font-lato text-[#546E7A] truncate">
                                {selectedOption?.label}
                            </span>
                            <MdKeyboardArrowDown
                                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>

                        {/* Dropdown Options */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {dateOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm font-lato ${dateChange === option.value
                                            ? 'bg-[#F48A1F] text-white'
                                            : 'text-[#546E7A]'
                                            }`}
                                        onClick={() => handleDateChange(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Date Picker - Only show when Custom is selected */}
                    {showCustomDatePicker && (
                        <div className="w-6/12 flex items-center ml-10 justify-end gap-2">
                            <MdCalendarToday className="text-[#546E7A]" />
                            <DatePicker
                                selected={startDate}
                                onChange={handleStartDateChange}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="dd/MM/yy"
                                className="bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none"
                            />
                            <span className="text-[#546E7A]">-</span>
                            <DatePicker
                                selected={endDate}
                                onChange={handleEndDateChange}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="dd/MM/yy"
                                className="bg-transparent text-[#546E7A] w-[80px] text-sm text-center outline-none"
                            />
                        </div>
                    )}
                </div>

                <button onClick={handleAddBrand} className='bg-[#F48A1F] w-2/12 text-white px-4 rounded-[10px] py-[12.5px] flex items-center justify-center gap-2'>
                    {
                        loading ?
                            <CgSpinner className='animate-spin text-white' />
                            :
                            <p className='font-jost text-[#F8FAFC] whitespace-nowrap text-sm leading-[20px]'>
                                {searchMode === 'brand' ? 'Add Brand to Monitor' : 'Add Keyword to Monitor'}
                            </p>
                    }
                </button>
            </div>

            {/* Rest of your component remains the same */}
            <div className='h-[450px] w-full  flex flex-col px-[25px] gap-[48px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl'>
                <div className='flex items-center gap-2'>
                    <img src={Bubble} alt='Bubble' className='w-6 h-6' />
                    <p className='font-jost text-[#6B7280] font-semibold text-lg'>Tracked Brands & Keywords</p>
                </div>

                <div className='px-[25px] pb-[28px]'>
                    {brandWatchLoading ? (
                        <div className='flex items-center justify-center h-[300px]'>
                            <CgSpinner className='animate-spin w-8 h-8 text-[#F48A1F]' />
                        </div>
                    ) : brandWatchData?.length > 0 ? (
                        <>
                            <div className='flex flex-wrap gap-[29px]'>
                                {brandWatchData.map((item, index) => (
                                    <div key={item.id || index} className='border w-[200px] h-auto border-[#E4E7EC] rounded-xl flex flex-col gap-1 p-[13px]'>
                                        <div
                                            className='flex items-center justify-end'
                                        >
                                            <IoCloseSharp 
                                                className='w-5 h-5  cursor-pointer text-[#9CA3AF]' 
                                                onClick={() => {
                                                    setEndBrandWatchData(item);
                                                    setOpenEndBrandWatchModal(true);
                                                }}
                                            />
                                        </div>
                                        <div 
                                            className='flex cursor-pointer flex-col gap-6' 
                                            onClick={() => { 
                                                navigate("/brandwatch/report", { state: item }) 
                                            }}
                                        >
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-1'>
                                                        <LuPackage className='w-5 h-5 text-[#10B981]' />
                                                        <p className='font-jost text-[#6B7280] font-semibold text-[20px] capitalize leading-7'>
                                                            {item.brand?.name || item.keyword || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PAGINATION */}
                            
                                <div className='flex justify-between items-center mt-10 p-4 bg-gray-50 rounded-xl'>
                                    <button
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-jost font-medium text-sm transition-all duration-200 ${
                                            currentPage === 1
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-[#F48A1F] border border-[#F48A1F]/20 hover:bg-[#F48A1F]/5'
                                        }`}
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                    >
                                        <FaArrowLeft className='w-4 h-4' />
                                        <span>Previous</span>
                                    </button>

                                    <div className='flex items-center gap-4'>
                                        <span className='text-sm text-gray-600 font-jost'>
                                            Page {currentPage}
                                        </span>
                                    </div>

                                    <button
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-jost font-medium text-sm transition-all duration-200 ${
                                            !pagination?.next_page_url && brandWatchData?.length < itemsPerPage
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-[#F48A1F] border border-[#F48A1F]/20 hover:bg-[#F48A1F]/5'
                                        }`}
                                        onClick={handleNextPage}
                                        disabled={!pagination?.next_page_url && brandWatchData?.length < itemsPerPage}
                                    >
                                        <span>Next</span>
                                        <FaArrowRight className='w-4 h-4' />
                                    </button>
                                </div>
                       
                        </>
                    ) : (
                        <div className='flex items-center justify-center w-[384px] mx-auto py-20'>
                            <p className='font-jost text-xl text-[#F48A1F]/20'>No Brand Watch Available</p>
                        </div>
                    )}
                </div>
          
                {/* {
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
                                        <div className='flex cursor-pointer flex-col gap-6' onClick={() => { navigate("/brandwatch/report", { state: item }) }}>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-1'>
                                                        <LuPackage className='w-5 h-5 text-[#10B981]' />
                                                        <p className='font-jost text-[#6B7280] font-semibold text-[20px] capitalize leading-7'>{item.brand !== null ? item.brand.name : item.keyword}</p>
                                                    </div>
                                                </div>
                                            </div>
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
                } */}
            </div>
        

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