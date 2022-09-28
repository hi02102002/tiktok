import { useEffect } from 'react';

import { DefaultLayout } from '@/components/Layout';
import { selectPost, unmountPosts } from '@/features/post';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { NextPageWithLayout } from '@/types';

const Home: NextPageWithLayout = () => {
    const { posts } = useAppSelector(selectPost);

    return <div>Home</div>;
};

Home.getLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export default Home;
