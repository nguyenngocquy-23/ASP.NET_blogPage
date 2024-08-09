import React, {useEffect, useState} from "react";
import axios from "axios";
import './ContactManager.css';
import Swal from "sweetalert2";

const ContactManager = () => {
    const [dataContact, setDataContact] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [contentFeedback,setContentFeedback] = useState("");
    const [email,setEmail] = useState("");
    const [feedbackAdmin,setFeedbackAdmin] = useState("");
    const [message,setMessage] = useState("");

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        // Gọi API để lấy dữ liệu
        axios.get('https://localhost:7125/Contact/all')
            .then(response => {
                setDataContact(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }
    const handleFeedBack = (email,content) => {
        setFormVisible(true);
        setEmail(email);
        setContentFeedback(content);
    };
    const CancalForm = () => {
        setFormVisible(false);
        setMessage("");
    }
    // @ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (feedbackAdmin === "") {
            setMessage("Nội dung phản hồi trống!");
            return;
        }
        let To = email;
        let Subject = "Phản Hồi Yêu Cầu Từ Blog Website"; // Sửa tên biến thành title nếu cần
        let Body = feedbackAdmin;
        try {
            const response = await fetch('https://localhost:7125/Contact/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ To, Subject, Body }), // Đảm bảo biến đúng tên
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchData();
            setMessage('');
            setEmail('');
            setFeedbackAdmin('');
            setContentFeedback('');
            setFormVisible(false);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Gửi Phản Hồi Thành Công!",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error:', error); // Thêm log lỗi để debug
            setMessage('Đã xảy ra lỗi khi gửi phản hồi!');
        }
    }
    return (
        <div className="table-container">
            <h2 className="table-title" style={{fontWeight: "bold"}}>Các Liên Hệ Từ Người Dùng</h2>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th>Tiêu Đề</th>
                    <th>Nội Dung</th>
                    <th>Phản Hồi</th>
                </tr>
                </thead>
                <tbody>
                {dataContact.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.fullName}</td>
                        <td>{item.email}</td>
                        <td>{item.title}</td>
                        <td>{item.content}</td>
                        <td>
                            <button className="btn edit-btn" style={{fontWeight: "bold"}} onClick={() => handleFeedBack(item.email,item.content)}>Phản Hồi</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/*Form phản hoi*/}
            {isFormVisible && (
                <div className="feedback-overlay">
                    <div className="feedback-form-container">
                        <button style={{float: "right", fontWeight: "bold", border: "none", margin: "0", padding: "0"}}
                                onClick={() => CancalForm()}>x
                        </button>
                        <h3 style={{fontWeight: "bold"}}>Phản Hồi Người Dùng</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label style={{fontWeight: 'bold'}}>Người dùng:</label>
                                <p>- {contentFeedback}</p>
                            </div>
                            <div className="form-group">
                                <lable htmlFor="feedback-content" style={{fontWeight: 'bold'}}>Admin phản hồi:</lable>
                                <div>
                                    <textarea
                                        id="feedback-content"
                                        placeholder="Nội dung phản hồi"
                                        onChange={(e) => setFeedbackAdmin(e.target.value)}
                                        rows="4"
                                        className="feedback-textarea"
                                    />
                                </div>
                            </div>
                            {message && <p style={{color: 'red'}}>{message}</p>}
                            <input type={"submit"} value={"Phản Hồi"} className="submit-btn"/>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}
export default ContactManager;