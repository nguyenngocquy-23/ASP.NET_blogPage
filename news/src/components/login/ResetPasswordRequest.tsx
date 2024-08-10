import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './resetPasswordRequest.module.css';

const ResetPasswordRequest: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading

        try {
            await axios.post('https://localhost:7125/User/requestPasswordReset', null, {
                params: { email }
            });
            // Chuyển hướng đến trang đặt lại mật khẩu và truyền email qua URL
            navigate(`/accounts/password/reset?email=${encodeURIComponent(email)}`);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
                <h2>Quên Mật Khẩu</h2>
                <form onSubmit={handleRequest}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? 'Đang Xử Lý...' : 'Gửi Mã Xác Nhận'}
                    </button>
                    {loading && <div className={styles.loader}></div>}
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordRequest;
