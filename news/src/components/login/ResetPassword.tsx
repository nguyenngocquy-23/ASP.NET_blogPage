import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import styles from './resetPassword.module.css';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ResetPassword: React.FC = () => {
    const query = useQuery();
    const [email, setEmail] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const emailFromQuery = query.get('email');
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, [query]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        try {
            await axios.post('https://localhost:7125/User/changePassword', null, {
                params: { email, code: verificationCode, newPassword, confirmPassword }
            });
            setMessage('Thành công thay đổi mật khẩu');
            setTimeout(() => {
                navigate('/login');
            }, 4000);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Thay đổi mật khẩu không thành công. Vui lòng thử lại sau.');
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };
    return (
        <div>
            {error &&
                <p style={{color: 'red', fontWeight: 600, fontStyle: 'italic', textAlign: 'center'}}>{error}</p>}
            <div className={styles.container}>
                <h2>Đặt Lại Mật Khẩu</h2>
                <form onSubmit={handleReset}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            readOnly
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Mã Xác Nhận</label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? 'Đang Xử Lý...' : 'Đặt Lại Mật Khẩu'}
                    </button>
                    {loading && <div className={styles.loader}></div>}
                    {message && <p className={styles.message}>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
