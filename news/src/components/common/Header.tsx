// Header.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaHistory,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { RootState } from "../reduxStore/Store";
import { logoutCurrentUser } from "../reduxStore/UserSlice";

function Header() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutCurrentUser());
    localStorage.removeItem("authToken");
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
            {currentUser ? (
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
            )}
          </ul>
        </nav>
        <div className={styles.search}>
          <form
            className={styles.formSearch}
            action="/searchPage/timkiem"
            method="get"
          >
            <input
              className={styles.inputSearch}
              name="q"
              type="text"
              placeholder="Nhập nội dung tìm kiếm....."
            />
          </form>
        </div>
        <div className={styles.socialIcons}>
          <a href={"/history"} title={"History"}>
            <FaHistory />
          </a>
          <a href={"#"} title={"Facebook"}>
            <FaFacebook />
          </a>
          <a href={"#"} title={"Twitter"}>
            <FaTwitter />
          </a>
          <a href={"#"} title={"Instagram"}>
            <FaInstagram />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
