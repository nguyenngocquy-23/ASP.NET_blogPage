import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';

// Giả sử có 100 mục
const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
export const PaginatedItems = () => {
    const [currentPage, setCurrentPage] = useState(9); // Bắt đầu từ trang 10 (0-based index)
  const itemsPerPage = 10;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 9); // Cập nhật trang hiện tại từ trang 10 (0-based index)
  };

  const pageRangeDisplayed = 5; // Số lượng trang hiển thị trong phân trang
  const marginPagesDisplayed = 1; // Số lượng trang đầu và cuối hiển thị

  const offset = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  return (
    <div className="container mt-5">
      <ul className="list-group">
        {currentItems.map((item, index) => (
          <li key={index} className="list-group-item">{item}</li>
        ))}
      </ul>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(items.length / itemsPerPage)}
        marginPagesDisplayed={marginPagesDisplayed}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center mt-4'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakLinkClassName={'page-link'}
        initialPage={1} // Chỉ số trang được chọn mặc định
      />
    </div>
  );
};
