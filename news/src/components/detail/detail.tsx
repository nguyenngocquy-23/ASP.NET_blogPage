// export default Detail;
import React, { useEffect, useState } from "react";
import axios from "axios";
import cheerio from "cheerio";
import styles from "../detail/Detail.module.css";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/Store";
import { FaRegMessage, FaVolumeHigh, FaVolumeOff } from "react-icons/fa6";
import { addReadArticle } from "../reduxStore/UserSlice";
import podStyles from "./Podcast.module.css";

// Định nghĩa interface cho chi tiết bài viết
interface Blog {
  id: string;
  auth: string;
  categoryId: string;
  title: string;
  image: string;
  content: string;
  createdAt: string;
  status: string;
  numLike: string;
  shortDescription: string;
}

interface BlogRelate {
  id: string;
  title: string;
  image: string;
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogRelate, setBlogRelate] = useState<BlogRelate[]>([]);
  const [commentContent, setCommentContent] = useState<string>(""); // State để lưu nội dung bình luận
  const dispatch = useDispatch();
  const currentUser = null;
  const comments = null;
  // const comments = useSelector((state: RootState) =>
  //     state.user.comments.filter((comment) => comment.link === link)
  // ); // Lọc bình luận theo link của bài viết hiện tại
  function convertToSlug(text: string) {
    // Chuyển đổi chuỗi thành chữ thường
    let slug = text.toLowerCase();
    // Loại bỏ các ký tự đặc biệt, chỉ giữ lại chữ cái và số
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Thay thế khoảng trắng bằng dấu gạch ngang
    slug = slug.replace(/\s+/g, "-");

    return slug;
  }

  // hàm chuển đổi chuỗi có các ký tự đặc biệt
  function decodeHTMLEntities(text: string): string {
    const entities: { [key: string]: string } = {
      "&apos;": "'",
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      // Thêm các ký tự HTML entities khác nếu cần
    };

    // Thay thế các ký tự HTML entities cụ thể
    Object.keys(entities).forEach((entity) => {
      const regex = new RegExp(entity, "g");
      text = text.replace(regex, entities[entity]);
    });

    // Sử dụng DOMParser để giải mã các ký tự còn lại
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    return doc.documentElement.textContent || text;
  }

  // function decodeHTMLEntities(text: string) {
  //     const textArea = document.createElement('textarea');
  //     textArea.innerHTML = text;
  //     return textArea.value;
  // }

  const extractLinkPath = (url: string) => {
    const parts = url.split("/");
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
    const textToRead = blog?.content.replace(/<[^>]*>?/gm, "") || "";
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "vi-VN"; // Thiết lập ngôn ngữ tiếng Việt
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
      console.log(`https://localhost:7125/Blog/getBlogById?id=${id}`)
      const getBlogById = await axios.post(
        `https://localhost:7125/Blog/getBlogById?id=${id}`
      );
      setBlog(getBlogById.data[0]);
    } catch (error) {
      console.error("Detail Error: ", error);
    }
  }

  async function fetchBlogRelate() {
    try {
      const getBlogRelate = await axios.get(
        `https://localhost:7125/CategoryCotroller/category?id=${blog?.categoryId}&page=1&limit=5`
      );
      setBlogRelate(getBlogRelate.data);
    } catch (error) {
      console.error("Detail Error: ", error);
    }
  }

  useEffect(() => {
    fetch();
  }, []);
  
  useEffect(() => {
    if (blog) {
      dispatch(
        addReadArticle({
          id: blog.id,
          img: blog.image,
          title: blog.title,
          content: blog.content,
        })
      );
    }
  }, [blog, dispatch]);

  useEffect(() => {
    if (blog && blog.categoryId) {
      fetchBlogRelate();
    }
  }, [blog]);
  const handleCommentSubmit = () => {};

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.breadCrumbDetail}>
          <ul>
            <li>
              <a href={"/"}></a>
            </li>
          </ul>
          <div className="bread-crumb-detail__time">{blog?.createdAt}</div>
        </div>
        <div className={styles.audioControls}>
          {isReading ? (
            <FaVolumeOff
              onClick={handleStopReading}
              className={styles.audioIcon}
              title={"Dừng nghe"}
            />
          ) : (
            <FaVolumeHigh
              onClick={handleReadText}
              className={styles.audioIcon}
              title={"Nghe"}
            />
          )}
        </div>
        <div className={styles.contentDetail}>
          <h1 className={styles.contentDetailTitle}>
            {blog?.title || "Loading..."}
          </h1>
          <h2 className={styles.contentDetailSapo}>{blog?.shortDescription}</h2>
          <div
            className={styles.maincontent}
            id="maincontent"
            dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
          ></div>
        </div>
      </div>
      {/*Mục liên quan*/}
      <div className="vnn-news-ai-suggest horizontal-box-wrapper sticky top-65 pb-15">
        <h2 className={styles.horizontalHeading}>CÓ THỂ BẠN QUAN TÂM</h2>
        <div>
          {blogRelate.map((item, index) => (
            <div className={styles.horizontalItem} key={index}>
              <div className={styles.horizontalImage}>
                <img src={item.image || "Loading..."} alt={item.title} />
              </div>
              <div className={styles.horizontalTitle}>
                <h3>
                  <a href={"/detail/" + item.id} title={item.title}>
                    {item.title}
                  </a>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/*Bình luận*/}
      <div className={styles.comments}>
        <span className={styles.title}>Bình luận</span>
        <br />
        {currentUser ? (
          <>
            <textarea
              className={styles.inputComment}
              maxLength={500}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder={"Bình luận của bạn..."}
            />
            <br />
            <button className={styles.btnComment} onClick={handleCommentSubmit}>
              Bình luận
            </button>
            <span
              className="comment-bg emptyComment"
              style={{ display: "none" }}
            >
              <img
                src="https://static.vnncdn.net/v1/icon/chat(1).svg"
                alt="comment icon"
              />
            </span>
            <span className="comment-number vnn-comment-count-detail"></span>
          </>
        ) : (
          <span className={styles.noMess}>
            <FaRegMessage />
            <Link to={"/login"}> Đăng nhập </Link>
            để tiến hành bình luận !
          </span>
        )}
        {/* {Array.isArray(comments) && comments.map((comment, index) => (
                        <div key={index} className={styles.commentItem}>
                            <div className={styles.commentUser}>{comment.email}</div>
                            <div className={styles.commentContent}>{comment.content}</div>
                            <div className={styles.commentTime}>{comment.time}</div>
                        </div>
                    ))} */}
      </div>
    </div>
  );
};

export default Detail;
