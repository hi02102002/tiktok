import { useCallback, useMemo } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    Avatar,
    BriefProfile,
    Button,
    ButtonFollow,
    ButtonLike,
    ButtonScrollToTop,
    SectionUser,
} from '@/components';
import { DefaultLayout } from '@/components/Layout';
import { ROUTES } from '@/constants';
import { fetchComments, selectComment } from '@/features/comments';
import { selectPost } from '@/features/post';
import { selectUser } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { NextPageWithLayout } from '@/types';
import Tippy from '@tippyjs/react/headless';
import { AiFillMessage } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';
import { RiShareForwardFill } from 'react-icons/ri';

import InputComment from './InputComment';
import ParentComment from './ParentComment';

const PostDetail: NextPageWithLayout = () => {
    const { posts } = useAppSelector(selectPost);
    const user = useAppSelector(selectUser);
    const router = useRouter();
    const post = useMemo(() => posts[0], [posts]);
    const { comments, hasMore, page } = useAppSelector(selectComment);
    const dispatch = useAppDispatch();

    const handleLoadMoreComment = useCallback(async () => {
        const moreComments = await postServices.getComments(post._id, page + 1);
        dispatch(fetchComments({ comments: moreComments, page: page + 1 }));
    }, [post._id, page, dispatch]);

    const title = `Tiktok - ${post.caption} | with Music of ${post.user.username}`;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mb-6 text-lg font-medium"
                >
                    <IoIosArrowBack className="icon-24" />
                    <span>Go back</span>
                </button>
                <div
                    className="w-full bg-black rounded relative"
                    style={{
                        height: post.width < post.height ? '600px' : 'auto',
                    }}
                >
                    <video
                        src={post.video.url}
                        className="object-contain w-full h-full rounded relative"
                        autoPlay
                        controls
                        loop
                    ></video>
                    <div className="flex flex-col mb-4 gap-4 items-start absolute z-10 right-4 bottom-16">
                        <ButtonLike
                            postId={post._id}
                            usersLiked={post.usersLiked}
                        />

                        <div className="flex flex-col gap-1 items-center justify-center">
                            <Button className="w-12 h-12 !min-w-0 bg-neutral-200 hover:bg-neutral-300 rounded-full">
                                <AiFillMessage className="icon-24 flex-shrink-0" />
                            </Button>
                            <span className="text-subtext uppercase text-sm font-semibold">
                                {post.totalComment}
                            </span>
                        </div>

                        <Button className="w-12 h-12 !min-w-0 bg-neutral-200 hover:bg-neutral-300 rounded-full">
                            <RiShareForwardFill className="icon-24 flex-shrink-0" />
                        </Button>
                    </div>
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
            <ButtonScrollToTop />
        </>
    );
};

PostDetail.getLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
};
export default PostDetail;
