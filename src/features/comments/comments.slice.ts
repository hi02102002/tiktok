import { RootState } from '@/store';
import { IComment, TypeLike } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const LIMIT = 10;

interface IInitialState {
    comments: Array<IComment>;
    hasMore: boolean;
    page: number;
}

const initialState: IInitialState = {
    comments: [],
    hasMore: true,
    page: 1,
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        addComment: (state, { payload }: PayloadAction<IComment>) => {
            state.comments.unshift(payload);
        },
        unmountComments: (state) => {
            state.comments = [];
            state.hasMore = true;
            state.page = 1;
        },
        fetchComments: (
            state,
            {
                payload: { comments, page },
            }: PayloadAction<{
                comments: Array<IComment>;
                page: number;
            }>,
        ) => {
            state.comments = state.comments.concat(comments);
            if (comments.length >= LIMIT) {
                state.hasMore = true;
                state.page = page + 1;
            } else {
                state.hasMore = false;
            }
        },
        toggleLikeComment: (
            state,
            {
                payload,
            }: PayloadAction<{
                type: TypeLike;
                userId: string;
                commentId: string;
            }>,
        ) => {
            state.comments = state.comments.map((comment) => {
                if (comment._id === payload.commentId) {
                    return {
                        ...comment,
                        usersLiked:
                            payload.type === TypeLike.LIKE
                                ? [...comment.usersLiked].concat(payload.userId)
                                : [...comment.usersLiked].filter(
                                      (_userId) => _userId !== payload.userId,
                                  ),
                    };
                }
                return comment;
            });
        },
        removeComment: (state, { payload }: PayloadAction<string>) => {
            state.comments = state.comments.filter(
                (comment) => comment._id !== payload,
            );
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            if (!action.payload) {
                return state;
            }
            return {
                ...action.payload.comment,
            };
        },
    },
});

export const {
    unmountComments,
    fetchComments,
    addComment,
    toggleLikeComment,
    removeComment,
} = commentSlice.actions;
export const selectComment = (state: RootState) => state.comment;
export const commentReducer = commentSlice.reducer;
