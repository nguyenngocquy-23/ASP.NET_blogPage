import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../manageInfo/ManaInfo.module.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

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
      const response = await axios.get(
        "https://localhost:7125/User/testToken",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response.data);
      setFormData({
        ...formData,
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        phoneNumber: response.data.phoneNumber || "",
        currentPassword: response.data.password || "",
      });
      setUserInfo(response.data);
    };
    fetchUserData();
  }, []);

  const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("in form:" + formData.currentPassword);
    console.log("in db:" + userInfo.password);
    const fetchPassword = async () => {
      const response = await axios.post("https://localhost:7125/User/checkPass?userId="+userInfo.id+"&input="+formData.currentPassword)
      if (response.data == false) {
        alert("password wrong!");
        return;
      }
    };
    fetchPassword();
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
      await axios.post("https://localhost:7125/User/updateInf?userId="+userInfo.id+"&fullName="+formData.fullName+"&email="+formData.email+"&phoneNumber="+formData.phoneNumber);

      Swal.fire({
        icon:"success",
        title:"Thay đổi thông tin thành công!",
        toast:true,
        showConfirmButton:false,
        position:"center",
        timer:2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
    } catch (error) {
      console.error("Failed to update user", error);
      Swal.fire({
        icon: "warning",
        title: "Cập nhật thất bại!",
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
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Tạo URL với tham số query string
      const url = `https://localhost:7125/User/updatePass?id=`+userInfo.id+`&newPassword=${formData.newPassword}`;

      // Gọi API
      await axios.post(url);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      Swal.fire({
        icon: "success",
        title: "Đổi mật khẩu thành công!",
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
    } catch (error) {
      console.error("Failed to change password", error);
      Swal.fire({
        icon: "warning",
        title: "Đổi mật khẩu thất bại!",
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
              <h1 className={styles.contactInfo__headTitle}>Đổi mật khẩu</h1>
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
