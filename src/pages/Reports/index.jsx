import React, { useRef, useState } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { FaLaugh, FaLongArrowAltUp } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'
import { LuFilter, LuPackage } from 'react-icons/lu'
import { RiPieChartLine } from 'react-icons/ri'
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Chart from 'react-apexcharts'
import { LuArchive, LuCalendarDays, LuShare2 } from 'react-icons/lu'
import { GoTag } from 'react-icons/go'
import { FiCheckCircle } from 'react-icons/fi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { FiBarChart2 } from 'react-icons/fi'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

//Svgs
import Facebook from "../../assets/svg/facebook.svg"
import Twitter from "../../assets/svg/twitter.svg"
import Pinterest from "../../assets/svg/pinterest.svg"

// Images
import Girl from "../../assets/png/girl.png"



const Reports = () => {
  const [dateRange, setDateRange] = useState("")
  const [brands, setBrands] = useState("")
  const [sentiment, setSentiment] = useState("")
  const [source, setSource] = useState("")
  const [regions, setRegions] = useState("")
  const [alertType, setAlertType] = useState("")
  const [report, setReport] = useState(false)
  const [selectedTime, setSelectedTime] = useState("This Week")


  const handleGenerateReport = () => {
    setReport(prev => !prev)
  }

  const reportRef = useRef(null);

  // const handleDownloadPDF = async () => {
  //   const input = reportRef.current;
  //   const canvas = await html2canvas(input, { scale: 2 });
  //   const imgData = canvas.toDataURL('image/png');

  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save('report.pdf');
  // };

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

  
  // Line Chart Data
  const [lineChartData] = useState({
    series: [
      {
        name: 'Positive',
        data: [10, 20, 15, 25, 20, 30]
      },
      {
        name: 'Negative',
        data: [5, 10, 8, 12, 10, 15]
      },
    ],
    options: {
      chart: {
        type: 'line',
        toolbar: { show: false },
      },
      stroke: {
        curve: 'smooth'
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'top',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      colors: ['#1E5631', '#FF4E4C'],
    }
  })

  // Bar Chart Data
  const channelData = [
      { name: 'Twitter', samsung: 1200, apple: 1500 },
      { name: 'Facebook', samsung: 800, apple: 1000 },
      { name: 'Instagram', samsung: 600, apple: 750 },
      { name: 'News Sites', samsung: 400, apple: 500 },
  ];

  const dataStats = [
    {
      name: "Today’s sentiment",
      num: "5,837",
      percentChange: 5
    },
    {
      name: "Total Mentions",
      num: "3,024",
      percentChange: 8
    },
    {
      name: "Channel Distribution",
      num: "8",
      percentChange: 2
    },
    {
      name: "Active Alerts",
      num: "240",
      percentChange: 2
    },
  ]

  const sentimentData = [
    {
      name: 'Apple',
      positive: 40,
      negative: 41,
      neutral: 19, // calculated as 100 - (40 + 41)
    },
    {
      name: 'Samsung',
      positive: 22,
      negative: 22,
      neutral: 56, // calculated as 100 - (22 + 22)
    },
  ];

  const mentionsData = [
    {
      name: 'Apple',
      reach: 300,
    },
    {
      name: 'Samsung',
      reach: 30,
    },
  ];

  const engagementData = [
    {
      name: 'Apple',
      reach: 300,
    },
    {
      name: 'Samsung',
      reach: 30,
    },
  ];

  const potentialData = [
    {
      name: 'Apple',
      reach: 300,
    },
    {
      name: 'Samsung',
      reach: 30,
    },
  ];

  return (
    <div className='flex flex-col gap-6 px-3 w-full'>
      <div className='flex flex-col gap-1'>
        <p className='font-jost text-[#101928] font-semibold leading-[145%] text-[24px]'>Brand Watch Report</p>
        <p className='text-[#667185] text-sm font-jost'>This report provides a comprehensive overview of brand sentiment and engagement.</p>
      </div>

      <div className='border border-[#E0E0E0] rounded-xl  w-full p-5 flex flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-2 flex-col '>
            <p className='font-jost text-DARK-_100 font-semibold leading-7 text-[18px]'>Generate Report</p>
            <p className='text-DARK-_200 text-sm font-jost leading-[150%]'>Apply all filters applicable to your report</p>
          </div>
          <button
            type='button'
            className='w-[150px] h-[40px] bg-[#F48A1F] rounded-[8px] p-2'
            onClick={handleGenerateReport}
          >
            <p className='font-jost text-white text-base font-medium'>Generate Report</p>
          </button>
        </div>

        <div className='w-full bg-[#E5E7EB] h-[1.5px]'></div>

        <div className='flex flex-col pt-6 w-full gap-[19px]'>

          <div className='flex items-center gap-4 w-full'>
            <div className='flex flex-col gap-2 w-6/12'>
              <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Date Range</p>
              <div className='flex items-center w-full bg-transparent  rounded-[10px] border border-[#D1D5DB] p-3'>
                <select
                  name='date'
                  value={dateRange}
                  className='appearance-none w-full bg-transparent outline-none font-jost text-base text-[#111827]'
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last Month">Last Month</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="Last 12 Months">Last 12 Months</option>
                </select>
                <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
              </div>
            </div>
            <div className='flex flex-col gap-2 w-6/12'>
              <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Brands</p>
              <div className='flex items-center w-full bg-transparent rounded-[10px] border border-[#D1D5DB] p-3'>
                <select
                  name='brands'
                  value={brands}
                  className='appearance-none w-full outline-none bg-transparent font-jost text-base text-[#111827]'
                  onChange={(e) => setBrands(e.target.value)}
                >
                  <option value="Cadbury:Dangote">Cadbury:Dangote</option>
                  <option value="Apple:Samsung">Apple:Samsung</option>
                </select>
                <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
              </div>
            </div>
          </div>

          <div className='flex items-center gap-4 w-full'>
            <div className='flex flex-col gap-2 w-3/12'>
              <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Sentiment</p>
              <div className='flex items-center w-full bg-transparent rounded-[10px] border border-[#D1D5DB] p-3'>
                <select
                  name='sentiment'
                  value={sentiment}
                  className='appearance-none w-full outline-none bg-transparent font-jost text-base text-[#111827]'
                  onChange={(e) => setSentiment(e.target.value)}
                >
                  <option value="All Sentiment">All Sentiments</option>
                </select>
                <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
              </div>
            </div>
            <div className='flex flex-col gap-2 w-3/12'>
              <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Source</p>
              <div className='flex items-center w-full rounded-[10px] bg-transparent border border-[#D1D5DB] p-3'>
                <select
                  name='source'
                  value={source}
                  className='appearance-none w-full outline-none bg-transparent font-jost text-base text-[#111827]'
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="All sources">All sources</option>
                </select>
                <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
              </div>
            </div>
            <div className='flex flex-col gap-2 w-3/12'>
              <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Region</p>
              <div className='flex items-center w-full rounded-[10px] bg-transparent border border-[#D1D5DB] p-3'>
                <select
                  name='regions'
                  value={regions}
                  className='appearance-none w-full outline-none font-jost bg-transparent text-base text-[#111827]'
                  onChange={(e) => setRegions(e.target.value)}
                >
                  <option value="All Regions">All Regions</option>
                </select>
                <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
              </div>
            </div>
            <div className='flex flex-col gap-2 w-3/12'>
              <p className='font-jost font-medium text-sm leading-[150%] text-[#374151]'>Alert Type</p>
              <div className='flex items-center w-full rounded-[10px] bg-[#fcfcfc] border border-[#D1D5DB] p-3'>
                <select
                  name='alertType'
                  value={alertType}
                  className='appearance-none w-full outline-none bg-[#fcfcfc] font-jost text-base text-[#111827]'
                  onChange={(e) => setAlertType(e.target.value)}
                >
                  <option value="All types">All types</option>
                </select>
                <IoIosArrowDown className='w-5 h-5 text-[#4B5563]' />
              </div>
            </div>
          </div>

        </div>

      </div>

      {report && (
        <div className='border border-[#E0E0E0] rounded-xl  w-full p-5 flex flex-col gap-5' ref={reportRef}>

          <div className='flex items-center justify-between'>
            <div className='flex gap-2 flex-col '>
              <p className='font-jost text-DARK-_100 font-semibold leading-7 text-[18px]'>Report ready! Here’s what we found.</p>
              <p className='text-DARK-_200 text-sm font-jost leading-[150%]'>Data shown below reflects your selected filters.</p>
            </div>
            <button
              type='button'
              className='w-[157px] h-[40px] bg-[#111827] rounded-[8px] p-2 flex items-center gap-2 justify-center'
              onClick={handleDownloadPDF}
            >
              <AiOutlineDownload className='w-5 h-5 text-white' />
              <p className='font-jost text-white text-base font-medium'>Export Report</p>
            </button>
          </div>

          <div className='w-full bg-[#E5E7EB] h-[1.5px]'></div>

          <div className='flex items-end justify-between'>
            <div className='flex flex-col gap-2'>
              <p className='font-jost font-medium text-[#374151] text-[18px] leading-[28px]'>Social Listening Report</p>
              <p className='text-DARK-_200 text-sm font-jost leading-[150%]'>01 July 2025 – 07 July 2025</p>
            </div>

            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <LuFilter className='text-[#111827] w-5 h-5' />
                <p className='font-jost text-sm leading-[150%] text-DARK-_200'>Alert Type: <span className='text-DARK-_200'>All</span></p>
              </div>
              <div className='bg-[#F3F4F6] h-[6px] w-[6px]'></div>
              <p className='font-jost text-GREY-_100 text-sm'>Source: <span className='text-DARK-_200'>All Sentiments</span></p>
              <div className='bg-[#F3F4F6] h-[6px] w-[6px]'></div>
              <p className='font-jost text-GREY-_100 text-sm'>Source: <span className='text-DARK-_200'>All Sentiments</span></p>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <p className='text-black font-jost text-[18px] font-medium'>All Data</p>
            <div className='flex items-center gap-4 w-full'>
              {
                dataStats.map((item, index) => (
                  <div key={index} className='w-3/12 flex flex-col border border-[#E4E7EC] rounded-[10px] p-3 gap-2'>
                    <p className='text-[#667185] text-sm font-jost leading-[145%]'>{item.name}</p>
                    <div className='flex items-center gap-[14px]'>
                      <p className='font-semibold text-[#101928] text-[18px] leading-[145%]'>{item.num}</p>
                      <div className='bg-[#E7F6EC] flex items-center gap-1 w-10 rounded p-[1px]'>
                        <FaLongArrowAltUp className='w-3 h-3 text-[#036B26]' />
                        <p className='font-jost text-sm text-[#036B26]'>{item.percentChange}%</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className='flex items-center gap-6'>
             <div className={`h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl`}>
              <div className='flex items-center gap-2'>
                <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Total Mentions</p>
              </div>
              {
                mentionsData.length > 0 ?
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={mentionsData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}k`} />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => `${value}k`} />
                        <Bar dataKey="reach" stackId="a" fill="#BDDAFF">
                          <LabelList dataKey="reach" position="center" formatter={(val) => `${val}k`} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  :
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
              }
            </div>

             <div className={`h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl`}>
              <div className='flex items-center gap-2'>
                <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Engagement</p>
              </div>
              {
                engagementData.length > 0 ?
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={engagementData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}k`} />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => `${value}k`} />
                        <Bar dataKey="reach" stackId="a" fill="#BDDAFF">
                          <LabelList dataKey="reach" position="center" formatter={(val) => `${val}k`} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  :
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
              }
            </div>

          </div>

          <div className='flex items-center gap-6'>
            <div className={`h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl`}>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <RiPieChartLine className='w-5 h-5 text-[#F48A1F]' />
                  <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Sentiment Breakdown</p>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-1'>
                    <div className='bg-[#D8FDE5] w-2 h-2 rounded-full'></div>
                    <p className='font-jost text-black text-xs leading-[100%]'>Positive</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='bg-[#DEDEDE] w-2 h-2 rounded-full'></div>
                    <p className='font-jost text-black text-xs leading-[100%]'>Neutral</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='bg-[#FFDCDB] w-2 h-2 rounded-full'></div>
                    <p className='font-jost text-black text-xs leading-[100%]'>Negative</p>
                  </div>
                </div>
              </div>
              {
                sentimentData.length > 0 ?
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
                        <Bar dataKey="positive" stackId="a" fill="#D8FDE5">
                          <LabelList dataKey="positive" position="center" formatter={(val) => `${val}%`} />
                        </Bar>
                        <Bar dataKey="negative" stackId="a" fill="#FFDCDB">
                          <LabelList dataKey="negative" position="center" formatter={(val) => `${val}%`} />
                        </Bar>
                        <Bar dataKey="neutral" stackId="a" fill="#E5E7EB">
                          <LabelList dataKey="neutral" position="center" formatter={(val) => `${val}%`} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  :
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
              }
            </div>

            <div className={`h-[362px] w-6/12 flex flex-col px-[25px] py-[28px] shadow bg-white border-[1px] border-white rounded-xl`}>
              <div className='flex items-center gap-2'>
                <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Potential Reach</p>
              </div>
              {
                potentialData.length > 0 ?
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={potentialData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}k`} />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => `${value}k`} />
                        <Bar dataKey="reach" stackId="a" fill="#BDDAFF">
                          <LabelList dataKey="reach" position="center" formatter={(val) => `${val}k`} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  :
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
              }
            </div>

          </div>

          <div className='flex gap-4'>
              {/* Sentiment Analysis Overview (Line Chart) */}
            <div className='bg-white rounded-[18px] w-1/2 p-4 shadow-sm'>
                <div className='flex justify-between items-start'>
                    <p className='font-jost font-medium text-[20px] mb-4 text-[#4B5563]'>
                        Results Over Time
                    </p>
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className='font-jost text-[#252F3D]  text-xs cursor-pointer bg-transparent border-none outline-none'
                    >
                        {["This Week", "This Month"].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <Chart
                    options={lineChartData.options}
                    series={lineChartData.series}
                    type='line'
                    height={300}
                />
            </div>

            {/* Channel Sentiment Distribution (Bar Chart) */}
            <div className={` gap-[18px] w-6/12 flex flex-col px-[25px]  py-[28px] shadow bg-white border-[1px] border-white rounded-xl`}>
              <div className='flex items-center gap-2'>
                  <FiBarChart2 className='w-5 h-5 text-[#F48A1F]' />
                  <p className='font-semibold font-jost text-[#6B7280] text-[20px]'>Channel Performance</p>
              </div>
              {
                channelData.length > 0 ?
                  <div className="w-full h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={channelData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="samsung" fill="#BDDAFF" name="Samsung" />
                              <Bar dataKey="apple" fill="#F2E5FF" name="Apple" />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
                  :
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
              }
          </div>
          </div>

          {/* Top Mentions */}
          <div className='flex flex-col gap-[11px] '>
            <p className='font-jost font-semibold text-[18px]  text-[#6B7280]'>
              Top Mentions
            </p>

            <div className='grid grid-cols-2 gap-4'>

              {/* Facebook Card */}
              <div className='bg-[#fff] h-[232px] flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
                <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' />
                <div className='flex gap-5 flex-col w-full'>
                  <div className='flex items-start justify-between'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1'>
                        <img src={Facebook} alt='Facebook' className='w-5 h-5' />
                        <p className='font-jost text-sm text-[#000000]'>Facebook</p>
                      </div>
                      <p className='font-medium font-jost text-[10px] text-[#6B7280]'>@Mary Slessor</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <LuCalendarDays className='w-5 h-5 text-[#9CA3AF]' />
                      <p className='font-jost font-medium text-[#6B7280] text-xs'>14th Feb, 2024 10:05</p>
                    </div>
                  </div>
                  <p className='font-jost text-[#4B5563] text-sm'>
                    Great experience with the new product launch!#Innovation
                  </p>
                  <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Comments</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Likes</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Reposts</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Impressions</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-5'>
                    <div className='bg-[#DCFCE7] h-auto rounded-full flex items-center gap-1 p-1.5'>
                      <FaLaugh className='w-5 h-5 text-[#1FCE6E]' />
                      <p className='text-[#1FCE6E] text-xs text-center font-inter'>positive</p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                      <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                      <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                      <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                      <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                    </div>
                    <p className='font-jost text-[#F48A1F] text-sm'>Details</p>
                  </div>
                </div>
              </div>

              {/* Twitter Card */}
              <div className='bg-[#fff] h-[232px] flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
                <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' />
                <div className='flex gap-5 flex-col w-full'>
                  <div className='flex items-start justify-between'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1'>
                        <img src={Twitter} alt='Twitter' className='w-5 h-5' />
                        <p className='font-jost text-sm text-[#000000]'>Twitter</p>
                      </div>
                      <p className='font-medium font-jost text-[10px] text-[#6B7280]'>@Mary Slessor</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <LuCalendarDays className='w-5 h-5 text-[#9CA3AF]' />
                      <p className='font-jost font-medium text-[#6B7280] text-xs'>14th Feb, 2024 10:05</p>
                    </div>
                  </div>
                  <p className='font-jost text-[#4B5563] text-sm'>
                    Great experience with the new product launch!#Innovation
                  </p>
                  <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Comments</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Likes</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Reposts</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Impressions</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-5'>
                    <div className='bg-[#DCFCE7] h-auto rounded-full flex items-center gap-1 p-1.5'>
                      <FaLaugh className='w-5 h-5 text-[#1FCE6E]' />
                      <p className='text-[#1FCE6E] text-xs text-center font-inter'>positive</p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                      <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                      <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                      <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                      <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                    </div>
                    <p className='font-jost text-[#F48A1F] text-sm'>Details</p>
                  </div>
                </div>
              </div>

              {/* Pinterest Card */}
              <div className='bg-[#fff] h-[232px] flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
                <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' />
                <div className='flex gap-5 flex-col w-full'>
                  <div className='flex items-start justify-between'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1'>
                        <img src={Pinterest} alt='Pinterest' className='w-5 h-5' />
                        <p className='font-jost text-sm text-[#000000]'>Pinterest</p>
                      </div>
                      <p className='font-medium font-jost text-[10px] text-[#6B7280]'>@Mary Slessor</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <LuCalendarDays className='w-5 h-5 text-[#9CA3AF]' />
                      <p className='font-jost font-medium text-[#6B7280] text-xs'>14th Feb, 2024 10:05</p>
                    </div>
                  </div>
                  <p className='font-jost text-[#4B5563] text-sm'>
                    Great experience with the new product launch!#Innovation
                  </p>
                  <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Comments</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Likes</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Reposts</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Impressions</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-5'>
                    <div className='bg-[#DCFCE7] h-auto rounded-full flex items-center gap-1 p-1.5'>
                      <FaLaugh className='w-5 h-5 text-[#1FCE6E]' />
                      <p className='text-[#1FCE6E] text-xs text-center font-inter'>positive</p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                      <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                      <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                      <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                      <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                    </div>
                    <p className='font-jost text-[#F48A1F] text-sm'>Details</p>
                  </div>
                </div>
              </div>

              {/* YouTube Card */}
              <div className='bg-[#fff] h-[232px] flex items-start gap-2 px-[22px] pt-[22px] pb-[45px] rounded-lg'>
                <img src={Girl} alt='Girl' className='w-[32px] h-[32px] ' />
                <div className='flex gap-5 flex-col w-full'>
                  <div className='flex items-start justify-between'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1'>
                        <img src={Facebook} alt='Facebook' className='w-5 h-5' />
                        <p className='font-jost text-sm text-[#000000]'>Facebook</p>
                      </div>
                      <p className='font-medium font-jost text-[10px] text-[#6B7280]'>@Mary Slessor</p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <LuCalendarDays className='w-5 h-5 text-[#9CA3AF]' />
                      <p className='font-jost font-medium text-[#6B7280] text-xs'>14th Feb, 2024 10:05</p>
                    </div>
                  </div>
                  <p className='font-jost text-[#4B5563] text-sm'>
                    Great experience with the new product launch!#Innovation
                  </p>
                  <div className='flex items-center gap-[30px] w-[278px] h-[28px]'>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Comments</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Likes</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Reposts</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>45k</p>
                      <p className='font-jost text-[10px] font-medium text-[#4B5563]'>Impressions</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-5'>
                    <div className='bg-[#DCFCE7] h-auto rounded-full flex items-center gap-1 p-1.5'>
                      <FaLaugh className='w-5 h-5 text-[#1FCE6E]' />
                      <p className='text-[#1FCE6E] text-xs text-center font-inter'>positive</p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <LuShare2 className='w-5 h-5 text-[#9CA3AF]' />
                      <LuArchive className='w-5 h-5 text-[#9CA3AF]' />
                      <GoTag className='w-5 h-5 text-[#9CA3AF]' />
                      <FiCheckCircle className='w-5 h-5 text-[#9CA3AF]' />
                      <IoDocumentTextOutline className='w-5 h-5 text-[#9CA3AF]' />
                    </div>
                    <p className='font-jost text-[#F48A1F] text-sm'>Details</p>
                  </div>
                </div>
              </div>

            </div>
          </div>



        </div>
      )}

    </div>
  )
}

export default Reports