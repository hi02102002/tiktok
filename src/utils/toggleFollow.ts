import { TypeFollow } from '@/types';

export const toggleFollow = (
    followers: Array<string>,
    type: TypeFollow,
    userId: string,
) => {
    return type === TypeFollow.FOLLOW
        ? followers.concat(userId)
        : followers.filter((followerId) => followerId !== userId);
};
