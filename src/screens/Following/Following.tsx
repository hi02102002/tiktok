import { useCallback } from 'react';

import { ScrollInfinityPosts } from '@/components';
import { DefaultLayout } from '@/components/Layout';
import { fetchPosts, selectPost } from '@/features/post';
import { useAppDispatch, useAppSelector } from '@/hooks';
import postServices from '@/services/post.services';
import { NextPageWithLayout } from '@/types';

const Following: NextPageWithLayout = () => {
    const { page, posts } = useAppSelector(selectPost);
    const dispatch = useAppDispatch();
    const handleGetMore = useCallback(async () => {
        const posts = await postServices.fetchFollowingPosts(page, 10);
        dispatch(fetchPosts({ posts, page: page + 1 }));
    }, [dispatch, page]);
    return (
        <div>
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
