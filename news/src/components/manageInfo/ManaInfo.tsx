import React, {useEffect, useState} from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import styles from '../manageInfo/ManaInfo.module.css';
import {Link} from 'react-router-dom';

const ManaInfo: React.FC = () => {

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
                                THÔNG TIN TÀI KHOẢN
                            </h1>
                        </div>
                        <form className={styles.sentForm__main}>
                            <div className={styles.field}>
                                <label>Họ và tên</label>
                                <div className={styles.field__input}>
                                    <input type="text" name="AuthorName"/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>email</label>
                                <div className={styles.field__input}>
                                    <input type="text" name="AuthorEmail"/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Số điện thoại</label>
                                <div className={styles.field__input}>
                                    <input type="text" name="Title"/>
                                    <span className="form-message"></span>
                                </div>
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
                            <h2 className={styles.contactInfo__headTitle}>Đổi mật khẩu</h2>
                        </div>
                        <div className={styles.contactInfo__main}>
                        <form className={styles.sentForm__main}>
                            <div className={styles.field}>
                                <label>Mật khẩu hiện tại</label>
                                <div className={styles.field__input}>
                                    <input type="text" name="AuthorName"/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Mật khẩu mới</label>
                                <div className={styles.field__input}>
                                    <input type="text" name="AuthorEmail"/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Xác nhận mật khẩu</label>
                                <div className={styles.field__input}>
                                    <input type="text" name="Title"/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <button type="submit">Đổi</button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ManaInfo;
