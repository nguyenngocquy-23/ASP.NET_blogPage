import "./AdminHome.css";
import {Link, Outlet, useNavigate} from "react-router-dom";
import { TfiWrite } from "react-icons/tfi";
import { MdContactMail, MdDashboard } from "react-icons/md";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../../reduxStore/Store";
import {FaUserCog} from "react-icons/fa";

const AdminHome = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [clickDashBoard, setClickDashBoard] = useState(true);
  const [clickBlog, setClickBlog] = useState(false);
  const [clickContact, setClickContact] = useState(false);
  const [clickUsers, setClickUsers] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentUser?.role != 0) {
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  const handlerDashboard = () => {
    setClickDashBoard(true);
    setClickContact(false);
    setClickBlog(false);
    setClickUsers(false);
  };
  const handlerBlog = () => {
    setClickDashBoard(false);
    setClickContact(false);
    setClickBlog(true);
    setClickUsers(false);
  };
  const handlerContact = () => {
    setClickDashBoard(false);
    setClickContact(true);
    setClickBlog(false);
    setClickUsers(false);
  };
  const handlerUsers = () => {
    setClickDashBoard(false);
    setClickContact(false);
    setClickBlog(false);
    setClickUsers(true);
  }
  return (
    <div className="container">
      <div className="sidebar">
        <a href={"/"}>
          <h2>Blog Website</h2>
        </a>
        <div className="solid"></div>
        <ul>
          <li onClick={() => handlerDashboard()}>
            <Link to="/admin" className={clickDashBoard ? "Click" : ""}>
              <MdDashboard/> Dashboard
            </Link>
          </li>
          <li onClick={() => handlerBlog()}>
            <Link to="/admin/blogs" className={clickBlog ? "Click" : ""}>
              <TfiWrite/> Quản Lý Bài Blog
            </Link>
          </li>
          <li onClick={() => handlerContact()}>
            <Link
                to="/admin/ContactManager"
                className={clickContact ? "Click" : ""}
            >
              <MdContactMail/> Quản Lý Liên Hệ
            </Link>
          </li>
          <li onClick={() => handlerUsers()}><Link to="/admin/users"
                                                   className={clickUsers ? "Click" : ""}><FaUserCog/> Quản Lý Tài Khoản</Link>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <div className="navbar">
          <h1>
            Welcome to Admin {currentUser.fullName}
            <a href={"/login"}>
              Đăng Xuất
            </a>
          </h1>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
