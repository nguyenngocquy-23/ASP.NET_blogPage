// import React, { useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import styles from "../blogDetail/BlogDetail.module.css";

// const BlogForm: React.FC = () => {
//   const [title, setTitle] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [shortDescription, setShortDescription] = useState("");
//   const [content, setContent] = useState("");
//   const [contentError, setContentError] = useState("");
//   const [shortDescError, setShortDescError] = useState("");

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };
//   async function uploadFile(file: File) {
//     try {
//       // Gọi API để lấy Presigned URL
//       const { data } = await axios.get(
//         "https://localhost:7125/AdminBlog/generatePresignedUrl"
//       );
//       const { Url, ObjectName } = data;

//       // Upload file lên Firebase Storage sử dụng Presigned URL
//       const uploadResponse = await axios.put(Url, file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//       });

//       if (uploadResponse.status === 200) {
//         console.log("File uploaded successfully");
//         const fileUrl = `https://storage.googleapis.com/webblog-6eee4.appspot.com/${ObjectName}`;

//         // Gửi URL của file về server để lưu
//         const saveResponse = await axios.post(
//           "https://localhost:7125/AdminBlog/createBlog",
//           {
//             Url: fileUrl,
//             ObjectName: ObjectName,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (saveResponse.status === 200) {
//           console.log("File URL saved successfully");
//         } else {
//           console.error("Failed to save file URL");
//         }
//       } else {
//         console.error("Failed to upload file");
//       }
//     } catch (error) {
//       console.error("An error occurred:", error);
//     }
//   }

//   // Kiểm tra nếu fileInput không phải là null trước khi thêm sự kiện
//   const fileInput = document.getElementById(
//     "fileInput"
//   ) as HTMLInputElement | null;
//   // dự bị nếu có upload file # image
//   if (fileInput) {
//     fileInput.addEventListener("change", (event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files?.[0]; // Cẩn thận với trường hợp `files` có thể là `undefined`

//       if (file) {
//         uploadFile(file);
//       }
//     });
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (content.length === 0) {
//       setContentError("Nội dung không được để trống.");
//     } else {
//       setContentError("");
//     }

//     if (shortDescription.length === 0) {
//       setShortDescError("Mô tả ngắn không được để trống.");
//     } else {
//       setShortDescError("");
//     }

//     if (content.length > 0 && shortDescription.length > 0) {
//       const formData = new FormData();
//       formData.append("auth", "auth");
//       formData.append("categoryId", "0");
//       formData.append("title", title);
//       if (image) formData.append("image", image);
//       formData.append("shortDescription", shortDescription);
//       formData.append("content", content);
//       formData.append("status", "1");
//       formData.append("numLike", "0");
//       formData.append("createAt", Date.now().toString());

//       Array.from(formData.entries()).forEach(([key, value]) => {
//         console.log(`${key}: ${value}`);
//       });

//       try {
//         await axios.post(
//           "https://localhost:7125/AdminBlog/createBlog",
//           formData,
//           {
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );
//         Swal.fire({
//           icon: "success",
//           title: "Đã lưu thành công",
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 500,
//           timerProgressBar: true,
//           didOpen: (toast) => {
//             toast.onmouseenter = Swal.stopTimer;
//             toast.onmouseleave = Swal.resumeTimer;
//           },
//         });
//         setTimeout(() => {
//           window.location.href = "/admin/blogs";
//         }, 600);
//       } catch (error) {
//         Swal.fire({
//           icon: "warning",
//           title: "Lưu thất bại!",
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 1000,
//           timerProgressBar: true,
//           didOpen: (toast) => {
//             toast.onmouseenter = Swal.stopTimer;
//             toast.onmouseleave = Swal.resumeTimer;
//           },
//         });
//       }
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Quản lý bài viết</h2>
//       <form onSubmit={handleSubmit}>
//         <div className={styles.formGroup}>
//           <label htmlFor="title">Tiêu đề</label>
//           <input
//             type="text"
//             className={styles.formControl}
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="image">Hình ảnh</label>
//           <input
//             type="file"
//             className={styles.formControl}
//             id="image"
//             accept=".jpg, .jpeg, .png, .gif, .svg"
//             onChange={handleImageChange}
//           />
//           {image && (
//             <div>
//               <img src={URL.createObjectURL(image)} alt="Selected" />
//             </div>
//           )}
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="shortDescription">Mô tả ngắn</label>
//           <textarea
//             style={{ height: "100px" }}
//             className={styles.formControl}
//             id="shortDescription"
//             rows={8}
//             value={shortDescription}
//             onChange={(e) => setShortDescription(e.target.value)}
//             required
//           />
//           {shortDescError && (
//             <label className="error-input">{shortDescError}</label>
//           )}
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="content">Nội dung</label>
//           <textarea
//             style={{ height: "100px" }}
//             className={styles.formControl}
//             id="content"
//             rows={8}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             required
//           />
//           {contentError && (
//             <label className={styles.errorInput}>{contentError}</label>
//           )}
//         </div>
//         <div className={"${styles.formGroup} ${styles.mt3}"}>
//           <button type="submit" className={styles.buttonSubmit}>
//             Lưu
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BlogForm;
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "../blogDetail/BlogDetail.module.css";

const BlogForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [auth, setAuth] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [shortDescError, setShortDescError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

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
          console.log("dataa : " + url );

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
          auth:"quy",
          title,
          image: imageUrl,
          shortDescription,
          content,
          categoryId: 0,
          status: 1,
          numLike: 0,
          createAt: new Date().toISOString(),
        };
        console.log('blogData:', JSON.stringify(blogData, null, 2));

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
          position: "top-end",
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
      <h2>Quản lý bài viết</h2>
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
          <label htmlFor="image">Hình ảnh</label>
          <input
            type="file"
            className={styles.formControl}
            id="image"
            accept=".jpg, .jpeg, .png, .gif, .svg"
            onChange={handleImageChange}
          />
          {image && (
            <div>
              <img src={URL.createObjectURL(image)} alt="Selected" />
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
