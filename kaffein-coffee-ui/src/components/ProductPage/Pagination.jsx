import React from "react";
import "../../assets/scss/pages/product.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pagesToShow = 4;

  // Səhifə nömrələrini göstərən funksiya
  const renderPageNumbers = () => {
    let pages = [];

    if (totalPages <= pagesToShow + 2) {
      // Bütün səhifələri göstər (az səhifə varsa)
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Səhifələməni qısaldılmış formada göstər
      if (currentPage <= pagesToShow) {
        for (let i = 1; i <= pagesToShow; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage > totalPages - pagesToShow) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - pagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      {/* Geri düyməsi */}
      <button
        className="pagination__button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {/* Səhifə nömrələri */}
      {renderPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`pagination__button ${
            currentPage === page ? "pagination__button--active" : ""
          }`}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      {/* İrəli düyməsi */}
      <button
        className="pagination__button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
