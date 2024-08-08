import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './register.module.css';

function Register() {
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        setLoading(true); // Bắt đầu loading
        try {
            const response = await axios.post('https://localhost:7125/User/create', {
                fullName,
                email,
                phoneNumber,
                username,
                password,
                confirmPassword
            });
            try {
                await axios.post('https://localhost:7125/User/requireActivateAccount', null, {
                    params: { emailorUsername: email }
                });
                setSuccess("Đăng ký thành công!")
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                console.error('Gởi mail kích hoạt không thành công!', error);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.title || 'Đăng ký không thành công. Vui lòng thử lại sau.';
                setError(errorMsg);
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
            console.error('Registration failed:', err); // Change 'error' to 'err'
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className={styles.bigContainer}>
            <div className={styles.authContainer}>
                <h2>Đăng Ký</h2>
                <form onSubmit={handleRegister}>
                    <div className={styles.formGroup}>
                        <label>Họ và Tên</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
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
                        <label>Số Điện Thoại</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Tên Đăng Nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <div className={styles.formGroup}>
                        <label>Xác Nhận Mật Khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red', fontWeight: 600, fontStyle: 'italic', textAlign: 'center' }}>{error}</p>}
                    {success && <p style={{ color: 'green', fontWeight: 600, fontStyle: 'italic', textAlign: 'center' }}>{success}</p>}
                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? 'Đang Xử Lý...' : 'Đăng Ký'}
                    </button>
                    {loading && <div className={styles.loader}></div>}
                </form>
            </div>
        </div>
    );
}

export default Register;
