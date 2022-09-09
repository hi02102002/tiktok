import { RootState } from '@/store';
import { IUser } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

interface IInitialState {
    user: IUser | null;
}

const initialState: IInitialState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            if (!action.payload) {
                return state;
            }
            return {
                ...action.payload.user,
            };
        },
    },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;

export const userReducer = userSlice.reducer;
