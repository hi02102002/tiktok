import { commentReducer } from '@/features/comments';
import { postReducer } from '@/features/post';
import { userReducer } from '@/features/user';
import { Action, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';

const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
        comment: commentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//@ts-ignore
export type AppStore = ReturnType<typeof store>;
export const useAppDispatch = () => useDispatch();
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const wrapper = createWrapper<AppStore>(() => store);
