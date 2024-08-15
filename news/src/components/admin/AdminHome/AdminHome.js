import './AdminHome.css';
import { Link, Outlet } from 'react-router-dom';
import {IoIosHome} from "react-icons/io";
import {TfiWrite} from "react-icons/tfi";
import {MdContactMail, MdDashboard} from "react-icons/md";
import {useEffect, useState} from "react";
import axios from "axios";

const AdminHome = () => {
    const [userAdmin , setUserAdmin] = useState('');
    const [clickDashBoard,setClickDashBoard] = useState(true);
    const [clickBlog,setClickBlog] = useState(false);
    const [clickContact,setClickContact] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
                    try {
                        const response = axios.get('https://localhost:7125/User/testToken')
                        if(response.data.role === 1){
                            setUserAdmin(response.data.username);
                            console.log(response.data.username)
                        }
                    }catch (error){
                        console.error('Error fetch data: ' + error);
                    }
                }
        fetchData();
    },[])

    const handlerDashboard = () => {
        setClickDashBoard(true);
        setClickContact(false);
        setClickBlog(false);
    }
    const handlerBlog = () => {
        setClickDashBoard(false);
        setClickContact(false);
        setClickBlog(true);
    }
    const handlerContact = () => {
        setClickDashBoard(false);
        setClickContact(true);
        setClickBlog(false);
    }
    return (
        <div className="container">
            <div className="sidebar">
                <a href={"/"}><h2 style = {{color: "#008eff"}}>Blog Website</h2></a>
                <div className= "solid"></div>
                <ul>
                    <li onClick={() => handlerDashboard()}><Link to="/admin" className={clickDashBoard ? "Click" : ""}><MdDashboard /> Dashboard</Link></li>
                    <li onClick={() => handlerBlog()}><Link to="/admin/blogs" className={clickBlog ? "Click" : ""}><TfiWrite/>  Quản Lý Bài Blog</Link></li>
                    <li onClick={() => handlerContact()}><Link to="/admin/ContactManager" className={clickContact ? "Click" : ""}><MdContactMail/>  Quản Lý Liên Hệ</Link></li>
                </ul>
            </div>
            <div className="main-content">
                <div className="navbar">
                    <h1>Welcome to Admin Blog</h1>
                    {userAdmin != '' ? <p>{userAdmin}</p> : <a href={"/login"} style={{color: "white"}}>Đăng Nhập</a>
                    }
                </div>
                <div className="content">
                <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
