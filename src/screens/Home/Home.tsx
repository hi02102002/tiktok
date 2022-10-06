import { useCallback, useState } from 'react';

import Head from 'next/head';

import { ScrollInfinityPosts } from '@/components';
import { DefaultLayout } from '@/components/Layout';
import { fetchPosts, selectPost } from '@/features/post';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { NextPageWithLayout } from '@/types';

const Home: NextPageWithLayout = () => {
    const [page, setPage] = useState<number>(1);
    const { posts } = useAppSelector(selectPost);
    const dispatch = useAppDispatch();
    const handleGetMore = useCallback(async () => {
        const posts = await postServices.fetchPostsHome(page + 1, 10);
        dispatch(fetchPosts({ posts }));
        setPage(page + 1);
    }, [dispatch, page]);

    return (
        <div>
            <Head>
                <title>Tiktok - Home</title>
            </Head>
            {posts.length === 0 ? (
                <p className="text-center text-subtext font-medium">
                    No recently posts.
                </p>
            ) : (
                <ScrollInfinityPosts onGetMore={handleGetMore} type="HOME" />
            )}
        </div>
    );
};

Home.getLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export default Home;
