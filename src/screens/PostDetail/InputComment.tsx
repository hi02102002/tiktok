import { useCallback, useState } from 'react';

import { Avatar, Spiner } from '@/components';
import { addComment } from '@/features/comments';
import { incrementTotalComment } from '@/features/post';
import { selectUser } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { IComment } from '@/types';
import { toast } from 'react-hot-toast';

interface Props {
    postId: string;
    parentCommentId?: string | null;
    isReply?: boolean;
    onComment?: (comment: IComment) => void;
}

const InputComment = ({
    postId,
    parentCommentId = null,
    isReply = false,
    onComment,
}: Props) => {
    const user = useAppSelector(selectUser);
    const [textComment, setTextComment] = useState<string>('');
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const handleAddComment = useCallback(async () => {
        try {
            if (!user) {
                toast.error('You must login to comment this post.');
                return;
            }
            setLoading(true);
            const comment = await postServices.addComment(
                postId,
                textComment,
                parentCommentId as string,
            );
            setTextComment('');
            dispatch(incrementTotalComment(postId));
            onComment && onComment(comment);
            if (!isReply) {
                dispatch(addComment(comment));
            }
        } catch (error) {
            setLoading(false);
        }
        {
            setLoading(false);
        }
    }, [
        parentCommentId,
        postId,
        textComment,
        dispatch,
        isReply,
        onComment,
        user,
    ]);

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex-shrink-0">
                <Avatar
                    src={user?.avatar as string}
                    alt={user?.username}
                    size={44}
                    className="w-full "
                />
            </div>
            <input
                type="text"
                className="form-input"
                placeholder="Add comment"
                value={textComment}
                onChange={(e) => {
                    setTextComment(e.target.value);
                }}
            />
            <button
                disabled={textComment.length === 0}
                className="text-primary disabled:text-neutral-600 font-medium w-10 h-10 flex items-center justify-center"
                onClick={handleAddComment}
            >
                {loading ? (
                    <Spiner className="!text-neutral-500" />
                ) : (
                    <span>Post</span>
                )}
            </button>
        </div>
    );
};

export default InputComment;
