import React from "react";

const Pagination = ({ pageNumber, totalPages, onPageChange }) => {
  if (totalPages < 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(pageNumber - 1)}
        disabled={pageNumber === 1}
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          className={pageNumber === index + 1 ? "active" : ""}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(pageNumber + 1)}
        disabled={pageNumber === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
