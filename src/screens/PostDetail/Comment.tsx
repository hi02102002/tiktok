import { useCallback, useMemo } from 'react';

import Link from 'next/link';

import { Avatar } from '@/components';
import { removeComment, toggleLikeComment } from '@/features/comments';
import { decrementTotalComment } from '@/features/post';
import { selectUser } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { IComment, TypeLike } from '@/types';
import { linkToProfile } from '@/utils';
import { toast } from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';

interface Props {
    comment: IComment;
    hasMore?: boolean;
    onViewMoreComment?: () => void;
    childComments?: Array<IComment>;
    onShowReply: () => void;
    onLike?: (commentId: string, userId: string, type: TypeLike) => void;
    onRemove?: (commentId: string) => void;
}

const Comment = ({
    comment,
    onViewMoreComment,
    hasMore,
    childComments,
    onShowReply,
    onLike,
    onRemove,
}: Props) => {
    const currentUser = useAppSelector(selectUser);

    const isLiked = useMemo(() => {
        return comment.usersLiked.includes(currentUser?._id as string);
    }, [comment.usersLiked, currentUser?._id]);

    const dispatch = useAppDispatch();

    const handleLike = useCallback(async () => {
        if (!currentUser) {
            toast.error('You must login to like or unlike this comment.');
            return;
        }

        try {
            if (isLiked) {
                await postServices.unlikeComment(comment._id, comment.postId);
                if (!comment.parentId) {
                    dispatch(
                        toggleLikeComment({
                            commentId: comment._id,
                            userId: currentUser._id as string,
                            type: TypeLike.UNLIKE,
                        }),
                    );
                }
                onLike && onLike(comment._id, currentUser._id, TypeLike.UNLIKE);
            } else {
                await postServices.likeComment(comment._id, comment.postId);

                if (!comment.parentId) {
                    dispatch(
                        toggleLikeComment({
                            commentId: comment._id,
                            userId: currentUser._id as string,
                            type: TypeLike.LIKE,
                        }),
                    );
                }
                onLike && onLike(comment._id, currentUser._id, TypeLike.LIKE);
            }
        } catch (error) {}
    }, [
        comment._id,
        currentUser,
        dispatch,
        isLiked,
        onLike,
        comment.postId,
        comment.parentId,
    ]);

    const handleRemove = useCallback(async () => {
        await postServices.removeComment(comment.postId, comment._id);
        dispatch(removeComment(comment._id));
        dispatch(decrementTotalComment(comment.postId));
        onRemove && onRemove(comment._id);
    }, [comment._id, dispatch, onRemove, comment.postId]);

    return (
        <div className="flex gap-3 items-start">
            <Avatar
                size={44}
                src={comment.user.avatar}
                alt={comment.user.username}
            />
            <div className="flex flex-col gap-1 w-full">
                <Link
                    href={linkToProfile(
                        currentUser?._id as string,
                        comment.user._id,
                    )}
                >
                    <a>
                        <h3 className="font-medium leading-[1]">
                            {comment.user.firstName} {comment.user.lastName}
                        </h3>
                    </a>
                </Link>
                <p>{comment.content}</p>
                <div className="flex items-center gap-3">
                    <span>3d ago</span>
                    <div className="flex items-center gap-2">
                        <span>{comment.usersLiked.length}</span>
                        <button onClick={handleLike}>
                            {isLiked ? (
                                <AiFillHeart className="text-primary" />
                            ) : (
                                <AiOutlineHeart />
                            )}
                        </button>
                    </div>
                    <button className="font-medium" onClick={onShowReply}>
                        Reply
                    </button>
                    {currentUser?._id === comment.user._id && (
                        <button className="font-medium" onClick={handleRemove}>
                            Remove
                        </button>
                    )}
                </div>
                {childComments && (
                    <div className="mt-2 flex flex-col gap-2">
                        {childComments?.map((comment) => {
                            return (
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    onShowReply={onShowReply}
                                    onLike={onLike}
                                    onRemove={onRemove}
                                />
                            );
                        })}
                    </div>
                )}
                {comment.numChildren > 0 && hasMore && (
                    <button
                        className="text-neutral-500 font-medium flex items-center gap-1 mb-1"
                        onClick={onViewMoreComment}
                    >
                        <span className="leading-[1]">View more replies</span>
                        <IoIosArrowDown className="icon-16" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Comment;
