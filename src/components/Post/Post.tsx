import { useEffect, useRef } from 'react';

import Link from 'next/link';

import { Avatar, BriefProfile, Button, ButtonFollow } from '@/components';
import { selectPost } from '@/features/post';
import { selectUser } from '@/features/user';
import { useAppDispatch, useAppSelector, useElementOnScreen } from '@/hooks';
import { IPost } from '@/types';
import Tippy from '@tippyjs/react/headless';
import { AiFillMessage } from 'react-icons/ai';
import { RiShareForwardFill } from 'react-icons/ri';
import TimeAgo from 'react-timeago';

import { ButtonLike } from '../Button';

interface Props {
    post: IPost;
    type: 'FOLLOWING' | 'HOME';
}
const Post = ({ post, type }: Props) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { currentPost } = useAppSelector(selectPost);
    const $videoRef = useRef<HTMLVideoElement | null>(null);
    const $btnRef = useRef<HTMLButtonElement | null>(null);
    const isVisible = useElementOnScreen($videoRef, {
        root: null,
        rootMargin: '0px',
        threshold: 1,
    });

    useEffect(() => {
        if (isVisible) {
            $videoRef.current?.play();
        } else {
            $videoRef.current?.pause();
        }
    }, [isVisible, dispatch, post, currentPost]);

    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 sm:block hidden">
                <Avatar
                    src={post.user.avatar}
                    alt={post.user.username}
                    size={56}
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                        <div className="sm:hidden block flex-shrink-0">
                            <Avatar
                                src={post.user.avatar}
                                alt={post.user.username}
                                size={44}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="hidden"
                                    ref={$btnRef}
                                ></button>
                                <Tippy
                                    render={(attrs) => {
                                        return (
                                            <div {...attrs} tabIndex={-1}>
                                                <BriefProfile
                                                    user={post.user}
                                                />
                                            </div>
                                        );
                                    }}
                                    interactive
                                    delay={800}
                                    placement="bottom"
                                >
                                    <div>
                                        <Link href={`/user/${post.user._id}`}>
                                            <a>
                                                <h3 className="text-lg font-bold hover:underline transition-all line-clamp-1 cursor-pointer">
                                                    {post.user.firstName}{' '}
                                                    {post.user.lastName}
                                                </h3>
                                            </a>
                                        </Link>
                                    </div>
                                </Tippy>
                                <span className="text-subtext text-sm sm:block hidden">
                                    {post.user.username} -{' '}
                                    {<TimeAgo date={post.createdAt} />}
                                </span>
                            </div>
                            <p className="text-neutral-700 line-clamp-2 break-all">
                                {post.caption}
                            </p>
                        </div>
                    </div>
                    {!(user?._id === post.user._id) && type === 'HOME' && (
                        <ButtonFollow receiverId={post.user._id} />
                    )}
                </div>
                <div className="flex gap-5 sm:flex-row flex-col">
                    <div>
                        <div
                            className={`${
                                post.height > post.width
                                    ? 'md:h-[516px]'
                                    : 'h-auto'
                            }`}
                        >
                            <div className="w-auto h-full">
                                <video
                                    src={post.video.url}
                                    className=" h-full object-cover block rounded"
                                    controls
                                    ref={$videoRef}
                                    loop
                                    muted
                                ></video>
                            </div>
                        </div>
                    </div>
                    <div className="sm:self-end flex sm:flex-col gap-4 items-start">
                        <ButtonLike
                            usersLiked={post.usersLiked}
                            postId={post._id}
                        />
                        <Link href={`/video/${post._id}`}>
                            <a>
                                <div className="flex flex-col gap-1 items-center justify-center">
                                    <Button className="w-12 h-12 !min-w-0 bg-neutral-200 hover:bg-neutral-300 rounded-full">
                                        <AiFillMessage className="icon-24 flex-shrink-0" />
                                    </Button>
                                    <span className="text-subtext uppercase text-sm font-semibold">
                                        {post.totalComment}
                                    </span>
                                </div>
                            </a>
                        </Link>
                        <Button className="w-12 h-12 !min-w-0 bg-neutral-200 hover:bg-neutral-300 rounded-full">
                            <RiShareForwardFill className="icon-24 flex-shrink-0" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
