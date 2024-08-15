import axios from 'axios'

// Kiểu dữ liệu của User.
export interface User {
    id: number;
    username: string;
    password: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: number;
    status: number;
    createdAt: string;
    isEnable: boolean;
}


// Hàm lấy user từ token;
export const getUserFromToken = async (): Promise<User | null> => {
    try {
        const token = localStorage.getItem('authToken');

        if(!token) {
            console.log('Token không tồn tại trong Local Storage!');
            return null;
        }

        // Gọi API
        const response = await axios.get<User>('https://localhost:7125/User/testToken', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi gọi API: ', error);
        return null;
    }
}