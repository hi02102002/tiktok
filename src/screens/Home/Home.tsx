import { useCallback } from 'react';

import { ScrollInfinityPosts } from '@/components';
import { DefaultLayout } from '@/components/Layout';
import { fetchPosts, selectPost } from '@/features/post';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { NextPageWithLayout } from '@/types';

const Home: NextPageWithLayout = () => {
    const { page } = useAppSelector(selectPost);
    const dispatch = useAppDispatch();
    const handleGetMore = useCallback(async () => {
        const posts = await postServices.fetchPostsHome(page, 10);
        dispatch(fetchPosts({ posts, page: page + 1 }));
    }, [dispatch, page]);

    return (
        <div>
            <ScrollInfinityPosts onGetMore={handleGetMore} />
        </div>
    );
};

Home.getLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export default Home;
