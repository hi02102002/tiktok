import { useCallback, useMemo } from 'react';

import { Button } from '@/components';
import { toggleFollowSuggestAccounts } from '@/features/accounts';
import { toggleFollowOnPost } from '@/features/post';
import { selectUser, toggleFollow } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import usersServices from '@/services/users.services';
import { TypeFollow, onFollow } from '@/types';
import { toast } from 'react-hot-toast';

interface Props {
    followers: Array<string>;
    receiverId: string;
    onFollow?: onFollow;
}

const ButtonFollow = ({ followers, receiverId, onFollow }: Props) => {
    const currentUser = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const isFollowing = useMemo(() => {
        if (!currentUser) {
            return false;
        }
        return followers.includes(currentUser._id);
    }, [followers, currentUser]);

    // handle unfollow or following base on follower of user
    const handelToggleFollow = useCallback(async () => {
        if (!currentUser) {
            toast.error('You must login to follow this user.');
            return;
        }
        try {
            if (isFollowing) {
                const user = await usersServices.unfollowUser(receiverId);
                dispatch(toggleFollow(user));
                dispatch(
                    toggleFollowSuggestAccounts({
                        receiverId,
                        userId: user._id,
                        type: TypeFollow.UNFOLLOW,
                    }),
                );
                dispatch(
                    toggleFollowOnPost({
                        type: TypeFollow.UNFOLLOW,
                        userId: user._id,
                        receiverId,
                    }),
                );
                onFollow?.(TypeFollow.UNFOLLOW, user._id, receiverId);
            } else {
                const user = await usersServices.followUser(receiverId);
                dispatch(toggleFollow(user));
                dispatch(
                    toggleFollowSuggestAccounts({
                        receiverId,
                        userId: user._id,
                        type: TypeFollow.FOLLOW,
                    }),
                );
                dispatch(
                    toggleFollowOnPost({
                        type: TypeFollow.FOLLOW,
                        userId: user._id,
                        receiverId,
                    }),
                );
                onFollow?.(TypeFollow.FOLLOW, user._id, receiverId);
            }
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, isFollowing, receiverId, onFollow, currentUser]);

    return (
        <Button
            onClick={handelToggleFollow}
            typeButton={isFollowing ? 'tertiary' : 'primary'}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </Button>
    );
};

export default ButtonFollow;
