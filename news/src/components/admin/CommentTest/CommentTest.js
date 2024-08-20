import React, {useEffect, useState} from "react";
import axios from "axios";
import './CommentStyle.css';
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {FiExternalLink } from "react-icons/fi";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";


const CommentTest = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    useEffect(() => {
        if (currentUser?.role != 0) {
            navigate('/unauthorized');
        }
    }, [currentUser, navigate]);

    const [dataComment, setDataComment] = useState([]);
    const [email,setEmail] = useState("");
    const [message,setMessage] = useState("");
    const [loading, setLoading] = useState(true);






    useEffect(() => {
            const fetchCommentData = async () => {

                axios.get('https://localhost:7125/api/Comment/manager')
                    .then(response => {
                        setDataComment(response.data);
                        setDataComment.log(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching data: ', error);
                    });
            };
            fetchCommentData();
        }
        , []);

    //  Internally, customStyles will deep merges your customStyles with the default styling.
    const customStyles = {

        headCells: {
            style: {
                backgroundColor: '#1edfb8',
                color: '#fff',
            },
        },

    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Số hàng trên trang',
        rangeSeparatorText: 'của',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tất cả',
    };
    const CustomTitle = ({ row }) => (
        <Link to={`http://localhost:3000/detail/${row.blogId}`}>
            {row.blogTitle}
            <FiExternalLink color="#3FA2F6" style={{ marginLeft: '5px' }} />
        </Link>
    );

    const CustomPending = ({row}) => (
        <div>
            {row === 0 ? (
                <FaCheckCircle className="success-pending" />
            ) : (
                <span className="pending-comment">
                    {row} <IoIosAlert />
                </span>
            )}
        </div>

    );

    const columns = [
        {
            name: 'Id Blog',
            selector: row => row.blogId,
            sortable: true,
            maxWidth: '40px',
            center: true,
        },
        {
            name: 'Tên Blog',
            selector: row => row.blogTitle,
            sortable: true,
            wrap: true,
            cursor: 'pointer',
            cell: row => <CustomTitle row={row} />,
        },
        {
            name: 'Số lượng bình luận',
            selector: row => row.totalComment,
            sortable: true,
            center: true,
        },
        {
            name: 'Bị ẩn',
            selector: row => row.removeComment,
            sortable: false,
            maxWidth: '40px',
            center: true,
        },
        {
            name: 'Trạng thái kiểm duyệt',
            selector: row => row.pendingComment,
            sortable: true,
            cell: row => <CustomPending row={row.pendingComment} />,
            center: true,
        },
        {
            name: 'Lượt thích bài viết',
            selector: row => row.numLike,
            sortable: true,
            center: true,
        }
    ];
    return (
        <div className="table-container">

            <h2 className="table-title" style={{fontWeight: "bold"}}>Quản lý bình luận 1</h2>

            <div className="dataTable">
                <DataTable
                    columns={columns}
                    data={dataComment}
                    pagination
                    highlightOnHover
                    noDataComponent={<div>Không có dữ liệu</div>}
                    customStyles = {customStyles}
                    paginationComponentOptions={paginationComponentOptions}
                />
            </div>
        </div>
    )
}
export default CommentTest;