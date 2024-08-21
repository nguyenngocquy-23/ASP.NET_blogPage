import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Dashboard/Dashboard.module.css";
import {
  FaChalkboard,
  FaChartBar,
  FaCodeBranch,
  FaComment,
  FaThumbsDown,
  FaThumbsUp,
  FaUsers,
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AiFillLike} from "react-icons/ai";

const Dashboard = () => {
  const [TotalBlog , setTotalBlog] = useState(0);
  const [BlogInMonth,setBlogInMonth] = useState(0);
  const [UserInMonth,setUserInMonth] = useState(0);
  const [ContactInMonth,setContactInMonth] = useState(0);
  const [BlogInDate,setBlogInDate] = useState(0);
  const [UserInDate,setUserInDate] = useState(0);
  const [TopBlog,setTopBlog] = useState([]);
  const [TopUser,setTopUser] = useState([]);



  const now = new Date();

  // Format the date
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    
    axios
      .get("https://localhost:7125/DashBoard/TotalBlog")
      .then((response) => {
        setTotalBlog(response.data);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    axios
        .get("https://localhost:7125/DashBoard/BlogInMonth")
        .then((response) => {
          setBlogInMonth(response.data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    axios
        .get("https://localhost:7125/DashBoard/UserInMonth")
        .then((response) => {
          setUserInMonth(response.data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    axios
        .get("https://localhost:7125/DashBoard/ContactInMonth")
        .then((response) => {
          setContactInMonth(response.data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    axios
        .get("https://localhost:7125/DashBoard/BlogInDay")
        .then((response) => {
          setBlogInDate(response.data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    axios
        .get("https://localhost:7125/DashBoard/UserInDay")
        .then((response) => {
          setUserInDate(response.data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    axios
        .get("https://localhost:7125/DashBoard/TopBlog")
        .then((response) => {
          setTopBlog(response.data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    axios
        .get("https://localhost:7125/DashBoard/TopUser")
        .then((response) => {
          setTopUser(response.data);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
  }, []);

  return (
    <div className={styles.container}>
      <h2>Thống kê</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div className={styles.row}>
          <div className={styles.col}>
            <div
              className={styles.card}
              style={{ borderTop: "8px solid #FFF455" }}
            >
              <div className={styles.cardBody}>
                <div className={styles.alignItemsCenter}>
                  <div className={styles.colIcon}>
                    <div className={styles.iconBig}>
                      <FaChalkboard />
                    </div>
                  </div>
                  <div className={styles.colStats}>
                    <div className={styles.numbers}>
                      <p className={styles.cardCategory}>Tổng số bài viết</p>
                      <h4 className={styles.cardTitle}>{TotalBlog}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.col}>
            <div
              className={styles.card}
              style={{ borderTop: "8px solid #219C90" }}
            >
              <div className={styles.cardBody}>
                <div className={styles.alignItemsCenter}>
                  <div className={styles.colIcon}>
                    <div className={styles.iconBig}>
                      <FaChartBar />
                    </div>
                  </div>
                  <div className={styles.colStats}>
                    <div className={styles.numbers}>
                      <p className={styles.cardCategory}>
                        Số bài mới đăng (tháng)
                      </p>
                      <h4 className={styles.cardTitle}>{BlogInMonth}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.col}>
            <div
              className={styles.card}
              style={{ borderTop: "8px solid #FFC700" }}
            >
              <div className={styles.cardBody}>
                <div className={styles.alignItemsCenter}>
                  <div className={styles.colIcon}>
                    <div className={styles.iconBig}>
                      <FaUsers />
                    </div>
                  </div>
                  <div className={styles.colStats}>
                    <div className={styles.numbers}>
                      <p className={styles.cardCategory}>Tài khoản người dùng mới (tháng)</p>
                      <h4 className={styles.cardTitle}>{UserInMonth}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.col}>
            <div
              className={styles.card}
              style={{ borderTop: "8px solid #EE4E4E" }}
            >
              <div className={styles.cardBody}>
                <div className={styles.alignItemsCenter}>
                  <div className={styles.colIcon}>
                    <div className={styles.iconBig}>
                      <FaCodeBranch />
                    </div>
                  </div>
                  <div className={styles.colStats}>
                    <div className={styles.numbers}>
                      <p className={styles.cardCategory}>
                        Tổng số liên hệ gửi về Admin (tháng)
                      </p>
                      <h4 className={styles.cardTitle}>{ContactInMonth}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rowRight}>
          <div className={styles.colRight}>
            <div className="card card-primary card-round">
              <div className={styles.cardHeader}>
                <div className="card-head-row">
                  <h1 className={styles.cardTitle}>Tổng bài viết hôm nay</h1>
                </div>
                <h3 className={styles.cardCategory}>{formatDate(now)}</h3>
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.num}>{BlogInDate}</h2>
              </div>
            </div>
            <div className="card card-round">
              <div className={styles.cardBody}>
                <p className="text-muted">Tổng người dùng mới hôm nay</p>
                <h2 className={styles.num}>{UserInDate}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.body_table} style={{height:'400px'}}>

        <div className={styles.table_container_left} >
          <h2>Top 5 Bài Viết Yêu Thích Nhất</h2>
          <table className={styles.styled_table}>
            <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu Đề</th>
              <th><AiFillLike /></th>
            </tr>
            </thead>
            <tbody>
            {TopBlog.map(blog => (
                <tr className={styles.active_row}>
                  <td>{blog.id}</td>
                  <td>{blog.title}</td>
                  <td>{blog.numLike}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className={styles.table_container_right}>
        <h2>Top 5 Người Dùng Tương Tác Nhiều Nhất</h2>
          <table className={styles.styled_table}>
            <thead>
            <tr>
              <th>ID</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              {/*<th>Số Điện Thoại</th>*/}
            </tr>
            </thead>
            <tbody>
            {TopUser.map(user => (
                <tr className={styles.active_row}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  {/*<td>{user.phoneNumber}</td>*/}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
