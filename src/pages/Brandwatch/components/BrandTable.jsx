import React, { useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';

const BrandTable = ({ summary1 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const sources = summary1?.sources || { twitter: [], youtube: [], news: [] };

  // Flatten data in the order: Twitter → YouTube → News
  const flatData = [
    ...(sources.twitter || []).map(url => ({ type: 'Twitter/X', url })),
    ...(sources.youtube || []).map(url => ({ type: 'YouTube', url })),
    ...(sources.news || []).map(url => ({ type: 'News', url })),
  ];



  const totalItems = flatData?.length;
  const totalPages = Math?.ceil(totalItems / itemsPerPage);

  const currentData = flatData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDisplayAndHrefUrl = (type, originalUrl) => {
    let displayUrl = originalUrl;
    let hrefUrl = originalUrl;

    if (type === 'Twitter/X') {
      const postId = originalUrl.split('/').pop();
      hrefUrl = `https://x.com/i/status/${postId}`;
      displayUrl = hrefUrl;
    } else if (type === 'YouTube') {
      const videoId = originalUrl.includes('v=')
        ? originalUrl.split('v=')[1].split('&')[0]
        : originalUrl.split('/').pop();
      if (videoId) {
        hrefUrl = `https://youtu.be/${videoId}`;
        displayUrl = hrefUrl;
      }
    }

    return { displayUrl, hrefUrl };
  };

  const handleExportCSV = () => {
    if (flatData?.length === 0) return;

    const header = 'Source,URL\n';
    const rows = flatData
      .map(item => {
        const { hrefUrl } = getDisplayAndHrefUrl(item.type, item.url);
        return `"${item.type}","${hrefUrl.replace(/"/g, '""')}"`;
      })
      .join('\n');

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'brand_sources.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-[#101928]">
          Sources ({totalItems})
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>

          <button
            onClick={handleExportCSV}
            disabled={totalItems === 0}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg transition-colors"
          >
            <AiOutlineDownload className="w-5 h-5" />
            <span className="text-base font-medium">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {totalItems === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No sources found for this period.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-t-lg border-b border-gray-200">
            <table className="w-full min-w-[800px] table-auto">
              <thead className="bg-[#F1F3F9] border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-jost text-sm font-semibold text-[#667185] uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left font-jost text-sm font-semibold text-[#667185] uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left font-jost text-sm font-semibold text-[#667185] uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData?.map((item, index) => {
                  const { displayUrl, hrefUrl } = getDisplayAndHrefUrl(item.type, item.url);
                  const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;

                  return (
                    <tr key={globalIndex} className="hover:bg-[#F1F3F9] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{globalIndex}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={hrefUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline hover:text-[#FF4E4C] break-all"
                        >
                          {displayUrl}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} sources
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)]?.map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === i + 1
                          ? 'bg-[#F48A1F] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrandTable;