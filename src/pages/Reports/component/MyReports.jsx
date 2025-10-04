import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../services/api'
import { appUrls } from '../../../services/urls'
import { CiMenuKebab } from 'react-icons/ci'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyReports = () => {
    const [allReports, setAllReports] = useState({ data: [], pagination: {} })
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedReport, setSelectedReport] = useState(null)

    const navigate = useNavigate()

    const getAllMyReports = async (url = appUrls?.REPORTS_URL) => {
        setLoading(true)
        try {
            const res = await api.get(url)
            setAllReports(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllMyReports()
    }, [])

    const filteredReports = allReports.data?.filter(item =>
        item.subject.toLowerCase().includes(search.toLowerCase()) ||
        item.report_type.toLowerCase().includes(search.toLowerCase()) ||
        item.region.toLowerCase().includes(search.toLowerCase())
    ) || []

    const handleKebabClick = (report) => {
        setSelectedReport(report)
        setShowModal(true)
    }


    const getFileExtension = (url) => {
        return url?.split('.').pop().split(/\#|\?/)[0];
    };


    const handleDownload = async (item) => {
        console.log(item, "item");
        if (item?.file) {
            try {
                // Extract file name from the URL
                const fileName = item.file?.substring(item.file?.lastIndexOf('/') + 1);

                // Fetch file as a blob
                const response = await axios.get(`/report-files/${fileName}`, {
                    responseType: 'blob',
                });

                if (response.status !== 200) {
                    throw new Error('Failed to fetch file');
                }

                // ✅ Axios stores the blob in response.data
                const blob = response.data;

                // Create a temporary download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                // Create a nice filename
                const filename = `${item.subject || 'report'}.${getFileExtension(item.file)}`;
                link.download = filename;

                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success("Report Downloaded Successfully")
            } catch (error) {
                console.error('Download failed:', error);
                alert('Download failed. Please try again.');
            }
        }

        setShowModal(false);
        setSelectedReport(null);
    };


    const closeModal = () => {
        setShowModal(false)
        setSelectedReport(null)
    }

    const getStatusColor = (status) => {
        const text = status === null ? 'Pending' : status
        let bgColor = 'bg-[#FDE68A]'
        let textColor = 'text-[#92400E]'
        if (status === 'done') {
            bgColor = 'bg-[#A7F3D0]'
            textColor = 'text-[#065F46]'
        } else if (status === 'failed') {
            bgColor = 'bg-[#FECACA]'
            textColor = 'text-[#991B1B]'
        }
        return { text, bgColor, textColor }
    }

    const { pagination } = allReports

    const totalPages = Math.ceil(pagination.total / pagination.per_page)

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
                            placeholder='Search Report Title...'
                            className='appearance-none w-[350px] outline-none border border-[#D1D5DB] p-2 rounded-lg bg-transparent font-jost text-base text-[#111827]'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {loading ? (
                        <div className='flex items-center justify-center py-8'>
                            <p className='text-[#101928] font-jost text-sm font-medium'>Loading...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-[#F1F3F9]">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Title</th>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Type</th>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Region</th>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Status</th>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredReports.length > 0 ? filteredReports.map((item) => {
                                            const { text, bgColor, textColor } = getStatusColor(item.status)
                                            return (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#101928] font-jost capitalize">{item.subject}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#101928] font-jost capitalize">{item.report_type}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#101928] font-jost capitalize">{item.region}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs capitalize font-semibold font-jost rounded-full ${bgColor} ${textColor}`}>
                                                            {text}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-left text-sm font-medium">
                                                        <button
                                                            onClick={() => handleDownload(item)}
                                                            disabled={item.status !== "done"}
                                                            className={`${item.status === "done" ? "bg-[#111827] text-white" : "bg-[#ccc] text-white"} w-[150px] py-2 px-4 rounded-md font-jost text-sm`}
                                                        >
                                                            Download Report
                                                        </button>
                                                        {/* <button
                                                            onClick={() => handleKebabClick(item)}
                                                            className="text-[#667185] hover:text-[#101928] focus:outline-none"
                                                        >
                                                            <CiMenuKebab className='w-5 h-5' />
                                                        </button> */}
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-[#101928] font-jost text-sm font-medium">
                                                    No Reports Available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {pagination.total > 0 && (
                                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        <button
                                            onClick={() => pagination.prev_page_url && getAllMyReports(pagination.prev_page_url)}
                                            disabled={!pagination.prev_page_url || loading}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => pagination.next_page_url && getAllMyReports(pagination.next_page_url)}
                                            disabled={!pagination.next_page_url || loading}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 font-jost">
                                                Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{' '}
                                                <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of{' '}
                                                <span className="font-medium">{pagination.total}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => pagination.prev_page_url && getAllMyReports(pagination.prev_page_url)}
                                                    disabled={!pagination.prev_page_url || loading}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-GREY-_700 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => pagination.next_page_url && getAllMyReports(pagination.next_page_url)}
                                                    disabled={!pagination.next_page_url || loading}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-GREY-_700 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 min-w-[200px]">
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-jost text-gray-700 mb-4">Download</p>
                            <button
                                onClick={handleDownload}
                                className="w-full bg-[#111827] text-white py-2 px-4 rounded-md font-jost text-sm"
                            >
                                Download Report
                            </button>
                            <button
                                onClick={closeModal}
                                className="w-full mt-2 text-gray-500 py-2 px-4 rounded-md font-jost text-sm hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyReports