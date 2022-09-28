import { RootState } from '@/store';
import { IUser, TypeFollow } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const LIMIT = 10;

interface IInitialState {
    suggestAccounts: {
        accounts: Array<IUser>;
        hasMore: boolean;
    };
    followingAccounts: {
        accounts: Array<IUser>;
        hasMore: boolean;
    };
}

const initialState: IInitialState = {
    followingAccounts: {
        accounts: [],
        hasMore: true,
    },
    suggestAccounts: {
        accounts: [],
        hasMore: true,
    },
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        fetchSuggestAccounts: (
            state,
            { payload }: PayloadAction<Array<IUser>>,
        ) => {
            state.suggestAccounts.accounts = payload;
            if (payload.length >= LIMIT) {
                state.suggestAccounts.hasMore = true;
            } else {
                state.suggestAccounts.hasMore = false;
            }
        },
        fetchFollowingAccounts: (
            state,
            { payload }: PayloadAction<Array<IUser>>,
        ) => {
            state.followingAccounts.accounts =
                state.followingAccounts.accounts.concat(payload);
            if (payload.length >= LIMIT) {
                state.followingAccounts.hasMore = true;
            } else {
                state.followingAccounts.hasMore = false;
            }
        },

        toggleFollowSuggestAccounts: (
            state,
            {
                payload,
            }: PayloadAction<{
                type: TypeFollow;
                receiverId: string;
                userId: string;
            }>,
        ) => {
            state.suggestAccounts.accounts = state.suggestAccounts.accounts.map(
                (account) => {
                    if (account._id === payload.receiverId) {
                        console.log(account._id, payload.receiverId);
                        return {
                            ...account,
                            followers:
                                payload.type === TypeFollow.FOLLOW
                                    ? account.followers.concat(payload.userId)
                                    : account.followers.filter(
                                          (follower) =>
                                              follower !== payload.userId,
                                      ),
                        };
                    }
                    return account;
                },
            );
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            const nextState = { ...state, ...action.payload.account };
            return nextState;
        },
    },
});

export const {
    fetchFollowingAccounts,
    fetchSuggestAccounts,
    toggleFollowSuggestAccounts,
} = accountSlice.actions;

export const selectFollowingAccounts = (state: RootState) =>
    state.account.followingAccounts;

export const selectSuggestAccounts = (state: RootState) =>
    state.account.suggestAccounts;

export const accountReducer = accountSlice.reducer;
