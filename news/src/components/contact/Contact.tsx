import React, {useEffect, useState} from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import styles from './Contact.module.css';
import {Link} from 'react-router-dom';
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import {RootState} from "../reduxStore/Store";

const Contact: React.FC = () => {

    const extractLinkPath = (url: string) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };
    // Gửi dữ lieu ve server
    const [FullName,setFullName] = useState('');
    const [Email,setEmail] = useState('');
    const [Title,setTitle] = useState('');
    const [Content,setContent] = useState('');
    const [status,setStatus] = useState('');
    const [statusDanger,setStatusDanger] = useState('');
    const currentUser = useSelector((state: RootState) => state.user.currentUser);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentDateTime = new Date();
      if(currentUser){
          if(Title == '' || Content == ''){
              setStatusDanger('Chưa điền đầy đủ thông tin!');
          }else{
              try {
                  const fullName = currentUser.fullName;
                  const email = currentUser.email;
                  const feedback = 0;
                  const response = await fetch('https://localhost:7125/Contact', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({fullName,email, Title,Content,currentDateTime,feedback}),
                  });

                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  setStatusDanger('');
                  Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "Gửi Thành Công!",
                      showConfirmButton: false,
                      timer: 1500
                  });
                  setTitle("");
                  setContent("");
              } catch (error) {
                  setStatusDanger('Gửi yêu cầu không thành công! Có thể là do email không đúng định dạng!');
              }
          }
      }else{
          if(FullName == '' || Email == '' || Title == '' || Content == ''){
              console.log(FullName + Email)
              setStatusDanger('Chưa điền đầy đủ thông tin!');
          }else{
              try {
                  const feedback = 0;
                  const response = await fetch('https://localhost:7125/Contact', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ FullName, Email, Title,Content,currentDateTime,feedback}),
                  });

                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  setStatusDanger('');
                  Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "Gửi Yêu Cầu Thành Công!",
                      showConfirmButton: false,
                      timer: 1500
                  });
                  setFullName("");
                  setEmail("");
                  setTitle("");
                  setContent("");
              } catch (error) {
                  setStatusDanger('Gửi yêu cầu không thành công! Có thể là do email không đúng định dạng!');
              }
          }
      }
    }

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
                        <form className={styles.sentForm__main} onSubmit={handleSubmit}>
                            {currentUser ? (
                                <>
                                    <div className={styles.field}>
                                        <label>Họ và tên <span className={styles.required}>*</span></label>
                                        <div className={styles.field__input}>
                                            <input type="text" name="AuthorName" value={currentUser.fullName}
                                                   onChange={(e) => setFullName(e.target.value)} disabled/>
                                            <span className="form-message"></span>
                                        </div>
                                    </div>
                                    <div className={styles.field}>
                                        <label>Nhập email <span className={styles.required}>*</span></label>
                                        <div className={styles.field__input}>
                                            <input type="text" name="AuthorEmail" value={currentUser.email}
                                                   onChange={(e) => setEmail(e.target.value)} disabled/>
                                            <span className="form-message"></span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.field}>
                                        <label>Họ và tên <span className={styles.required}>*</span></label>
                                        <div className={styles.field__input}>
                                            <input type="text" name="AuthorName" value={FullName}
                                                   onChange={(e) => setFullName(e.target.value)}/>
                                            <span className="form-message"></span>
                                        </div>
                                    </div>
                                    <div className={styles.field}>
                                        <label>Nhập email <span className={styles.required}>*</span></label>
                                        <div className={styles.field__input}>
                                            <input type="text" name="AuthorEmail" value={Email}
                                                   onChange={(e) => setEmail(e.target.value)}/>
                                            <span className="form-message"></span>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className={styles.field}>
                                <label>Tiêu đề <span className={styles.required}>*</span></label>
                                <div className={styles.field__input}>
                                    <input type="text" name="Title" value={Title}
                                           onChange={(e) => setTitle(e.target.value)}/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Nội dung <span className={styles.required}>*</span></label>
                                <div className={styles.field__input}>
                                    <textarea name="Content" value={Content}
                                              onChange={(e) => setContent(e.target.value)}/>
                                    <span className="form-message"></span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <p style={{fontStyle : "italic"}}>Phần có dấu (<span style={{color:'red', fontSize:'20px', marginTop:'10px'}}> * </span>) là thông tin bắt buộc</p>
                            </div>
                            {status && <p style={{color: 'green'}}>{status}</p>}
                            {statusDanger && <p style={{color: 'red'}}>{statusDanger}</p>}
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
