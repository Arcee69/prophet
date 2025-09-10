import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../../features/transactions/getTransactionSlice'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

const Billing = () => {
     const [currentPage, setCurrentPage] = useState(1)

      const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTransactions(currentPage))
    }, [dispatch, currentPage])

    const { transactions, loading, pagination } = useSelector((state) => state.allTransactions)
    console.log(transactions, "transactions")

    const handlePrevious = () => {
        if (pagination?.prevPageUrl) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const handleNext = () => {
        if (pagination?.nextPageUrl) {
            console.log("next")
            setCurrentPage(prev => prev + 1)
        }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [])

    // Filter users based on search, status, and category
    const filteredTransactions = transactions?.data

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[10px] p-8 flex flex-col gap-6">
        <div className="flex flex-col border-b border-[#EAECF0] pb-5 gap-2">
            <p className="font-medium font-jost text-[#111827] text-[18px] leading-[28px]">
                Transactions
            </p>
            <p className="text-[#9CA3AF] font-jost leading-5">
                Manage your transactions here
            </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#EAECF0] pt-6">
            <div className="flex flex-col gap-2">
                <p className="font-medium font-jost text-[#111827] text-[18px] leading-[28px]">
                    Transaction History
                </p>
            </div>
        
                        {/* Table */}
            <div className='overflow-x-auto rounded-xl'>
                <table className='w-full border-collapse '>
                    <thead>
                        <tr className='bg-NEUTRAL-200'>
                            <th className='p-4 text-left'><input type='checkbox' /></th>
                            <th className='p-4 text-left text-sm font-jost font-semibold text-DARK-500'>Tx Ref</th>
                            <th className='p-4 text-left text-sm font-jost font-semibold text-DARK-500'>Provider</th>
                            <th className='p-4 text-left text-sm font-jost font-semibold text-DARK-500'>Purpose</th>
                            <th className='p-4 text-left text-sm font-jost font-semibold text-DARK-500'>Amount</th>
                            {/* <th className='p-4 text-left text-sm font-jost font-semibold text-DARK-500'>End Date</th> */}
                            <th className='p-4 text-left text-sm font-jost font-semibold text-DARK-500'>Status</th>
                            <th className='p-4 text-left text-sm font-jost text-DARK-500'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className='p-4 text-center text-GREY-200 font-jost'>
                                    Loading Data...
                                </td>
                            </tr>
                        ) : filteredTransactions?.length > 0 ? filteredTransactions?.map((sub, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-GREY-50'}>
                                <td className='p-4'><input type='checkbox' /></td>
                                {/* <td className='p-4'>
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-sm font-jost text-DARK-500'>{sub.tx_ref.slice(0, 10)}</p>
                                        <p className='text-[10px] font-jost text-DARK-500'>{sub.email}</p>
                                    </div>
                                </td> */}
                                <td className='p-4 text-sm font-jost text-DARK-500'>{sub.tx_ref}</td>
                                <td className='p-4 text-sm font-jost text-DARK-500'>{sub.provider}</td>
                                <td className='p-4 text-sm font-jost text-DARK-500'>{sub.purpose}</td>
                                <td className='p-4 text-sm font-jost text-DARK-500'>{sub.amount}</td>
                                <td className='p-4'>
                                    <span className={`${sub.status === "completed" ? "bg-GREEN-50 text-GREEN-700" : "bg-red-100 text-red-500 "} text-xs font-medium px-2.5 py-2 rounded-lg`}>{sub.is_active ? "Active" : "Expired"}</span>
                                </td>
                                {/* <td className='p-4'>
                                    <div className='flex relative'>
                                        <img
                                            src={Kebab}
                                            alt='Kebab'
                                            className='cursor-pointer'
                                            onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                                        />
                                        {openMenuIndex === index && (
                                            <div className='absolute top-full w-[100px] flex flex-col gap-3 right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-2 z-10'>
                                                <button
                                                    onClick={() => {
                                                        setOpenDetailsModal(true);
                                                        setSubscriptionData(sub);
                                                        setOpenMenuIndex(null);
                                                    }}
                                                    className='font-jost text-green-400'
                                                >
                                                    View
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td> */}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className='p-4 text-center text-GREY-200 font-jost'>
                                    No Transactions Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className='flex justify-between items-center p-4 mt-4'>
                    <button
                        className='flex items-center gap-3 cursor-pointer'
                        onClick={handlePrevious}
                        disabled={!pagination?.prevPageUrl}
                    >
                        <FaArrowLeft className='w-4 h-4 text-GREY-200' />
                        <p className='text-GREY-200 font-jost'>Previous</p>
                    </button>
                    <span className='px-4 py-2 bg-GREY-600 rounded-lg'>
                        {currentPage}
                    </span>
                    <button
                        className='flex items-center gap-3 cursor-pointer'
                        onClick={handleNext}
                    // disabled={!pagination?.nextPageUrl}
                    >
                        <p className='text-GREY-200 font-jost'>Next</p>
                        <FaArrowRight className='w-4 h-4 mt-[1px] text-GREY-200' />
                    </button>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Billing