import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../detail/Detail.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/Store";
import { FaRegMessage, FaVolumeHigh, FaVolumeOff } from "react-icons/fa6";
import { addReadArticle } from "../reduxStore/UserSlice";
import podStyles from "./Podcast.module.css";
import Swal from "sweetalert2";
import CommentList from "../detail/comment/CommentList";
import { getUserFromToken, User } from "../utils/UserUtils";
import {FaRegThumbsUp, FaThumbsUp, FaThumbtack, FaUser} from "react-icons/fa";
import {FiExternalLink} from "react-icons/fi";
import {formatDate} from "../utils/dateUtils";

interface Blog {
  id: string;
  authId: string;
  authName: string;
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
  const [isLike, setIsLike] = useState(false);
  const [nameCategory, setNameCategory] = useState<string>("");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogRelate, setBlogRelate] = useState<BlogRelate[]>([]);
  const [commentContent, setCommentContent] = useState<string>(""); // State để lưu nội dung bình luận
  const dispatch = useDispatch();
  const [numLike, setNumLike] = useState(0);
  // const [authName, setAuthName] = useState("");
  const [hasBeenDispatched, setHasBeenDispatched] = useState(false);

  const [isGetData, setIsGetData] = useState(false)
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
      const getBlogById = await axios.post(
        `https://localhost:7125/Blog/getBlogById?id=${id}`
      );
      if (getBlogById.data[0]) {
        let blogData = getBlogById.data[0];
        
        const getUserForAuthName = await axios.get(
          `https://localhost:7125/auth/${blogData.authId}`
        );
        
        blogData.authName = getUserForAuthName.data;
        
        setBlog(blogData);
      }
    } catch (error) {
      console.error("Detail Error: ", error);
    }
  }


  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handleLikeByUser = async (isLike: boolean) => {
    if (currentUser && currentUser.id != undefined) {
      if (isLike) {
        const response = await axios.post(
          `https://localhost:7125/Like/delete?idUser=${currentUser.id}&idBlog=${blog?.id}`
        );
        if (response.data) {
          Swal.fire({
            icon: "success",
            title: "Đã bỏ thích bài viết thành công",
            toast: true,
            position: "bottom-left",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
          setIsLike(false);
          setNumLike(numLike - 1);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Lỗi",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        }
      } else {
        const response = await axios.post(
          `https://localhost:7125/Like/add?idUser=${currentUser.id}&idBlog=${blog?.id}`
        );
        if (response.data) {
          Swal.fire({
            icon: "success",
            title: "Đã thích bài viết thành công",
            toast: true,
            position: "bottom-left",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          setIsLike(true);
          setNumLike(numLike + 1);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Lỗi",
            toast: true,
            position: "bottom-left",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        }
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập để thích",
        toast: true,
        position: "bottom-left",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  useEffect(() => {
    fetch();
    setIsGetData(false);
  }, [id]);


  useEffect( () => {
    const fetchData = async () => {
      if (blog && blog?.id && !isGetData) {
        try {
          const getCategoryById = await axios.post(`https://localhost:7125/CategoryCotroller/category/${blog?.categoryId}`);
          setNameCategory(getCategoryById.data);

          const getNumLikeBlog = await axios.post(`https://localhost:7125/Like/countLike?idBlog=${blog?.id}`);
          setNumLike(getNumLikeBlog.data);

          const getBlogRelate = await axios.post(`https://localhost:7125/Blog/getBlogRelate?categoryId=${blog?.categoryId}&blogId=${blog?.id}`);
          setBlogRelate(getBlogRelate.data);
          if(currentUser && currentUser.id != undefined) {
            const getIsLike = await axios.post(`https://localhost:7125/Like/isLike?idUser=${currentUser?.id}&idBlog=${blog?.id}`);
            setIsLike(getIsLike.data);
          }

          setIsGetData(true);
        } catch (error) {
          console.error("Fetch data error: ", error);
        }
      }
      }

    fetchData();
  }, [blog, id, currentUser]);


  useEffect(() => {
    if (blog && !hasBeenDispatched) {
      dispatch(
        addReadArticle({
          id: blog.id,
          img: blog.image,
          title: blog.title,
          shortDescription: blog.shortDescription,
        })
      );
      setHasBeenDispatched(true);
    }
  }, [blog, dispatch]);

  const navigate = useNavigate();
  const handleClick = (url: any, id: any, name: any) => {
    navigate(`/${url}?page=1`, { state: { id: id, name: name } });
  };

  //*** Dành cho admin - Kiểm duyệt các bình luận !.
  const approveComment = async () => {
    const result = await Swal.fire({
      title: "Kiểm duyệt toàn bộ bình luận?",
      text: "Hành động này sẽ duyệt tất cả bình luận chờ duyệt!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đúng, duyệt tất cả!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        // Gửi yêu cầu PUT đến API để duyệt tất cả bình luận
        const response = await axios.put(
          `https://localhost:7125/api/Comment/reviews/${blog?.id}`
        );

        await Swal.fire({
          icon: "success",
          title: "Duyệt tất cả bài viết thành công !",
          toast: true,
          position: "bottom-left",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });


      } catch (error) {
        await Swal.fire({
          icon: "warning",
          title: "Lỗi khi duyệt bình luận",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      {isGetData ? (
          <>
            <div className={styles.subContainer}>
              <div className={styles.breadCrumbDetail}>
                <ul>
                  <li>
                    <a
                        style={{
                          cursor: "pointer",
                          fontSize: "30px"
                        }}
                        onClick={() =>
                            handleClick(convertToSlug(nameCategory), blog?.categoryId, nameCategory)}>
                      {nameCategory}
                    </a>
                  </li>
                </ul>
                <div className="bread-crumb-detail__time">{blog?formatDate(blog?.createdAt):""}</div>
              </div>
              <div className={styles.audioControls}>
                <div className={styles.inforAuth}>
                  Tác giả:<Link to={`/profile/${blog?.authId}`} className={styles.detailAuth} style={{
                  marginLeft: "8px",
                  fontWeight: "bold",
                  color: "blue",
                  cursor: "pointer",
                  marginRight: "100px"
                }} > {blog?.authName}</Link>
                  <p>lượt thích: {numLike}</p>
                </div>
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
                <div className={styles.imgDetail}>
                  <img src={blog?.image} alt=""/>
                </div>
                <div
                    className={styles.maincontent}
                    id="maincontent"
                    dangerouslySetInnerHTML={{__html: blog?.content || ""}}
                ></div>
              </div>
              <div className={styles.like}>
                <p onClick={() => handleLikeByUser(isLike)}
                   style={{
                     cursor: "pointer",
                     color: "blue",
                     display: "inline-block",
                     margin: 'auto',
                     fontSize: '100px',
                     marginTop: '20px'
                   }}
                >{isLike ?
                    <FaThumbsUp title="Bỏ thích"/>
                    : <FaRegThumbsUp title="Thích"/>}</p>
              </div>
            </div>
            {/*Mục liên quan*/}
            <div className="vnn-news-ai-suggest horizontal-box-wrapper sticky top-65 pb-15">
              <h2 className={styles.horizontalHeading}>CÓ THỂ BẠN QUAN TÂM</h2>
              <div>
                {blogRelate.map((item, index) => (
                    <div className={styles.horizontalItem} key={index}>
                      <div className={styles.horizontalImage}>
                        <img src={item.image || "Loading..."} alt={item.title}/>
                      </div>
                      <div className={styles.horizontalTitle}>
                        <h3>
                          <Link to={"/detail/" + item.id} title={item.title}>
                            {item.title}
                          </Link>
                        </h3>
                      </div>
                    </div>
                ))}
              </div>
            </div>
            {/*Bình luận*/}

            <div className={styles.comments}>
              <span className={styles.title}>Bình luận</span>
              {currentUser !== null && currentUser.role === 0 && (
                  <button
                      className="comment-form-button checked-comment"
                      onClick={approveComment}
                  >
                    Kiểm duyệt toàn bộ bình luận!
                  </button>
              )}


        <br />
        { currentUser.id != undefined && currentUser !== null && blog !==null ? (
            <CommentList currentUser={currentUser} blogId={parseInt(blog.id, 10)} />
        ) : (
            <span className={styles.noMess}>

                        <FaRegMessage/>
                        <Link to={'/login'}> Đăng nhập </Link>
                        để tiến hành bình luận !</span>
              )
              }
            </div>
          </>
      ) : <></>}
    </div>
  );
};

export default Detail;