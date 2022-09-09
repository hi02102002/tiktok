import axios from '@/axios';
import { IRes, IUser } from '@/types';

class UserServices {
    public getAllUsers = async (q?: string, limit?: number, page?: number) => {
        return await axios
            .get<
                IRes<{
                    users: Array<IUser>;
                }>
            >('/users', {
                params: {
                    q: q,
                    limit,
                    page,
                },
            })
            .then((value) => value.data.data.users);
    };
}

export default new UserServices();
