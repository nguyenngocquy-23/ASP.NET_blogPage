import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    email: string;
    password: string;
}

interface Comment {
    link: string; // Thêm link để định danh bài viết
    email: string;
    content: string;
    time: string;
}


interface UserState {
    users: User[];
    comments: Comment[];
    currentUser: User | null;
    readArticles: any;
}

const initialState: UserState = {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    currentUser: JSON.parse(sessionStorage.getItem('currentUser') || 'null'),
    comments: JSON.parse(localStorage.getItem('comments') || '[]'),
    readArticles :JSON.parse(sessionStorage.getItem('readArticles') || '[]'),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        registerUser(state, action: PayloadAction<User>) {
            state.users.push(action.payload); // Thêm người dùng mới
            localStorage.setItem('users', JSON.stringify(state.users));
        },
        loginSuccess(state, action: PayloadAction<User>) {
            state.currentUser = action.payload; // Đăng nhập thành công
            sessionStorage.setItem('currentUser', JSON.stringify(action.payload));
        },
        logoutSuccess(state) {
            state.currentUser = null; // Đăng xuất
            sessionStorage.removeItem('currentUser');
        },
        addComment(state, action: PayloadAction<Comment>) {
            state.comments = Array.isArray(state.comments) ? [...state.comments, action.payload] : [action.payload];
            localStorage.setItem('comments', JSON.stringify(state.comments));
        },
        addReadArticle: (state, action) => {
            const newArticle = action.payload;
            let existingArticleIndex = -1;
            for (let index = 0; index < state.readArticles.length; index++) {
                if(state.readArticles[index].title === newArticle.title) {
                    existingArticleIndex = index;
                    break;
                }
            }
            if (existingArticleIndex !== -1) {
                // Xóa bài viết cũ
                state.readArticles .splice(existingArticleIndex, 1);
            }

            // Thêm bài viết mới
            state.readArticles.push(newArticle);
            sessionStorage.setItem('readArticles', JSON.stringify(state.readArticles));
        },
    },
});

export const { registerUser, loginSuccess, logoutSuccess, addComment ,addReadArticle } = userSlice.actions;
export default userSlice.reducer;
