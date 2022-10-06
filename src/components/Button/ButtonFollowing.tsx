import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components';
import { toggleFollowOnPost } from '@/features/post';
import { selectUser, toggleFollow } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import usersServices from '@/services/users.services';
import { TypeFollow, onFollow } from '@/types';
import { toast } from 'react-hot-toast';

interface Props {
    receiverId: string;
    onFollow?: onFollow;
}

const ButtonFollow = ({ receiverId, onFollow }: Props) => {
    const currentUser = useAppSelector(selectUser);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const _isFollowing = useMemo(() => {
        if (!currentUser) {
            return false;
        }
        return currentUser.following.includes(receiverId);
    }, [currentUser, receiverId]);

    // handle unfollow or following base on follower of user
    const handelToggleFollow = useCallback(async () => {
        if (!currentUser) {
            toast.error('You must login to follow this user.');
            return;
        }
        try {
            setLoading(true);
            if (_isFollowing) {
                const user = await usersServices.unfollowUser(receiverId);
                dispatch(toggleFollow(user));

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
                    toggleFollowOnPost({
                        type: TypeFollow.FOLLOW,
                        userId: user._id,
                        receiverId,
                    }),
                );
                onFollow?.(TypeFollow.FOLLOW, user._id, receiverId);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, _isFollowing, receiverId, onFollow, currentUser]);

    return (
        <Button
            onClick={handelToggleFollow}
            typeButton={_isFollowing ? 'tertiary' : 'primary'}
            loading={loading}
            disabled={loading}
        >
            {_isFollowing ? 'Following' : 'Follow'}
        </Button>
    );
};

export default ButtonFollow;
