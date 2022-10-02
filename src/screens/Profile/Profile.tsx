import { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { Avatar, Button, ButtonFollow, Spiner } from '@/components';
import { LayOutOnlyHeader } from '@/components/Layout';
import { selectUser } from '@/features/user';
import { useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { IPost, IUser, NextPageWithLayout, onFollow } from '@/types';
import { toggleFollow } from '@/utils';
import { unionBy } from 'lodash';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiShare } from 'react-icons/bi';
import InfiniteScroll from 'react-infinite-scroll-component';

import ModalEditProfile from './ModalEditProfile';

interface Props {
    user: IUser;
    posts: Array<IPost>;
    hasMore: boolean;
}

const LIMIT = 10;

const Profile: NextPageWithLayout<Props> = (props) => {
    const [user, setUser] = useState<IUser>(props.user);
    const [posts, setPosts] = useState<Array<IPost>>(props.posts);
    const [hasMore, setHasMore] = useState<boolean>(props.hasMore);
    const [page, setPage] = useState<number>(1);
    const currentUser = useAppSelector(selectUser);
    const router = useRouter();
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false);

    const handleFetchMore = useCallback(async () => {
        const resPosts = await postServices.fetchUserPosts(
            user._id,
            page + 1,
            LIMIT,
        );
        setHasMore(resPosts.length >= LIMIT ? true : false);
        setPage(page + 1);
        setPosts((prevPostsState) =>
            unionBy(prevPostsState.concat(resPosts), '_id'),
        );
    }, [page, user._id]);

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

    const _user = useMemo(() => {
        return user._id === currentUser?._id ? currentUser : user;
    }, [currentUser, user]);

    return (
        <>
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
                                    {!(currentUser?._id === user._id) ? (
                                        <ButtonFollow
                                            followers={user.followers}
                                            receiverId={user._id}
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
                                            <div
                                                className="absolute w-full h-full inset-0 cursor-pointer"
                                                onClick={() => {
                                                    router.push(`/${post._id}`);
                                                }}
                                            >
                                                <Image
                                                    src={post.cover.url}
                                                    alt={post.caption}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded"
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </InfiniteScroll>
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
        </>
    );
};

Profile.getLayout = (page) => {
    return <LayOutOnlyHeader>{page}</LayOutOnlyHeader>;
};

export default Profile;
