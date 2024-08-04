import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../manageInfo/ManaInfo.module.css";
import { Link } from "react-router-dom";

const ManaInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userInfo, setUserInfo] = useState<any>(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://localhost:7125/User/0"); // Thay 0 thành id user hiện tại
        setUserInfo(response.data);
        setFormData({
          ...formData,
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
        });
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(formData.currentPassword);
    if (formData.currentPassword !== "c") {
      alert("password wrong!");
      return;
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("https://localhost:7125/User/updateInf", {
        id: 0, // Đảm bảo có ID người dùng
        username: "quy",
        password: "c", // Cập nhật thuộc tính phù hợp
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: 1, // Cập nhật theo yêu cầu của API
        status: 1, // Cập nhật theo yêu cầu của API
        createdAt: new Date().toISOString(),
      });

      alert("Update successful");
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Update failed...");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.currentPassword !== "c") {
      // get password tu sessionStorage
      alert("Passwords wrong!");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Tạo URL với tham số query string
      const url = `https://localhost:7125/User/updatePass?id=0&newPassword=${formData.newPassword}`;

      // Gọi API
      await axios.post(url);

      alert("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password", error);
      alert("Password change failed");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.container__left}>
          <div>
            <div className={styles.sentForm__head}>
              <h1 className={styles.sentForm__headTitle}>
                THÔNG TIN TÀI KHOẢN
              </h1>
            </div>
            <form className={styles.sentForm__main} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Họ và tên</label>
                <div className={styles.field__input}>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <span className="form-message"></span>
                </div>
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <div className={styles.field__input}>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <span className="form-message"></span>
                </div>
              </div>
              <div className={styles.field}>
                <label>Số điện thoại</label>
                <div className={styles.field__input}>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <span className="form-message"></span>
                </div>
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
              <h2 className={styles.contactInfo__headTitle}>Đổi mật khẩu</h2>
            </div>
            <div className={styles.contactInfo__main}>
              <form
                className={styles.sentForm__main}
                onSubmit={handlePasswordChange}
              >
                <div className={styles.field}>
                  <label>Mật khẩu hiện tại</label>
                  <div className={styles.field__input}>
                    <input
                      type="password"
                      name="currentPassword"
                      onChange={handleChange}
                      onBlur={handleCurrentPassword}
                    />
                    <span className="form-message"></span>
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Mật khẩu mới</label>
                  <div className={styles.field__input}>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <span className="form-message"></span>
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Xác nhận mật khẩu</label>
                  <div className={styles.field__input}>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span className="form-message"></span>
                  </div>
                </div>
                <div className={styles.field}>
                  <button type="submit">Đổi</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManaInfo;
