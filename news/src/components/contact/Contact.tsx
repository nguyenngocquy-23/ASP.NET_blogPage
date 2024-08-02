import React, {useEffect, useState} from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import styles from './Contact.module.css';
import {Link} from 'react-router-dom';

const Contact: React.FC = () => {

    const extractLinkPath = (url: string) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.container__left}>
                    <div>
                        <div className={styles.sentForm__head}>
                            <h1 className={styles.sentForm__headTitle}>
                                LIÊN HỆ CHÚNG TÔI
                            </h1>
                        </div>
                        <form className={styles.sentForm__main}>
                            <div className={styles.field}>
                                <label>Họ và tên <span className={styles.required}>*</span></label>
                                <div className={styles.field__input}>
                                    <input type="text" name="AuthorName"/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Nhập email <span className={styles.required}>*</span></label>
                                <div className={styles.field__input}>
                                    <input type="text" name="AuthorEmail"/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Tiêu đề <span className={styles.required}>*</span></label>
                                <div className={styles.field__input}>
                                    <input type="text" name="Title"/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Nội dung <span className={styles.required}>*</span></label>
                                <div className={styles.field__input}>
                                    <textarea name="Content"></textarea>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <p style={{fontStyle : "italic"}}>Phần có dấu (<span style={{color:'red', fontSize:'20px', marginTop:'10px'}}> * </span>) là thông tin bắt buộc</p>
                            </div>
                            <div className={styles.field}>
                                <button type="submit">Gửi</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={styles.container__right}>
                    <div className={styles.contactInfo}>
                        <div>
                            <h2 className={styles.contactInfo__headTitle}>Thông tin liên hệ</h2>
                            <div className="contactInfo__head-image">
                                <div className={styles.img}></div>
                            </div>
                        </div>
                        <div className={styles.contactInfo__main}>
                            <ul className={styles.contactInfo__mainList}>
                                <li className={styles.contactInfo__mainListItem}>
                                    <span className="label">Tòa soạn: </span>
                                    Ký túc xá khu B, Phường Linh Trung, Thủ Đức
                                </li>
                                <li className={styles.contactInfo__mainListItem}>
                                    <span className="label">Đường dây nóng: </span>
                                    0923 238 843
                                </li>
                                <li className={styles.contactInfo__mainListItem}>
                                    <span className="label">Điện thoại: </span>
                                    (084) 31000821
                                </li>
                                <li className={styles.contactInfo__mainListItem}>
                                    <span className="label">Email: </span>
                                    nhomX@trangtintuc.com
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Contact;
