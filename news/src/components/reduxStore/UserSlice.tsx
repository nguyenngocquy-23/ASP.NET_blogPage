import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Comment {
    link: string; // Thêm link để định danh bài viết
    email: string;
    content: string;
    time: string;
}


interface UserState {
    currentUser: any
    readArticles: any;
}

const initialState: UserState = {
    currentUser: JSON.parse(sessionStorage.getItem('currentUser')||'null'),
    readArticles :JSON.parse(sessionStorage.getItem('readArticles') || '[]'),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addReadArticle: (state, action) => {
            const newArticle = action.payload;
            console.log('newArticle :',newArticle)
            let existingArticleIndex = -1;
            for (let index = 0; index < state.readArticles.length; index++) {
                if (state.readArticles[index].title === newArticle.title) {
                    existingArticleIndex = index;
                    break;
                }
            }
            if (existingArticleIndex !== -1) {
                // Xóa bài viết cũ
                state.readArticles.splice(existingArticleIndex, 1);
            }

            // Thêm bài viết mới
            state.readArticles.push(newArticle);
            sessionStorage.setItem('readArticles', JSON.stringify(state.readArticles));
        },
        loginCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            sessionStorage.setItem('currentUser', JSON.stringify(action.payload));
        },
        logoutCurrentUser: (state) => {
            state.currentUser = null;
        },
    },
});

export const { loginCurrentUser, logoutCurrentUser, addReadArticle } = userSlice.actions;
export default userSlice.reducer;
