import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../reduxStore/Store'; // Giả sử bạn có RootState đã được định nghĩa
import { loginSuccess } from '../reduxStore/UserSlice';
import styles from './register.module.css';

// Định nghĩa kiểu cho trạng thái người dùng trong Redux store
interface User {
    email: string;
    password: string;
}

function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector((state: RootState) => state.user.users); // Lấy danh sách người dùng từ Redux store

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find((user: User) => user.email === email && user.password === password);

        if (user) {
            dispatch(loginSuccess(user)); // Lưu thông tin người dùng hiện tại vào Redux store
            navigate('/'); // Chuyển hướng sau khi đăng nhập thành công
        } else {
            setError('Email hoặc mật khẩu không chính xác !');
        }
    };

    return (
        <div className={styles.bigContainer}>
            <div className={styles.imageContainer}></div>
            <div className={styles.authContainer}>
                <h2>Đăng Nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Mật Khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red', fontWeight : 600, fontStyle : 'italic' }}>{error}</p>}
                    <button type="submit" className={styles.btn} style={{ marginBottom: '10px' }}>
                        Đăng Nhập
                    </button>
                    <label>Chưa có tài khoản? </label>
                    <Link to={'/register'}> Đăng ký</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
