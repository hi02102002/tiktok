import { IPost } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IInitialState {
    posts: Array<IPost>;
}

const initialState: IInitialState = {
    posts: [],
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        createPost: (state, action: PayloadAction<IPost>) => {
            state.posts.unshift(action.payload);
        },
    },
});

export const { createPost } = postSlice.actions;

export const postReducer = postSlice.reducer;
