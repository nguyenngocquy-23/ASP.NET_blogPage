import React from 'react';
import styles from './footer.module.css';
import {FaFacebook, FaInstagram, FaTwitter} from "react-icons/fa";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.preContainer}>
                <ul className={styles.category}>
                    <li><a href="/giao-duc">Giáo dục</a></li>
                    <li><a href="/chinh-tri">Chính trị</a></li>
                    <li><a href="/van-hoa">Văn hóa</a></li>
                    <li><a href="/the-thao">Thể thao</a></li>
                    <li><a href="/doi-song">Đời sống</a></li>
                    <li><a href="/suc-khoe">Sức khỏe</a></li>
                    <li><a href="/du-lich">Du lịch</a></li>
                    <li><a href="/kinh-doanh">Kinh doanh</a></li>
                    <li><a href="/talkshow">Talks</a></li>
                    <li><a href="/su-kien">Sự kiện</a></li>
                    <li><a href="/podcast">Podcast</a></li>
                    <li><a href="/tin-tuc-24h">Tin tức 24h</a></li>
                </ul>
            </div>
            <div className={styles.container}>
                <div className={styles.footerSection}>
                    <h4>Về Chúng Tôi</h4>
                    <p>Trang cung cấp những thông tin mới mẻ và chính xác nhất. Đáp ứng nhu cầu theo dõi thông tin xã
                        hội trong và ngoài nước.</p>
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
