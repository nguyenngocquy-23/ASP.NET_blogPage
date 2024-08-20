// Header.tsx
import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFacebook, FaTwitter, FaInstagram, FaHistory, FaUser } from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import styles from "./header.module.css";
import { RootState } from "../reduxStore/Store";
import {logoutCurrentUser} from "../reduxStore/UserSlice";

function Header() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>();
  const handleLogout = () => {
    dispatch(logoutCurrentUser())
    localStorage.removeItem('authToken');
  };
  const navigate = useNavigate();
  const handleChange = (event: any) => {
    const { value } = event.target;
    setContent(value);
  };
  const handleSearch = () => {
    navigate(`/searchPage/timkiem?content=${content}&page=1&filter=moi-nhat`);

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
                    <Link to="/manaInfo">
                      <FaUser style={{marginRight: "4px"}}/>
                      {currentUser.fullName}
                    </Link>
                    <div className={styles.logout}>
                      <Link to="/login" onClick={handleLogout}>
                        Đăng xuất
                      </Link>
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
            <button
              className={styles.btnSearch}
              type={"submit"}
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
