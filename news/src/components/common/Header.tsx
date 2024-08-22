// Header.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaHistory,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { RootState } from "../reduxStore/Store";
import { logoutCurrentUser } from "../reduxStore/UserSlice";
import axios from "axios";
import Swal from "sweetalert2";

function Header() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>();
  const [BlogInDate, setBlogInDate] = useState(0);
  const [isNotify, setIsNotify] = useState(false);
  
  const handleNotifyNewBlogInDay = () => {
    if (currentUser?.role == 1 && BlogInDate > 0 && !isNotify) {
      console.log('show!')
      Swal.fire({
        icon: "info",
        title: `Có ${BlogInDate} bài viết mới vừa được thêm hôm nay!`,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar:true,
        toast: true,
      });
      setIsNotify(true);
    }
  };
  useEffect(() => {
    axios
      .get("https://localhost:7125/DashBoard/BlogInDay")
      .then((response) => {
        setBlogInDate(response.data);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  handleNotifyNewBlogInDay();

  const handleLogout = () => {
    dispatch(logoutCurrentUser());
    localStorage.removeItem("authToken");
    setIsNotify(false)
  };
  const navigate = useNavigate();
  const handleChange = (event: any) => {
    const { value } = event.target;
    setContent(value);
  };
  const handleSearch = () => {
    navigate(`/searchPage/timkiem?content=${content}&page=1&filter=moi-nhat`);
  };
  const handleHeader = () => {
    if (currentUser && currentUser.role == 1) {
      return (
        <li className={styles.account}>
          <Link to="/"></Link>
          <div className={styles.info}>
            <FaUser style={{ marginRight: "4px" }} />
            {currentUser.fullName}
            <div className={styles.logout}>
              <ul>
                <li>
                  <Link to="/manaInfo">Quản lý tài khoản</Link>
                </li>
                <li style={{ borderTop: "1px solid white" }}>
                  <Link to="/login" onClick={handleLogout}>
                    Đăng xuất
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </li>
      );
    } else if (currentUser && currentUser.role == 0) {
      return (
        <li className={styles.account}>
          <Link to="/admin" title="Quay về admin">
            <div className={styles.info}>
              <FaUser style={{ marginRight: "4px" }} />
              Admin
            </div>
          </Link>
        </li>
      );
    } else {
      return (
        <li>
          <Link to="/login">Đăng nhập</Link>
        </li>
      );
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">Trang Tin Tức</Link>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link to="/">Trang Chủ</Link>
            </li>
            <li>
              <Link to="/contact">Liên Hệ</Link>
            </li>
            {/* treat cho admin */}
            {handleHeader()}
            {/* {currentUser ? (
              <>
                <li className={styles.account}>
                  <Link to="/"></Link>
                  <div className={styles.info}>
                    <FaUser style={{ marginRight: "4px" }} />
                    {currentUser.fullName}
                    <div className={styles.logout}>
                      <ul>
                        <li>
                          <Link to="/manaInfo">
                            Quản lý tài khoản
                          </Link>
                        </li>
                        <li style={{borderTop:'1px solid white'}}> 
                          <Link to="/login" onClick={handleLogout}>
                            Đăng xuất
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Đăng nhập</Link>
              </li>
            )} */}
          </ul>
        </nav>
        <div className={styles.search}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
              setContent("");
            }}
            className={styles.formSearch}
          >
            <input
              className={styles.inputSearch}
              name="content"
              onChange={handleChange}
              value={content}
              type="text"
              placeholder="Nhập nội dung tìm kiếm....."
            />
          </form>
        </div>
        <div className={styles.socialIcons}>
          <Link to={"/history"} title={"History"}>
            <FaHistory />
          </Link>
          <Link to={""} title={"Facebook"}>
            <FaFacebook />
          </Link>
          <Link to={""} title={"Twitter"}>
            <FaTwitter />
          </Link>
          <Link to={""} title={"Instagram"}>
            <FaInstagram />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
