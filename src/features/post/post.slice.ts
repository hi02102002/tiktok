import { RootState } from '@/store';
import { IPost } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const LIMIT = 10;

interface IInitialState {
    posts: Array<IPost>;
    page: number;
    hasMore: boolean;
}

const initialState: IInitialState = {
    posts: [],
    page: 1,
    hasMore: true,
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        createPost: (state, action: PayloadAction<IPost>) => {
            state.posts.unshift(action.payload);
        },
        fetchPosts: (
            state,
            action: PayloadAction<{
                posts: Array<IPost>;
                page: number;
            }>,
        ) => {
            state.posts = state.posts.concat(action.payload.posts);
            state.page = action.payload.page;
            if (action.payload.posts.length >= LIMIT) {
                state.hasMore = true;
            } else {
                state.hasMore = false;
            }
        },
        unmountPosts: (state) => {
            state.hasMore = true;
            state.page = 1;
            state.posts = [];
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            if (!action.payload) {
                return state;
            }
            return {
                ...action.payload.post,
            };
        },
    },
});

export const { createPost, fetchPosts, unmountPosts } = postSlice.actions;
export const selectPost = (state: RootState) => state.post;
export const postReducer = postSlice.reducer;
