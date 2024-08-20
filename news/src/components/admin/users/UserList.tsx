import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import styles from './userList.module.css';
import {FaLock, FaUnlock} from "react-icons/fa";
import DataTable from 'react-data-table-component';
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reduxStore/Store";

interface User {
    id: number;
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string;
    status: number;
}

function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const dispatch = useDispatch();
    useEffect(() => {
        if (currentUser?.role != 0) {
            navigate("/unauthorized");
        }else{
            fetchUsers();
        }
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        console.log('dang fetch')
        try {
            console.log("dang lay api")
            const response = await axios.get(`https://localhost:7125/User/getAll`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setUsers(response.data);
            console.log(response.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = typeof err.response?.data === 'string' ? err.response.data : 'Không thể lấy danh sách user. Vui lòng thử lại sau';
                setError(errorMsg);
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleLockStatus = async (userId: number, isLock: boolean) => {
        setLoading(true);
        try {
            await axios.put(`https://localhost:7125/User/toggleLockStatus/${userId}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (isLock)
                Swal.fire({
                    title: "Đã khóa tài khoản!",
                    icon: "success"
                });
            else
                Swal.fire({
                    title: "Đã mở tài khoản!",
                    icon: "success"
                });
            fetchUsers();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = typeof err.response?.data === 'string' ? err.response.data : 'Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại sau';
                setError(errorMsg);
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            name: 'ID',
            selector: (row: User) => row.id,
            sortable: true,
        },
        {
            name: 'Tên Tài Khoản',
            selector: (row: User) => row.fullName,
            sortable: true,
        },
        {
            name: 'Tên Đăng Nhập',
            selector: (row: User) => row.username,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row: User) => row.email,
            sortable: true,
        },
        {
            name: 'Số điện thoại',
            selector: (row: User) => row.phoneNumber,
            sortable: true,
        },
        {
            name: 'Trạng thái',
            cell: (row: User) => (
                <button onClick={() => {
                    if (row.status === 1) {
                        toggleLockStatus(row.id, true);
                    } else if (row.status === 0) {
                        toggleLockStatus(row.id, false);
                    }
                }}>
                    {row.status === 0 ? <FaLock style={{color: 'red'}}/> : <FaUnlock/>}
                </button>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h2>Danh Sách Người Dùng</h2>
            {loading && <p>Đang tải...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            <DataTable
                columns={columns}
                data={users}
                progressPending={loading}
                pagination
                highlightOnHover
                noDataComponent="Không có dữ liệu để hiển thị"
            />
        </div>
    );
}

export default UserList;