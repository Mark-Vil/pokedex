import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  goToNextPage, 
  goToPrevPage, 
  goToPage 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Show at most 5 page numbers
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <>
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button 
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            &laquo; Previous
          </button>
          
          {currentPage > 3 && (
            <>
              <button 
                onClick={() => goToPage(1)} 
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                1
              </button>
              {currentPage > 4 && <span className="text-gray-500">...</span>}
            </>
          )}
          
          {getPageNumbers().map(number => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-3 py-1 rounded-md ${
                currentPage === number 
                  ? 'bg-[#FF5350] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          ))}
          
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="text-gray-500">...</span>}
              <button 
                onClick={() => goToPage(totalPages)} 
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next &raquo;
          </button>
        </nav>
      </div>
      
      <div className="mt-2 text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages} | Showing Pokémon {(currentPage - 1) * (totalPages > 0 ? Math.ceil(890 / totalPages) : 0) + 1} - {Math.min(currentPage * (totalPages > 0 ? Math.ceil(890 / totalPages) : 0), 890)}
      </div>
    </>
  );
};

export default Pagination;