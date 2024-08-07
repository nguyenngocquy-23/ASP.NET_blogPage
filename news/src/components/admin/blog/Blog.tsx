import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { format, parseISO } from "date-fns"; // hỗ trợ định dạng ngày tháng theo mẫu
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "../blog/Blog.module.css";
import Swal from "sweetalert2";

interface Blog {
  id: number;
  image: string;
  title: string;
  shortDescription: string;
  createdAt: string;
  // Thêm các trường khác nếu cần thiết
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://localhost:7125/AdminBlog");
        setBlogs(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        setError("Lỗi khi tải danh sách bài viết.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      // Hiển thị thông báo xác nhận trước khi xóa
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa bài viết này?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, xóa đi!",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        // Gọi API để xóa bài viết
        await axios.delete(`https://localhost:7125/AdminBlog/${id}`);

        // Cập nhật lại danh sách bài viết sau khi xóa thành công
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));

        // Hiển thị thông báo thành công
        Swal.fire({
          timer: 1000,
          icon: "success",
          title: "Đã xóa!",
          text: "Bài viết đã được xóa.",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      // Hiển thị thông báo lỗi
      Swal.fire("Lỗi!", "Đã xảy ra lỗi khi xóa bài viết.", "error");
    }
  };

  const columns = [
    {
      name: "Tiêu đề",
      selector: (row: Blog) => row.title,
      sortable: true,
      width: "250px",
    },
    {
      name: "Hình ảnh",
      cell: (row: Blog) => (
        <img
          src={row.image}
          alt={row.image}
          style={{ width: "50px", height: "50px" }}
        />
      ),
      width: "150px",
    },
    {
      name: "Mô tả ngắn",
      selector: (row: Blog) => row.shortDescription,
    },
    {
      name: "Ngày tạo",
      selector: (row: Blog) =>
        format(parseISO(row.createdAt), "dd/MM/yyyy HH:mm:ss"),
      sortable: true,
      width: "200px",
    },
    {
      name: "Tác vụ",
      cell: (row: Blog) => (
        <div>
          <Link
            to={`/admin/blogDetail/${row.id}`}
            style={{ marginRight: "10px", fontSize: "22px" }}
            title="Sửa bài viết"
          >
            <FaEdit style={{ color: "blue", marginLeft: "10px" }} />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "22px",
            }}
            title="Xóa bài viết"
          >
            <FaTrash style={{ color: "red" }} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Danh sách bài viết</h2>
      {loading && <p>Đang tải...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <Link
        to={"/admin/blogDetail"}
        className={styles.addIcon}
        title="Tạo bài viết"
      >
        <FaPlus />
      </Link>
      {!loading && !error && (
        <div className={styles.dataTable}>
          {/* <DataTable columns={columns} data={blogs} pagination /> */}
          <DataTable
            columns={columns}
            data={blogs}
            pagination
            customStyles={{
              headCells: {
                style: {
                  fontSize: "17px",
                },
              },
              cells: {
                style: {
                  borderCollapse: "collapse",
                  fontSize: "15px",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Blog;
