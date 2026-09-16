import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../services/api'
import { appUrls } from '../../../services/urls'
import { toast } from 'react-toastify'

import Logo from '../../../assets/png/logo.png'
import ReputationReportDocument from '../../Sentiment/components/report/ReputationReportDocument'
import buildReputationModel, { formatPeriod, unwrapReport } from '../../Sentiment/components/report/buildReputationModel'
import { slugify } from '../../Sentiment/components/report/reportTheme'
import exportReportPdf from '../../../utils/exportReportPdf'

// Rows carry the written report as JSON rather than a stored file, so the PDF is
// rebuilt here on demand - the same document the Sentiment board exports.
const reportMetaOf = (item) => item?.data?.report_metadata || {}

const humaniseType = (item) => {
    const raw = String(item?.report_type || '').replace(/_/g, ' ').trim()
    return raw || 'Report'
}

const brandOf = (item) => reportMetaOf(item).brand_name || ''

const periodOf = (item) => {
    const range = reportMetaOf(item).reporting_period || {}
    if (!range.start_date && !range.end_date) return null
    return formatPeriod(range.start_date, range.end_date)
}

const formatDateTime = (value) => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return { date: date.toLocaleDateString(), time: date.toLocaleTimeString() }
}

const MyReports = () => {
    const [allReports, setAllReports] = useState({ data: [], pagination: {} })
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    // The report being rendered off-screen for capture, if any.
    const [exportJob, setExportJob] = useState(null)

    const reportDocRef = useRef(null)
    // Guards the capture against the effect re-entering while it runs.
    const exportRunning = useRef(false)

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

    // Reports generated from the Sentiment board carry no subject or region, so every
    // field is read defensively: a missing one must not take the page down.
    const filteredReports = allReports.data?.filter(item => {
        const term = search.toLowerCase()
        return [brandOf(item), humaniseType(item), periodOf(item)]
            .some(value => String(value || '').toLowerCase().includes(term))
    }) || []

    const handleDownload = (item) => {
        if (exportJob) return

        const model = buildReputationModel({ brand: brandOf(item), response: item })
        if (!model.hasReport) {
            toast.error('This report has no content to download yet.')
            return
        }

        setExportJob({
            id: item.id,
            model,
            fileName: `${slugify(model.brand || 'report')}-reputation-intelligence-report.pdf`
        })
    }

    // The document has to be mounted and laid out before html2canvas can read it, so
    // the capture runs from an effect once the off-screen node is on the page.
    useEffect(() => {
        if (!exportJob || exportRunning.current) return

        exportRunning.current = true
        let mounted = true

        const run = async () => {
            try {
                await exportReportPdf(reportDocRef.current, { fileName: exportJob.fileName })
                toast.success('Report downloaded successfully')
            } catch (error) {
                console.error('Report export failed', error)
                toast.error('The report could not be built. Please try again.')
            } finally {
                exportRunning.current = false
                if (mounted) setExportJob(null)
            }
        }

        run()

        return () => { mounted = false }
    }, [exportJob])

    const { pagination } = allReports

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
                            placeholder='Search by brand or report type...'
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
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Brand</th>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Report Type</th>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Reporting Period</th>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Generated At</th>
                                            <th className="px-4 py-2 text-left text-base font-medium text-[#667185] uppercase tracking-wider font-jost">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredReports.length > 0 ? filteredReports.map((item) => {
                                            const generated = formatDateTime(reportMetaOf(item).generated_at || item.created_at)
                                            // Only a report that carries written content can be rebuilt as a PDF.
                                            const downloadable = Boolean(unwrapReport(item))
                                            const busy = exportJob?.id === item.id

                                            return (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#101928] font-jost capitalize">{brandOf(item) || '--'}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#101928] font-jost capitalize">{humaniseType(item)}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#101928] font-jost">{periodOf(item) || '--'}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#101928] font-jost">
                                                        {generated ? (
                                                            <div className='flex flex-col'>
                                                                <p>{generated.date}</p>
                                                                <p>{generated.time}</p>
                                                            </div>
                                                        ) : '--'}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-left text-sm font-medium">
                                                        <button
                                                            onClick={() => handleDownload(item)}
                                                            disabled={!downloadable || Boolean(exportJob)}
                                                            className={`${downloadable ? "bg-[#111827] text-white" : "bg-[#ccc] text-white"} w-[150px] py-2 px-4 rounded-md font-jost text-sm disabled:cursor-not-allowed`}
                                                        >
                                                            {busy ? 'Preparing...' : 'Download Report'}
                                                        </button>
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

            {/* Parked off-screen rather than hidden: html2canvas measures a real laid-out
                node, so `display: none` or zero opacity would capture nothing. */}
            {exportJob && (
                <div
                    aria-hidden='true'
                    style={{ position: 'absolute', left: '-20000px', top: 0, width: 794, pointerEvents: 'none' }}
                >
                    <ReputationReportDocument ref={reportDocRef} model={exportJob.model} logo={Logo} />
                </div>
            )}
        </div>
    )
}

export default MyReports
