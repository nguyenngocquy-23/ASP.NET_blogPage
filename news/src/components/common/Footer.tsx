import React from 'react';
import styles from './footer.module.css';
import {FaFacebook, FaInstagram, FaTwitter} from "react-icons/fa";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.preContainer}>
                <ul className={styles.category}>
                    <li><a href="/tin-noi-bat">Tin nổi bật</a></li>
                    <li><a href="/the-thao">Thể thao</a></li>
                    <li><a href="/nhan-su">Nhân sự</a></li>
                    <li><a href="/qui-dinh">Qui định</a></li>
                    <li><a href="/chinh-sach">Chính sách</a></li>
                    <li><a href="/phong-ban">Phòng ban</a></li>
                    <li><a href="/luonng">Lương</a></li>
                </ul>
            </div>
            <div className={styles.container}>
                <div className={styles.footerSection}>
                    <h4>Về Chúng Tôi</h4>
                    <p>Trang cung cấp những thông tin mới nhất từ công ty cũng như tình hình phát triển và cạnh tranh của công ty nhằm giúp nhân viên nắm được tình hình công ty và nâng cao tinh thần trách nhiệm trong công việc.</p>
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
                        <li><a href="#"><FaFacebook/> Facebook</a></li>
                        <li><a href="#"><FaTwitter/> Twitter</a></li>
                        <li><a href="#"><FaInstagram/> Instagram</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
