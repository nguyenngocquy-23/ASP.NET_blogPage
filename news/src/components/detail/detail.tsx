
    // export default Detail;
    import React, {useEffect, useState} from 'react';
    import axios from 'axios';
    import styles from '../detail/Detail.module.css';
    import {Link, useParams} from 'react-router-dom';
    import {useDispatch, useSelector} from 'react-redux';
    import {RootState} from '../reduxStore/Store';
    import {FaRegMessage, FaVolumeHigh, FaVolumeOff} from 'react-icons/fa6';
    import {addReadArticle} from "../reduxStore/UserSlice";
    import podStyles from "./Podcast.module.css";
    import Swal from "sweetalert2"
    import CommentList from '../detail/comment/CommentList'
    import {getUserFromToken, User} from "../utils/UserUtils";


    // Định nghĩa interface cho chi tiết bài viết
    interface Blog {
        id:string;
        auth:string;
        categoryId:string;
        title:string;
        image:string;
        content:string;
        updateAt:string;
        status:string;
        numLike:string;
        shortDescription:string
    }

    interface BlogRelate {
        id:string;
        title: string;
        image: string;
    }

    const Detail: React.FC = () => {
        const {id} = useParams<{ id: string }>();
        const [blog, setBlog] = useState<Blog |null>(null);
        const [blogRelate, setBlogRelate] = useState<BlogRelate[]>([]);
        const [commentContent, setCommentContent] = useState<string>(''); // State để lưu nội dung bình luận
        const dispatch = useDispatch();


        // Dành cho việc lấy user từ token.
        const [currentUser, setCurrentUser] = useState<User| null>(null);

        useEffect(() => {
            const fetchUser = async () => {
                const userData = await getUserFromToken();
                setCurrentUser(userData);

            };
            fetchUser();
        }, []);

        // const comments = useSelector((state: RootState) =>
        //     state.user.comments.filter((comment) => comment.link === link)
        // ); // Lọc bình luận theo link của bài viết hiện tại
        function convertToSlug(text: string) {
            // Chuyển đổi chuỗi thành chữ thường
            let slug = text.toLowerCase();
            // Loại bỏ các ký tự đặc biệt, chỉ giữ lại chữ cái và số
            slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            // Thay thế khoảng trắng bằng dấu gạch ngang
            slug = slug.replace(/\s+/g, '-');

            return slug;
        }

        // hàm chuển đổi chuỗi có các ký tự đặc biệt
        function decodeHTMLEntities(text: string): string {
            const entities: { [key: string]: string } = {
                '&apos;': "'",
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                // Thêm các ký tự HTML entities khác nếu cần
            };

            // Thay thế các ký tự HTML entities cụ thể
            Object.keys(entities).forEach(entity => {
                const regex = new RegExp(entity, 'g');
                text = text.replace(regex, entities[entity]);
            });

            // Sử dụng DOMParser để giải mã các ký tự còn lại
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            return doc.documentElement.textContent || text;
        }

        // function decodeHTMLEntities(text: string) {
        //     const textArea = document.createElement('textarea');
        //     textArea.innerHTML = text;
        //     return textArea.value;
        // }

        const extractLinkPath = (url: string) => {
            const parts = url.split('/');
            return parts[parts.length - 1];
        };
        // Thêm state cho việc đọc văn bản
        const [isReading, setIsReading] = useState(false);

        // Thêm hàm để quản lý việc đọc văn bản
        const synth = window.speechSynthesis;
        const handleReadText = () => {
            if (synth.speaking) {
                synth.cancel();
                setIsReading(false);
                return;
            }
            const textToRead = blog?.content.replace(/<[^>]*>?/gm, '') || '';
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'vi-VN'; // Thiết lập ngôn ngữ tiếng Việt
            utterance.onend = () => {
                setIsReading(false);
            };
            synth.speak(utterance);
            setIsReading(true);
        };
        // Thêm hàm để dừng đọc văn bản
        const handleStopReading = () => {
            if (synth.speaking) {
                synth.cancel();
                setIsReading(false);
            }
        };

        async function fetch() {
            try {
                const getBlogById = await axios.post(`https://localhost:7125/Blog/getBlogById?id=${id}`)
                setBlog(getBlogById.data[0]);

            } catch (error) {
                console.error("Detail Error: ", error)
            }
        }

        async function fetchBlogRelate() {
            try {
                const getBlogRelate = await axios.get(`https://localhost:7125/CategoryCotroller/category?id=${blog?.categoryId}&page=1&limit=5`)
                setBlogRelate(getBlogRelate.data);

            } catch (error) {
                console.error("Detail Error: ", error)
            }
        }

        useEffect(() => {
            fetch();
            {console.log(blog)}
        }, []);

        useEffect(() => {
            if (blog && blog.categoryId) {
                fetchBlogRelate();
            }
        }, [blog]);
        const handleCommentSubmit = () => {
        };


        //*** Dành cho admin - Kiểm duyệt các bình luận !.
        const approveComment = async() => {
            const result = await Swal.fire({
                title: 'Kiểm duyệt toàn bộ bình luận?',
                text: 'Hành động này sẽ duyệt tất cả bình luận chờ duyệt!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đúng, duyệt tất cả!',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                try {
                    // Gửi yêu cầu PUT đến API để duyệt tất cả bình luận
                    const response = await axios.put(`https://localhost:7125/api/Comment/reviews/2`);

                    await Swal.fire({
                        title: 'Duyệt thành công',
                        html: `
                        <p>Đã duyệt tất cả bình luận thành công!</p>
                        <p>Chi tiết xem tại
                        <a href="http://localhost:3000/admin/commentManager"
                         target="_blank"
                         rel="noopener noreferrer"
                         style="color: #3FA2F6; 
                         font-weight: bold;"
                         >
                        Quản lý bình luận</a></p>
                    `,
                        icon: 'success',
                        confirmButtonText: 'Ở lại'
                    });

                } catch (error) {
                    console.error("Lỗi khi duyệt bình luận", error);
                    await Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi duyệt bình luận, vui lòng thử lại',
                        icon: 'error',
                        confirmButtonText: 'Đóng'
                    });
                }
            }
        }

        return (
            <div className={styles.container}>
                <div className={styles.subContainer}>
                    <div className={styles.breadCrumbDetail}>
                        <ul>
                            <li>
                                <a href={'/'}></a>
                            </li>
                        </ul>
                        <div className="bread-crumb-detail__time">{blog?.updateAt}</div>
                    </div>
                            <div className={styles.audioControls}>
                                {isReading ? (
                                    <FaVolumeOff onClick={handleStopReading} className={styles.audioIcon} title={"Dừng nghe"}/>
                                ) : (
                                    <FaVolumeHigh onClick={handleReadText} className={styles.audioIcon} title={"Nghe"}/>
                                )}
                            </div>
                            <div className={styles.contentDetail}>
                                <h1 className={styles.contentDetailTitle}>{blog?.title || 'Loading...'}</h1>
                                <h2 className={styles.contentDetailSapo}>{blog?.shortDescription}</h2>
                                <div className={styles.maincontent} id="maincontent"
                                    dangerouslySetInnerHTML={{__html: blog?.content || ''}}>
                                </div>
                            </div>
                </div>
                {/*Mục liên quan*/}
                <div className="vnn-news-ai-suggest horizontal-box-wrapper sticky top-65 pb-15">
                    <h2 className={styles.horizontalHeading}>CÓ THỂ BẠN QUAN TÂM</h2>
                    <div>
                        {blogRelate.map((item, index) => (
                            <div className={styles.horizontalItem} key={index}>
                                <div className={styles.horizontalImage}><img src={item.image || 'Loading...'}
                                                                             alt={item.title}/></div>
                                <div className={styles.horizontalTitle}><h3><a
                                    href={'/detail/' + item.id}
                                    title={item.title}>{item.title}</a></h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/*Bình luận*/}

                            <div className={styles.comments}>
                                <span className={styles.title}>Bình luận</span>
                                {currentUser !== null && currentUser.role === 0 && (
                                    <button className="comment-form-button checked-comment"
                                            onClick={approveComment}

                                    >Kiểm duyệt toàn bộ bình luận!</button>
                                )}

                                <br/>
                                {currentUser !== null && (
                                    <CommentList currentUser={currentUser} blogId={2}/>

                                )}
                            </div>
                        </div>



        );
    };


    export default Detail;

