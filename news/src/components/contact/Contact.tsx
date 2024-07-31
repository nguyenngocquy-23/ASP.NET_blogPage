// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import cheerio from 'cheerio';
// import styles from './New.module.css';
// import {Link} from "react-router-dom";
//
// interface FeedItem {
//     title: string;
//     link: string;
//     description: string;
//     subDescription?: string;
//     imageUrl?: string;
// }
//
// const New: React.FC = () => {
//     const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const rssUrl = 'https://vietnamnet.vn/tin-tuc-24h.rss';
//         const fetchRSS = async () => {
//             try {
//                 const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
//                 const data = response.data.contents;
//
//                 // Parse RSS feed
//                 const parser = new DOMParser();
//                 const xml = parser.parseFromString(data, 'application/xml');
//
//                 const items = Array.from(xml.querySelectorAll('item')).map(item => {
//                     const title = item.querySelector('title')?.textContent || '';
//                     const link = item.querySelector('link')?.textContent || '';
//                     const description = item.querySelector('description')?.textContent || '';
//
//                     // Use cheerio to parse the description HTML and extract the image URL
//                     const $ = cheerio.load(description);
//                     const imageUrl = $('img').attr('src') || '';
//
//                     const subDescription = $('br').get(0)?.nextSibling as Text | null;
//                     const trimmedNodeValue = subDescription?.nodeValue?.trim();
//                     return {
//                         title,
//                         link,
//                         description,
//                         trimmedNodeValue,
//                         imageUrl
//                     };
//                 });
//                 console.log(items);
//                 setFeedItems(items);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setLoading(false);
//             }
//         };
//
//         fetchRSS();
//     }, []);
//
//     return (
//         <div classNameNameName={styles.app}>
//             <h1 classNameNameName={styles.title}>TIN TỨC 24H</h1>
//             {loading && <p>Loading...</p>}
//             {!loading && (
//                 <div classNameNameName={styles.feedContainer}>
//                     {feedItems.map((item, index) => (
//                         <div key={index} classNameNameName={styles.verticalPost}>
//                             <div classNameNameName={styles.verticalPost__avt}>
//                                 <Link to={`/detail/${item.link}`} title={item.title}>
//                                     {item.imageUrl && (
//                                         <img src={item.imageUrl} alt={item.title} classNameNameName={styles.image} />
//                                     )}
//                                     <h3 classNameNameName={styles.verticalPost__mainTitle}>{item.title}</h3>
//                                 </Link>
//                             </div>
//                             <p classNameNameName={styles.description}>{item.subDescription}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default New;
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
                                    nhom33@trangtintuc.com
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
