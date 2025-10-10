import { useEffect, useRef, useState } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { IoIosArrowDown } from 'react-icons/io'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactMarkdown from "react-markdown"

// Images
import { countries } from '../../utils/countries'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands } from '../../features/brands/getBrandsSlice'
import { api } from '../../services/api'
import { appUrls } from '../../services/urls'
import { useNavigate } from 'react-router-dom';
import ModalPop from '../../components/modalPop';
import PaymentInfo from './component/PaymentInfo';
import { toast } from 'react-toastify';



const Reports = () => {
  const [selectedBrand, setSelectedBrand] = useState({ id: "", name: "" });
  const [subject, setSubject] = useState("")
  const [regions, setRegions] = useState("")
  const [reportType, setReportType] = useState("")
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState("")
  const [openPaymentInfo, setOpenPaymentInfo] = useState(false)


  const reportRef = useRef(null);

   const dispatch = useDispatch()

    useEffect(() => {
      dispatch(fetchBrands())
    }, [])

    const brandData = useSelector((state) => state.allBrands)
    const allBrandData = brandData?.brands?.data
    console.log(allBrandData, "data")

    console.log(selectedBrand, "selectedBrand")

    const handleIndustryReport = async () => {
      setOpenPaymentInfo(true)
      setLoading(true)
      const data = {
        "subject": selectedBrand.name,
        "region": regions,
        "brand_id": selectedBrand.id,
        "request": description
      }
      try {
        const res = await api.post(appUrls?.INDUSTRY_REPORT_URL, data)
        console.log(res, "maxwell")
        toast.success(res.data.message)
      } catch (err) {
        console.log(err, "salo")
        toast.error(err.data.message)
      } finally {
         setLoading(false)
      }
    }

    const handleCrisisReport = async () => {
      setOpenPaymentInfo(true)
      setLoading(true)
      const data = {
        "subject": subject,
        "region": regions,
        "brand_id": null,
        "request": description
      }
      try {
        const res = await api.post(appUrls?.CRISIS_REPORT_URL, data)
        console.log(res, "crisis")
        toast.success(res.data.message)
      } catch (err) {
        console.log(err, "salo")
        toast.error(err.data.message)
      } finally {
         setLoading(false)
      }
    }

    const handlePoliticalReport = async () => {
       setOpenPaymentInfo(true)
        setLoading(true)
      const data = {
        "subject": subject,
        "region": regions,
        "request": description
      }
      try {
        const res = await api.post(appUrls?.POLITICAL_REPORT_URL, data)
        console.log(res, "political")
        toast.success(res.data.message)
      } catch (err) {
        console.log(err, "salo")
        toast.error(err.data.message)
      } finally {
         setLoading(false)
      }
    }

    const handleElectionReport = async () => {
       setOpenPaymentInfo(true)
        setLoading(true)
      const data = {
        "subject": subject,
        "region": regions,
        "request": description
      }
      try {
        const res = await api.post(appUrls?.ELECTION_REPORT_URL, data)
        console.log(res, "election")
        toast.success(res.data.message)
      } catch (err) {
        console.log(err, "salo")
        toast.error(err.data.message)
      } finally {
         setLoading(false)
      }
    }

    const handleGenerateReport = () => {
      if(reportType === "Industry Report") {
        handleIndustryReport()
      } 
      if (reportType === "Election Analysis") {
        handleElectionReport()
      } 
      if (reportType === "Crisis Playbooks") {
        handleCrisisReport()
      }
      if (reportType === "Political Pulse Reports") {
        handlePoliticalReport()
      }
    }

    console.log(reportData.data, "fafo")


  const handleDownloadPDF = async () => {
    const input = reportRef.current;

    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save('report.pdf');

  };

  const navigate = useNavigate()

   


  return (
    <div className='flex flex-col gap-6 px-3 w-full'>
      <div className='flex flex-col gap-1'>
        <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Report</p>
        <p className='text-[#667185] text-sm font-jost'></p>
      </div>

      <div className='border border-[#E0E0E0] rounded-xl  w-full p-5 flex flex-col gap-5'>
        <div className='flex items-center gap-5 justify-end'>
          <button
            type='button'
            className='w-[150px] h-[40px] bg-[#111827] rounded-[8px] p-2'
            onClick={() => navigate("/reports/my-reports")}
          >
            <p className='font-jost text-white text-base font-medium'>My Reports</p>
          </button>
        </div>

        <div className='w-full bg-[#E5E7EB] h-[1.5px]'></div>

        <div className='flex flex-col pt-6 w-full gap-[19px]'>

          <div className='flex items-center gap-4 w-full'>
          
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Region</p>
              <div className='flex items-center w-full rounded-[10px] bg-transparent border border-[#D1D5DB] p-3'>
                <select
                  name='regions'
                  value={regions}
                  className='appearance-none w-full outline-none font-jost bg-transparent text-base text-[#111827]'
                  onChange={(e) => setRegions(e.target.value)}
                >
                  <option value="All Regions">All Regions</option>
                  <option value="Nigeria">Nigeria</option>
                  {countries.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
                <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
              </div>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Report Type</p>
              <div className='flex items-center w-full rounded-[10px] bg-[#fcfcfc] border border-[#D1D5DB] p-3'>
                <select
                  name='reportType'
                  value={reportType}
                  className='appearance-none w-full outline-none bg-[#fcfcfc] font-jost text-base text-[#111827]'
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="">Select Report</option>
                  <option value="Industry Report">Industry Report</option>
                  <option value="Election Analysis">Election Analysis</option>
                  <option value="Political Pulse Reports">Political Pulse Reports</option>
                  <option value="Crisis Playbooks">Crisis Playbooks</option>
                </select>
                <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
              </div>
            </div>

            <div className='flex items-center gap-4 w-full'>
              {
                reportType === 'Industry Report' ? 
                <div className='flex flex-col gap-2 w-full'>
                  <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Brands</p>
                  <div className='flex items-center w-full bg-transparent rounded-[10px] border border-[#D1D5DB] p-3'>
                    <select
                      name='brands'
                      value={selectedBrand.id}
                      className='appearance-none w-full outline-none bg-transparent font-jost text-base text-[#111827]'
                      onChange={(e) => {
                        const brand = allBrandData?.find((item) => item.id === e.target.value);
                        setSelectedBrand({ id: brand.id, name: brand.name });
                      }}
                    >
                      <option value="Select Brand">Select Brand</option>
                      {
                        allBrandData?.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))
                      }
                    </select>
                    <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
                  </div>
                </div>
                : 
                <div className='flex flex-col gap-2 w-full'>
                  <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Subject</p>
                  <div className='flex items-center w-full bg-transparent rounded-[10px] border border-[#D1D5DB] p-3'>
                    <input
                      name='subject'
                      value={subject}
                      className='appearance-none w-full outline-none bg-transparent font-jost text-base text-[#111827]'
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>
              }
            </div>

          </div>

          <div className='flex flex-col gap-2 w-full'>
            <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Brief Description</p>
            <div className='flex items-center w-full bg-transparent rounded-[10px] border border-[#D1D5DB] p-3'>
              <textarea
                name='description'
                value={description}
                className='appearance-none w-full outline-none bg-transparent h-[150px] font-jost text-base text-[#111827]'
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              type='button'
              className='w-[150px] h-[40px] bg-[#F48A1F] rounded-[8px] p-2'
              onClick={handleGenerateReport}
            >
              <p className='font-jost text-white text-base font-medium'>Request Report</p>
            </button>
          </div>
        </div>
      </div>

      <ModalPop isOpen={openPaymentInfo}>
        <PaymentInfo loading={loading} handleClose={() => setOpenPaymentInfo(false)} />
      </ModalPop>

    </div>
  )
}

export default Reports