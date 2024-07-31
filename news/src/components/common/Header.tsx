// Header.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFacebook, FaTwitter, FaInstagram, FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { RootState } from "../reduxStore/Store";

function Header() {
  const currentUser = null;
  const dispatch = useDispatch();
  const handleLogout = () => {
    
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
                  <Link to="/">{"currentUser.email"}</Link>
                  <div className={styles.logout}>
                    <Link to="/login" onClick={handleLogout}>
                      Đăng xuất
                    </Link>
                  </div>
                </li>
                <li className={styles.account}>
                  <Link to="/">{"currentUser.email"}</Link>
                  <div className={styles.info}>
                    <Link to="/manaInfo">
                      Tài khoản
                    </Link>
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
            <button
              className={styles.btnSearch}
              type="submit"
              title={"Tìm kiếm"}
            >
              <img
                src="https://static.vnncdn.net/v1/icon/search.png"
                alt="search icon"
              />
            </button>
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
