import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "../blogDetail/BlogDetail.module.css";
import {Link, useNavigate, useParams} from "react-router-dom";
import { url } from "inspector";
import { data } from "cheerio/lib/api/attributes";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {FaArrowCircleLeft, FaPlus} from "react-icons/fa";
import {MdCancel} from "react-icons/md";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reduxStore/Store";

interface Category{
    id : number;
    name : string;
}
const BlogForm: React.FC = () => {
    const { blogId } = useParams<{ blogId?: string }>();
    const [title, setTitle] = useState("");
    const [auth, setAuth] = useState("");
    const [listCategory, setListCategory] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [shortDescription, setShortDescription] = useState("");
    const [content, setContent] = useState("");
    const [contentError, setContentError] = useState("");
    const [shortDescError, setShortDescError] = useState("");

    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const dispatch = useDispatch();


    useEffect(() => {
        if (currentUser?.role != 0) {
            navigate('/unauthorized');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const fetchAndConvertImage = async () => {
            try {
                if (imageUrl) {
                    const response = await fetch(imageUrl);
                    if (!response.ok) throw new Error("Network response was not ok");

                    // Chuyển đổi dữ liệu thành Blob
                    const blob = await response.blob();

                    // Tạo đối tượng File từ Blob
                    const file = new File([blob], "image.jpg", { type: blob.type });
                    setImage(file);
                }
            } catch (error) {
                console.error("Error fetching or converting image:", error);
            }
        };

        fetchAndConvertImage();
    }, [imageUrl]);

    useEffect(() => {
        if (blogId) {
            const fetchBlogDetails = async () => {
                try {
                    const { data } = await axios.get(
                        `https://localhost:7125/AdminBlog/${blogId}`
                    );
                    setTitle(data.title);
                    setAuth(data.auth);
                    setCategoryId(data.categoryId);
                    setShortDescription(data.shortDescription);
                    setContent(data.content);
                    if (data.image) {
                        setImageUrl(data.image); // Set the URL for the existing image
                    }
                    console.log("image: " + data.image);
                } catch (error) {
                    console.error("Failed to fetch blog details", error);
                }
            };

            fetchBlogDetails();
        }
    }, [blogId]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post('https://localhost:7125/CategoryCotroller/category');
                setListCategory(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0])); // Create a URL for the selected image
        }
    };

    // submit form create
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (content.length === 0) {
            setContentError("Nội dung không được để trống.");
        } else {
            setContentError("");
        }

        if (shortDescription.length === 0) {
            setShortDescError("Mô tả ngắn không được để trống.");
        } else {
            setShortDescError("");
        }

        if (content.length > 0 && shortDescription.length > 0) {
            try {
                let imageUrl = "";
                console.log("image : " + image?.text);
                if (image) {
                    console.log("image x1 : " + image.text);
                    const { data } = await axios.get(
                        "https://localhost:7125/AdminBlog/generatePresignedUrl"
                    );
                    const { url, objectName } = data;
                    console.log("dataa : " + url);

                    const uploadResponse = await axios.put(url, image, {
                        headers: {
                            "Content-Type": image.type,
                        },
                    });
                    console.log("uploadResponse.status : " + uploadResponse.status);
                    if (uploadResponse.status === 200) {
                        imageUrl = `https://storage.googleapis.com/webblog-6eee4.appspot.com/${objectName}`;
                    } else {
                        console.error("Failed to upload image");
                    }
                } else if (imageUrl) {
                    imageUrl = imageUrl; // Use existing image URL if no new image is uploaded
                }

                const blogData = {
                    auth: auth,
                    title,
                    image: imageUrl,
                    shortDescription,
                    content,
                    categoryId,
                    status: 1,
                    numLike: 0,
                    createAt: new Date().toISOString(),
                };

                if (blogId) {
                    // Update existing blog
                    const blogUpdate = {
                        id: blogId,
                        auth: auth,
                        title,
                        image: imageUrl,
                        shortDescription,
                        content,
                        categoryId,
                        status: 1,
                    };
                    await axios.post(
                        `https://localhost:7125/AdminBlog/updateBlog`,
                        blogUpdate,
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    console.log("blogData:", JSON.stringify(blogUpdate, null, 2));
                } else {
                    await axios.post(
                        "https://localhost:7125/AdminBlog/createBlog",
                        blogData,
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    console.log("blogData:", JSON.stringify(blogData, null, 2));
                }

                Swal.fire({
                    icon: "success",
                    title: "Đã lưu thành công",
                    toast: true,
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
                setTimeout(() => {
                    window.location.href = "/admin/blogs";
                }, 600);
            } catch (error) {
                Swal.fire({
                    icon: "warning",
                    title: "Lưu thất bại!",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
            }
        }
    };
    return (
        <div className={styles.container}>
        <Link
            to={"/admin/blogs"}
    className={styles.addIcon}
    style={{float: "left", fontWeight: "bold",fontSize: "25px", border: "none", margin: "0", padding: "0"}}
    title="Quay lại"
        >
        <FaArrowCircleLeft/>
        </Link>
        <h2>Chi tiết bài viết</h2>

    <form onSubmit={handleSubmit}>
    <div className={styles.formGroup}>
    <label htmlFor="title">Tiêu đề</label>
    <input
    type="text"
    className={styles.formControl}
    id="title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    />
    </div>
    <div className={styles.formGroup}>
    <label htmlFor="category">Thể loại</label>
    <select
    className={styles.formControl}
    id="category"
    name="category"
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    required
    >
    <option value="">Chọn thể loại</option>
    {listCategory?.map(item => (
        <option key={item.id} value={item.id}>{item.name}</option>
    ))}
    </select>
    </div>
    <div className={styles.formGroup}>
    <label htmlFor="image">Hình ảnh</label>
    <input
    type="file"
    className={styles.formControl}
    id="image"
    style={{background: "white"}}
    accept=".jpg, .jpeg, .png, .gif, .svg"
    onChange={handleImageChange}
    />
    {(imageUrl || image) && (
        <div>
            <img
                src={imageUrl || URL.createObjectURL(image!)}
        alt="Selected"
        style={{
        maxWidth: "100%",
            maxHeight: "200px",
            marginTop: "10px",
    }}
        />
        </div>
    )}
    </div>
    <div className={styles.formGroup}>
    <label htmlFor="shortDescription">Mô tả ngắn</label>
    <textarea
    style={{height: "100px"}}
    className={styles.formControl}
    id="shortDescription"
    rows={8}
    value={shortDescription}
    onChange={(e) => setShortDescription(e.target.value)}
    required
    />
    {shortDescError && (
        <label className={styles.errorInput}>{shortDescError}</label>
    )}
    </div>
    <div className={styles.formGroup}>
    <label htmlFor="content">Nội dung</label>
    {/* <textarea
            style={{ height: "100px" }}
            className={styles.formControl}
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          /> */}
    <CKEditor
        editor={ClassicEditor}
    data={content}
    onChange={(event, editor) => {
        const data = editor.getData();
        setContent(data);
    }}
    config={{
        ckfinder: {
            uploadUrl: "https://your-upload-url",
        },
        toolbar: [
            'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'imageUpload'
        ],
            image: {
            toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
        }
    }}
    />
    {contentError && (
        <label className={styles.errorInput}>{contentError}</label>
    )}
    </div>
    <div className={"${styles.formGroup} ${styles.mt3}"}>
    <button type="submit" className={styles.buttonSubmit}>
        Lưu
        </button>
        </div>
        </form>
        </div>
);
};

export default BlogForm;