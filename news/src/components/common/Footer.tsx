import React, { useEffect, useState } from "react";
import styles from "./footer.module.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface Category {
  id: number;
  name: string;
}
const Footer: React.FC = () => {
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch();
  }, []);
  async function fetch() {
    try {
      const response = await axios.post(
        "https://localhost:7125/CategoryCotroller/category"
      );
      setListCategory(response.data);
      const category = { id: 0, name: "Khác" };
      setListCategory((listCategory) => [...listCategory, category]);
    } catch (error) {
      console.error("Nav error", error);
    }
  }
  function convertToSlug(text: string) {
    // Chuyển đổi chuỗi thành chữ thường
    let slug = text.toLowerCase();
    // Loại bỏ các ký tự đặc biệt, chỉ giữ lại chữ cái và số
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Thay thế khoảng trắng bằng dấu gạch ngang
    slug = slug.replace(/\s+/g, "-");
    return slug;
  }
  const handleClick = (url: any, id: any, name: any) => {
    navigate(`/${url}?page=1`, { state: { id: id, name: name } });
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.preContainer}>
        <ul className={styles.category}>
          {listCategory.map((item) => (
            <li>
              <a
                href=""
                onClick={(event) => {
                  event.preventDefault();
                  handleClick(
                    convertToSlug(item.name),
                    item.id,
                    item.name
                  );
                }}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.container}>
        <div className={styles.footerSection}>
          <h4>Về Chúng Tôi</h4>
          <p>
            Trang cung cấp những thông tin mới nhất từ công ty cũng như tình
            hình phát triển và cạnh tranh của công ty nhằm giúp nhân viên nắm
            được tình hình công ty và nâng cao tinh thần trách nhiệm trong công
            việc.
          </p>
        </div>
        <div className={styles.footerSection}>
          <h4>Liên Hệ</h4>
          <p>Email: nhom33@trangtintuc.com</p>
          <p>Điện thoại: 0931-000-821</p>
          <p>Địa chỉ: Phường Linh Trung, Thành Phố Thủ Đức</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Theo Dõi Chúng Tôi</h4>
          <ul className={styles.socialMedia}>
            <li>
              <a href="#">
                <FaFacebook /> Facebook
              </a>
            </li>
            <li>
              <a href="#">
                <FaTwitter /> Twitter
              </a>
            </li>
            <li>
              <a href="#">
                <FaInstagram /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
