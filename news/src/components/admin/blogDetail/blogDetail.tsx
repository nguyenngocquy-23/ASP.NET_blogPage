import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const BlogForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState('');
  const [shortDescError, setShortDescError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.length === 0) {
      setContentError('Nội dung không được để trống.');
    } else {
      setContentError('');
    }

    if (shortDescription.length === 0) {
      setShortDescError('Mô tả ngắn không được để trống.');
    } else {
      setShortDescError('');
    }

    if (content.length > 0 && shortDescription.length > 0) {
      const formData = new FormData();
      formData.append('title', title);
      if (image) formData.append('image', image);
      formData.append('shortDescription', shortDescription);
      formData.append('content', content);

      try {
        await axios.post('/admin/blog-detail', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire({
          icon: 'success',
          title: 'Đã lưu thành công',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        setTimeout(() => {
          window.location.href = '/admin/blogs';
        }, 600);
      } catch (error) {
        Swal.fire({
          icon: 'warning',
          title: 'Lưu thất bại!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
      }
    }
  };

  return (
    <div className="container">
      <h2>Quản lý bài viết</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="image">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
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
        <div className="form-group mt-3">
          <label htmlFor="shortDescription">Mô tả ngắn</label>
          <textarea
            className="form-control"
            id="shortDescription"
            rows={8}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
          {shortDescError && <label className="error-input">{shortDescError}</label>}
        </div>
        <div className="form-group mt-3">
          <label htmlFor="content">Nội dung</label>
          <textarea
            className="form-control"
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {contentError && <label className="error-input">{contentError}</label>}
        </div>
        <div className="form-group mt-3">
          <button type="submit" className="btn btn-success">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
