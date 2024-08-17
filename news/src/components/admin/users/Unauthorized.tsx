import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Không thể truy cập!</h1>
            <button style={styles.button} onClick={() => navigate("/")}>
                Về trang chủ
            </button>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center" as const,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: "2.5rem",
        color: "#dc3545",
        marginBottom: "20px",
    },
    message: {
        fontSize: "1.25rem",
        color: "#6c757d",
        marginBottom: "30px",
    },
    button: {
        padding: "10px 20px",
        fontSize: "1rem",
        color: "#fff",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};

export default Unauthorized;
