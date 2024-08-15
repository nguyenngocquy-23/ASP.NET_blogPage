import React, {useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import styles from './register.module.css';
import {useDispatch} from "react-redux";
import {loginCurrentUser} from "../reduxStore/UserSlice";

function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://localhost:7125/User/login', {
                usernameOrEmail,
                password
            });
            localStorage.setItem('authToken', response.data.token);
            const {id, username, fullName, email, phoneNumber, role, status} = response.data;
            const userData = {id, username, fullName, email, phoneNumber, role, status};
            console.log('userData : '+ userData.email)
            dispatch(loginCurrentUser(userData));
            if (response.data.role == 0)
                navigate('/admin');
            else
                navigate('/')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = typeof err.response?.data === 'string' ? err.response.data : 'Đăng nhập không thành công. Vui lòng thử lại sau.';
                setError(errorMsg);
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendActivationLink = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post('https://localhost:7125/User/requireActivateAccount', null, {
                params: {emailorUsername: usernameOrEmail}
            });
            alert('Yêu cầu gửi lại link kích hoạt đã được gửi thành công! Vui lòng kiểm tra hộp thư email của bạn.');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = typeof err.response?.data == 'string' ? err.response.data : 'Gửi yêu cầu không thành công. Vui lòng thử lại sau.';
                setError(errorMsg);
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.bigContainer}>
            <div className={styles.imageContainer}></div>
            <div>
                <div>
                    {error &&
                        <p style={{
                            color: 'red',
                            fontWeight: 600,
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }}>{error}</p>}
                    {error && typeof error === 'string' && error.includes("kiểm tra hộp thư email") &&
                        <div className={styles.linkContainer} style={{float: "right", cursor: "pointer"}}>
                            <p onClick={handleResendActivationLink}>Yêu cầu gửi lại</p>
                        </div>
                    }
                </div>
                <div className={styles.authContainer}>
                    <h2>Đăng Nhập</h2>
                    <form onSubmit={handleLogin}>
                        <div className={styles.formGroup}>
                            <label>Username hoặc email</label>
                            <input
                                type="text"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
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

                        <button type="submit" className={styles.btn} disabled={loading}>
                            {loading ? 'Đang Xử Lý...' : 'Đăng Nhập'}
                        </button>
                        {loading && <div className={styles.loader}></div>}
                        <div className={styles.linkContainer}>
                            <div style={{marginTop: '5px'}}>
                                <label>Chưa có tài khoản? </label>
                                <Link to="/register">Đăng ký</Link>
                            </div>
                            <span>
                                <Link to="/accounts/password/resetRequest">Quên mật khẩu</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;