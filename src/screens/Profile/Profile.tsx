import { useCallback, useEffect, useMemo, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    Avatar,
    Button,
    ButtonFollow,
    ButtonScrollToTop,
    Spiner,
} from '@/components';
import { LayOutOnlyHeader } from '@/components/Layout';
import { selectUser } from '@/features/user';
import { useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import usersServices from '@/services/users.services';
import { IPost, IUser, NextPageWithLayout, onFollow } from '@/types';
import { toggleFollow } from '@/utils';
import { uniqBy } from 'lodash';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiShare } from 'react-icons/bi';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';

import ModalEditProfile from './ModalEditProfile';

interface Props {
    user: IUser;
    posts: Array<IPost>;
    hasMore: boolean;
}

const LIMIT = 10;

const Profile: NextPageWithLayout<Props> = (props) => {
    const currentUser = useAppSelector(selectUser);
    const [posts, setPosts] = useState<Array<IPost>>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
    const router = useRouter();
    const [user, setUser] = useState<IUser>(props.user);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFetchMore = useCallback(async () => {
        setPage(page + 1);
    }, [page]);

    const handleFollow = useCallback<onFollow>(
        (type, userId) => {
            setUser((prevUserState) => {
                return {
                    ...prevUserState,
                    followers: toggleFollow(user.followers, type, userId),
                };
            });
        },
        [user.followers],
    );

    useEffect(() => {
        (async () => {
            try {
                const _userRes = await usersServices.getUser(
                    router.query?.userId as string,
                );
                setUser(_userRes);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [router.query?.userId]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const _postsRes =
                    router.query?.userId === currentUser?._id
                        ? await postServices.fetchOwnPosts(page, LIMIT)
                        : await postServices.fetchUserPosts(
                              router.query?.userId as string,
                              page,
                              LIMIT,
                          );
                if (_postsRes.length >= LIMIT) {
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }
                setPosts((prev) => {
                    return uniqBy(prev.concat(_postsRes), '_id');
                });
            } catch (error) {
                setLoading(false);
            } finally {
                setLoading(false);
            }
        })();
    }, [currentUser?._id, page, router.query?.userId]);

    useEffect(() => {
        setPosts([]);
    }, [router.query?.userId]);

    const _user = useMemo(() => {
        return router.query?.userId === currentUser?._id
            ? (currentUser as IUser)
            : user;
    }, [currentUser, user, router.query?.userId]);

    const title = `Tiktok - ${_user.firstName} ${_user.lastName} (${_user.username})`;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="max-w-6xl mx-auto w-full px-4 py-6">
                <div>
                    <div className="w-full max-w-2xl mb-5">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-5">
                                <Avatar
                                    src={_user.avatar}
                                    alt={_user.username}
                                    size={116}
                                />
                                <div>
                                    <h2 className="text-3xl font-semibold">
                                        {_user.firstName} {_user.lastName}
                                    </h2>
                                    <span className="text-lg font-semibold block mb-5">
                                        {_user.username}
                                    </span>
                                    {!(currentUser?._id === _user._id) ? (
                                        <ButtonFollow
                                            receiverId={_user._id}
                                            onFollow={handleFollow}
                                        />
                                    ) : (
                                        <Button
                                            typeButton="tertiary"
                                            className="px-4"
                                            onClick={() => {
                                                setShowModalEdit(true);
                                            }}
                                        >
                                            <AiOutlineEdit className="icon-24" />
                                            <span> Edit Profile</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <button>
                                <BiShare className="icon-24" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-5">
                            <div className="flex items-center gap-1">
                                <strong>{_user.following.length}</strong>
                                <span>Following</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <strong>{_user.followers.length}</strong>
                                <span>Follower</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <strong>{_user.numLike}</strong>
                                <span>Likes</span>
                            </div>
                        </div>
                        <p className="mt-3">{_user.bio || 'No bio'}</p>
                    </div>
                    <div>
                        <div className="text-lg font-semibold h-11 w-56 inline-flex items-center justify-center border-b-2 border-solid border-neutral-900 cursor-pointer mb-3">
                            <span>Videos</span>
                        </div>
                        {loading ? (
                            <ul
                                className="grid gap-4"
                                style={{
                                    gridTemplateColumns:
                                        'repeat(auto-fill, minmax(184px, 1fr))',
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((el) => {
                                    return (
                                        <li
                                            key={el}
                                            className="w-full relative pb-[132.653%]"
                                        >
                                            <Skeleton
                                                height="100%"
                                                width="100%"
                                                containerClassName="absolute w-full h-full inset-0 "
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : posts.length > 0 ? (
                            <InfiniteScroll
                                dataLength={posts.length}
                                hasMore={hasMore}
                                loader={<Spiner />}
                                next={handleFetchMore}
                                style={{
                                    overflow: 'hidden',
                                }}
                            >
                                <ul
                                    className="grid gap-4"
                                    style={{
                                        gridTemplateColumns:
                                            'repeat(auto-fill, minmax(184px, 1fr))',
                                    }}
                                >
                                    {posts.map((post) => {
                                        return (
                                            <li
                                                key={post._id}
                                                className="w-full relative pb-[132.653%]"
                                            >
                                                <Link
                                                    href={`/video/${post._id}`}
                                                >
                                                    <a>
                                                        <div className="absolute w-full h-full inset-0 cursor-pointer">
                                                            <Image
                                                                src={
                                                                    post.cover
                                                                        .url
                                                                }
                                                                alt={
                                                                    post.caption
                                                                }
                                                                layout="fill"
                                                                objectFit="cover"
                                                                className="rounded"
                                                            />
                                                        </div>
                                                    </a>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </InfiniteScroll>
                        ) : (
                            <p className="text-center text-lg font-semibold">
                                No videos.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {showModalEdit && (
                <ModalEditProfile
                    onClose={() => {
                        setShowModalEdit(false);
                    }}
                />
            )}
            <ButtonScrollToTop />
        </>
    );
};

Profile.getLayout = (page) => {
    return <LayOutOnlyHeader>{page}</LayOutOnlyHeader>;
};

export default Profile;
