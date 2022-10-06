import { useCallback, useState } from 'react';

import Head from 'next/head';

import { ScrollInfinityPosts } from '@/components';
import { DefaultLayout } from '@/components/Layout';
import { fetchPosts, selectPost } from '@/features/post';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { NextPageWithLayout } from '@/types';

const Following: NextPageWithLayout = () => {
    const { posts } = useAppSelector(selectPost);
    const [page, setPage] = useState<number>(1);
    const dispatch = useAppDispatch();
    const handleGetMore = useCallback(async () => {
        const posts = await postServices.fetchFollowingPosts(page + 1, 10);
        dispatch(fetchPosts({ posts }));
        setPage(page + 1);
    }, [dispatch, page]);
    return (
        <div>
            <Head>
                <title>Tiktok - Following</title>
            </Head>
            {posts.length === 0 ? (
                <p className="text-center text-subtext font-medium">
                    Follow user to see posts.
                </p>
            ) : (
                <ScrollInfinityPosts
                    onGetMore={handleGetMore}
                    type="FOLLOWING"
                />
            )}
        </div>
    );
};

Following.getLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export default Following;
