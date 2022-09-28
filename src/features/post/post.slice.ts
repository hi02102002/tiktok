import { RootState } from '@/store';
import { IPost, TypeFollow, TypeLike } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const LIMIT = 10;

interface IInitialState {
    posts: Array<IPost>;
    page: number;
    hasMore: boolean;
    currentPost: null | IPost;
}

const initialState: IInitialState = {
    posts: [],
    page: 1,
    hasMore: true,
    currentPost: null,
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
            if (action.payload.posts.length >= LIMIT) {
                state.hasMore = true;
                state.page = action.payload.page + 1;
            } else {
                state.hasMore = false;
            }
        },
        toggleLike: (
            state,
            {
                payload,
            }: PayloadAction<{
                postId: string;
                userId: string;
                type: TypeLike;
            }>,
        ) => {
            state.posts = state.posts.map((post) => {
                if (post._id === payload.postId) {
                    return {
                        ...post,
                        usersLiked:
                            payload.type === TypeLike.LIKE
                                ? [...post.usersLiked].concat(payload.userId)
                                : [...post.usersLiked].filter(
                                      (_userId) => _userId !== payload.userId,
                                  ),
                    };
                }
                return post;
            });
        },
        unmountPosts: (state) => {
            state.hasMore = true;
            state.page = 1;
            state.posts = [];
        },
        setCurrentPost: (state, action: PayloadAction<IPost | null>) => {
            state.currentPost = action.payload;
        },
        toggleFollowOnPost: (
            state,
            {
                payload,
            }: PayloadAction<{
                userId: string;
                type: TypeFollow;
                receiverId: string;
            }>,
        ) => {
            state.posts = state.posts.map((post) => {
                if (post.user._id === payload.receiverId) {
                    return {
                        ...post,
                        user: {
                            ...post.user,
                            followers:
                                payload.type === TypeFollow.FOLLOW
                                    ? post.user.followers.concat(payload.userId)
                                    : post.user.followers.filter(
                                          (follower) =>
                                              follower !== payload.userId,
                                      ),
                        },
                    };
                }
                return post;
            });
        },
        incrementTotalComment: (state, { payload }: PayloadAction<string>) => {
            state.posts = state.posts.map((post) => {
                if (post._id === payload) {
                    return {
                        ...post,
                        totalComment: post.totalComment + 1,
                    };
                }
                return post;
            });
        },
        decrementTotalComment: (state, { payload }: PayloadAction<string>) => {
            state.posts = state.posts.map((post) => {
                if (post._id === payload) {
                    return {
                        ...post,
                        totalComment: post.totalComment - 1,
                    };
                }
                return post;
            });
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

export const {
    createPost,
    fetchPosts,
    unmountPosts,
    toggleLike,
    setCurrentPost,
    toggleFollowOnPost,
    decrementTotalComment,
    incrementTotalComment,
} = postSlice.actions;
export const selectPost = (state: RootState) => state.post;
export const postReducer = postSlice.reducer;
