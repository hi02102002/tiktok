import { useCallback, useState } from 'react';

import postServices from '@/services/post.services';
import { IComment, TypeLike } from '@/types';
import { uniqBy } from 'lodash';

import Comment from './Comment';
import InputComment from './InputComment';

const LIMIT_COMMENT = 5;

interface Props {
    comment: IComment;
}

const ParentComment = ({ comment }: Props) => {
    const [childComments, setChildComments] = useState<Array<IComment>>([]);
    const [pageChildComments, setPageChildComments] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showInputReply, setShowInputReply] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const handelViewMore = useCallback(async () => {
        try {
            setLoading(true);
            const comments = await postServices.getChildComments(
                comment.postId,
                comment._id,
                pageChildComments,
                LIMIT_COMMENT,
            );
            if (comments.length >= LIMIT_COMMENT) {
                setHasMore(true);
            } else {
                setHasMore(false);
            }
            setChildComments((prevCommentsState) =>
                uniqBy<IComment>([...prevCommentsState, ...comments], '_id'),
            );
            setPageChildComments(pageChildComments + 1);
        } catch (error) {
            console.log(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, [comment._id, comment.postId, pageChildComments]);

    const handleToggleLikeChildComment = useCallback(
        (commentId: string, userId: string, type: TypeLike) => {
            setChildComments((prevCommentsState) =>
                prevCommentsState.map((comment) => {
                    if (comment._id === commentId) {
                        return {
                            ...comment,
                            usersLiked:
                                type === TypeLike.LIKE
                                    ? [...comment.usersLiked].concat(userId)
                                    : [...comment.usersLiked].filter(
                                          (_userId) => _userId !== userId,
                                      ),
                        };
                    }
                    return comment;
                }),
            );
        },
        [],
    );

    const handleRemoveChildComment = useCallback((commentId: string) => {
        setChildComments((prevCommentsState) =>
            prevCommentsState.filter((comment) => comment._id !== commentId),
        );
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <Comment
                comment={comment}
                hasMore={hasMore}
                onViewMoreComment={handelViewMore}
                childComments={childComments}
                onShowReply={() => {
                    setShowInputReply(!showInputReply);
                }}
                onLike={handleToggleLikeChildComment}
                onRemove={handleRemoveChildComment}
                loadingViewMore={loading}
            />
            {showInputReply && (
                <InputComment
                    postId={comment.postId}
                    parentCommentId={comment._id}
                    isReply
                    onComment={(comment) => {
                        setChildComments((prevCommentsState) =>
                            uniqBy(prevCommentsState.concat(comment), '_id'),
                        );
                        setShowInputReply(false);
                    }}
                />
            )}
        </div>
    );
};

export default ParentComment;
