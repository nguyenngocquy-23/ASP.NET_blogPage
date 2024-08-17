import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm để điều hướng
import styles from './userList.module.css';
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";

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
    const [authorized, setAuthorized] = useState<boolean>(false);
    const navigate = useNavigate(); // Khai báo biến điều hướng

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                // Kiểm tra quyền hạn người dùng
                const response = await axios.get(`https://localhost:7125/User/checkAdmin`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (response.data.isAdmin) {
                    setAuthorized(true);
                    fetchUsers(); // Nếu người dùng là admin, tải danh sách người dùng
                } else {
                    setAuthorized(false);
                    navigate('/unauthorized'); // Hoặc điều hướng đến trang khác
                }
            } catch (err) {
                setAuthorized(false);
                navigate('/unauthorized'); // Hoặc điều hướng đến trang khác
            }
        };

        checkAuthorization();
    }, [navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://localhost:7125/User/getAll`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setUsers(response.data);
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

    const toggleLockStatus = async (userId: number) => {
        setLoading(true);
        try {
            await axios.put(`https://localhost:7125/User/toggleLockStatus/${userId}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            fetchUsers(); // Refresh the user list after toggling status
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

    return (
        <div className={styles.container}>
            <h2>Danh Sách Người Dùng</h2>
            {loading && <p>Đang tải...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!authorized && <p>Không có quyền truy cập.</p>}
            {authorized && (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Tài Khoản</th>
                        <th>Tên Đăng Nhập</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user: User) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.fullName}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>
                                <button onClick={() => toggleLockStatus(user.id)}>
                                    {user.status === 0 ? <FaLock style={{color: 'red'}}/> : <FaUnlock/>}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserList;
