import { useCallback, useMemo } from 'react';

import { calcTotalLike, toggleLike } from '@/features/post';
import { selectUser } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { ButtonOwnProps, TypeLike } from '@/types';
import { toast } from 'react-hot-toast';
import { AiFillHeart } from 'react-icons/ai';

import Button from './Button';

interface Props extends ButtonOwnProps {
    postId: string;
    usersLiked: Array<string>;
}

const ButtonLike = ({ usersLiked, postId }: Props) => {
    const user = useAppSelector(selectUser);
    const isLiked = useMemo(
        () => usersLiked.includes(user?._id as string),
        [user?._id, usersLiked],
    );
    const dispatch = useAppDispatch();

    const handleToggleLike = useCallback(async () => {
        if (!user) {
            toast.error('You must login to like this post');
            return;
        }
        if (isLiked) {
            await postServices.unlikePost(postId);
            dispatch(
                toggleLike({
                    postId: postId,
                    userId: user?._id as string,
                    type: TypeLike.UNLIKE,
                }),
            );
            dispatch(
                calcTotalLike({
                    type: 'DECREMENT',
                    postId: postId,
                }),
            );
        } else {
            await postServices.likePost(postId);
            dispatch(
                toggleLike({
                    postId: postId,
                    userId: user?._id as string,
                    type: TypeLike.LIKE,
                }),
            );
            dispatch(
                calcTotalLike({
                    type: 'INCREMENT',
                    postId: postId,
                }),
            );
        }
    }, [dispatch, isLiked, user, postId]);
    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            <Button
                className="w-12 h-12 flex-shrink-0 !min-w-0 bg-neutral-100 hover:bg-neutral-300 rounded-full"
                onClick={handleToggleLike}
            >
                <AiFillHeart
                    className={`${
                        isLiked ? 'text-rose-500' : ''
                    } icon-24 flex-shrink-0`}
                />
            </Button>
            <span className="text-subtext uppercase text-sm font-semibold">
                {usersLiked.length}
            </span>
        </div>
    );
};

export default ButtonLike;
