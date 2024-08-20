import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ContactManager.css";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const ContactManager = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentUser?.role != 0) {
      navigate("/unauthorized");
    }
  }, [currentUser, navigate]);

  const [dataContact, setDataContact] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [contentFeedback, setContentFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackAdmin, setFeedbackAdmin] = useState("");
  const [message, setMessage] = useState("");
  const [checkFeedBack, setCheckFeedBack] = useState("0");
  const [clickedCPH, setClickedCPH] = useState(true);
  const [clickedDPH, setClickedDPH] = useState(false);
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    if (checkFeedBack == 0) {
      fetchDataCPH();
    } else {
      fetchDataDPH();
    }
  }, []);
  const fetchDataCPH = async () => {
    // Gọi API để lấy dữ liệu
    axios
      .get("https://localhost:7125/Contact/allCPH")
      .then((response) => {
        setDataContact(response.data);
        console.log(response.data);
        setLoading(false);
        setSearchData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };
  const fetchDataDPH = async () => {
    // Gọi API để lấy dữ liệu
    axios
      .get("https://localhost:7125/Contact/allDPH")
      .then((response) => {
        setDataContact(response.data);
        console.log(response.data);
        setLoading(false);
        setSearchData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };
  const handleFeedBack = (row) => {
    setFormVisible(true);
    setEmail(row.email);
    setContentFeedback(row.content);
    setID(row.id);
    setName(row.fullName);
  };
  const CancalForm = () => {
    setFormVisible(false);
    setMessage("");
  };

  const handleSearch = (event) => {
    const newData = dataContact.filter((row) => {
      return (
        row.fullName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.email.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setSearchData(newData);
  };
  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedbackAdmin === "") {
      setMessage("Nội dung phản hồi trống!");
      return;
    }
    let To = email;
    let Subject = "Phản Hồi Yêu Cầu Từ Blog Website"; // Sửa tên biến thành title nếu cần
    let Body = feedbackAdmin;
    let Id = id;
    try {
      const response = await fetch(
        "https://localhost:7125/Contact/send?Id=" + Id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ To, Subject, Body, Id }), // Đảm bảo biến đúng tên
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (checkFeedBack == 0) {
        fetchDataCPH();
      } else {
        fetchDataDPH();
      }
      setMessage("");
      setEmail("");
      setFeedbackAdmin("");
      setContentFeedback("");
      setFormVisible(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Gửi Phản Hồi Thành Công!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error:", error); // Thêm log lỗi để debug
      setMessage("Đã xảy ra lỗi khi gửi phản hồi!");
    }
  };
  const CPH = () => {
    setCheckFeedBack(0);
    setClickedCPH(true);
    setClickedDPH(false);
    fetchDataCPH();
  };
  const DPH = () => {
    setCheckFeedBack(1);
    setClickedDPH(true);
    setClickedCPH(false);
    fetchDataDPH();
  };
  const columns = [
    {
      name: "Họ và Tên",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Tiêu Đề",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Nội Dung",
      selector: (row) => row.content,
      sortable: false,
    },
    {
      name: "Phản Hồi",
      selector: (row) => row.feedback,
      cell: (row) => (
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "green",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => handleFeedBack(row)}
        >
          {row.feedback || "Phản Hồi"}
        </button>
      ),
      sortable: false,
    },
  ];
  const customStyle = {
    headCells: {
      style: {
        fontSize: "17px",
        background: "#009879",
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: "center",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Đảm bảo nội dung tiêu đề cũng được căn giữa theo chiều dọc
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        textAlign: "center",
        padding: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    rows: {
      style: {
        minHeight: "50px",
        "&:hover": {
          backgroundColor: "#f1f1f1",
        },
      },
    },
    pagination: {
      style: {
        border: "none",
        display: "flex",
        justifyContent: "center",
        padding: "10px",
      },
    },
  };
  return (
    <div className="table-container">
      <input
        type="text"
        title="Keyword trong họ tên và email"
        onChange={handleSearch}
        placeholder="Tìm kiếm..."
        className="search-input"
        style={{
          position: "absolute",
          top: "5px",
          left: "10px",
          width: "20%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <h2 className="table-title" style={{ fontWeight: "bold" }}>
        Liên Hệ Từ Người Dùng
      </h2>
      <div style={{ position: "absolute", top: "5px", right: "10px" }}>
        <button
          className={clickedCPH ? "button-clicked" : "button-normal"}
          onClick={() => CPH()}
        >
          Chưa Phản Hồi
        </button>
        <button
          className={clickedDPH ? "button-clicked" : "button-normal"}
          style={{ marginLeft: "10px" }}
          onClick={() => DPH()}
        >
          Đã Phản Hồi
        </button>
      </div>
      <div className="dataTable">
        <DataTable
          customStyles={customStyle}
          columns={columns}
          data={searchData}
          progressPending={loading}
          pagination
          highlightOnHover
          noDataComponent={<div>Không có dữ liệu</div>}
        />
      </div>

      {/*Form phản hoi*/}
      {isFormVisible && (
        <div className="feedback-overlay">
          <div className="feedback-form-container">
            <button
              style={{
                float: "right",
                fontSize:'20px',
                fontWeight: "bold",
                border: "none",
                marginTop: "-10px",
                marginright: "-10px",
                padding: "5px 10px",
                borderRadius:'3px',
                cursor:'pointer'
              }}
              title="Thoát"
              onClick={() => CancalForm()}
            >
              x
            </button>
            <h3 style={{ fontWeight: "bold" }}>Phản Hồi Người Dùng</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label style={{ fontWeight: "bold" }}>{name}:</label>
                <p style={{ margin: "10px 0" }}>- {contentFeedback}</p>
              </div>
              <div className="form-group">
                <lable
                  htmlFor="feedback-content"
                  style={{ fontWeight: "bold" }}
                >
                  Admin phản hồi:
                </lable>
                <div style={{ marginTop: "5px" }}>
                  <textarea
                    id="feedback-content"
                    placeholder="Nội dung phản hồi"
                    onChange={(e) => setFeedbackAdmin(e.target.value)}
                    rows="4"
                    className="feedback-textarea"
                  />
                </div>
              </div>
              {message && <p style={{ color: "red" }}>{message}</p>}
              <input
                type={"submit"}
                value={"Phản Hồi"}
                className="submit-btn"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
