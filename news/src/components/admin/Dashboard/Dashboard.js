import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Dashboard/Dashboard.module.css";
import {
  FaChalkboard,
  FaChartBar,
  FaCodeBranch,
  FaUsers,
} from "react-icons/fa";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const now = new Date();

  // Format the date
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    
    axios
      .get("https://localhost:7125/DashBoard/contact")
      .then((response) => {
        setSalesData(response.data);
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
                      <h4 className={styles.cardTitle}>1294</h4>
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
                      <h4 className={styles.cardTitle}>1303</h4>
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
                      <p className={styles.cardCategory}>Lượng người dùng</p>
                      <h4 className={styles.cardTitle}>1345</h4>
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
                        Số truy cập bình quân
                      </p>
                      <h4 className={styles.cardTitle}>576</h4>
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
                <h2 className={styles.num}>17</h2>
              </div>
            </div>
            <div className="card card-round">
              <div className={styles.cardBody}>
                <p className="text-muted">Người dùng đang trực tuyến</p>
                <h2 className={styles.num}>17</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
