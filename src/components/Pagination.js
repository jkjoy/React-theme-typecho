import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, last page, current page, and one page before and after current page
      let startPage = Math.max(currentPage - 1, 1);
      let endPage = Math.min(currentPage + 1, totalPages);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = Math.min(maxPagesToShow, totalPages);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
      }
      
      // Add ellipsis if needed
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }
      
      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button 
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
        ) : (
          <button
            key={page}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}
      
      <button 
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

export default Pagination;
