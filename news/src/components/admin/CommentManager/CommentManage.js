import React, {useEffect, useState} from "react";
import axios from "axios";
import '../CommentManager/CommentManager.css';
import Swal from "sweetalert2";
import { FaEye } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const CommentManage = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    useEffect(() => {
        if (currentUser?.role != 0) {
            navigate('/unauthorized');
        }
    }, [currentUser, navigate]);

    const [dataComment, setDataComment] = useState([]);

    const [checkFeedBack,setCheckFeedBack] = useState("0");
    const [clickedCPH, setClickedCPH] = useState(true);
    const [clickedDPH, setClickedDPH] = useState(false);


    useEffect(() => {
        if(checkFeedBack == 0){
            fetchDataCPH();
        }else{
            fetchDataDPH();
        }
    }, []);
    const fetchDataCPH = async () => {
        // Gọi API để lấy dữ liệu
        axios.get('https://localhost:7125/api/Comment/manager')
            .then(response => {
                setDataComment(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }
    const fetchDataDPH = async () => {
        // Gọi API để lấy dữ liệu
        axios.get('https://localhost:7125/api/Comment/manager')
            .then(response => {
                setDataComment(response.data);
                setDataComment.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }
    const CPH = () => {
        setCheckFeedBack(0);
        setClickedCPH(true);
        setClickedDPH(false);
        fetchDataCPH();

    }
    const DPH = () => {
        setCheckFeedBack(1);
        setClickedDPH(true);
        setClickedCPH(false);
        fetchDataDPH();
    }
    return (
        <div className="table-container">
            <h2 className="table-title" style={{fontWeight: "bold"}}>Quản lý bình luận</h2>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>ID Blog</th>
                    <th>Tên Blog</th>
                    <th>Số lượng bình luận</th>
                    <th>Bị ẩn</th>
                    <th>Trạng thái kiểm duyệt</th>
                    <th>Lượt thích</th>
                </tr>
                </thead>
                <tbody>
                {dataComment.map(item => (
                    <tr key={item.blogId}>
                        <td>{item.blogId}</td>
                        <td><a href={`http://localhost:3000/detail/chuyen-nhuong-mu-dang-dam-phan-them-1-hau-ve-va-2-tien-ve-2310386.html`}
                               target="_blank"
                               rel="noopener noreferrer">
                            {item.blogTitle}
                            <FiExternalLink color="#3FA2F6"/>
                        </a></td>
                        <td>{item.totalComment}</td>
                        <td>
                            {item.removeComment}


                        </td>
                        <td>{
                            item.pendingComment === 0 ? (

                                <FaCheckCircle className="success-pending"/>


                            ) : (
                                <span className="pending-comment">{item.pendingComment} <IoIosAlert/></span>
                            )
                        }</td>
                        <td>
                          10
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    )
}
export default CommentManage;