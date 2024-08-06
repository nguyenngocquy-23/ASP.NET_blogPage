import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "../blogDetail/BlogDetail.module.css";
import { useParams } from "react-router-dom";
import { url } from "inspector";

const BlogForm: React.FC = () => {
  const { blogId } = useParams<{ blogId?: string }>();
  const [title, setTitle] = useState("");
  const [auth, setAuth] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [shortDescError, setShortDescError] = useState("");

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
        } catch (error) {
          console.error("Failed to fetch blog details", error);
        }
      };

      fetchBlogDetails();
    }
  }, [blogId]);

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
        }

        const blogData = {
          auth: "quy",
          title,
          image: imageUrl,
          shortDescription,
          content,
          categoryId,
          status: 1,
          numLike: 0,
          createAt: new Date().toISOString(),
        };
        console.log("blogData:", JSON.stringify(blogData, null, 2));

        await axios.post(
          "https://localhost:7125/AdminBlog/createBlog",
          blogData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
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
            <option value="0">Tin nổi bật</option>
            <option value="1">Thể thao</option>
            <option value="2">Phòng ban</option>
            <option value="3">Nhân sự</option>
            <option value="4">Qui định</option>
            <option value="5">Chính sách</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Hình ảnh</label>
          <input
            type="file"
            className={styles.formControl}
            id="image"
            accept=".jpg, .jpeg, .png, .gif, .svg"
            onChange={handleImageChange}
          />
          {/* {image && (
            <div>
              <img src={URL.createObjectURL(image)} alt="Selected" />
            </div>
          )} */}
          {/* {(imageUrl || image) && (
            <div>
              <img
                src={imageUrl || URL.createObjectURL(image!)}
                alt="Selected"
              />
            </div>
          )} */}
          {(imageUrl || image) && (
            <div>
              <img
                src={imageUrl || URL.createObjectURL(image!)}
                alt="Selected"
                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
              />
            </div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="shortDescription">Mô tả ngắn</label>
          <textarea
            style={{ height: "100px" }}
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
          <textarea
            style={{ height: "100px" }}
            className={styles.formControl}
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
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
