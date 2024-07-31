import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Comment {
    link: string; // Thêm link để định danh bài viết
    email: string;
    content: string;
    time: string;
}


interface UserState {
    readArticles: any;
}

const initialState: UserState = {
    readArticles :JSON.parse(sessionStorage.getItem('readArticles') || '[]'),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
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

export const {addReadArticle } = userSlice.actions;
export default userSlice.reducer;
