import axios from '@/axios';
import { IRes, IUser } from '@/types';

class UserServices {
    public searchUsers = async (q?: string, limit?: number, page?: number) => {
        return await axios
            .get<
                IRes<{
                    users: Array<IUser>;
                }>
            >('/users/search', {
                params: {
                    q: q,
                    limit,
                    page,
                },
            })
            .then((value) => value.data.data.users);
    };
    public getSuggestAccounts = async (userId: string | undefined) => {
        return await axios
            .get<
                IRes<{
                    suggestAccounts: Array<IUser>;
                }>
            >('/users/suggestAccounts', {
                params: {
                    userId: userId ? userId : undefined,
                },
            })
            .then((value) => value.data.data.suggestAccounts);
    };
    public getFollowingAccounts = async (page: number, limit: number) => {
        return await axios
            .get<
                IRes<{
                    followingAccounts: Array<IUser>;
                }>
            >('/users/followingAccounts', {
                params: {
                    page,
                    limit,
                },
            })
            .then((value) => value.data.data.followingAccounts);
    };

    public followUser = async (receiverId: string) => {
        return await axios
            .patch<
                IRes<{
                    user: IUser;
                }>
            >(`/users/follow/${receiverId}`)
            .then((value) => value.data.data.user);
    };
    public unfollowUser = async (receiverId: string) => {
        return await axios
            .patch<
                IRes<{
                    user: IUser;
                }>
            >(`/users/unfollow/${receiverId}`)
            .then((value) => value.data.data.user);
    };
}

export default new UserServices();
