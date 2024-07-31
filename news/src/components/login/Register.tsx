import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import styles from './register.module.css';
import {registerUser} from "../reduxStore/UserSlice";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        // Dispatch action to store email and password in Redux store
        dispatch(registerUser({email, password}));
        navigate('/login');
    };

    return (
        <div className={styles.bigContainer}>
            <div className={styles.authContainer}>
                <h2>Đăng Ký</h2>
                <form onSubmit={handleRegister}>
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
                    <div className={styles.formGroup}>
                        <label>Xác Nhận Mật Khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.btn}>Đăng Ký</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
