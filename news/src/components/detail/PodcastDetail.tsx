// export default Detail;
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import styles from '../detail/Detail.module.css';
import podStyles from '../detail/Podcast.module.css';
import {Link, useParams} from 'react-router-dom';
import {addComment} from '../reduxStore/UserSlice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../reduxStore/Store';
import {FaRegMessage} from 'react-icons/fa6';

// Định nghĩa interface cho chi tiết bài viết
interface DetailContent {
    title: string;
    demo: string;
    content: string;
    dateUp: string;
    navItems: string[];
    podcast: string;
}

interface FeedItem {
    title: string;
    link: string;
    imageUrl: string;
}

const PodcastDetail: React.FC = () => {
    const {link} = useParams<{ link: string }>();
    const [detail, setDetail] = useState<DetailContent | null>(null);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [commentContent, setCommentContent] = useState<string>(''); // State để lưu nội dung bình luận
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const comments = useSelector((state: RootState) =>
        state.user.comments.filter((comment) => comment.link === link)
    ); // Lọc bình luận theo link của bài viết hiện tại
    function convertToSlug(text: string) {
        // Chuyển đổi chuỗi thành chữ thường
        let slug = text.toLowerCase();
        // Loại bỏ các ký tự đặc biệt, chỉ giữ lại chữ cái và số
        slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        // Thay thế khoảng trắng bằng dấu gạch ngang
        slug = slug.replace(/\s+/g, '-');

        return slug;
    }

    const extractLinkPath = (url: string) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    useEffect(() => {
        async function fetch() {
            try {
                const response = await axios.get(`https://vietnamnet.vn/${link}`);
                const html = response.data;
                const $ = cheerio.load(html);

                // Sửa các lớp CSS trong HTML để sử dụng className thay vì class
                $('[class]').each((index, element) => {
                    const classes = $(element).attr('class')?.split(' ') || [];
                    classes.forEach(className => {
                        $(element).removeClass(className).addClass(className);
                    });
                });

                // Extract content from the HTML as per your requirement
                const title = $('.content-detail-title').text().trim();
                const content = $('#maincontent').html() || $('.maincontent').html() || '';
                const dateUp = $('.bread-crumb-detail__time').text();
                const demo = $('.content-detail-sapo').text();
                const navElements = $('.bread-crumb-detail ul li').toArray();
                const navItems = navElements.map((li) => $(li).text().trim());
                const navItemsFiltered = navItems.slice(1);  // Loại bỏ phần tử đầu tiên
                const podcast = $('.podcast-player').html() || '';
                setDetail({title, demo, content, dateUp, navItems: navItemsFiltered, podcast});

                // mục liên quan
                const rssUrl = 'https://vietnamnet.vn/' + convertToSlug(navItemsFiltered[0]) + '.rss';
                const fetchRSS = async () => {
                    try {
                        const response = await axios.get(rssUrl);
                        const data = response.data;

                        // Parse RSS feed
                        const parser = new DOMParser();
                        const xml = parser.parseFromString(data, 'application/xml');

                        const items = Array.from(xml.querySelectorAll('item')).map(item => {
                            const title = item.querySelector('title')?.textContent || '';
                            const link = item.querySelector('link')?.textContent || '';
                            const description = item.querySelector('description')?.textContent || '';

                            // Use cheerio to parse the description HTML and extract the image URL
                            const $ = cheerio.load(description);
                            const imageUrl = $('img').attr('src') || '';
                            return {
                                title,
                                link,
                                imageUrl
                            };
                        });
                        setFeedItems(items);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };
                fetchRSS();
            } catch (error) {
                console.error('Error fetching the HTML:', error);
            }
        }

        fetch();
    }, [link]);
    useEffect(() => {
        if (feedItems.length > 5) {
            setFeedItems(feedItems.slice(0, 5)); // Chỉ lấy 5 phần tử đầu tiên
        }
    }, [feedItems]);
    useEffect(() => {
        if (detail?.content) {
            const container = document.getElementById('maincontent');
            if (container) {
                const secretElements = container.querySelectorAll('[data-srcset]');
                secretElements.forEach((element) => {
                    element.setAttribute('srcset', element.getAttribute("data-srcset") || ''); // Thêm thuộc tính bạn cần vào đây
                });
                const reLink = container.querySelectorAll('article a');
                reLink.forEach((element) => {
                    let originalUrl = element.getAttribute("href") || ''; // Lấy đường dẫn gốc từ href
                    element.setAttribute('href', "/detail" + originalUrl); // Cập nhật lại thuộc tính href của thẻ <a>
                });
            }
        }
    }, [detail]);

    const handleCommentSubmit = () => {
        if (currentUser && commentContent) {
            const newComment = {
                link: link + '',
                email: currentUser.email,
                content: commentContent,
                time: new Date().toLocaleString(),
            };
            dispatch(addComment(newComment)); // Thêm bình luận vào Redux store
            setCommentContent(''); // Xóa nội dung bình luận sau khi gửi
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.subContainer}>
                <div className={styles.breadCrumbDetail}>
                    <ul>
                        {detail?.navItems.map((navItem, index) => (
                            <li key={index}>
                                {index > 0 ? `> ${navItem}` : (<a href={'/' + convertToSlug(navItem)}>{navItem}</a>)}
                            </li>
                        ))}
                    </ul>
                    <div className="bread-crumb-detail__time">{detail?.dateUp}</div>
                </div>
                <div className="content-detail content-mobile-change">
                    <h1 className={podStyles.contentDetailTitle}>{detail?.title || 'Loading...'}</h1>
                    <h2 className={podStyles.contentDetailSapo}>{detail?.demo}</h2>
                    {/*source podcast*/}
                    <div className={styles.podcastPlayer}>
                        <div className={styles.podcastPlayerContainer}>
                            <div className="podcast-player__left">
                                <div className="podcast-player__text">
                                </div>
                            </div>
                            <div className={styles.podcastAudio}>
                                <div className={styles.podcastAudio__body}>
                                    <audio autoPlay controls>
                                        <source
                                            src="https://static-images.vnncdn.net/vps_audios/000001/000003/2024/7/8/d310b20b-fa60-435e-9fd3-c7b8006f3723-10_intro.mp3?width=0&amp;s=dC7DWa_SpVKN8VL5Se8r-w"
                                            type="audio/mp3"/>
                                    </audio>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*Mục liên quan*/}
            <div className="vnn-news-ai-suggest horizontal-box-wrapper sticky top-65 pb-15">
                <h2 className={styles.horizontalHeading}>CÓ THỂ BẠN QUAN TÂM</h2>
                <div>
                    {feedItems.map((item, index) => (
                        <div className={styles.horizontalItem} key={index}>
                            <div className={styles.horizontalImage}><img src={item.imageUrl || 'Loading...'}
                                                                         alt={item.title}/></div>
                            <div className={styles.horizontalTitle}><h3><a
                                href={'/detail/' + extractLinkPath(item.link)}
                                title={item.title}>{item.title}</a></h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/*Bình luận*/}
            <div className={styles.comments}>
                <span className={styles.title}>Bình luận</span><br/>
                {currentUser ? (
                    <>
                        <textarea className={styles.inputComment} maxLength={500}
                                  value={commentContent}
                                  onChange={(e) => setCommentContent(e.target.value)}
                                  placeholder={"Bình luận của bạn..."}/><br/>
                        <button className={styles.btnComment} onClick={handleCommentSubmit}>
                            Bình luận
                        </button>
                        <span className="comment-bg emptyComment" style={{display: 'none'}}>
                            <img src="https://static.vnncdn.net/v1/icon/chat(1).svg" alt="comment icon"/>
                        </span>
                        <span className="comment-number vnn-comment-count-detail"></span>
                    </>
                ) : (
                    <span className={styles.noMess}>
                        <FaRegMessage/>
                        <Link to={'/login'}> Đăng nhập </Link>
                        để tiến hành bình luận !</span>
                )}
                {Array.isArray(comments) && comments.map((comment, index) => (
                    <div key={index} className={styles.commentItem}>
                        <div className={styles.commentUser}>{comment.email}</div>
                        <div className={styles.commentContent}>{comment.content}</div>
                        <div className={styles.commentTime}>{comment.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PodcastDetail;
