import { useCallback, useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    Avatar,
    BriefProfile,
    Button,
    ButtonFollow,
    SectionUser,
} from '@/components';
import { DefaultLayout } from '@/components/Layout';
import { ROUTES } from '@/constants';
import { selectComment } from '@/features/comments';
import { selectPost } from '@/features/post';
import { selectUser } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { NextPageWithLayout } from '@/types';
import Tippy from '@tippyjs/react/headless';
import { IoIosArrowBack } from 'react-icons/io';

import InputComment from './InputComment';
import ParentComment from './ParentComment';

const PostDetail: NextPageWithLayout = () => {
    const { posts, hasMore, page } = useAppSelector(selectPost);
    const user = useAppSelector(selectUser);
    const router = useRouter();
    const post = useMemo(() => posts[0], [posts]);
    const { comments } = useAppSelector(selectComment);
    const dispatch = useAppDispatch();

    const handleLoadMoreComment = useCallback(async () => {
        const moreComments = await postServices.getComments(post._id);
    }, [post._id]);

    return (
        <div>
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 mb-6 text-lg font-medium"
            >
                <IoIosArrowBack className="icon-24" />
                <span>Go back</span>
            </button>
            <div
                className="w-full bg-black rounded"
                style={{
                    height: post.width < post.height ? '600px' : 'auto',
                }}
            >
                <video
                    src={post.video.url}
                    className="object-contain w-full h-full rounded"
                ></video>
            </div>
            <p className="my-4">{post.caption}</p>
            <div className="flex items-center justify-between mb-4">
                <Tippy
                    render={(attrs) => {
                        return (
                            <div {...attrs} tabIndex={-1}>
                                <BriefProfile user={post.user} />
                            </div>
                        );
                    }}
                    interactive
                    delay={800}
                    placement="bottom-start"
                    popperOptions={{
                        strategy: 'fixed',
                    }}
                >
                    <div>
                        <SectionUser
                            user={post.user}
                            className="hover:bg-transparent !p-0"
                            sizeAvatar={44}
                        />
                    </div>
                </Tippy>
                <div>
                    {!(user?._id === post.user._id) && (
                        <ButtonFollow
                            followers={post.user.followers}
                            receiverId={post.user._id}
                        />
                    )}
                </div>
            </div>
            <h4 className="text-lg font-medium mb-4">
                {post.totalComment} comments
            </h4>
            <div className="flex items-center gap-3 w-full mb-4">
                {user ? (
                    <InputComment postId={post._id} />
                ) : (
                    <>
                        <Avatar size={44} src={''} alt={''} />
                        <Link href={ROUTES.LOGIN}>
                            <a>
                                <span className="font-medium text-primary">
                                    Log in to comment
                                </span>
                            </a>
                        </Link>
                    </>
                )}
            </div>

            <div className="flex flex-col">
                <ul className="flex flex-col gap-4">
                    {comments.map((comment) => {
                        return (
                            <ParentComment
                                key={comment._id}
                                comment={comment}
                            />
                        );
                    })}
                </ul>
                {hasMore && (
                    <Button
                        typeButton="primary"
                        className="mt-4 self-center"
                        onClick={handleLoadMoreComment}
                    >
                        Load more
                    </Button>
                )}
            </div>
        </div>
    );
};

PostDetail.getLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
};
export default PostDetail;
